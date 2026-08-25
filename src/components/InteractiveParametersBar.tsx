import React from 'react';
import { PortfolioParameters } from '../types';
import { RefreshCw, Sliders, TrendingUp, DollarSign, Percent, Target } from 'lucide-react';

interface Props {
  params: PortfolioParameters;
  onChange: (newParams: PortfolioParameters) => void;
  onReset: () => void;
}

export const InteractiveParametersBar: React.FC<Props> = ({ params, onChange, onReset }) => {
  const handleDepositChange = (val: number) => {
    onChange({ ...params, monthlyDepositEur: Math.max(0, val) });
  };

  const handleReturnChange = (val: number) => {
    onChange({ ...params, expectedAnnualReturnPct: Math.max(0, Math.min(30, val)) });
  };

  const handleInflationChange = (val: number) => {
    onChange({ ...params, inflationRatePct: Math.max(0, Math.min(15, val)) });
  };

  const handleDividendYieldChange = (val: number) => {
    onChange({ ...params, dividendYieldPct: Math.max(0, Math.min(15, val)) });
  };

  const handleMilestoneChange = (val: number) => {
    onChange({ ...params, targetMilestoneEur: Math.max(100000, val) });
  };

  return (
    <div id="interactive-parameters-bar" className="bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-5 border border-slate-800 mb-8 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
            Active Financial Model Assumptions
          </h2>
          <p className="text-xs text-slate-500 pl-2.5">
            Dynamic sensitivity controls applied live across all multi-horizon projections and milestone engines
          </p>
        </div>

        {/* Preset Return Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1">CAGR Presets:</span>
          {[
            { label: '5.0% Bear', rate: 5.0 },
            { label: '7.5% Moderate', rate: 7.5 },
            { label: '10.0% Baseline', rate: 10.0 },
            { label: '12.0% AI Tech', rate: 12.0 },
          ].map((preset) => (
            <button
              key={preset.label}
              id={`preset-btn-${preset.rate}`}
              onClick={() => handleReturnChange(preset.rate)}
              className={`text-xs font-mono px-2.5 py-1 rounded transition-all cursor-pointer border ${
                params.expectedAnnualReturnPct === preset.rate
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            id="reset-parameters-btn"
            onClick={onReset}
            title="Reset to default document values"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors ml-1 cursor-pointer font-mono"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4">
        {/* Monthly Deposit */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Monthly Contribution
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">€{params.monthlyDepositEur.toLocaleString()}</span>
          </div>
          <input
            id="slider-monthly-deposit"
            type="range"
            min="0"
            max="6000"
            step="100"
            value={params.monthlyDepositEur}
            onChange={(e) => handleDepositChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>€0</span>
            <span className="text-slate-400">€2.000 (Target)</span>
            <span>€6.000</span>
          </div>
        </div>

        {/* Expected Annual Rate of Return */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              Expected Return (CAGR)
            </span>
            <span className="font-mono font-bold text-teal-400 text-sm">{params.expectedAnnualReturnPct.toFixed(1)}%</span>
          </div>
          <input
            id="slider-annual-return"
            type="range"
            min="2"
            max="20"
            step="0.5"
            value={params.expectedAnnualReturnPct}
            onChange={(e) => handleReturnChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>2%</span>
            <span className="text-slate-400">10% Base</span>
            <span>20% Max</span>
          </div>
        </div>

        {/* Inflation Rate */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Inflation Rate
            </span>
            <span className="font-mono font-bold text-amber-400 text-sm">{params.inflationRatePct.toFixed(1)}%</span>
          </div>
          <input
            id="slider-inflation-rate"
            type="range"
            min="0"
            max="6"
            step="0.25"
            value={params.inflationRatePct}
            onChange={(e) => handleInflationChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0%</span>
            <span className="text-slate-400">1.5% Base</span>
            <span>6%</span>
          </div>
        </div>

        {/* Dividend Yield */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              Dividend Target Yield
            </span>
            <span className="font-mono font-bold text-indigo-400 text-sm">{params.dividendYieldPct.toFixed(1)}%</span>
          </div>
          <input
            id="slider-dividend-yield"
            type="range"
            min="0"
            max="8"
            step="0.2"
            value={params.dividendYieldPct}
            onChange={(e) => handleDividendYieldChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0% (Acc Focus)</span>
            <span className="text-slate-400">2.5%</span>
            <span>8%</span>
          </div>
        </div>

        {/* Strategic Target Milestone */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              Target Milestone
            </span>
            <span className="font-mono font-bold text-purple-400 text-sm">€{(params.targetMilestoneEur / 1000).toFixed(0)}k</span>
          </div>
          <input
            id="slider-target-milestone"
            type="range"
            min="200000"
            max="2000000"
            step="50000"
            value={params.targetMilestoneEur}
            onChange={(e) => handleMilestoneChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>€200k</span>
            <span className="text-slate-400">€500k</span>
            <span>€2.0M</span>
          </div>
        </div>
      </div>
    </div>
  );
};
