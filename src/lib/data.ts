export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  warranty: string;
  description: string;
  image: string; // base64 or URL
  inStock: boolean;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  color: string;
  image?: string; // base64 battery image
}

export interface SiteContent {
  // Navbar
  navbarTitle: string;
  navbarSubtitle: string;
  navPhone: string;

  // Hero slides
  heroSlides: Array<{
    title: string;
    subtitle: string;
    desc: string;
    badge: string;
    icon: string;
  }>;

  // Hero stats
  heroStats: Array<{ label: string; value: string }>;

  // Brands section
  brandsSectionLabel: string;
  brandsSectionTitle: string;
  brandsSectionDesc: string;

  // Services section
  servicesSectionLabel: string;
  servicesSectionTitle: string;
  services: Array<{ title: string; desc: string; color: string }>;

  // About section
  aboutLabel: string;
  aboutTitle: string;
  aboutPara1: string;
  aboutPara2: string;
  aboutFeatures: string[];
  aboutCardTitle: string;
  aboutCardSubtitle: string;
  aboutLocation: string;
  aboutPhone: string;
  aboutHours: string;

  // Footer
  footerDesc: string;
  footerFacebookUrl: string;
  footerAddress: string;
  footerPhone: string;
  footerHours: string;
  footerEmail: string;
  footerCreatorName: string;
  footerCreatorUrl: string;
}

export const BRANDS: Brand[] = [
  {
    id: 'exide', name: 'Exide',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Exide_Logo.svg',
    tagline: 'The Power of Expertise', color: '#CC0000',
  },
  {
    id: 'powerzone', name: 'Powerzone',
    logo: 'https://www.powerzoneenergy.com/images/logo.png',
    tagline: 'Zone of Maximum Power', color: '#FF6600',
  },
  {
    id: 'amaron', name: 'Amaron',
    logo: 'https://www.amaron.in/images/amaron-logo.png',
    tagline: 'Last Long. Really Long.', color: '#00AA44',
  },
  {
    id: 'eastman', name: 'Eastman',
    logo: 'https://www.eastmanindustries.com/images/logo.png',
    tagline: 'Built to Last', color: '#0066CC',
  },
  {
    id: 'okaya', name: 'Okaya',
    logo: 'https://www.okayapower.com/images/okaya-logo.png',
    tagline: 'Power Your Dreams', color: '#9900CC',
  },
  {
    id: 'luminous', name: 'Luminous',
    logo: 'https://www.luminousindia.com/pub/static/frontend/Luminous/luminous/en_US/images/luminous-logo.svg',
    tagline: 'Har Ghar Ki Shaan', color: '#FF9900',
  },
  {
    id: 'livguard', name: 'Livguard',
    logo: 'https://www.livguard.com/static-assets/icons/logo/livguard-logo.svg',
    tagline: 'Guard Your Life', color: '#006699',
  },
  {
    id: 'microtek', name: 'Microtek',
    logo: 'https://www.microtekdirect.com/pub/static/frontend/Microtek/default/en_US/images/logo.png',
    tagline: 'Smart Power Solutions', color: '#CC6600',
  },
];

const STORAGE_KEY = 'exide_point_products';
const SITE_CONTENT_KEY = 'exide_point_site_content';
const BRAND_IMAGES_KEY = 'exide_point_brand_images';

// ─── Products ───────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return getDefaultProducts();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    const defaults = getDefaultProducts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  } catch {
    return getDefaultProducts();
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function getProductsByBrand(brand: string): Product[] {
  return getProducts().filter(p => p.brand.toLowerCase() === brand.toLowerCase());
}

// ─── Brand Images ────────────────────────────────────────────────────────────

