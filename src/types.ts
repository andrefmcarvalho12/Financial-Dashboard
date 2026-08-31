export type StrategyAction = 'Buy' | 'Keep' | 'Sell';

// Thematic tags accepted in the AiTrendRelevance column of holdings_*.csv.
// Both the original vocabulary and the current broker-export vocabulary are
// supported, so previously generated datasets keep type-checking.
export type AiTrendRelevance =
  // Current vocabulary
  | 'AI Hardware / Semiconductors'
  | 'AI Software & Platforms'
  | 'AI Data Centre Infrastructure'
  | 'AI Energy Demand (power/uranium)'
  | 'Broad Index (indirect AI exposure)'
  | 'Broad Tech Index'
  | 'Non-AI'
  // Legacy vocabulary
  | 'Direct Core AI'
  | 'AI Infrastructure & Semis'
  | 'Defensive / Cash'
  | 'Energy / Power Grid'
  | 'Diversifier';

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
  aiTrendRelevance?: AiTrendRelevance;
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
