import React, { useState } from 'react';
import { PortfolioParameters, OptimizationRecommendation, ScenarioSensitivity } from '../types';
import { generateSensitivityScenarios, formatEur, formatPct } from '../utils/financialCalculations';
import { 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Scale, 
  Sliders,
  DollarSign,
  Briefcase,
  AlertOctagon,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  params: PortfolioParameters;
  recommendations: OptimizationRecommendation[];
}

export const StrategyScenarioAnalysis: React.FC<Props> = ({ params, recommendations }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(3); // Baseline default
  const scenarios: ScenarioSensitivity[] = generateSensitivityScenarios(params);

  const triggerMilestoneCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div id="strategy-scenario-analysis-section" className="space-y-8 mb-10">
      {/* SECTION HEADER & SENSITIVITY TABLE */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg p-5 sm:p-6 text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
              Section 5 • Sensitivity Scenarios & Macro Stress Testing
            </h2>
            <div className="flex items-center gap-2 pl-2.5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Market Rate Sensitivity Matrix (±2.0% Variance)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 pl-2.5">
              Multi-scenario capital trajectories, variance across economic cycles, and exact estimated timeline to €500k milestone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="celebrate-milestone-btn"
              onClick={triggerMilestoneCelebration}
              className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 px-3 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate €500k Target</span>
            </button>
          </div>
        </div>

        {/* 1. SENSITIVITY SCENARIO TABLE */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">Rate Variance vs. Milestone Arrival</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Benchmark Spread: ±2.0% return bounds</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
            <table id="sensitivity-scenarios-table" className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3.5">Scenario Description</th>
                  <th className="py-2.5 px-3 text-center">CAGR</th>
                  <th className="py-2.5 px-3.5 text-right">5-Year Nom</th>
                  <th className="py-2.5 px-3.5 text-right">10-Year Nom</th>
                  <th className="py-2.5 px-3.5 text-right">15-Year Nom</th>
                  <th className="py-2.5 px-3.5 text-right text-emerald-400 font-bold bg-slate-900/60">
                    Time to €500k
                  </th>
                  <th className="py-2.5 px-3.5 text-right text-emerald-400 font-bold bg-slate-900/80">
                    Arrival Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {scenarios.map((sc, idx) => {
                  const isBaseline = sc.scenarioName.includes('Primary Baseline');
                  const isSelected = selectedScenarioIndex === idx;

                  return (
                    <tr
                      key={sc.scenarioName}
                      id={`scenario-row-${idx}`}
                      onClick={() => setSelectedScenarioIndex(idx)}
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isBaseline ? 'bg-slate-900 font-semibold' : isSelected ? 'bg-slate-800/60' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isBaseline ? 'bg-emerald-400 ring-2 ring-emerald-500/30' : 'bg-slate-600'}`}></span>
                          <span className="font-bold text-white">{sc.scenarioName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 ml-3.5">{sc.tag}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sc.annualRatePct >= 12
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : sc.annualRatePct >= 9
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {sc.annualRatePct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-medium text-slate-300">
                        <div>{formatEur(sc.year5Nominal, 0)}</div>
                        <div className="text-[10px] text-slate-500">Real: {formatEur(sc.year5Real, 0)}</div>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-medium text-slate-300">
                        <div>{formatEur(sc.year10Nominal, 0)}</div>
                        <div className="text-[10px] text-slate-500">Real: {formatEur(sc.year10Real, 0)}</div>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-white">
                        <div>{formatEur(sc.year15Nominal, 0)}</div>
                        <div className="text-[10px] text-slate-500 font-normal">Real: {formatEur(sc.year15Real, 0)}</div>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-emerald-400 bg-slate-900/30">
                        {sc.yearsTo500k}y ({sc.monthsTo500k}m)
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-white bg-slate-900/50">
                        {sc.target500kDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 500K MILESTONE DRILLDOWN BANNER */}
        <div className="mt-5 p-4 bg-slate-950 text-slate-100 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Milestone Velocity Confirmation</div>
              <h4 className="text-sm md:text-base font-mono font-bold text-white">
                €500,000 Milestone on Track for {scenarios[3].target500kDate} (~{scenarios[3].yearsTo500k} Years)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated on €315.99k initial base + €2,000/month recurring deposit @ 10.0% expected baseline CAGR.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right px-3 py-1.5 bg-slate-900 rounded border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-500 block">Remaining Capital Gap</span>
              <span className="text-xs font-bold text-emerald-400">
                {formatEur(Math.max(0, params.targetMilestoneEur - params.totalStartingValueEur), 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SENIOR PORTFOLIO MANAGER RECOMMENDATIONS */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg p-5 sm:p-6 text-slate-100">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
              Section 6 • Strategic Execution Playbook
            </h2>
            <div className="flex items-center gap-2 pl-2.5">
              <h3 className="text-xl font-bold text-white tracking-tight">Rebalancing & Alpha Optimization Recommendations</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 pl-2.5">
              4 concrete fiduciary actions tailored specifically to your High Risk Profile, AI thematic focus, and Portuguese CIRS regime.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => {
            const impactBadgeColor =
              rec.impactLevel === 'Critical'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : rec.impactLevel === 'High'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={rec.id}
                id={`recommendation-card-${index}`}
                className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Action #{index + 1} • {rec.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${impactBadgeColor}`}>
                      {rec.impactLevel} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug mb-2">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Concrete Action Steps */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {rec.actionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="leading-tight">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {rec.associatedTickers && rec.associatedTickers.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Target Assets:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {rec.associatedTickers.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 font-bold rounded text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
