import type { ResellerCityStat } from '@/features/resellers/types';
import type { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import L from 'leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSON, MapContainer, Marker, useMap } from 'react-leaflet';

// Maps reseller city names (lowercase) to GADM Level 2 NAME_2 values
const CITY_TO_GADM: Record<string, string> = {
    'manila': 'Manila', 'quezon city': 'QuezonCity', 'makati': 'MakatiCity',
    'makati city': 'MakatiCity', 'pasig': 'PasigCity', 'pasig city': 'PasigCity',
    'taguig': 'Taguig', 'taguig city': 'Taguig', 'pasay': 'PasayCity',
    'pasay city': 'PasayCity', 'mandaluyong': 'Mandaluyong', 'marikina': 'Marikina',
    'muntinlupa': 'Muntinlupa', 'caloocan': 'KalookanCity', 'caloocan city': 'KalookanCity',
    'valenzuela': 'Valenzuela', 'san juan': 'SanJuan', 'navotas': 'Navotas',
    'malabon': 'Malabon', 'las piñas': 'LasPiñas', 'las pinas': 'LasPiñas',
    'parañaque': 'Parañaque', 'paranaque': 'Parañaque', 'pateros': 'Pateros',
    'cebu city': 'CebuCity', 'cebu': 'CebuCity', 'lapu-lapu': 'Lapu-Lapu',
    'mandaue': 'Mandaue', 'davao city': 'DavaoCity', 'davao': 'DavaoCity',
    'cagayan de oro': 'CagayandeOroCity', 'cagayan de oro city': 'CagayandeOroCity',
    'zamboanga city': 'ZamboangaCity', 'zamboanga': 'ZamboangaCity',
    'butuan': 'ButuanCity', 'butuan city': 'ButuanCity',
    'general santos': 'GeneralSantosCity', 'bacolod': 'BacolodCity',
    'bacolod city': 'BacolodCity', 'iloilo city': 'IloiloCity', 'iloilo': 'IloiloCity',
    'tacloban': 'TaclobanCity', 'antipolo': 'AntipoloCity', 'antipolo city': 'AntipoloCity',
    'angeles': 'AngelesCity', 'angeles city': 'AngelesCity',
    'baguio': 'BaguioCity', 'baguio city': 'BaguioCity',
    'naga': 'NagaCity', 'naga city': 'NagaCity', 'legazpi': 'LegazpiCity',
    'lucena': 'LucenaCity', 'lipa': 'LipaCity', 'batangas city': 'BatangasCity',
    'santa rosa': 'SantaRosa', 'bacoor': 'Bacoor', 'imus': 'Imus',
};

const DEFAULT_STYLE: L.PathOptions = {
    fillOpacity: 0,
    color:       'transparent',
    weight:      0,
};

const HOVER_STYLE: L.PathOptions = {
    fillColor:   '#3b82f6',
    fillOpacity: 0.2,
    color:       '#1d4ed8',
    weight:      1.5,
};

const SELECTED_STYLE: L.PathOptions = {
    fillColor:   '#3b82f6',
    fillOpacity: 0.3,
    color:       '#1e3a8a',
    weight:      2,
};

const CITY_DISPLAY: Record<string, string> = {
    'QuezonCity': 'Quezon City', 'MakatiCity': 'Makati City', 'PasigCity': 'Pasig City',
    'PasayCity': 'Pasay City', 'KalookanCity': 'Caloocan City', 'LasPiñas': 'Las Piñas',
    'Parañaque': 'Parañaque', 'SanJuan': 'San Juan', 'CebuCity': 'Cebu City',
    'DavaoCity': 'Davao City', 'CagayandeOroCity': 'Cagayan de Oro',
    'ZamboangaCity': 'Zamboanga City', 'ButuanCity': 'Butuan City',
    'GeneralSantosCity': 'General Santos City', 'BacolodCity': 'Bacolod City',
    'IloiloCity': 'Iloilo City', 'TaclobanCity': 'Tacloban City',
    'AntipoloCity': 'Antipolo City', 'AngelesCity': 'Angeles City',
    'BaguioCity': 'Baguio City', 'NagaCity': 'Naga City', 'LegazpiCity': 'Legazpi City',
    'LucenaCity': 'Lucena City', 'LipaCity': 'Lipa City', 'BatangasCity': 'Batangas City',
    'SantaRosa': 'Santa Rosa', 'Bacoor': 'Bacoor City', 'Imus': 'Imus City',
    'Taguig': 'Taguig City', 'Mandaluyong': 'Mandaluyong City', 'Marikina': 'Marikina City',
    'Muntinlupa': 'Muntinlupa City', 'Valenzuela': 'Valenzuela City',
    'Navotas': 'Navotas City', 'Malabon': 'Malabon City', 'Pateros': 'Pateros',
    'Mandaue': 'Mandaue City', 'Lapu-Lapu': 'Lapu-Lapu City',
};

function displayCity(gadmName: string): string {
    return CITY_DISPLAY[gadmName] ?? gadmName;
}

function MapLibreGLLayer(): null {
    const map = useMap();
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let gl: any = null;
        let cancelled = false;

        // Dynamic import ensures @maplibre/maplibre-gl-leaflet patches the same
        // L instance that is resolved at runtime, avoiding Vite dev-mode module
        // deduplication issues that cause L.maplibreGL to be undefined.
        //
        // The style is fetched manually so that relative tile/glyph URLs can be
        // rewritten to absolute URLs before being passed to MapLibre GL.
        // MapLibre GL fetches tiles inside a Web Worker where relative URLs are
        // invalid and cause "Failed to parse URL" errors.
        Promise.all([
            import('@maplibre/maplibre-gl-leaflet'),
            fetch('/map-style.json?v=3').then((r) => r.json()),
        ]).then(([, style]) => {
            if (cancelled) return;
            const origin = window.location.origin;
            // Rewrite relative tile URLs to absolute
            for (const source of Object.values(style.sources as Record<string, { tiles?: string[]; data?: string }>)) {
                if (Array.isArray(source.tiles)) {
                    source.tiles = source.tiles.map((u: string) => u.startsWith('/') ? `${origin}${u}` : u);
                }
                if (typeof source.data === 'string' && source.data.startsWith('/')) {
                    source.data = `${origin}${source.data}`;
                }
            }
            // Rewrite relative glyphs URL
            if (typeof style.glyphs === 'string' && style.glyphs.startsWith('/')) {
                style.glyphs = `${origin}${style.glyphs}`;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            gl = (L as any).maplibreGL({
                style,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            });
            gl.addTo(map);
            // Force Leaflet and the GL canvas to recalculate their sizes after mount
            setTimeout(() => {
                if (cancelled) return;
                map.invalidateSize({ animate: false });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const glMap = gl.getMaplibreMap?.() as any;
                if (glMap) glMap.resize();
            }, 0);
        });

        return () => {
            cancelled = true;
            if (gl) map.removeLayer(gl);
        };
    }, [map]);
    return null;
}

