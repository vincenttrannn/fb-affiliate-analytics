export interface AccountInfo {
  email: string;
  posted_count: number;
  groups_used_count: number;
  status: string;
  anonymous_commented: number;
}

export interface TimelineEntry {
  ts: string;
  url: string;
}

export interface DashboardState {
  version?: string;
  totalPostedLinks: number;
  totalGroups: number;
  activeAccounts: number;
  currentCycle: number;
  lastUpdated: string;
  postedLinks: string[];
  postedTimeline?: TimelineEntry[];
  groupLinkMap: Record<string, string[]>;
  accounts: AccountInfo[];
}

export interface Product {
  id: string;
  name: string;
  price: number | null;
  sales: string;
  shop: string;
  commissionRate: string;
  commission: number | null;
  link: string;
  productLink: string;
  category: string;
  price_raw: string;
}

export interface Offer {
  name: string;
  commissionRate: string;
  link: string;
  period: string;
  type: string;
  source: string;
}

export interface GroupInfo {
  url: string;
  totalPosts: number;
  links: string[];
}

export interface ClickReport {
  sourceFile: string;
  exportedAt: string;
  summary: {
    totalClicks: number;
    facebookClicks: number;
    otherClicks: number;
    periodFrom: string;
    periodTo: string;
    clicksBySubId: Record<string, number>;
  };
  timeline: { date: string; clicks: number }[];
  change: { totalClicksPct: number | null } | null;
}

export interface ConversionReport {
  sourceFile: string;
  exportedAt: string;
  summary: {
    totalOrders: number;
    totalItems: number;
    totalCommission: number;
    totalPurchaseValue: number;
    periodFrom: string;
    periodTo: string;
  };
  timeline: { date: string; orders: number; commission: number }[];
  topProducts: { name: string; shop: string; commission: number; qty: number; category: string }[];
  change: { totalOrdersPct: number | null; totalCommissionPct: number | null } | null;
}

export interface ClickStats {
  totalClicks: number;
  todayClicks: number;
  dailyTimeline: { date: string; clicks: number }[];
  topLinks: { slug: string; clicks: number; productName?: string; targetUrl?: string }[];
}
