import React from 'react';
import { ShieldCheck, FileText, AlertCircle, Percent, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatEur } from '../utils/financialCalculations';

export const PortugalTaxAdvisor: React.FC = () => {
  return (
    <div id="portugal-tax-advisor-section" className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg p-5 sm:p-6 mb-10 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
            Section 7 • Portuguese Tax Efficiency Framework
          </h2>
          <div className="flex items-center gap-2 pl-2.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Portugal Tax Alpha & Wealth Optimization (CIRS)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 pl-2.5">
            Structural strategies under Portuguese Tax Code (Autoridade Tributária) to optimize compounding and minimize fiscal drag.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CIRS Art. 43º & 72º Compliant</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Pillar 1: Accumulating ETFs */}
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-2">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. UCITS Accumulating (Acc)</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Zero Annual Dividend Tax Drag</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In Portugal, distributed dividends from US single stocks or distributing funds incur a <strong className="text-slate-200">28% flat withholding tax (Taxa Liberatória)</strong>. By allocating heavily to UCITS accumulating ETFs (CNDX, CSPX, IWDA, IUIT), 100% of dividends are reinvested gross inside the fund structure, legally deferring taxes until sale decades later.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Current Acc Allocation: 48.3%</span>
          </div>
        </div>

        {/* Pillar 2: Long-Term Holding Relief */}
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 mb-2">
              <Percent className="w-3.5 h-3.5 text-teal-400" />
              <span>2. Long-Term Holding Discounts</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Up to 30% Capital Gains Exclusion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under Portuguese tax reforms (CIRS Art. 43º), gains realized on securities held long-term qualify for progressive taxable base deductions:
            </p>
            <ul className="text-[11px] font-mono text-slate-400 space-y-1 mt-2.5">
              <li className="flex items-center justify-between"><span className="text-slate-300">2 to 5 years:</span> <span>10% off (25.2% eff.)</span></li>
              <li className="flex items-center justify-between"><span className="text-slate-300">5 to 8 years:</span> <span>20% off (22.4% eff.)</span></li>
              <li className="flex items-center justify-between text-emerald-400 font-bold"><span>Over 8 years:</span> <span>30% off (19.6% eff.)</span></li>
            </ul>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono font-semibold text-teal-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Incentivizes 8+ yr holding horizon</span>
          </div>
        </div>

        {/* Pillar 3: PPR Tax Shield */}
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>3. PPR Deduction & Exit Rates</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Up to €400 Annual Direct IRS Refund</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your existing €8,800 PPR allocation qualifies for the annual 20% IRS deduction credit (up to €400/yr for age &lt;35, or €350/yr for 35–50), plus an ultra-low preferential <strong className="text-slate-200">8.0% or 8.6% final tax rate</strong> at retirement maturity under CIRS rules.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono font-semibold text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Guaranteed immediate fiscal yield</span>
          </div>
        </div>
      </div>
    </div>
  );
};