interface GeoProperties {
    name: string;
    province: string;
    cx?: number;
    cy?: number;
}

interface SelectedCity {
    gadmName: string;
    displayName: string;
    province: string;
    count: number;
}

interface CityMarkersLayerProps {
    cityCounts: Record<string, number>;
    centroids:  Record<string, [number, number]>;
    onPin: (gadmName: string, pos: [number, number]) => void;
}

function CityMarkersLayer({ cityCounts, centroids, onPin }: CityMarkersLayerProps): React.ReactElement {
    const map = useMap();

    return (
        <>
            {Object.entries(cityCounts).map(([gadmName, count]) => {
                const pos = centroids[gadmName];
                if (!pos) return null;
                const icon = L.divIcon({
                    className: '',
                    html: `<div style="width:28px;height:28px;background:#4f46e5;color:#fff;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;font-family:sans-serif">${String(count)}</div>`,
                    iconSize:   [28, 28],
                    iconAnchor: [14, 14],
                });
                return (
                    <Marker
                        key={gadmName}
                        position={pos}
                        icon={icon}
                        eventHandlers={{
                            click: () => {
                                map.flyTo(pos, 13, { duration: 1.2 });
                                onPin(gadmName, pos);
                            },
                        }}
                    />
                );
            })}
        </>
    );
}

