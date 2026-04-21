export interface City {
    name: string;
    lat: number;
    lng: number;
    available: boolean;
}

export const PHILIPPINE_CITIES: City[] = [
  // NCR
  { name: 'Manila',          lat: 14.5995,  lng: 120.9842, available: true  },
  { name: 'Quezon City',     lat: 14.6760,  lng: 121.0437, available: true  },
  { name: 'Caloocan',        lat: 14.7500,  lng: 120.9822, available: false },
  { name: 'Makati',          lat: 14.5547,  lng: 121.0244, available: true  },
  { name: 'Pasig',           lat: 14.5764,  lng: 121.0851, available: true  },
  { name: 'Taguig',          lat: 14.5176,  lng: 121.0509, available: false },
  { name: 'Parañaque',       lat: 14.4793,  lng: 121.0198, available: true  },
  { name: 'Valenzuela',      lat: 14.7011,  lng: 120.9830, available: true  },
  { name: 'Las Piñas',       lat: 14.4490,  lng: 120.9930, available: false },
  { name: 'Marikina',        lat: 14.6507,  lng: 121.1029, available: true  },
  { name: 'Muntinlupa',      lat: 14.4081,  lng: 121.0415, available: true  },
  { name: 'Navotas',         lat: 14.6667,  lng: 120.9417, available: false },
  { name: 'Malabon',         lat: 14.6683,  lng: 120.9570, available: true  },
  { name: 'Mandaluyong',     lat: 14.5794,  lng: 121.0359, available: true  },
  { name: 'San Juan',        lat: 14.6019,  lng: 121.0355, available: false },
  { name: 'Pasay',           lat: 14.5378,  lng: 121.0014, available: true  },
  { name: 'Pateros',         lat: 14.5441,  lng: 121.0685, available: true  },

  // Region I – Ilocos
  { name: 'Laoag',                     lat: 18.1979, lng: 120.5937, available: true  },
  { name: 'Batac',                     lat: 18.0553, lng: 120.5651, available: false },
  { name: 'Vigan',                     lat: 17.5747, lng: 120.3869, available: false },
  { name: 'Candon',                    lat: 17.1958, lng: 120.4489, available: true  },
  { name: 'San Fernando (La Union)',   lat: 16.6159, lng: 120.3166, available: true  },
  { name: 'Dagupan',                   lat: 16.0433, lng: 120.3333, available: true  },
  { name: 'San Carlos (Pangasinan)',   lat: 15.9267, lng: 120.3533, available: false },
  { name: 'Urdaneta',                  lat: 15.9760, lng: 120.5710, available: false },
  { name: 'Alaminos',                  lat: 16.1567, lng: 119.9800, available: true  },

  // Region II – Cagayan Valley
  { name: 'Tuguegarao',  lat: 17.6132, lng: 121.7270, available: true  },
  { name: 'Cauayan',     lat: 16.9297, lng: 121.7756, available: true  },
  { name: 'Ilagan',      lat: 17.1490, lng: 121.8910, available: false },
  { name: 'Santiago',    lat: 16.6860, lng: 121.5497, available: true  },
  { name: 'Solano',      lat: 16.5167, lng: 121.1833, available: true  },
  { name: 'Bayombong',   lat: 16.4833, lng: 121.1500, available: false },

  // Region III – Central Luzon
  { name: 'Tarlac City',              lat: 15.4755,  lng: 120.5960, available: true  },
  { name: 'Cabanatuan',               lat: 15.4866,  lng: 120.9716, available: true  },
  { name: 'Palayan',                  lat: 15.5406,  lng: 121.0841, available: true  },
  { name: 'Muñoz',                    lat: 15.7167,  lng: 120.9,    available: true  },
  { name: 'Gapan',                    lat: 15.3071,  lng: 120.9453, available: false },
  { name: 'Angeles',                  lat: 15.1450,  lng: 120.5887, available: false },
  { name: 'Mabalacat',                lat: 15.2167,  lng: 120.5833, available: true  },
  { name: 'San Fernando (Pampanga)',  lat: 15.0286,  lng: 120.6928, available: true  },
  { name: 'Olongapo',                 lat: 14.8294,  lng: 120.2826, available: true  },
  { name: 'Balanga',                  lat: 14.6743,  lng: 120.5361, available: false },
  { name: 'Malolos',                  lat: 14.8433,  lng: 120.8114, available: true  },
  { name: 'Meycauayan',               lat: 14.7333,  lng: 120.9556, available: false },
  { name: 'San Jose del Monte',       lat: 14.8137,  lng: 121.0453, available: false },

  // Region IV-A – CALABARZON
  { name: 'Antipolo',              lat: 14.5860,  lng: 121.1760, available: true  },
  { name: 'Cavite City',           lat: 14.4791,  lng: 120.8974, available: false },
  { name: 'Bacoor',                lat: 14.4580,  lng: 120.9380, available: true  },
  { name: 'Imus',                  lat: 14.4297,  lng: 120.9367, available: false },
  { name: 'Dasmariñas',            lat: 14.3294,  lng: 120.9367, available: true  },
  { name: 'General Trias',         lat: 14.3869,  lng: 120.8817, available: true  },
  { name: 'Trece Martires',        lat: 14.2822,  lng: 120.8658, available: true  },
  { name: 'Tagaytay',              lat: 14.1153,  lng: 120.9621, available: false },
  { name: 'Rosario (Cavite)',      lat: 14.4167,  lng: 120.8500, available: false },
  { name: 'Biñan',                 lat: 14.3408,  lng: 121.0806, available: true  },
  { name: 'Santa Rosa',            lat: 14.3122,  lng: 121.1114, available: true  },
  { name: 'Calamba',               lat: 14.2113,  lng: 121.1653, available: false },
  { name: 'San Pablo',             lat: 14.0683,  lng: 121.3244, available: false },
  { name: 'Tanauan',               lat: 14.0850,  lng: 121.1500, available: false },
  { name: 'Lipa',                  lat: 13.9411,  lng: 121.1631, available: true  },
  { name: 'Batangas City',         lat: 13.7565,  lng: 121.0584, available: true  },
  { name: 'San Jose (Batangas)',   lat: 13.5333,  lng: 121.0500, available: true  },
  { name: 'Lucena',                lat: 13.9322,  lng: 121.6167, available: true  },
  { name: 'Tayabas',               lat: 13.8658,  lng: 121.5931, available: true  },

  // Region IV-B – MIMAROPA
  { name: 'Calapan',         lat: 13.4117,  lng: 121.1803, available: true  },
  { name: 'Roxas (Palawan)', lat: 10.3167,  lng: 119.3500, available: false },
  { name: 'Puerto Princesa', lat:  9.7392,  lng: 118.7353, available: false },

  // Region V – Bicol
  { name: 'Naga',           lat: 13.6218,  lng: 123.1945, available: false },
  { name: 'Iriga',          lat: 13.4228,  lng: 123.4097, available: true  },
  { name: 'Ligao',          lat: 13.2167,  lng: 123.5333, available: true  },
  { name: 'Tabaco',         lat: 13.3583,  lng: 123.7317, available: false },
  { name: 'Legazpi',        lat: 13.1392,  lng: 123.7438, available: true  },
  { name: 'Sorsogon City',  lat: 12.9742,  lng: 124.0050, available: true  },
  { name: 'Masbate City',   lat: 12.3681,  lng: 123.6200, available: true  },
  { name: 'Virac',          lat: 13.5833,  lng: 124.2333, available: false },

  // Region VI – Western Visayas
  { name: 'Kalibo',                     lat: 11.7069,  lng: 122.3644, available: true  },
  { name: 'Roxas City',                 lat: 11.5833,  lng: 122.7500, available: true  },
  { name: 'San Jose de Buenavista',     lat: 10.7500,  lng: 121.9333, available: true  },
  { name: 'Iloilo City',               lat: 10.7202,  lng: 122.5621, available: false },
  { name: 'Passi',                      lat: 11.1000,  lng: 122.6383, available: false },
  { name: 'Victorias',                  lat: 10.9000,  lng: 123.0717, available: false },
  { name: 'Cadiz',                      lat: 10.9500,  lng: 123.3000, available: false },
  { name: 'Escalante',                  lat: 10.8400,  lng: 123.4967, available: true  },
  { name: 'Sagay',                      lat: 10.8976,  lng: 123.4200, available: true  },
  { name: 'San Carlos (Neg. Occ.)',     lat: 10.4922,  lng: 123.4100, available: true  },
  { name: 'Silay',                      lat: 10.8000,  lng: 122.9750, available: true  },
  { name: 'Talisay (Neg. Occ.)',        lat: 10.7436,  lng: 122.9742, available: true  },
  { name: 'Bacolod',                    lat: 10.6767,  lng: 122.9570, available: true  },
  { name: 'Bago',                       lat: 10.5333,  lng: 122.8333, available: true  },
  { name: 'La Carlota',                 lat: 10.4167,  lng: 122.9167, available: true  },
  { name: 'Himamaylan',                 lat: 10.0981,  lng: 122.8697, available: false },
  { name: 'Kabankalan',                 lat:  9.9867,  lng: 122.8139, available: false },

  // Region VII – Central Visayas
  { name: 'Bogo',             lat: 11.0500,  lng: 124.0000, available: true  },
  { name: 'Danao',            lat: 10.5211,  lng: 124.0267, available: true  },
  { name: 'Mandaue',          lat: 10.3236,  lng: 123.9223, available: false },
  { name: 'Lapu-Lapu',        lat: 10.3103,  lng: 123.9494, available: true  },
  { name: 'Cebu City',        lat: 10.3157,  lng: 123.8854, available: true  },
  { name: 'Talisay (Cebu)',   lat: 10.2447,  lng: 123.8481, available: true  },
  { name: 'Minglanilla',      lat: 10.2411,  lng: 123.7961, available: false },
  { name: 'Naga (Cebu)',      lat: 10.2108,  lng: 123.7589, available: true  },
  { name: 'Carcar',           lat: 10.1081,  lng: 123.6406, available: false },
  { name: 'Toledo',           lat: 10.3778,  lng: 123.6361, available: false },
  { name: 'Tagbilaran',       lat:  9.6500,  lng: 123.8544, available: false },
  { name: 'Canlaon',          lat: 10.3858,  lng: 123.1983, available: true  },
  { name: 'Guihulngan',       lat: 10.1225,  lng: 123.2728, available: true  },
  { name: 'Tanjay',           lat:  9.5169,  lng: 123.1564, available: false },
  { name: 'Bais',             lat:  9.5906,  lng: 123.1222, available: true  },
  { name: 'Dumaguete',        lat:  9.3103,  lng: 123.3081, available: true  },
  { name: 'Bayawan',          lat:  9.3667,  lng: 122.8000, available: false },

  // Region VIII – Eastern Visayas
  { name: 'Calbayog',   lat: 12.0667,  lng: 124.6000, available: false },
  { name: 'Catbalogan', lat: 11.7753,  lng: 124.8856, available: true  },
  { name: 'Tacloban',   lat: 11.2442,  lng: 125.0011, available: true  },
  { name: 'Ormoc',      lat: 11.0058,  lng: 124.6075, available: false },
  { name: 'Hilongos',   lat: 10.3700,  lng: 124.7483, available: true  },
  { name: 'Baybay',     lat: 10.6833,  lng: 124.8000, available: true  },
  { name: 'Sogod',      lat: 10.3783,  lng: 125.0050, available: false },
  { name: 'Maasin',     lat: 10.1333,  lng: 124.8400, available: true  },
  { name: 'Borongan',   lat: 11.6083,  lng: 125.4333, available: true  },

  // Region IX – Zamboanga Peninsula
  { name: 'Dapitan',        lat:  8.6542,  lng: 123.4228, available: true  },
  { name: 'Dipolog',        lat:  8.5878,  lng: 123.3422, available: false },
  { name: 'Isabela City',   lat:  6.7058,  lng: 121.9711, available: true  },
  { name: 'Pagadian',       lat:  7.8264,  lng: 123.4369, available: true  },
  { name: 'Ipil',           lat:  7.7833,  lng: 122.5833, available: false },
  { name: 'Zamboanga City', lat:  6.9214,  lng: 122.0790, available: false },

  // Region X – Northern Mindanao
  { name: 'Oroquieta',      lat:  8.4858,  lng: 123.8058, available: true  },
  { name: 'Tangub',         lat:  8.0667,  lng: 123.7333, available: false },
  { name: 'Ozamiz',         lat:  8.1500,  lng: 123.8500, available: true  },
  { name: 'Iligan',         lat:  8.2286,  lng: 124.2453, available: false },
  { name: 'El Salvador',    lat:  8.5628,  lng: 124.5200, available: true  },
  { name: 'Cagayan de Oro', lat:  8.4542,  lng: 124.6319, available: true  },
  { name: 'Gingoog',        lat:  8.8228,  lng: 125.1100, available: true  },
  { name: 'Manolo Fortich', lat:  8.3667,  lng: 124.8667, available: false },
  { name: 'Malaybalay',     lat:  8.1575,  lng: 125.1278, available: false },
  { name: 'Maramag',        lat:  7.7583,  lng: 125.0083, available: true  },
  { name: 'Valencia',       lat:  7.9036,  lng: 125.0944, available: true  },

  // Region XI – Davao Region
  { name: 'Panabo',                          lat:  7.3072,  lng: 125.6839, available: true  },
  { name: 'Tagum',                           lat:  7.4478,  lng: 125.8078, available: true  },
  { name: 'Island Garden City of Samal',     lat:  7.0667,  lng: 125.7167, available: true  },
  { name: 'Nabunturan',                      lat:  7.6017,  lng: 125.9683, available: false },
  { name: 'Davao City',                      lat:  7.1907,  lng: 125.4553, available: true  },
  { name: 'Sta. Cruz (Davao del Sur)',        lat:  6.8833,  lng: 125.4167, available: true  },
  { name: 'Digos',                           lat:  6.7497,  lng: 125.3572, available: false },
  { name: 'Mati',                            lat:  6.9500,  lng: 126.2167, available: false },

  // Region XII – SOCCSKSARGEN
  { name: 'Cotabato City',    lat:  7.2236,  lng: 124.2461, available: false },
  { name: 'Kidapawan',        lat:  7.0083,  lng: 125.0892, available: true  },
  { name: 'Isulan',           lat:  6.6333,  lng: 124.6000, available: false },
  { name: 'Tacurong',         lat:  6.6933,  lng: 124.6758, available: true  },
  { name: 'Koronadal',        lat:  6.5036,  lng: 124.8469, available: true  },
  { name: 'Surallah',         lat:  6.3667,  lng: 124.7333, available: true  },
  { name: 'General Santos',   lat:  6.1164,  lng: 125.1716, available: false },

  // Region XIII – Caraga
  { name: 'Cabadbaran',   lat:  9.1236,  lng: 125.5342, available: true  },
  { name: 'Butuan',       lat:  8.9490,  lng: 125.5436, available: true  },
  { name: 'Bayugan',      lat:  8.7167,  lng: 125.7500, available: false },
  { name: 'Prosperidad',  lat:  8.6000,  lng: 125.9167, available: false },
  { name: 'Tandag',       lat:  9.0778,  lng: 126.1972, available: true  },
  { name: 'Bislig',       lat:  8.2167,  lng: 126.3167, available: true  },
  { name: 'Hinatuan',     lat:  8.3667,  lng: 126.3333, available: true  },
  { name: 'Surigao City', lat:  9.7833,  lng: 125.4967, available: false },

  // BARMM
  { name: 'Marawi',   lat:  7.9986,  lng: 124.2928, available: false },
  { name: 'Lamitan',  lat:  6.6539,  lng: 122.1278, available: true  },
  { name: 'Jolo',     lat:  6.0500,  lng: 121.0000, available: false },
  { name: 'Bongao',   lat:  5.0297,  lng: 119.7731, available: true  },

  // CAR – Cordillera Administrative Region
  { name: 'Kabugao',     lat: 18.0167,  lng: 121.1833, available: true  },
  { name: 'Tabuk',       lat: 17.4106,  lng: 121.4447, available: false },
  { name: 'Bontoc',      lat: 17.0833,  lng: 120.9833, available: true  },
  { name: 'Lagawe',      lat: 16.8500,  lng: 121.1000, available: false },
  { name: 'Bangued',     lat: 17.5928,  lng: 120.6178, available: false },
  { name: 'La Trinidad', lat: 16.4608,  lng: 120.5872, available: true  },
  { name: 'Baguio',      lat: 16.4023,  lng: 120.5960, available: true  },
];

export const PACKAGES = [
    {
        id: 'starter',
        label: 'Starter',
        price: '₱1,500.00',
        originalPrice: '₱2,500.00',
        discount: '50% OFF',
        image: '/bundlebg.jpg',
    },
    {
        id: 'premium',
        label: 'Premium',
        price: '₱12,500.00',
        originalPrice: '₱22,500.00',
        discount: '30% OFF',
        image: '/bundlebg.jpg',
    },
    {
        id: 'elite',
        label: 'Elite',
        price: '₱21,500.00',
        originalPrice: '₱32,500.00',
        discount: '50% OFF',
        image: '/bundlebg.jpg',
    },
];
