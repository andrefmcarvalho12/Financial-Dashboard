import fs from 'fs';
import path from 'path';

interface SummaryCategory {
  category: string;
  label: string;
  valueEur: number;
  color?: string;
  subcategories?: { name: string; valueEur: number }[];
}

interface PortfolioSummaryJson {
  totalValueEur?: number;
  investmentsTotalEur?: number;
  emergencyFundTotalEur?: number;
  pprTotalEur?: number;
  cashTotalEur?: number;
  cryptoTotalEur?: number;
  monthlyDepositEur?: number;
  defaultAnnualReturnPct?: number;
  conservativeReturnPct?: number;
  moderateReturnPct?: number;
  aggressiveReturnPct?: number;
  dividendYieldTargetPct?: number;
  inflationRatePct?: number;
  targetMilestoneEur?: number;
  asOfDate?: string;
  lastUpdateDate?: string;
  categories?: SummaryCategory[];
}

// Clean and parse numbers with support for EU formats ('1 442,40 €', '78,45', '$456.75')
function parseFlexibleNumber(value: string | number | undefined | null, fallback = 0): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number') return Number.isNaN(value) ? fallback : value;

  const str = String(value).trim();
  if (!str) return fallback;

  // Remove currency signs, spaces, NBSP, and quotes
  let cleaned = str.replace(/[€$£\s\u00A0"']/g, '');

  // Handle EU decimal comma vs dot
  if (cleaned.includes(',') && cleaned.includes('.')) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      // 1.234,56 -> 1234.56
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,234.56 -> 1234.56
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // 1234,56 -> 1234.56
    cleaned = cleaned.replace(',', '.');
  }

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? fallback : num;
}

