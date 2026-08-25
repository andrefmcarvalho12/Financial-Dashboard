import React, { useState } from 'react';
import { Header } from './components/Header';
import { InteractiveParametersBar } from './components/InteractiveParametersBar';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { AssetBreakdownTable } from './components/AssetBreakdownTable';
import { ProjectionsSection } from './components/ProjectionsSection';
import { StrategyScenarioAnalysis } from './components/StrategyScenarioAnalysis';
import { PortugalTaxAdvisor } from './components/PortugalTaxAdvisor';
import { MilestoneTracker } from './components/MilestoneTracker';
import { 
  RAW_PORTFOLIO_META, 
  ASSET_CATEGORIES, 
  PORTFOLIO_HOLDINGS, 
  RECOMMENDATIONS 
} from './data/portfolioData';
import { PortfolioParameters } from './types';
import { calculateSectorBreakdown } from './utils/financialCalculations';
import { ShieldCheck, Cpu, HeartHandshake } from 'lucide-react';

export default function App() {
  const [params, setParams] = useState<PortfolioParameters>({
    totalStartingValueEur: RAW_PORTFOLIO_META.totalValueEur,
    monthlyDepositEur: RAW_PORTFOLIO_META.monthlyDepositEur,
    expectedAnnualReturnPct: RAW_PORTFOLIO_META.defaultAnnualReturnPct,
    dividendYieldPct: RAW_PORTFOLIO_META.dividendYieldTargetPct,
    inflationRatePct: RAW_PORTFOLIO_META.inflationRatePct,
    targetMilestoneEur: RAW_PORTFOLIO_META.targetMilestoneEur,
  });

  const handleReset = () => {
    setParams({
      totalStartingValueEur: RAW_PORTFOLIO_META.totalValueEur,
      monthlyDepositEur: RAW_PORTFOLIO_META.monthlyDepositEur,
      expectedAnnualReturnPct: RAW_PORTFOLIO_META.defaultAnnualReturnPct,
      dividendYieldPct: RAW_PORTFOLIO_META.dividendYieldTargetPct,
      inflationRatePct: RAW_PORTFOLIO_META.inflationRatePct,
      targetMilestoneEur: RAW_PORTFOLIO_META.targetMilestoneEur,
    });
  };

  const sectors = calculateSectorBreakdown(PORTFOLIO_HOLDINGS);
  const totalUnrealizedGains = PORTFOLIO_HOLDINGS.reduce(
    (sum, h) => sum + (h.profitEur || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        totalValueEur={params.totalStartingValueEur}
        lastUpdated={RAW_PORTFOLIO_META.lastUpdateDate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Model Assumptions Bar */}
        <InteractiveParametersBar
          params={params}
          onChange={setParams}
          onReset={handleReset}
        />

        {/* 1. Executive Summary & Diagnostic */}
        <ExecutiveSummary
          params={params}
          categories={ASSET_CATEGORIES}
          sectors={sectors}
          totalUnrealizedGainsEur={totalUnrealizedGains}
        />

        {/* 500k € Milestone Fast-Track Tracker */}
        <MilestoneTracker params={params} />

        {/* 2. Current Asset Breakdown Table */}
        <AssetBreakdownTable
          holdings={PORTFOLIO_HOLDINGS}
          totalPortfolioValueEur={params.totalStartingValueEur}
        />

        {/* 3. Future Portfolio Projections (5, 10, 15 Years) */}
        <ProjectionsSection params={params} />

        {/* 4. Strategy & Scenario Analysis (Sensitivity & Recommendations) */}
        <StrategyScenarioAnalysis
          params={params}
          recommendations={RECOMMENDATIONS}
        />

        {/* Portugal Tax Structuring Module */}
        <PortugalTaxAdvisor />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-slate-300 font-mono text-[11px]">
              <strong className="text-white">Portfolio Wealth & Projection Dashboard</strong> • Built for Long-Term Tech & AI Growth
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[10px]">
            <span>IRS Portugal Art. 43º & 72º Compliant</span>
            <span>•</span>
            <span>Monthly Compound Annuity Formula</span>
            <span>•</span>
            <span>Data synced: Aug 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
