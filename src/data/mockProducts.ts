import type { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-apex-gtr',
    slug: 'apex-gtr-vision',
    name: 'Apex GT-R Vision',
    tagline: 'The Pinnacle of Hybrid Grand Touring Performance',
    category: 'Sports Coupe',
    basePrice: 128500,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    description:
      'Engineered with an aerodynamic monocoque chassis, active downforce aero flaps, and a dual-turbo hybrid powertrain producing instantaneous torque.',
    specs: {
      acceleration: '2.6s (0-60 mph)',
      topSpeed: '205 mph',
      horsepower: '820 HP',
      drivetrain: 'Hybrid e-AWD',
      range: '420 mi Combined',
    },
    availableColors: [
      { id: 'c-obsidian', name: 'Obsidian Shadow', hex: '#0f172a', finish: 'Metallic', price: 0, badge: 'Standard' },
      { id: 'c-midnight', name: 'Midnight Hyper-Blue', hex: '#1e3a8a', finish: 'Metallic', price: 1200, badge: 'Popular' },
      { id: 'c-rosso', name: 'Rosso Corsa Red', hex: '#b91c1c', finish: 'Gloss', price: 1500 },
      { id: 'c-titanium', name: 'Liquid Titanium', hex: '#64748b', finish: 'Metallic', price: 1200 },
      { id: 'c-emerald', name: 'Emerald Stealth', hex: '#064e3b', finish: 'Matte', price: 2800, badge: 'Exclusive' },
      { id: 'c-gold', name: 'Solar Apex Gold', hex: '#d97706', finish: 'Metallic', price: 3200, badge: 'Signature' },
      { id: 'c-chalk', name: 'Alpine Chalk White', hex: '#f8fafc', finish: 'Gloss', price: 800 },
    ],
    availableWheels: [
      { id: 'w-turbine', name: '20" Forged Turbine Silver', size: '20-inch', finish: 'Machined Silver', price: 0 },
      { id: 'w-satin-black', name: '21" Dark Satin Multi-Spoke', size: '21-inch', finish: 'Matte Black', price: 1800 },
      { id: 'w-carbon-blade', name: '21" Carbon Aero Blade Rims', size: '21-inch', finish: 'Exposed Carbon', price: 3400 },
    ],
    availableAddOns: [
      { id: 'opt-aero', name: 'Carbon Aerodynamics Package', description: 'Active carbon fiber front splitter and high-downforce rear wing.', price: 4500, category: 'Exterior' },
      { id: 'opt-brakes', name: 'Carbon Ceramic Track Brakes', description: 'Cross-drilled carbon rotors with signature yellow 6-piston calipers.', price: 3200, category: 'Performance' },
      { id: 'opt-cockpit', name: 'Alcantara Racing Cockpit', description: 'Hand-stitched microfibre sport seats and carbon center console.', price: 2400, category: 'Interior' },
      { id: 'opt-audio', name: 'Immersive Spatial Audio', description: '18-speaker 1200W bespoke high-fidelity surround sound system.', price: 1800, category: 'Interior' },
    ],
  },
  {
    id: 'prod-specter-ev',
    slug: 'specter-aero-ev',
    name: 'Specter Aero EV',
    tagline: 'Pure Electric Velocity Wrapped in Sculpted Luxury',
    category: 'Electric GT',
    basePrice: 94000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description:
      'Ultra-low 0.19 drag coefficient electric grand tourer with 800V fast-charge architecture and next-generation autonomous driver assistance.',
    specs: {
      acceleration: '2.9s (0-60 mph)',
      topSpeed: '185 mph',
      horsepower: '680 HP',
      drivetrain: 'Dual Motor AWD',
      range: '385 Miles',
    },
    availableColors: [
      { id: 'c-cyber-silver', name: 'Cyber Liquid Silver', hex: '#94a3b8', finish: 'Metallic', price: 0, badge: 'Standard' },
      { id: 'c-deep-violet', name: 'Nebula Violet', hex: '#4c1d95', finish: 'Metallic', price: 1400 },
      { id: 'c-pearl-white', name: 'Glacier Pearl White', hex: '#f1f5f9', finish: 'Gloss', price: 900 },
      { id: 'c-carbon-black', name: 'Monolith Black', hex: '#020617', finish: 'Matte', price: 2600, badge: 'Exclusive' },
    ],
    availableWheels: [
      { id: 'w-aero-cover', name: '20" Aerodynamic AeroShields', size: '20-inch', finish: 'Diamond Cut', price: 0 },
      { id: 'w-ev-sport', name: '21" Vortex Lightweight Alloy', size: '21-inch', finish: 'Gloss Anthracite', price: 1600 },
    ],
    availableAddOns: [
      { id: 'opt-lidar', name: 'Autonomous Vision LiDAR Pack', description: 'Roof-integrated solid-state LiDAR with 360-degree sensory envelope.', price: 3800, category: 'Performance' },
      { id: 'opt-glass', name: 'Panoramic Electrochromic Glass Roof', description: 'Smart tinting glass roof adjusts opacity on demand.', price: 2100, category: 'Exterior' },
      { id: 'opt-sound-gen', name: 'Acoustic Sound Synthesizer', description: 'Curated harmonic engine sound profiles inside & out.', price: 950, category: 'Interior' },
    ],
  },
  {
    id: 'prod-veloce-spider',
    slug: 'veloce-spider-12',
    name: 'Veloce Spider 12',
    tagline: 'Unfiltered Hypercar Exhilaration With Open Skies',
    category: 'Hypercar',
    basePrice: 245000,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    description:
      'A bespoke open-air carbon composite hypercar engineered for the racetrack yet road legal, with an screaming atmospheric power plant.',
    specs: {
      acceleration: '2.2s (0-60 mph)',
      topSpeed: '224 mph',
      horsepower: '1050 HP',
      drivetrain: 'Quad-Motor Torque Vectoring',
      range: '280 Miles',
    },
    availableColors: [
      { id: 'c-giallo-fly', name: 'Giallo Modena Yellow', hex: '#eab308', finish: 'Gloss', price: 0 },
      { id: 'c-verde-mantis', name: 'Verde Mantis Green', hex: '#16a34a', finish: 'Metallic', price: 3500, badge: 'Track Signature' },
      { id: 'c-nero-nemesis', name: 'Nero Nemesis', hex: '#18181b', finish: 'Matte', price: 4200, badge: 'Exclusive' },
      { id: 'c-electric-orange', name: 'Magma Orange', hex: '#ea580c', finish: 'Gloss', price: 2900 },
    ],
    availableWheels: [
      { id: 'w-center-lock', name: '20"/21" Centerlock Magnesium Rims', size: 'Staggered', finish: 'Forged Bronze', price: 0 },
      { id: 'w-full-carbon', name: '20"/21" Ultra-Light Full Carbon Rims', size: 'Staggered', finish: 'Gloss Carbon', price: 6200 },
    ],
    availableAddOns: [
      { id: 'opt-titanium-exhaust', name: 'Inconel & Titanium Aerodynamic Pack', description: 'Aerospace-grade thermal heat shielding and vortex generators.', price: 6500, category: 'Performance' },
      { id: 'opt-telemetry', name: 'Real-Time Track Telemetry Suite', description: 'Dual HD cameras with GPS lap timing and delta data analysis.', price: 2800, category: 'Performance' },
      { id: 'opt-custom-luggage', name: 'Bespoke Carbon Luggage Set', description: 'Custom fitted leather and carbon travel luggage.', price: 3400, category: 'Interior' },
    ],
  },
  {
    id: 'prod-titanium-cross',
    slug: 'titanium-cross-gt',
    name: 'Titanium Cross GT',
    tagline: 'High-Altitude Luxury Meets Uncompromising Terrain Authority',
    category: 'Performance SUV',
    basePrice: 112000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Twin-turbocharged executive crossover featuring adaptive 3-chamber air suspension, electro-mechanical roll stabilization, and bespoke handcrafted trim.',
    specs: {
      acceleration: '3.4s (0-60 mph)',
      topSpeed: '178 mph',
      horsepower: '650 HP',
      drivetrain: 'Variable All-Terrain AWD',
      range: '460 mi Tank',
    },
    availableColors: [
      { id: 'c-alpine-slate', name: 'Slate Gray Metallic', hex: '#475569', finish: 'Metallic', price: 0 },
      { id: 'c-matte-desert', name: 'Kalahari Desert Sand', hex: '#78716c', finish: 'Matte', price: 2400 },
      { id: 'c-deep-navy', name: 'Pacific Deep Navy', hex: '#0f172a', finish: 'Gloss', price: 1200 },
      { id: 'c-nardo', name: 'Nardo Concrete Gray', hex: '#94a3b8', finish: 'Gloss', price: 1500 },
    ],
    availableWheels: [
      { id: 'w-suv-standard', name: '22" Off-Axis Bicolor Alloys', size: '22-inch', finish: 'Diamond Polished', price: 0 },
      { id: 'w-suv-forged', name: '23" Rugged Monoblock Forged Rims', size: '23-inch', finish: 'Satin Bronze', price: 2600 },
    ],
    availableAddOns: [
      { id: 'opt-offroad-pack', name: 'All-Terrain Expedition Package', description: 'Underbody titanium skid plates, roof rails & differential locks.', price: 3600, category: 'Performance' },
      { id: 'opt-night-vision', name: 'Infrared Night Vision Camera', description: 'Thermal camera display with pedestrian & wildlife warning.', price: 2200, category: 'Performance' },
      { id: 'opt-rear-exec', name: 'Rear Executive Lounge Consoles', description: 'Reclining massage chairs with cooled champagne chiller.', price: 4200, category: 'Interior' },
    ],
  },
];