// Flies to a city when focusCity changes
interface FocusControllerProps {
    focusCity:  string | null | undefined;
    cityMeta:   Record<string, { pos: [number, number]; province: string }>;
}

function FocusController({ focusCity, cityMeta }: FocusControllerProps): null {
    const map = useMap();
    useEffect(() => {
        if (!focusCity) return;
        const gadmName = CITY_TO_GADM[focusCity.trim().toLowerCase()];
        if (!gadmName) return;
        const meta = cityMeta[gadmName];
        if (!meta) return;
        map.flyTo(meta.pos, 13, { duration: 1.2 });
    }, [focusCity, map, cityMeta]);
    return null;
}

// Regional bounds: Philippines + surrounding seas + neighbor coastlines
// Covers South China Sea (W), Philippine Sea (E), Celebes/Sulu Sea (S), Luzon Strait (N)
const PH_BOUNDS: L.LatLngBoundsExpression = [[1.0, 108.0], [26.0, 135.0]];


const MIN_ZOOM = 5;

// Hard-enforces minZoom imperatively — Leaflet's minZoom prop alone can be
// bypassed by scroll/pinch gestures causing fractional drift below the limit.
function ZoomGuard(): null {
    const map = useMap();
    useEffect(() => {
        map.setMinZoom(MIN_ZOOM);
        const onZoom = () => {
            if (map.getZoom() < MIN_ZOOM) map.setZoom(MIN_ZOOM, { animate: false });
        };
        map.on('zoom', onZoom);
        return () => { map.off('zoom', onZoom); };
    }, [map]);
    return null;
}

// Re-applies the intended initial view after the GL canvas settles.
// fitBounds is not used because Leaflet computes zoom 5 for our bounds in a
// 700px-tall container, which zooms OUT from the desired zoom 6.
function FitPhilippines(): null {
    const map = useMap();
    useEffect(() => {
        const fit = () => {
            map.invalidateSize({ animate: false });
            map.setView([12.8, 122.0], 6, { animate: false });
        };
        fit();
        const t = setTimeout(fit, 600);
        return () => clearTimeout(t);
    }, [map]);
    return null;
}

interface PhilippinesMapProps {
    stats:      ResellerCityStat[];
    focusCity?: string | null;
}

