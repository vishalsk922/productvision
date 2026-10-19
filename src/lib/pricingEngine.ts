import type { ColorOption, WheelOption, AddOnOption, Product } from '../types';

export interface PriceBreakdown {
  basePrice: number;
  paintPrice: number;
  paintName: string;
  wheelPrice: number;
  wheelName: string;
  addOnsTotal: number;
  addOnsList: { name: string; price: number }[];
  totalPrice: number;
}

export function calculateConfigurationPrice(
  product: Product,
  selectedColor: ColorOption,
  selectedWheel: WheelOption,
  selectedAddOns: AddOnOption[]
): PriceBreakdown {
  const basePrice = product.basePrice;
  const paintPrice = selectedColor.price || 0;
  const wheelPrice = selectedWheel.price || 0;
  
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + (item.price || 0), 0);
  const addOnsList = selectedAddOns.map((item) => ({ name: item.name, price: item.price }));

  const totalPrice = basePrice + paintPrice + wheelPrice + addOnsTotal;

  return {
    basePrice,
    paintPrice,
    paintName: selectedColor.name,
    wheelPrice,
    wheelName: selectedWheel.name,
    addOnsTotal,
    addOnsList,
    totalPrice,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
