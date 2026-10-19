export type ProductCategory = 'All' | 'Sports Coupe' | 'Electric GT' | 'Hypercar' | 'Performance SUV';

export type PaintFinish = 'Metallic' | 'Matte' | 'Gloss';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  finish: PaintFinish;
  price: number;
  badge?: string;
}

export interface WheelOption {
  id: string;
  name: string;
  size: string;
  finish: string;
  price: number;
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Performance' | 'Exterior' | 'Interior';
}

export interface ProductSpecs {
  acceleration: string; // e.g. "0-60 in 2.6s"
  topSpeed: string;    // e.g. "205 mph"
  horsepower: string;  // e.g. "820 HP"
  drivetrain: string;  // e.g. "Dual-Motor AWD"
  range?: string;      // e.g. "340 Miles"
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Exclude<ProductCategory, 'All'>;
  basePrice: number;
  image: string;
  description: string;
  isFeatured?: boolean;
  specs: ProductSpecs;
  availableColors: ColorOption[];
  availableWheels: WheelOption[];
  availableAddOns: AddOnOption[];
}

export interface UserConfiguration {
  id: string;
  userId?: string;
  title: string;
  product: Product;
  selectedColor: ColorOption;
  selectedWheel: WheelOption;
  selectedAddOns: AddOnOption[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isCloudConnected: boolean;
}

export type ActiveTab = 'home' | 'catalog' | 'configurator' | 'my-configurations';