export function getBrandImages(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(BRAND_IMAGES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setBrandImage(brandId: string, base64: string): void {
  if (typeof window === 'undefined') return;
  const images = getBrandImages();
  images[brandId] = base64;
  localStorage.setItem(BRAND_IMAGES_KEY, JSON.stringify(images));
}

export function removeBrandImage(brandId: string): void {
  if (typeof window === 'undefined') return;
  const images = getBrandImages();
  delete images[brandId];
  localStorage.setItem(BRAND_IMAGES_KEY, JSON.stringify(images));
}

// ─── Site Content ────────────────────────────────────────────────────────────

const DEFAULT_SITE_CONTENT: SiteContent = {
  navbarTitle: 'EXIDE POINT',
  navbarSubtitle: '& Spare Parts',
  navPhone: '+918513908681',

  heroSlides: [
    {
      title: 'POWER YOUR LIFE',
      subtitle: 'Premium Battery Solutions',
      desc: 'Genuine batteries for cars, bikes, inverters & solar. Best prices, expert advice.',
      badge: 'AUTHORIZED MULTI BRAND RETAILER',
      icon: '⚡',
    },
    {
      title: 'NEVER RUN OUT',
      subtitle: 'Inverter & UPS Batteries',
      desc: 'Keep your home powered 24/7 with top-brand inverter batteries and free installation.',
      badge: '48-Month Warranty Available',
      icon: '🔋',
    },
    {
      title: 'TRUSTED QUALITY',
      subtitle: '8 Premium Brands In-Store',
      desc: 'Exide, Amaron, Luminous, Livguard, Microtek and more — all under one roof.',
      badge: '1000+ Happy Customers',
      icon: '🏆',
    },
  ],

  heroStats: [
    { label: 'Genuine Products', value: '100%' },
    { label: 'Brands Available', value: '8+' },
    { label: 'Years Experience', value: '10+' },
  ],

  brandsSectionLabel: 'Our Collection',
  brandsSectionTitle: 'PREMIUM BRANDS',
  brandsSectionDesc: 'We stock only genuine, warranty-backed batteries from India\'s most trusted brands.',

  servicesSectionLabel: 'What We Offer',
  servicesSectionTitle: 'OUR SERVICES',
  services: [
    { title: 'Battery Supply', desc: 'Wide range of car, bike, inverter, solar and industrial batteries from premium brands.', color: '#CC0000' },
    { title: 'Battery Testing', desc: 'Free battery health checkup and load testing to ensure peak performance.', color: '#FFD700' },
    { title: 'Home Delivery', desc: 'Fast doorstep delivery with professional installation service available.', color: '#00AA44' },
    { title: 'Old Battery Exchange', desc: 'Best buyback rates on your old battery. Get cashback on exchange.', color: '#0066CC' },
    { title: 'Quick Service', desc: 'Emergency battery replacement service — same day, any time.', color: '#FF6600' },
    { title: 'Genuine Warranty', desc: 'All products come with manufacturer warranty cards and free servicing.', color: '#9900CC' },
  ],

  aboutLabel: 'About Us',
  aboutTitle: 'YOUR TRUSTED BATTERY PARTNER',
  aboutPara1: 'Exide Point & Spare Parts has been serving the community for over a decade, providing top-quality batteries for every need — from two-wheelers to industrial inverters.',
  aboutPara2: 'We believe in honest service, genuine products, and building long-term relationships with our customers. Every battery we sell comes with complete manufacturer warranty and our personal service guarantee.',
  aboutFeatures: [
    'Authorized dealer for 8+ battery brands',
    'Free battery testing & health checkup',
    'Genuine products with valid warranty cards',
    'Expert installation & old battery exchange',
    'Competitive pricing & seasonal offers',
    'Emergency replacement assistance',
  ],
  aboutCardTitle: 'EXIDE POINT',
  aboutCardSubtitle: '& Spare Parts',
  aboutLocation: 'Your City, West Bengal, India',
  aboutPhone: '+91 8513908681',
  aboutHours: 'Mon–Sat: 9 AM – 8 PM',

  footerDesc: 'Your trusted destination for genuine batteries — cars, bikes, inverters & solar. Quality products, expert advice.',
  footerFacebookUrl: 'https://www.facebook.com/people/EXIDE-point-and-spare-parts/100069745907389/',
  footerAddress: 'Your City, West Bengal, India',
  footerPhone: '+91 8513908681',
  footerHours: 'Mon–Sat: 9 AM – 8 PM',
  footerEmail: 'exidepoint@gmail.com',
  footerCreatorName: 'KAUSIK SANTRA',
  footerCreatorUrl: 'https://instagram.com/k__k_santra',
};

export function getSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const data = localStorage.getItem(SITE_CONTENT_KEY);
    if (!data) return DEFAULT_SITE_CONTENT;
    // Merge with defaults so new fields are available even if not saved yet
    return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
}

function getDefaultProducts(): Product[] {
  return [
    {
      id: '1', name: 'Exide Matrix 35Ah', brand: 'Exide', category: 'Car Battery',
      price: 3499, warranty: '36 Months', description: 'High-performance car battery with advanced technology.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '2', name: 'Exide Inverter Plus 150Ah', brand: 'Exide', category: 'Inverter Battery',
      price: 8999, warranty: '48 Months', description: 'Premium tubular inverter battery for home UPS.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '3', name: 'Amaron PRO 35L', brand: 'Amaron', category: 'Car Battery',
      price: 4199, warranty: '42 Months', description: 'Silver calcium alloy battery with zero maintenance.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '4', name: 'Amaron Inverter 200Ah', brand: 'Amaron', category: 'Inverter Battery',
      price: 11500, warranty: '48 Months', description: 'Long backup inverter battery ideal for home use.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '5', name: 'Luminous ILTT 18048', brand: 'Luminous', category: 'Inverter Battery',
      price: 10200, warranty: '60 Months', description: '150Ah tall tubular battery with superior backup.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '6', name: 'Luminous Shakti Charge 180Ah', brand: 'Luminous', category: 'Inverter Battery',
      price: 9800, warranty: '48 Months', description: 'Extra backup with BPS technology.',
      image: '', inStock: false, createdAt: new Date().toISOString(),
    },
    {
      id: '7', name: 'Okaya HB500 12V', brand: 'Okaya', category: 'Solar Battery',
      price: 6700, warranty: '36 Months', description: 'Designed for solar applications, deep cycle.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '8', name: 'Livguard LGS1700i 150Ah', brand: 'Livguard', category: 'Inverter Battery',
      price: 9200, warranty: '36 Months', description: 'Supercharged performance with AI-powered charging.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '9', name: 'Microtek MTK 150Ah', brand: 'Microtek', category: 'Inverter Battery',
      price: 8400, warranty: '36 Months', description: 'Tubular plate battery for long backup.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '10', name: 'Eastman ET700 65Ah', brand: 'Eastman', category: 'Bike Battery',
      price: 1850, warranty: '18 Months', description: 'Sealed maintenance-free two-wheeler battery.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '11', name: 'Powerzone 100Ah Tubular', brand: 'Powerzone', category: 'Inverter Battery',
      price: 6999, warranty: '36 Months', description: 'High-capacity tubular battery for frequent outages.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
    {
      id: '12', name: 'Exide Xplore 2.5Ah', brand: 'Exide', category: 'Bike Battery',
      price: 1299, warranty: '18 Months', description: 'Reliable and long-lasting two-wheeler battery.',
      image: '', inStock: true, createdAt: new Date().toISOString(),
    },
  ];
}
