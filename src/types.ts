export type StrategyAction = 'Buy' | 'Keep' | 'Sell';

export interface HoldingItem {
  id: string;
  ticker: string;
  name: string;
  strategy: StrategyAction;
  assetClass: 'ETF' | 'Stock' | 'Crypto' | 'Cash' | 'Emergency' | 'PPR';
  industry: string;
  market: string;
  weightPct: number; // Percentage of total investments or portfolio
  shares?: number;
  avgPrice?: string;
  currentPrice?: string;
  totalCostEur?: number;
  currentValueUsd?: number;
  currentValueEur: number;
  profitPct?: number;
  profitEur?: number;
  dividendYieldPct: number;
  expectedReturnPct: number;
  notes?: string;
  aiTrendRelevance?: 'Direct Core AI' | 'AI Infrastructure & Semis' | 'Broad Tech Index' | 'Defensive / Cash' | 'Energy / Power Grid' | 'Diversifier';
}

export interface AssetCategorySummary {
  category: string;
  label: string;
  valueEur: number;
  weightPct: number;
  color: string;
  subcategories?: { name: string; valueEur: number; weightPct: number }[];
}

export interface SectorSummary {
  sector: string;
  valueEur: number;
  weightPct: number;
  color: string;
  count: number;
}

export interface HorizonProjection {
  years: number;
  label: string;
  nominalStartingPrincipal: number;
  totalMonthlyDeposits: number;
  totalPrincipalContributed: number;
  compoundGrowthGains: number;
  nominalTotalValue: number;
  realTotalValue: number; // Inflation adjusted
  realCompoundGains: number;
  estimatedNetAfterTaxEur?: number;
}

export interface ScenarioSensitivity {
  scenarioName: string;
  annualRatePct: number;
  tag: string;
  badgeColor: string;
  year5Nominal: number;
  year5Real: number;
  year10Nominal: number;
  year10Real: number;
  year15Nominal: number;
  year15Real: number;
  monthsTo500k: number;
  yearsTo500k: number;
  target500kDate: string;
}

export interface PortfolioParameters {
  totalStartingValueEur: number;
  monthlyDepositEur: number;
  expectedAnnualReturnPct: number;
  dividendYieldPct: number;
  inflationRatePct: number;
  targetMilestoneEur: number;
}

export interface OptimizationRecommendation {
  id: string;
  category: 'Rebalancing' | 'Tax Optimization' | 'AI Trend Strategy' | 'Risk Management';
  title: string;
  description: string;
  impactLevel: 'High' | 'Medium' | 'Critical';
  actionSteps: string[];
  associatedTickers?: string[];
}
