import type { ResellerCityStat } from '@/features/resellers/types';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import { useEffect, useRef, useState } from 'react';

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

const PALETTE = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
    '#3498db', '#9b59b6', '#e91e8c', '#27ae60', '#16a085',
    '#2980b9', '#8e44ad', '#d35400', '#c0392b', '#7f8c8d',
    '#f39c12', '#00bcd4', '#4caf50', '#ff5722', '#795548',
];

function cityColor(index: number): string {
    return PALETTE[(index * 7) % PALETTE.length];
}

interface GeoProperties {
    name: string;
    province: string;
}

interface SelectedCity {
    gadmName: string;
    displayName: string;
    province: string;
    count: number;
}

// Fits the map to Philippines bounds on mount
function FitPhilippines(): null {
    const map = useMap();
    useEffect(() => {
        map.fitBounds([[4.5, 116.5], [21.2, 127.0]], { padding: [10, 10] });
    }, [map]);
    return null;
}

interface PhilippinesMapProps {
    stats: ResellerCityStat[];
}

export default function PhilippinesMap({ stats }: PhilippinesMapProps): React.ReactElement {
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

    // Style each feature
    function style(_feature: Feature | undefined): L.PathOptions {
        const gadmName = _feature?.properties?.name as string | undefined ?? '';
        const count    = cityCounts[gadmName] ?? 0;
        const idx      = (_feature as { _index?: number })?._index ?? 0;
        return {
            fillColor:   count > 0 ? '#1d4ed8' : cityColor(idx),
            fillOpacity: count > 0 ? 0.85 : 0.9,
            color:       '#111827',
            weight:      0.7,
        };
    }

    // Bind click + index to each feature layer
    function onEachFeature(feature: Feature, layer: L.Layer, index: number): void {
        // Store index on feature for color lookup
        (feature as { _index?: number })._index = index;

        const props       = feature.properties as GeoProperties;
        const gadmName    = props.name;
        const displayName = displayCity(gadmName);
        const province    = props.province ?? '';
        const count       = cityCounts[gadmName] ?? 0;

        (layer as L.Path).on('click', () => {
            setSelected((prev) =>
                prev?.gadmName === gadmName ? null : {
                    gadmName, displayName, province, count,
                }
            );
            // Highlight selected
            if (geoJsonRef.current) {
                geoJsonRef.current.eachLayer((l) => {
                    const path = l as L.Path;
                    const f    = (path as unknown as { feature?: Feature }).feature;
                    const name = f?.properties?.name as string | undefined;
                    if (name === gadmName) {
                        path.setStyle({ color: '#1e3a8a', weight: 2.5, fillColor: '#fef08a', fillOpacity: 1 });
                    } else {
                        const i   = (f as { _index?: number })?._index ?? 0;
                        const cnt = cityCounts[name ?? ''] ?? 0;
                        path.setStyle({
                            color:       '#111827',
                            weight:      0.7,
                            fillColor:   cnt > 0 ? '#1d4ed8' : cityColor(i),
                            fillOpacity: cnt > 0 ? 0.85 : 0.9,
                        });
                    }
                });
            }
        });

        (layer as L.Path).on('mouseover', function (this: L.Path) {
            if (selected?.gadmName !== gadmName) {
                this.setStyle({ weight: 1.5, color: '#374151' });
            }
        });

        (layer as L.Path).on('mouseout', function (this: L.Path) {
            if (selected?.gadmName !== gadmName) {
                this.setStyle({ weight: 0.7, color: '#111827' });
            }
        });
    }

    return (
        <div className="space-y-2">
            <div className="relative rounded-xl border border-slate-200 overflow-hidden" style={{ height: 640 }}>

                {/* City detail panel */}
                {selected && (
                    <div className="absolute top-3 right-3 z-[1000] w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">City / Municipality</p>
                                <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5 truncate">{selected.displayName}</p>
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
                    center={[12.9, 121.8]}
                    zoom={6}
                    style={{ height: '100%', width: '100%', background: '#ffffff' }}
                    zoomControl
                >
                    <FitPhilippines />
                    {geoData && (
                        <GeoJSON
                            key="ph-cities"
                            ref={geoJsonRef}
                            data={geoData}
                            style={style}
                            onEachFeature={(feature, layer) => {
                                const data = geoData as { features?: Feature[] };
                                const idx  = data.features?.indexOf(feature) ?? 0;
                                onEachFeature(feature, layer, idx);
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
