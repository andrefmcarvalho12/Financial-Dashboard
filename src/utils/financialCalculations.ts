import { HorizonProjection, ScenarioSensitivity, PortfolioParameters, HoldingItem, SectorSummary } from '../types';

/**
 * Calculates Future Value using monthly compound interest with recurring end-of-month deposits.
 * FV = P * (1 + r/12)^(12*t) + PMT * [((1 + r/12)^(12*t) - 1) / (r/12)]
 */
export function calculateFutureValue(
  startingPrincipal: number,
  annualRatePct: number,
  monthlyDeposit: number,
  years: number
): number {
  const r = annualRatePct / 100;
  const monthlyRate = r / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    return startingPrincipal + monthlyDeposit * totalMonths;
  }

  const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
  const principalFuture = startingPrincipal * growthFactor;
  const depositsFuture = monthlyDeposit * ((growthFactor - 1) / monthlyRate);

  return principalFuture + depositsFuture;
}

/**
 * Adjusts a nominal future value for cumulative inflation over t years.
 * Real Value = Nominal Value / (1 + inflationRatePct/100)^years
 */
export function calculateRealValue(
  nominalValue: number,
  inflationRatePct: number,
  years: number
): number {
  const i = inflationRatePct / 100;
  return nominalValue / Math.pow(1 + i, years);
}

/**
 * Generates structured 5, 10, and 15 year horizon projections.
 */
export function generateHorizonProjections(
  params: PortfolioParameters
): HorizonProjection[] {
  const horizons = [
    { years: 5, label: '5-Year Horizon (2031)' },
    { years: 10, label: '10-Year Horizon (2036)' },
    { years: 15, label: '15-Year Horizon (2041)' },
  ];

  return horizons.map((h) => {
    const totalDeposits = params.monthlyDepositEur * 12 * h.years;
    const totalPrincipal = params.totalStartingValueEur + totalDeposits;
    const nominalTotal = calculateFutureValue(
      params.totalStartingValueEur,
      params.expectedAnnualReturnPct,
      params.monthlyDepositEur,
      h.years
    );
    const compoundGains = nominalTotal - totalPrincipal;
    const realTotal = calculateRealValue(nominalTotal, params.inflationRatePct, h.years);
    const realGains = realTotal - totalPrincipal;

    // Approximate Portuguese Tax efficiency estimation:
    // Since accumulating ETFs defer taxes until sale, and Portuguese law grants holding period discounts:
    // Tax on gains held >8 years is reduced by 30% (effective rate 19.6% instead of 28%)
    const taxDiscountFactor = h.years >= 8 ? 0.70 : h.years >= 5 ? 0.80 : 0.90;
    const effectiveTaxRate = 0.28 * taxDiscountFactor;
    const estimatedTaxOnLiquidation = compoundGains > 0 ? compoundGains * effectiveTaxRate : 0;
    const estimatedNetAfterTax = nominalTotal - estimatedTaxOnLiquidation;

    return {
      years: h.years,
      label: h.label,
      nominalStartingPrincipal: params.totalStartingValueEur,
      totalMonthlyDeposits: totalDeposits,
      totalPrincipalContributed: totalPrincipal,
      compoundGrowthGains: compoundGains,
      nominalTotalValue: nominalTotal,
      realTotalValue: realTotal,
      realCompoundGains: realGains,
      estimatedNetAfterTaxEur: estimatedNetAfterTax,
    };
  });
}

/**
 * Calculates exact months and years to reach a target milestone (e.g. 500,000 €).
 */
export function calculateTimeToMilestone(
  startingPrincipal: number,
  annualRatePct: number,
  monthlyDeposit: number,
  targetMilestone: number
): { months: number; years: number; targetDate: string } {
  if (startingPrincipal >= targetMilestone) {
    return { months: 0, years: 0, targetDate: 'Achieved Today' };
  }

  const r = annualRatePct / 100;
  const monthlyRate = r / 12;

  let currentVal = startingPrincipal;
  let months = 0;
  const maxMonths = 1200; // 100 years guard

  while (currentVal < targetMilestone && months < maxMonths) {
    currentVal = currentVal * (1 + monthlyRate) + monthlyDeposit;
    months++;
  }

  const years = +(months / 12).toFixed(1);

  // Target calendar date calculation from August 2026
  const targetDateObj = new Date(2026, 7, 25); // August 2026
  targetDateObj.setMonth(targetDateObj.getMonth() + months);
  const targetDate = targetDateObj.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return { months, years, targetDate };
}

/**
 * Builds baseline vs alternative sensitivity scenarios (+/- 2%, 5%, 7%, 10%, 12%, 14%).
 */
