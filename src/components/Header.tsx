import React, { useState } from 'react';
import { 
  Printer, 
  Cpu, 
  Layers,
  RefreshCw,
  FolderSync
} from 'lucide-react';
import { formatEur } from '../utils/financialCalculations';
import { DataImporterModal } from './DataImporterModal';

interface Props {
  totalValueEur: number;
  lastUpdated: string;
}

export const Header: React.FC<Props> = ({ totalValueEur, lastUpdated }) => {
  const [isImporterOpen, setIsImporterOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PORTFOLIO PROJECTION ENGINE
              </span>
              <span className="text-slate-500 text-xs font-mono">• PORTUGAL JURISDICTION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Financial Performance Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Senior Portfolio Management View | Tech & AI Alpha Strategy
            </p>
          </div>

          {/* Quick Stats in Professional Polish Header Style */}
          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto flex-wrap">
            <div className="text-left md:text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Portfolio Value</p>
              <p className="text-xl sm:text-2xl font-mono text-emerald-400 font-bold tracking-tight">
                {formatEur(totalValueEur, 2)}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Monthly Deposit</p>
              <p className="text-xl sm:text-2xl font-mono text-white font-bold tracking-tight">
                €2,000.00
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="open-sync-modal-btn"
                onClick={() => setIsImporterOpen(true)}
                className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors cursor-pointer border border-emerald-500/30"
                title="Sync or view the 2 input files"
              >
                <FolderSync className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sync 2 Files</span>
              </button>

              <button
                id="print-dashboard-btn"
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-800"
                title="Print or Save Report as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION QUICK JUMP NAV */}
        <nav className="flex items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-slate-800/80 no-scrollbar text-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1 shrink-0">Jump To:</span>
          {[
            { id: 'executive-summary-section', label: '1. Executive Summary' },
            { id: 'milestone-tracker-card', label: '2. 500k Milestone' },
            { id: 'asset-breakdown-table-section', label: '3. Asset Breakdown' },
            { id: 'future-projections-section', label: '4. Growth Projections' },
            { id: 'strategy-scenario-analysis-section', label: '5. Strategy & Sensitivity' },
            { id: 'portugal-tax-advisor-section', label: '6. Portugal Tax Alpha' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 hover:text-emerald-400 text-slate-400 rounded border border-slate-800/90 font-mono text-[11px] transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sync 2 Files Modal */}
      <DataImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
      />
    </header>
  );
};

