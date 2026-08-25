import React, { useState } from 'react';
import { AssetCategorySummary, SectorSummary, PortfolioParameters } from '../types';
import { formatEur, formatPct, calculateTimeToMilestone } from '../utils/financialCalculations';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  PieChart as PieChartIcon, 
  Layers, 
  Target, 
  Clock, 
  Scale, 
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
  params: PortfolioParameters;
  categories: AssetCategorySummary[];
  sectors: SectorSummary[];
  totalUnrealizedGainsEur: number;
}

export const ExecutiveSummary: React.FC<Props> = ({
  params,
  categories,
  sectors,
  totalUnrealizedGainsEur,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'asset' | 'sector'>('asset');

  // Milestone calculations
  const milestoneProgressPct = Math.min(
    100,
    +((params.totalStartingValueEur / params.targetMilestoneEur) * 100).toFixed(1)
  );
  const remainingToMilestone = Math.max(0, params.targetMilestoneEur - params.totalStartingValueEur);
  const milestoneTime = calculateTimeToMilestone(
    params.totalStartingValueEur,
    params.expectedAnnualReturnPct,
    params.monthlyDepositEur,
    params.targetMilestoneEur
  );

  // Tech & AI concentration calculation
  const techEtfValue = 72120 + 13280.28; // CNDX + IUIT
  const techStockValue = 13318.88 + 9848.03 + 8582.54 + 8358.83 + 8358.38 + 7213.27 + 7034.79 + 6050.40 + 4557.48 + 4152.66 + 3371.47 + 2991.19 + 1870.96 + 1455.39;
  const totalDirectTechAiEur = techEtfValue + techStockValue;
  const techExposurePct = +((totalDirectTechAiEur / params.totalStartingValueEur) * 100).toFixed(1);

  const darkPiePalette = [
    '#10b981', // emerald
    '#14b8a6', // teal
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#38bdf8', // sky
    '#64748b', // slate
  ];

  return (
    <div id="executive-summary-section" className="space-y-6 mb-12">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
            Section 1 • Executive Portfolio Diagnostic
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight pl-2.5">
            Capital Structure & Thematic Allocation
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 pl-2.5 max-w-3xl">
            Institutional portfolio analysis, asset class weighting, AI/semiconductor beta concentration, and capital health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Portfolio Profile</div>
              <div className="text-xs font-bold text-slate-200">Aggressive Growth (AI/Tech Core)</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP 4 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth Card */}
        <div id="kpi-total-portfolio-value" className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Portfolio Value</span>
              <Layers className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
              {formatEur(params.totalStartingValueEur, 2)}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Investments (86.8%):</span>
            <span className="font-mono text-slate-300">{formatEur(274334.28, 2)}</span>
          </div>
        </div>

        {/* Unrealized Capital Gains */}
        <div id="kpi-unrealized-gains" className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Unrealized Capital Gains</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
              +{formatEur(totalUnrealizedGainsEur, 2)}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Profit on Cost:</span>
            <span className="font-mono text-emerald-400 font-semibold">+72.1% across Equities</span>
          </div>
        </div>

        {/* Target Milestone Progress */}
        <div id="kpi-milestone-progress" className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">€500k Milestone</span>
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-mono font-bold text-white tracking-tight">
                {milestoneProgressPct}%
              </div>
              <span className="text-xs font-mono text-slate-400">€{formatEur(remainingToMilestone, 0)} gap</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${milestoneProgressPct}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-slate-500">Est. Achievement:</span>
            <span className="font-mono text-emerald-400 font-semibold">{milestoneTime.targetDate} (~{milestoneTime.years} yrs)</span>
          </div>
        </div>

        {/* Monthly Capital Deployment */}
        <div id="kpi-monthly-deposit" className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Monthly Deposit</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              {formatEur(params.monthlyDepositEur, 0)}
              <span className="text-xs font-mono text-slate-500 font-normal ml-1">/ mo</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Annual Velocity:</span>
            <span className="font-mono text-slate-300 font-semibold">{formatEur(params.monthlyDepositEur * 12, 0)} / yr</span>
          </div>
        </div>
      </div>

      {/* ALLOCATION VISUALIZATIONS & HIGH LEVEL HEALTH CHECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Interactive Visual Allocation Breakdown */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold border-l-2 border-emerald-500 pl-2">
                Capital Allocation Matrix
              </h3>
              <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
                <button
                  id="tab-allocation-asset"
                  onClick={() => setActiveChartTab('asset')}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded transition-all cursor-pointer ${
                    activeChartTab === 'asset'
                      ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Asset Class
                </button>
                <button
                  id="tab-allocation-sector"
                  onClick={() => setActiveChartTab('sector')}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded transition-all cursor-pointer ${
                    activeChartTab === 'sector'
                      ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sectors (Equities)
                </button>
              </div>
            </div>

            {/* Chart container */}
            <div className="h-56 w-full relative flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      activeChartTab === 'asset'
                        ? categories.map((c, idx) => ({ name: c.label, value: c.valueEur, color: darkPiePalette[idx % darkPiePalette.length] }))
                        : sectors.slice(0, 7).map((s, idx) => ({ name: s.sector, value: s.valueEur, color: darkPiePalette[idx % darkPiePalette.length] }))
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(activeChartTab === 'asset'
                      ? categories.map((c, idx) => ({ name: c.label, value: c.valueEur, color: darkPiePalette[idx % darkPiePalette.length] }))
                      : sectors.slice(0, 7).map((s, idx) => ({ name: s.sector, value: s.valueEur, color: darkPiePalette[idx % darkPiePalette.length] }))
                    ).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatEur(val, 2), 'Value']}
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderRadius: '0.5rem',
                      border: '1px solid #1e293b',
                      color: '#f8fafc',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      padding: '8px 12px',
                    }}
                    itemStyle={{ color: '#10b981' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Portfolio</span>
                <span className="text-sm font-mono font-bold text-white">
                  {activeChartTab === 'asset' ? '€315.99k' : '€274.33k'}
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80 max-h-44 overflow-y-auto pr-1">
              {activeChartTab === 'asset'
                ? categories.map((c, idx) => (
                    <div key={c.category} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: darkPiePalette[idx % darkPiePalette.length] }}></span>
                        <span className="text-slate-300 font-medium">{c.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-white">{formatEur(c.valueEur, 0)}</span>
                        <span className="font-mono text-slate-400 w-12 text-right">{c.weightPct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))
                : sectors.slice(0, 6).map((s, idx) => (
                    <div key={s.sector} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: darkPiePalette[idx % darkPiePalette.length] }}></span>
                        <span className="text-slate-300 font-medium">{s.sector}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-white">{formatEur(s.valueEur, 0)}</span>
                        <span className="font-mono text-slate-400 w-12 text-right">{s.weightPct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Direct Tech & AI Concentration:
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">~{techExposurePct}% of Total Portfolio</span>
          </div>
        </div>

        {/* Right 6 Columns: Comprehensive Health Check & Diagnostic */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold border-l-2 border-indigo-500 pl-2">
                Portfolio Diagnostics & Health Grade
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                GRADE: A- (STRONG ALPHA)
              </span>
            </div>

            <div className="space-y-3">
              {/* Strength 1 */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Secular AI Compounders & Alpha Generators</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Exceptional early positioning in mission-critical AI pillars (AMD +541%, NVDA +565%, NET +332%, TSM +310%, AMAT +384%). Low cost basis drives powerful compounding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Strength 2 */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Portuguese Tax Efficiency (UCITS Accumulating ETFs)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      48.3% of portfolio is housed in UCITS Acc ETFs (CNDX, CSPX, IWDA, IUIT). Dividends are reinvested internally with <strong>0% annual Portuguese IRS tax leakage</strong> until liquidation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Concentration Risk */}
              <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">High Sector Concentration & Equity Beta Overlap</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Over 60% of liquid assets are concentrated in Tech & Semiconductors. High correlation with NASDAQ-100 drawdowns. Individual holdings (AAPL, MSFT, NVDA) overlap with CNDX/IUIT.
                    </p>
                  </div>
                </div>
              </div>

              {/* Liquidity Moat */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Liquid Runway & Emergency Moat</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Emergency fund of <strong className="text-white font-mono">€27,264.00 (8.63%)</strong> provides over 13+ months of living buffer (Revolut 2% and Certificados de Aforro Série E).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            <span>Risk Tolerance: <strong className="text-slate-300 font-mono">High / Growth (Beta 1.28)</strong></span>
            <span>Tax Jurisdiction: <strong className="text-slate-300 font-mono">Portugal (IRS 28% Flat)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
