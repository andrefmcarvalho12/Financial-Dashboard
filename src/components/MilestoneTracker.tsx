import React, { useState } from 'react';
import { PortfolioParameters } from '../types';
import { calculateTimeToMilestone, formatEur } from '../utils/financialCalculations';
import { Target, Zap, Sparkles, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  params: PortfolioParameters;
}

export const MilestoneTracker: React.FC<Props> = ({ params }) => {
  const [simulatedDeposit, setSimulatedDeposit] = useState<number>(params.monthlyDepositEur);

  const currentMilestone = calculateTimeToMilestone(
    params.totalStartingValueEur,
    params.expectedAnnualReturnPct,
    params.monthlyDepositEur,
    params.targetMilestoneEur
  );

  const simulatedMilestone = calculateTimeToMilestone(
    params.totalStartingValueEur,
    params.expectedAnnualReturnPct,
    simulatedDeposit,
    params.targetMilestoneEur
  );

  const progressPct = Math.min(
    100,
    +((params.totalStartingValueEur / params.targetMilestoneEur) * 100).toFixed(1)
  );
  const remaining = Math.max(0, params.targetMilestoneEur - params.totalStartingValueEur);

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div id="milestone-tracker-card" className="bg-slate-900 text-slate-100 rounded-xl p-5 sm:p-6 border border-slate-800 mb-10 shadow-lg relative overflow-hidden">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
              Section 2 • Strategic Milestone Target
            </h2>
            <div className="flex items-center gap-2 pl-2.5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                €{(params.targetMilestoneEur / 1000).toFixed(0)}k Capital Milestone Tracker
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                {progressPct}% COMPLETE
              </span>
            </div>
          </div>

          <button
            id="milestone-confetti-btn"
            onClick={handleCelebrate}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-2 bg-slate-950 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 rounded-lg border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Milestone Event</span>
          </button>
        </div>

        {/* PROGRESS BAR & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-baseline text-xs font-mono">
              <span className="text-slate-400">
                Current Assets: <strong className="text-white font-bold">{formatEur(params.totalStartingValueEur, 2)}</strong>
              </span>
              <span className="text-emerald-400 font-bold">
                Goal: {formatEur(params.targetMilestoneEur, 0)}
              </span>
            </div>

            {/* Main Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 relative"
                style={{ width: `${progressPct}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md animate-ping"></span>
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>€0</span>
              <span className="font-semibold text-emerald-400">€{formatEur(remaining, 0)} remaining to threshold</span>
              <span>€500.000</span>
            </div>

            {/* ACCELERATION SIMULATOR SLIDER */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 mt-3">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-300 font-medium flex items-center gap-1.5 text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Monthly Contribution Velocity Acceleration:
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">€{simulatedDeposit.toLocaleString()}/mo</span>
              </div>
              <input
                id="slider-simulated-deposit"
                type="range"
                min="1000"
                max="5000"
                step="250"
                value={simulatedDeposit}
                onChange={(e) => setSimulatedDeposit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>€1.000/mo</span>
                <span className="text-slate-400">€2.000 (Current Target)</span>
                <span>€3.500</span>
                <span>€5.000/mo</span>
              </div>
            </div>
          </div>

          {/* RIGHT STATS BOX */}
          <div className="lg:col-span-4 bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-emerald-400" />
                Target Milestone Arrival
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {simulatedMilestone.targetDate}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Estimated in <strong className="text-emerald-400 font-mono">~{simulatedMilestone.years} years</strong> ({simulatedMilestone.months} months)
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Baseline Pace (€2k/mo):</span>
                <span className="text-white font-semibold">{currentMilestone.targetDate}</span>
              </div>
              {simulatedDeposit !== params.monthlyDepositEur && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Pace Delta:</span>
                  <span>
                    {Math.max(0, currentMilestone.months - simulatedMilestone.months)} months faster
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