export default function PhilippinesMap({ stats, focusCity }: PhilippinesMapProps): React.ReactElement {
    const [selected, setSelected] = useState<SelectedCity | null>(null);
    const geoJsonRef = useRef<L.GeoJSON | null>(null);
    const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);

    // Build reseller counts by GADM name
    const cityCounts: Record<string, number> = {};
    for (const s of stats) {
        const gadmName = CITY_TO_GADM[s.city.trim().toLowerCase()];
        if (gadmName) {
            cityCounts[gadmName] = (cityCounts[gadmName] ?? 0) + s.total;
        }
    }

    // Load GeoJSON
    useEffect(() => {
        fetch('/ph-cities.json')
            .then((r) => r.json())
            .then((data: GeoJsonObject) => setGeoData(data))
            .catch(() => null);
    }, []);

    // Build gadmName -> { pos, province } map from GeoJSON cx/cy
    const cityMeta = useMemo((): Record<string, { pos: [number, number]; province: string }> => {
        if (!geoData) return {};
        const result: Record<string, { pos: [number, number]; province: string }> = {};
        const fc = geoData as FeatureCollection;
        for (const f of fc.features ?? []) {
            const p = f.properties as GeoProperties;
            if (p.name && p.cx !== undefined && p.cy !== undefined) {
                result[p.name] = { pos: [p.cy, p.cx], province: p.province ?? '' };
            }
        }
        return result;
    }, [geoData]);

    const centroids = useMemo((): Record<string, [number, number]> => {
        const result: Record<string, [number, number]> = {};
        for (const [name, meta] of Object.entries(cityMeta)) result[name] = meta.pos;
        return result;
    }, [cityMeta]);

    // Style each feature
    function style(_feature: Feature | undefined): L.PathOptions {
        const gadmName = _feature?.properties?.name as string | undefined ?? '';
        if (gadmName && selected?.gadmName === gadmName) return SELECTED_STYLE;
        return DEFAULT_STYLE;
    }

    // Bind click + hover to each feature layer
    function onEachFeature(feature: Feature, layer: L.Layer): void {
        const props       = feature.properties as GeoProperties;
        const gadmName    = props.name;
        const displayName = displayCity(gadmName);
        const province    = props.province ?? '';
        const count       = cityCounts[gadmName] ?? 0;

        (layer as L.Path).on('click', () => {
            setSelected((prev) =>
                prev?.gadmName === gadmName ? null : { gadmName, displayName, province, count }
            );
            if (geoJsonRef.current) {
                geoJsonRef.current.eachLayer((l) => {
                    const path = l as L.Path;
                    const f    = (path as unknown as { feature?: Feature }).feature;
                    const name = f?.properties?.name as string | undefined;
                    path.setStyle(name === gadmName ? SELECTED_STYLE : DEFAULT_STYLE);
                });
            }
        });

        (layer as L.Path).on('mouseover', function (this: L.Path) {
            if (selected?.gadmName !== gadmName) this.setStyle(HOVER_STYLE);
        });

        (layer as L.Path).on('mouseout', function (this: L.Path) {
            if (selected?.gadmName !== gadmName) this.setStyle(DEFAULT_STYLE);
        });
    }

    return (
        <div className="space-y-2">
            <div className="relative rounded-xl border border-slate-200 overflow-hidden" style={{ height: 700 }}>

                {/* City detail panel */}
                {selected && (
                    <div className="absolute top-3 right-3 z-[1000] w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 leading-tight truncate">{selected.displayName}</p>
                                <p className="text-xs text-gray-400 truncate">{selected.province}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="text-gray-300 hover:text-gray-500 text-xl leading-none mt-0.5 flex-shrink-0"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="bg-indigo-50 rounded-lg px-3 py-3 text-center">
                            <p className="text-2xl font-bold text-indigo-700">{selected.count}</p>
                            <p className="text-xs text-indigo-400 font-medium mt-0.5">Approved Resellers</p>
                        </div>

                        {selected.count === 0 && (
                            <p className="text-xs text-gray-400 text-center py-1">No approved resellers yet.</p>
                        )}
                    </div>
                )}

                <MapContainer
                    center={[12.8, 122.0]}
                    zoom={6}
                    minZoom={MIN_ZOOM}
                    maxZoom={18}
                    maxBounds={PH_BOUNDS}
                    maxBoundsViscosity={0.8}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl
                >
                    <MapLibreGLLayer />
                    <FitPhilippines />
                    <ZoomGuard />
                    <FocusController focusCity={focusCity} cityMeta={cityMeta} />
                    {geoData && (
                        <GeoJSON
                            key="ph-cities"
                            ref={geoJsonRef}
                            data={geoData}
                            style={style}
                            onEachFeature={onEachFeature}
                        />
                    )}
                    <CityMarkersLayer
                        cityCounts={cityCounts}
                        centroids={centroids}
                        onPin={(gadmName, _pos) => {
                            const displayName = displayCity(gadmName);
                            const count       = cityCounts[gadmName] ?? 0;
                            const province    = cityMeta[gadmName]?.province ?? '';
                            setSelected({ gadmName, displayName, province, count });
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}
