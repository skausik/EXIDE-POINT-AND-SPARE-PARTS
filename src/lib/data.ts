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
}

export const BRANDS: Brand[] = [
  { id: 'exide', name: 'Exide', logo: '⚡', tagline: 'The Power of Expertise', color: '#CC0000' },
  { id: 'powerzone', name: 'Powerzone', logo: '🔋', tagline: 'Zone of Maximum Power', color: '#FF6600' },
  { id: 'amaron', name: 'Amaron', logo: '🏆', tagline: 'Last Long. Really Long.', color: '#00AA44' },
  { id: 'eastman', name: 'Eastman', logo: '⚙️', tagline: 'Built to Last', color: '#0066CC' },
  { id: 'okaya', name: 'Okaya', logo: '🌟', tagline: 'Power Your Dreams', color: '#9900CC' },
  { id: 'luminous', name: 'Luminous', logo: '💡', tagline: 'Har Ghar Ki Shaan', color: '#FF9900' },
  { id: 'livguard', name: 'Livguard', logo: '🛡️', tagline: 'Guard Your Life', color: '#006699' },
  { id: 'microtek', name: 'Microtek', logo: '🔌', tagline: 'Smart Power Solutions', color: '#CC6600' },
];

const STORAGE_KEY = 'exide_point_products';

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
