import React, { useState } from 'react';
import { PortfolioParameters, HorizonProjection } from '../types';
import { generateHorizonProjections, generateMonthlyTrajectoryChartData, formatEur } from '../utils/financialCalculations';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Percent, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight,
  Calculator,
  LineChart as LineChartIcon
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend } from 'recharts';

interface Props {
  params: PortfolioParameters;
}

export const ProjectionsSection: React.FC<Props> = ({ params }) => {
  const [showTaxAdjusted, setShowTaxAdjusted] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const projections: HorizonProjection[] = generateHorizonProjections(params);
  const chartData = generateMonthlyTrajectoryChartData(params);

  return (
    <div id="future-projections-section" className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg p-5 sm:p-6 mb-10 text-slate-100">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
            Section 4 • Multi-Horizon Compounding & Purchasing Power
          </h2>
          <div className="flex items-center gap-2 pl-2.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Future Portfolio Trajectories (5, 10, 15 Years)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              (r={params.expectedAnnualReturnPct.toFixed(1)}% | i={params.inflationRatePct.toFixed(1)}% | €{params.monthlyDepositEur.toLocaleString()}/mo)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 pl-2.5">
            Deterministic compound growth modelling, inflation-discounted constant-euro purchasing power, and Portuguese capital gains deferral estimates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="formula-explainer-btn"
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-950 hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors cursor-pointer border border-slate-800"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Formulas Used</span>
          </button>
        </div>
      </div>

      {/* FORMULA EXPLODED ACCORDION */}
      {showFormulaModal && (
        <div id="formula-explainer-modal" className="my-4 p-4 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs leading-relaxed">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono font-bold text-white text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Mathematical Compound Valuation Mechanics
            </span>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="font-mono font-semibold text-emerald-400 mb-1">1. Future Value with Recurring Monthly Annuity (FV)</div>
              <code className="text-[11px] font-mono text-teal-300 block bg-slate-950 p-2 rounded border border-slate-800 mb-1">
                FV = P × (1 + r/12)^(12×t) + PMT × [((1 + r/12)^(12×t) - 1) / (r/12)]
              </code>
              <p className="text-[11px] text-slate-400">
                Where P = Initial Portfolio (€{params.totalStartingValueEur.toLocaleString()}), r = Annual Rate ({params.expectedAnnualReturnPct}%), PMT = Monthly Deposit (€{params.monthlyDepositEur.toLocaleString()}), and t = Horizon Years.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="font-mono font-semibold text-amber-400 mb-1">2. Inflation-Adjusted Real Purchasing Power</div>
              <code className="text-[11px] font-mono text-amber-300 block bg-slate-950 p-2 rounded border border-slate-800 mb-1">
                Real FV = Nominal FV / (1 + i)^t
              </code>
              <p className="text-[11px] text-slate-400">
                Discounted by the specified annual inflation rate of i = {params.inflationRatePct}%, reflecting constant-euro purchasing power in year t.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3 HORIZON SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {projections.map((proj, idx) => {
          const gainsMultiplier = (proj.nominalTotalValue / proj.totalPrincipalContributed).toFixed(2);

          return (
            <div
              key={proj.years}
              id={`horizon-card-${proj.years}yr`}
              className={`rounded-lg p-4 border transition-all ${
                idx === 1
                  ? 'bg-slate-950 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${idx === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase">{proj.label}</h3>
                    <span className="text-[10px] font-mono text-slate-500">{proj.years * 12} Deposits</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {gainsMultiplier}x Principal
                </span>
              </div>

              {/* Nominal Portfolio Value */}
              <div className="my-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-0.5">
                  Nominal Valuation
                </span>
                <div className="text-2xl font-mono font-extrabold text-white tracking-tight">
                  {formatEur(proj.nominalTotalValue, 0)}
                </div>
              </div>

              {/* Real Inflation Adjusted */}
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Principal:</span>
                  <span className="font-semibold text-slate-200">{formatEur(proj.totalPrincipalContributed, 0)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 text-[11px]">
                  <span>Growth Gains:</span>
                  <span className="font-bold">+{formatEur(proj.compoundGrowthGains, 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 text-amber-400 text-[11px]">
                  <span>Real Value (1.5% inf):</span>
                  <span className="font-bold">{formatEur(proj.realTotalValue, 0)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED HORIZON COMPARISON TABLE */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-mono font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Structured Multi-Horizon Compounding Schedule
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showTaxAdjusted}
                onChange={(e) => setShowTaxAdjusted(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
              />
              <span>Include PT CIRS Holding Reduction Est.</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
          <table id="projections-breakdown-table" className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-2.5 px-3.5">Portfolio Growth Metric</th>
                <th className="py-2.5 px-3.5 text-right">Baseline (2026)</th>
                <th className="py-2.5 px-3.5 text-right text-slate-300">5-Year (2031)</th>
                <th className="py-2.5 px-3.5 text-right text-emerald-400 font-extrabold bg-slate-900/60">10-Year (2036)</th>
                <th className="py-2.5 px-3.5 text-right text-slate-300">15-Year (2041)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2.5 px-3.5 text-slate-300">Starting Portfolio Balance (P)</td>
                <td className="py-2.5 px-3.5 text-right font-medium text-white">{formatEur(params.totalStartingValueEur, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-slate-400">{formatEur(params.totalStartingValueEur, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-slate-400 bg-slate-900/30">{formatEur(params.totalStartingValueEur, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-slate-400">{formatEur(params.totalStartingValueEur, 2)}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 text-slate-300">Cumulative Monthly Contributions (PMT)</td>
                <td className="py-2.5 px-3.5 text-right text-slate-600">€0.00</td>
                <td className="py-2.5 px-3.5 text-right text-slate-300">{formatEur(projections[0].totalMonthlyDeposits, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-slate-300 bg-slate-900/30">{formatEur(projections[1].totalMonthlyDeposits, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-slate-300">{formatEur(projections[2].totalMonthlyDeposits, 2)}</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="py-2.5 px-3.5 text-slate-200 font-semibold">Total Invested Principal (P + Deposits)</td>
                <td className="py-2.5 px-3.5 text-right text-white font-bold">{formatEur(params.totalStartingValueEur, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-white font-bold">{formatEur(projections[0].totalPrincipalContributed, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-white font-bold bg-slate-900/50">{formatEur(projections[1].totalPrincipalContributed, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-white font-bold">{formatEur(projections[2].totalPrincipalContributed, 2)}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-emerald-400 flex items-center gap-1">
                  <span>Compound Capital Gains</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                </td>
                <td className="py-2.5 px-3.5 text-right text-slate-600">€0.00</td>
                <td className="py-2.5 px-3.5 text-right font-bold text-emerald-400">+{formatEur(projections[0].compoundGrowthGains, 2)}</td>
                <td className="py-2.5 px-3.5 text-right font-bold text-emerald-400 bg-slate-900/30">+{formatEur(projections[1].compoundGrowthGains, 2)}</td>
                <td className="py-2.5 px-3.5 text-right font-bold text-emerald-400">+{formatEur(projections[2].compoundGrowthGains, 2)}</td>
              </tr>
              <tr className="bg-slate-900 font-extrabold text-sm border-t border-b border-slate-700">
                <td className="py-3 px-3.5 text-white">Projected Nominal Portfolio Value</td>
                <td className="py-3 px-3.5 text-right text-emerald-400">{formatEur(params.totalStartingValueEur, 2)}</td>
                <td className="py-3 px-3.5 text-right text-white">{formatEur(projections[0].nominalTotalValue, 2)}</td>
                <td className="py-3 px-3.5 text-right text-emerald-400 text-sm bg-slate-900">{formatEur(projections[1].nominalTotalValue, 2)}</td>
                <td className="py-3 px-3.5 text-right text-white text-sm">{formatEur(projections[2].nominalTotalValue, 2)}</td>
              </tr>
              <tr className="bg-amber-950/20 font-semibold text-amber-300">
                <td className="py-2.5 px-3.5">
                  Real Inflation-Adjusted Value ({params.inflationRatePct}% infl.)
                </td>
                <td className="py-2.5 px-3.5 text-right text-slate-300">{formatEur(params.totalStartingValueEur, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-amber-400">{formatEur(projections[0].realTotalValue, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-amber-400 font-bold bg-amber-950/30">{formatEur(projections[1].realTotalValue, 2)}</td>
                <td className="py-2.5 px-3.5 text-right text-amber-400 font-bold">{formatEur(projections[2].realTotalValue, 2)}</td>
              </tr>
              {showTaxAdjusted && (
                <tr className="bg-indigo-950/30 text-indigo-300 font-medium">
                  <td className="py-2.5 px-3.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Est. Net Value (Portuguese Holding Reduction)</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-slate-400">{formatEur(params.totalStartingValueEur, 2)}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-indigo-300">{formatEur(projections[0].estimatedNetAfterTaxEur || 0, 2)}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-indigo-300 bg-indigo-950/40">{formatEur(projections[1].estimatedNetAfterTaxEur || 0, 2)}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-indigo-300">{formatEur(projections[2].estimatedNetAfterTaxEur || 0, 2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 15-YEAR TRAJECTORY VISUALIZATION CHART */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-emerald-400" />
              15-Year Growth Curve vs. €500k Strategic Milestone
            </h3>
            <p className="text-xs text-slate-400">
              Interactive timeline showing Principal Contributed vs. Investment Growth and Sensitivity Bands (+/- 2%).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Nominal Total
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 bg-teal-600 rounded-sm"></span> Principal
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400"></span> Real (Infl.)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGainsDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorPrincipalDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="shortLabel" stroke="#64748b" fontSize={10} tickLine={false} fontFamily="monospace" />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                fontFamily="monospace"
                tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                formatter={(val: number, name: string) => [
                  formatEur(val, 0),
                  name === 'nominalBaseline'
                    ? 'Nominal Total'
                    : name === 'principalContributed'
                    ? 'Total Principal'
                    : name === 'realBaseline'
                    ? 'Real (Inflation-Adj)'
                    : name === 'upperBound'
                    ? `Upper Bound (+2%)`
                    : name === 'lowerBound'
                    ? `Lower Bound (-2%)`
                    : name,
                ]}
                labelFormatter={(label) => `Timeline: ${label}`}
                contentStyle={{
                  backgroundColor: '#020617',
                  borderRadius: '0.5rem',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  padding: '8px 12px',
                  fontFamily: 'monospace',
                }}
              />
              <ReferenceLine
                y={params.targetMilestoneEur}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Milestone: €${(params.targetMilestoneEur / 1000).toFixed(0)}k`,
                  position: 'insideTopLeft',
                  fill: '#f43f5e',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="nominalBaseline"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGainsDark)"
              />
              <Area
                type="monotone"
                dataKey="realBaseline"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={0}
              />
              <Area
                type="monotone"
                dataKey="principalContributed"
                stroke="#0d9488"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorPrincipalDark)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