// Simple CSV parser supporting quotes and commas
function parseCsv(csvContent: string): Record<string, string>[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = splitCsvLine(headerLine).map((h) => h.trim());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function generatePortfolioDataFromFiles(
  summaryPath: string,
  holdingsPath: string,
  outputPath: string
) {
  console.log(`\n======================================================`);
  console.log(`🚀 [Portfolio Generator] Ingesting 2 input files...`);
  console.log(`📄 File 1 (Summary):  ${summaryPath}`);
  console.log(`📄 File 2 (Holdings): ${holdingsPath}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(summaryPath)) {
    throw new Error(`Summary file not found at: ${summaryPath}`);
  }
  if (!fs.existsSync(holdingsPath)) {
    throw new Error(`Holdings CSV file not found at: ${holdingsPath}`);
  }

  const rawSummary = fs.readFileSync(summaryPath, 'utf-8');
  const summary: PortfolioSummaryJson = JSON.parse(rawSummary);

  const rawHoldingsCsv = fs.readFileSync(holdingsPath, 'utf-8');
  const holdingRows = parseCsv(rawHoldingsCsv);

  console.log(`✅ Loaded summary JSON with target total: €${summary.totalValueEur?.toLocaleString() || 'N/A'}`);
  console.log(`✅ Parsed ${holdingRows.length} holding records from CSV.`);

  // Calculate sum of holdings
  let calculatedHoldingsSumEur = 0;
  const processedHoldings = holdingRows.map((row, idx) => {
    const ticker = row.Ticker || row.ticker || `ASSET-${idx + 1}`;
    const name = row.Name || row.name || ticker;
    const assetClass = (row.AssetClass || row.assetClass || (ticker.includes('AMS:') || ticker.includes('LON:') ? 'ETF' : 'Stock')) as 'Stock' | 'ETF' | 'Crypto' | 'Cash' | 'Bond';
    const industry = row.Industry || row.industry || (assetClass === 'ETF' ? 'Exchange-traded fund' : 'Information Technology');
    const market = row.Market || row.market || 'Global';
    const shares = parseFlexibleNumber(row.Shares || row.shares, 1);
    const avgPrice = row.AvgPrice || row.avgPrice || '€0.00';
    const currentPrice = row.CurrentPrice || row.currentPrice || '€0.00';
    const totalCostEur = parseFlexibleNumber(row.TotalCostEur || row.totalCostEur, 0);
    const currentValueUsd = parseFlexibleNumber(row.CurrentValueUsd || row.currentValueUsd, 0);
    const currentValueEur = parseFlexibleNumber(row.CurrentValueEur || row.currentValueEur, totalCostEur);
    
    calculatedHoldingsSumEur += currentValueEur;

    let profitEur = parseFlexibleNumber(row.ProfitEur || row.profitEur, currentValueEur - totalCostEur);
    let profitPct = parseFlexibleNumber(row.ProfitPct || row.profitPct, 0);
    if (profitPct === 0 && totalCostEur > 0) {
      profitPct = parseFloat((((currentValueEur - totalCostEur) / totalCostEur) * 100).toFixed(2));
    }

    const dividendYieldPct = parseFlexibleNumber(row.DividendYieldPct || row.dividendYieldPct, 0);
    const expectedReturnPct = parseFlexibleNumber(row.ExpectedReturnPct || row.expectedReturnPct, 10.0);
    const strategy = (row.Strategy || row.strategy || 'Keep') as 'Buy' | 'Hold' | 'Sell' | 'Keep' | 'Trim';
    const aiTrendRelevance = (row.AiTrendRelevance || row.aiTrendRelevance || 'Direct Core AI') as any;
    const notes = row.Notes || row.notes || '';

    const id = ticker.toLowerCase().replace(/[^a-z0-9]/g, '');

    return {
      id,
      ticker,
      name,
      strategy,
      assetClass,
      industry,
      market,
      weightPct: 0, // will compute after total portfolio value
      shares,
      avgPrice,
      currentPrice,
      totalCostEur: parseFloat(totalCostEur.toFixed(2)),
      currentValueUsd: parseFloat(currentValueUsd.toFixed(2)),
      currentValueEur: parseFloat(currentValueEur.toFixed(2)),
      profitPct: parseFloat(profitPct.toFixed(2)),
      profitEur: parseFloat(profitEur.toFixed(2)),
      dividendYieldPct: parseFloat(dividendYieldPct.toFixed(2)),
      expectedReturnPct: parseFloat(expectedReturnPct.toFixed(2)),
      aiTrendRelevance,
      notes,
    };
  });

  const totalPortfolioValueEur = summary.totalValueEur || calculatedHoldingsSumEur;

  // Compute weights
  processedHoldings.forEach((h) => {
    h.weightPct = parseFloat(((h.currentValueEur / totalPortfolioValueEur) * 100).toFixed(2));
  });

  // Build categories
  const categories = (summary.categories || []).map((cat) => {
    const weightPct = parseFloat(((cat.valueEur / totalPortfolioValueEur) * 100).toFixed(2));
    const subcategories = (cat.subcategories || []).map((sub) => ({
      name: sub.name,
      valueEur: sub.valueEur,
      weightPct: parseFloat(((sub.valueEur / totalPortfolioValueEur) * 100).toFixed(2)),
    }));

    return {
      category: cat.category,
      label: cat.label,
      valueEur: parseFloat(cat.valueEur.toFixed(2)),
      weightPct,
      color: cat.color || '#3b82f6',
      subcategories,
    };
  });

  const portfolioMeta = {
    totalValueEur: totalPortfolioValueEur,
    investmentsTotalEur: summary.investmentsTotalEur || calculatedHoldingsSumEur,
    emergencyFundTotalEur: summary.emergencyFundTotalEur || 27264.0,
    pprTotalEur: summary.pprTotalEur || 8800.0,
    cashTotalEur: summary.cashTotalEur || 3326.0,
    cryptoTotalEur: summary.cryptoTotalEur || 2266.77,
    monthlyDepositEur: summary.monthlyDepositEur || 2000.0,
    defaultAnnualReturnPct: summary.defaultAnnualReturnPct || 10.0,
    conservativeReturnPct: summary.conservativeReturnPct || 5.0,
    moderateReturnPct: summary.moderateReturnPct || 7.5,
    aggressiveReturnPct: summary.aggressiveReturnPct || 12.0,
    dividendYieldTargetPct: summary.dividendYieldTargetPct || 2.0,
    inflationRatePct: summary.inflationRatePct || 1.5,
    targetMilestoneEur: summary.targetMilestoneEur || 500000.0,
    asOfDate: summary.asOfDate || new Date().toISOString().split('T')[0],
    lastUpdateDate: summary.lastUpdateDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  const outputTsContent = `import { HoldingItem, AssetCategorySummary, OptimizationRecommendation } from '../types';

export const RAW_PORTFOLIO_META = ${JSON.stringify(portfolioMeta, null, 2)};

export const ASSET_CATEGORIES: AssetCategorySummary[] = ${JSON.stringify(categories, null, 2)};

export const PORTFOLIO_HOLDINGS: HoldingItem[] = ${JSON.stringify(processedHoldings, null, 2)};

export const RECOMMENDATIONS: OptimizationRecommendation[] = [
  {
    id: 'rec-1',
    category: 'Tax Optimization',
    title: 'Harvest Tax Losses & Eliminate High Dividend Drag (Sell VZ & BEPC)',
    impactLevel: 'Critical',
    description: 'Under Portuguese tax law (IRS), capital gains are taxed at 28%. You can offset realized capital losses against taxable gains in the same or future fiscal years (up to 5 years).',
    actionSteps: [
      'Sell Verizon (VZ) (approx. -119 € loss) and Brookfield Renewable (BEPC) (approx. -330 € loss) to generate €449.62 in tax-deductible losses.',
      'Reallocate the €4,420.76 in proceeds into accumulating core ETFs (e.g. CSPX or IUIT).',
      'Eliminates the annual 28% Portuguese IRS tax drag on dividend yields, accelerating compound growth without taxable income leakage.',
    ],
    associatedTickers: ['VZ', 'BEPC', 'CSPX'],
  },
  {
    id: 'rec-2',
    category: 'AI Trend Strategy',
    title: 'Systematic €2,000/Month DCA into AI Pillars & Core Compounder',
    impactLevel: 'High',
    description: 'To harness the ongoing AI and Technology supercycle while maintaining structural portfolio integrity, establish a disciplined dollar-cost averaging allocation rule for monthly deposits.',
    actionSteps: [
      '50% (€1,000/mo) into Core Foundational: iShares S&P 500 (CSPX) to maintain rock-solid base liquidity and broad exposure.',
      '25% (€500/mo) into Direct Tech/AI Sector ETF (IUIT) or NASDAQ 100 (CNDX).',
      '25% (€500/mo) into High-Conviction AI Moats (TSM, ASML, NVDA, GOOGL, MSFT) or opportunistically during market consolidations.',
    ],
    associatedTickers: ['CSPX', 'IUIT', 'CNDX', 'TSM', 'ASML', 'NVDA'],
  },
  {
    id: 'rec-3',
    category: 'Rebalancing',
    title: 'Consolidate Tech Overlap & Control Single-Stock Concentration',
    impactLevel: 'High',
    description: 'Currently, the portfolio has high direct and indirect exposure to semiconductors and mega-cap tech (e.g., AMD, NVDA, MSFT, AAPL, ASML, TSM are already top weights in CNDX, CSPX, and IUIT).',
    actionSteps: [
      'Maintain existing massive winners (AMD +541%, NVDA +565%, NET +332%) without triggering premature capital gains taxes.',
      'Direct all new capital to broad-market index/accumulating ETFs rather than further increasing single-stock risk beyond 5% per name.',
      'Keep semiconductor total direct weight under 25% of total liquid investments.',
    ],
    associatedTickers: ['AMD', 'NVDA', 'CNDX', 'IUIT'],
  },
  {
    id: 'rec-4',
    category: 'Risk Management',
    title: 'Preserve Safe Liquidity & Maximize PPR Portuguese Tax Deductions',
    impactLevel: 'Medium',
    description: 'Your Emergency Fund of €27,264 (8.63%) provides over 12-14 months of living expenses buffer in high-yield/safe government accounts. Your PPR provides immediate tax benefits.',
    actionSteps: [
      'Ensure you contribute the maximum eligible annual amount (e.g., 2,000 €/year) to your PPR to claim the maximum 20% IRS deduction (up to 400 € tax credit annually under Portuguese tax code).',
      'Maintain the Revolut 2% savings and Certificados de Aforro Série E for instant emergency liquidity, never diverting this into high-volatility tech stocks.',
    ],
    associatedTickers: ['PPR', 'Revolut Savings', 'Certificados Aforro'],
  },
];
`;

  fs.writeFileSync(outputPath, outputTsContent, 'utf-8');
  console.log(`✨ Successfully generated clean TypeScript portfolio data at: ${outputPath}`);
  console.log(`📊 Total Assets: €${totalPortfolioValueEur.toLocaleString()} across ${processedHoldings.length} holdings.`);
}

// CLI Execution
const defaultSummary = path.join(process.cwd(), 'inputs', 'portfolio_summary.json');
const defaultHoldings = path.join(process.cwd(), 'inputs', 'holdings_export.csv');
const defaultOutput = path.join(process.cwd(), 'src', 'data', 'portfolioData.ts');

try {
  generatePortfolioDataFromFiles(defaultSummary, defaultHoldings, defaultOutput);
} catch (err) {
  console.error('❌ Error executing portfolio data generator:', err);
  process.exit(1);
}
