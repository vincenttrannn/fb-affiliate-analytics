import { readFileSync } from 'fs';
import { join } from 'path';
import type { DashboardState, Product, Offer, GroupInfo } from './types';

const dataDir = join(process.cwd(), 'data');

function readJSON<T>(file: string): T {
  try {
    return JSON.parse(readFileSync(join(dataDir, file), 'utf-8'));
  } catch {
    return (file === 'state.json'
      ? { totalPostedLinks: 0, totalGroups: 0, activeAccounts: 0, currentCycle: 0, lastUpdated: '', postedLinks: [], groupLinkMap: {}, accounts: [] }
      : []) as T;
  }
}

export function getState(): DashboardState { return readJSON<DashboardState>('state.json'); }
export function getProducts(): Product[] { return readJSON<Product[]>('products.json'); }
export function getOffers(): Offer[] { return readJSON<Offer[]>('offers.json'); }
export function getGroups(): GroupInfo[] { return readJSON<GroupInfo[]>('groups.json'); }

export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map(p => p.category))].sort();
}

export function summarizeCommissionRates(products: Product[]) {
  const buckets: Record<string, number> = {};
  for (const p of products) {
    const rate = parseFloat(p.commissionRate) || 0;
    const key = rate === 0 ? '0%'
      : rate <= 5 ? '1-5%'
      : rate <= 10 ? '6-10%'
      : rate <= 20 ? '11-20%'
      : '20%+';
    buckets[key] = (buckets[key] || 0) + 1;
  }
  return buckets;
}

export function getClickReport(): import('./types').ClickReport | null {
  try { return readJSON<import('./types').ClickReport>('click_report.json') } catch { return null }
}

export function getConversionReport(): import('./types').ConversionReport | null {
  try { return readJSON<import('./types').ConversionReport>('conversion_report.json') } catch { return null }
}

export function summarizePriceRanges(products: Product[]) {
  const ranges: Record<string, number> = {};
  for (const p of products) {
    const price = p.price || 0;
    const key = price === 0 ? 'Free'
      : price <= 50000 ? '1-50k'
      : price <= 200000 ? '50-200k'
      : price <= 500000 ? '200-500k'
      : price <= 1000000 ? '500k-1tr'
      : '1tr+';
    ranges[key] = (ranges[key] || 0) + 1;
  }
  return ranges;
}