export function generateSensitivityScenarios(
  params: PortfolioParameters
): ScenarioSensitivity[] {
  const baseRate = params.expectedAnnualReturnPct;
  const scenariosConfig = [
    {
      name: 'Conservative Defense',
      rate: 5.0,
      tag: '5.0% Fixed Yield',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      name: 'Moderate Balanced',
      rate: 7.0,
      tag: '7.0% Broad Market',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      name: 'Baseline - 2% (Pessimistic Tech)',
      rate: Math.max(1, baseRate - 2),
      tag: `${(baseRate - 2).toFixed(1)}% Sensitivity -2%`,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      name: 'Baseline Expected (AI & Tech Core)',
      rate: baseRate,
      tag: `${baseRate.toFixed(1)}% Primary Baseline`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    },
    {
      name: 'Baseline + 2% (Optimistic Tech)',
      rate: baseRate + 2,
      tag: `${(baseRate + 2).toFixed(1)}% Sensitivity +2%`,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      name: 'High-Conviction AI Supercycle',
      rate: 14.0,
      tag: '14.0% Aggressive Tech',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  ];

  return scenariosConfig.map((sc) => {
    const y5Nominal = calculateFutureValue(params.totalStartingValueEur, sc.rate, params.monthlyDepositEur, 5);
    const y5Real = calculateRealValue(y5Nominal, params.inflationRatePct, 5);
    const y10Nominal = calculateFutureValue(params.totalStartingValueEur, sc.rate, params.monthlyDepositEur, 10);
    const y10Real = calculateRealValue(y10Nominal, params.inflationRatePct, 10);
    const y15Nominal = calculateFutureValue(params.totalStartingValueEur, sc.rate, params.monthlyDepositEur, 15);
    const y15Real = calculateRealValue(y15Nominal, params.inflationRatePct, 15);

    const milestone = calculateTimeToMilestone(
      params.totalStartingValueEur,
      sc.rate,
      params.monthlyDepositEur,
      params.targetMilestoneEur
    );

    return {
      scenarioName: sc.name,
      annualRatePct: sc.rate,
      tag: sc.tag,
      badgeColor: sc.badgeColor,
      year5Nominal: y5Nominal,
      year5Real: y5Real,
      year10Nominal: y10Nominal,
      year10Real: y10Real,
      year15Nominal: y15Nominal,
      year15Real: y15Real,
      monthsTo500k: milestone.months,
      yearsTo500k: milestone.years,
      target500kDate: milestone.targetDate,
    };
  });
}

/**
 * Builds monthly trajectory series for Recharts area/line charts (15 years = 180 points).
 */
export function generateMonthlyTrajectoryChartData(
  params: PortfolioParameters
) {
  const monthsTotal = 15 * 12;
  const data = [];
  const baseR = params.expectedAnnualReturnPct / 100 / 12;
  const lowerR = Math.max(0, (params.expectedAnnualReturnPct - 2)) / 100 / 12;
  const upperR = (params.expectedAnnualReturnPct + 2) / 100 / 12;
  const monthlyInfl = params.inflationRatePct / 100 / 12;

  let principal = params.totalStartingValueEur;
  let baseNominal = params.totalStartingValueEur;
  let lowerNominal = params.totalStartingValueEur;
  let upperNominal = params.totalStartingValueEur;

  for (let m = 0; m <= monthsTotal; m++) {
    if (m > 0) {
      principal += params.monthlyDepositEur;
      baseNominal = baseNominal * (1 + baseR) + params.monthlyDepositEur;
      lowerNominal = lowerNominal * (1 + lowerR) + params.monthlyDepositEur;
      upperNominal = upperNominal * (1 + upperR) + params.monthlyDepositEur;
    }

    const yearFraction = m / 12;
    const realBase = baseNominal / Math.pow(1 + params.inflationRatePct / 100, yearFraction);

    // Only sample every 6 months for chart performance, plus year ends
    if (m % 6 === 0 || m === monthsTotal) {
      const year = 2026 + Math.floor(m / 12);
      const monthName = new Date(2026, 7 + (m % 12), 1).toLocaleString('en-US', { month: 'short' });
      data.push({
        monthIndex: m,
        yearLabel: m === 0 ? 'Today (Aug 2026)' : `Yr ${yearFraction.toFixed(1)} (${monthName} ${year})`,
        shortLabel: m === 0 ? 'Start' : `Yr ${Math.floor(yearFraction)}`,
        principalContributed: Math.round(principal),
        nominalBaseline: Math.round(baseNominal),
        realBaseline: Math.round(realBase),
        compoundGains: Math.round(baseNominal - principal),
        lowerBound: Math.round(lowerNominal),
        upperBound: Math.round(upperNominal),
        milestone500k: 500000,
      });
    }
  }

  return data;
}

/**
 * Calculates sector aggregations from holdings
 */
export function calculateSectorBreakdown(holdings: HoldingItem[]): SectorSummary[] {
  const sectorMap: Record<string, { value: number; count: number }> = {};
  let totalInvested = 0;

  holdings.forEach((h) => {
    const sector = h.industry || 'Other';
    if (!sectorMap[sector]) {
      sectorMap[sector] = { value: 0, count: 0 };
    }
    sectorMap[sector].value += h.currentValueEur;
    sectorMap[sector].count += 1;
    totalInvested += h.currentValueEur;
  });

  const colors: Record<string, string> = {
    'Exchange-traded fund': '#3b82f6',
    'Semiconductors': '#8b5cf6',
    'Information Technology': '#06b6d4',
    'Communication Services': '#ec4899',
    'Financials': '#10b981',
    'Energy': '#f59e0b',
    'Real Estate': '#eab308',
    'Consumer Discretionary': '#f97316',
    'Healthcare': '#14b8a6',
    'Aerospace': '#6366f1',
    'Other': '#94a3b8',
  };

  return Object.keys(sectorMap).map((sector) => ({
    sector,
    valueEur: sectorMap[sector].value,
    weightPct: +( (sectorMap[sector].value / totalInvested) * 100 ).toFixed(2),
    color: colors[sector] || '#64748b',
    count: sectorMap[sector].count,
  })).sort((a, b) => b.valueEur - a.valueEur);
}

/**
 * Formats EUR currency cleanly
 */
export function formatEur(val: number, minimumFractionDigits = 0): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(val);
}

/**
 * Formats percentage
 */
export function formatPct(val: number, decimals = 1): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(decimals)}%`;
}
