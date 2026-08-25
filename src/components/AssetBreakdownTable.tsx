import React, { useState, useMemo } from 'react';
import { HoldingItem, StrategyAction } from '../types';
import { formatEur, formatPct } from '../utils/financialCalculations';
import { 
  Search, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  Download, 
  TrendingUp, 
  Layers, 
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface Props {
  holdings: HoldingItem[];
  totalPortfolioValueEur: number;
}

type SortField = 'weightPct' | 'currentValueEur' | 'profitPct' | 'expectedReturnPct' | 'dividendYieldPct' | 'name' | 'ticker';
type FilterTab = 'all' | 'etf' | 'stock' | 'buy' | 'keep' | 'sell' | 'ai';

export const AssetBreakdownTable: React.FC<Props> = ({ holdings, totalPortfolioValueEur }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('weightPct');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedHolding, setSelectedHolding] = useState<HoldingItem | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHoldings = useMemo(() => {
    return holdings.filter((item) => {
      // Search term matching
      const matchesSearch =
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industry.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filter tabs
      if (filterTab === 'all') return true;
      if (filterTab === 'etf') return item.assetClass === 'ETF';
      if (filterTab === 'stock') return item.assetClass === 'Stock';
      if (filterTab === 'buy') return item.strategy === 'Buy';
      if (filterTab === 'keep') return item.strategy === 'Keep';
      if (filterTab === 'sell') return item.strategy === 'Sell';
      if (filterTab === 'ai') {
        return (
          item.aiTrendRelevance === 'Direct Core AI' ||
          item.aiTrendRelevance === 'AI Infrastructure & Semis' ||
          item.industry === 'Semiconductors'
        );
      }
      return true;
    });
  }, [holdings, searchTerm, filterTab]);

  const sortedHoldings = useMemo(() => {
    return [...filteredHoldings].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'weightPct') {
        aVal = a.currentValueEur;
        bVal = b.currentValueEur;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      aVal = aVal || 0;
      bVal = bVal || 0;

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredHoldings, sortField, sortDirection]);

  // Aggregate totals for the filtered set
  const totals = useMemo(() => {
    const totalEur = sortedHoldings.reduce((sum, h) => sum + h.currentValueEur, 0);
    const totalUsd = sortedHoldings.reduce((sum, h) => sum + (h.currentValueUsd || 0), 0);
    const totalCost = sortedHoldings.reduce((sum, h) => sum + (h.totalCostEur || 0), 0);
    const totalProfit = sortedHoldings.reduce((sum, h) => sum + (h.profitEur || 0), 0);
    const weightedReturn =
      totalEur > 0
        ? sortedHoldings.reduce((sum, h) => sum + h.expectedReturnPct * h.currentValueEur, 0) / totalEur
        : 0;
    const weightedYield =
      totalEur > 0
        ? sortedHoldings.reduce((sum, h) => sum + h.dividendYieldPct * h.currentValueEur, 0) / totalEur
        : 0;

    return { totalEur, totalUsd, totalCost, totalProfit, weightedReturn, weightedYield };
  }, [sortedHoldings]);

  const exportCSV = () => {
    const headers = [
      'Ticker',
      'Name',
      'Strategy',
      'Asset Class',
      'Industry/Sector',
      'Weight %',
      'Current Value EUR',
      'Current Value USD',
      'Expected Return %',
      'Dividend Yield %',
      'Profit EUR',
      'Profit %',
    ];
    const rows = sortedHoldings.map((h) => [
      `"${h.ticker}"`,
      `"${h.name}"`,
      `"${h.strategy}"`,
      `"${h.assetClass}"`,
      `"${h.industry}"`,
      ((h.currentValueEur / totalPortfolioValueEur) * 100).toFixed(2),
      h.currentValueEur.toFixed(2),
      (h.currentValueUsd || 0).toFixed(2),
      h.expectedReturnPct.toFixed(1),
      h.dividendYieldPct.toFixed(2),
      (h.profitEur || 0).toFixed(2),
      (h.profitPct || 0).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Portfolio_Breakdown_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="asset-breakdown-table-section" className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg p-5 sm:p-6 mb-10 text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-l-2 border-emerald-500 pl-2">
            Section 3 • Holdings & Tactical Allocation
          </h2>
          <div className="flex items-center gap-2 pl-2.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Asset Breakdown & Execution Recommendations
            </h3>
            <span className="text-slate-500 text-xs font-mono">({holdings.length} Positions)</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 pl-2.5">
            Mark-to-market positions, portfolio weightings, alpha CAGR assumptions, and CIRS-aligned management actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="export-csv-btn"
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-4">
        {/* Tab Pills */}
        <div className="flex items-center flex-wrap gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'all', label: 'All Assets', count: holdings.length },
            { id: 'etf', label: 'ETFs', count: holdings.filter((h) => h.assetClass === 'ETF').length },
            { id: 'stock', label: 'Stocks', count: holdings.filter((h) => h.assetClass === 'Stock').length },
            { id: 'ai', label: 'AI & Semis', count: 16 },
            { id: 'buy', label: 'Buy (11)', count: holdings.filter((h) => h.strategy === 'Buy').length },
            { id: 'keep', label: 'Keep (19)', count: holdings.filter((h) => h.strategy === 'Keep').length },
            { id: 'sell', label: 'Sell (2)', count: holdings.filter((h) => h.strategy === 'Sell').length },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setFilterTab(tab.id as FilterTab)}
              className={`text-xs font-mono px-2.5 py-1 rounded transition-all cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-holdings-input"
            type="text"
            placeholder="Search ticker, company, sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table id="asset-breakdown-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <th className="py-3 px-3.5 cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => handleSort('ticker')}>
                <div className="flex items-center gap-1.5">
                  <span>Ticker / Asset</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-2.5">Action</th>
              <th className="py-3 px-3">Sector & Class</th>
              <th className="py-3 px-3.5 text-right cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => handleSort('currentValueEur')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Valuation (€ / $)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-2.5 text-right cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => handleSort('weightPct')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Weight</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => handleSort('profitPct')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Profit (Gain/Loss)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-2.5 text-right cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => handleSort('expectedReturnPct')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>CAGR</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => handleSort('dividendYieldPct')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Div Yield</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {sortedHoldings.map((holding) => {
              const weight = ((holding.currentValueEur / totalPortfolioValueEur) * 100).toFixed(2);
              const isProfitPositive = (holding.profitEur || 0) >= 0;

              return (
                <tr
                  key={holding.id}
                  id={`holding-row-${holding.ticker.replace(/[^a-zA-Z0-9]/g, '_')}`}
                  onClick={() => setSelectedHolding(selectedHolding?.id === holding.id ? null : holding)}
                  className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    selectedHolding?.id === holding.id ? 'bg-slate-800/70' : ''
                  }`}
                >
                  {/* Ticker & Name */}
                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <span>{holding.ticker}</span>
                      {holding.aiTrendRelevance?.includes('AI') && (
                        <span className="inline-flex items-center px-1 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[9px] font-mono">
                          AI
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]" title={holding.name}>
                      {holding.name}
                    </div>
                  </td>

                  {/* Strategy Badge */}
                  <td className="py-2.5 px-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        holding.strategy === 'Buy'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : holding.strategy === 'Sell'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {holding.strategy}
                    </span>
                  </td>

                  {/* Sector / Asset Class */}
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-200">{holding.industry}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{holding.assetClass} • {holding.market}</div>
                  </td>

                  {/* Current Value */}
                  <td className="py-2.5 px-3.5 text-right font-mono text-white">
                    <div className="font-bold">{formatEur(holding.currentValueEur, 2)}</div>
                    {holding.currentValueUsd ? (
                      <div className="text-[10px] text-slate-500 font-normal">
                        ${holding.currentValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 font-normal">Base EUR</div>
                    )}
                  </td>

                  {/* Weight */}
                  <td className="py-2.5 px-2.5 text-right font-mono text-slate-300 font-semibold">
                    {weight}%
                  </td>

                  {/* Profit */}
                  <td className="py-2.5 px-3 text-right font-mono">
                    {holding.profitEur !== undefined ? (
                      <div>
                        <div className={`font-bold ${isProfitPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfitPositive ? '+' : ''}{formatEur(holding.profitEur, 2)}
                        </div>
                        <div className={`text-[10px] ${isProfitPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {formatPct(holding.profitPct || 0)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Expected Return */}
                  <td className="py-2.5 px-2.5 text-right font-mono">
                    <span className="font-bold text-teal-400">
                      {holding.expectedReturnPct.toFixed(1)}%
                    </span>
                  </td>

                  {/* Dividend Yield */}
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    {holding.dividendYieldPct > 0 ? (
                      <span className="text-indigo-400">
                        {holding.dividendYieldPct.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">0.0% (Acc)</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* TOTALS FOOTER */}
          <tfoot>
            <tr className="bg-slate-900 font-mono text-xs border-t-2 border-slate-700 text-slate-200">
              <td className="py-3 px-3.5" colSpan={3}>
                <div className="font-bold text-slate-300">
                  Filtered Totals ({sortedHoldings.length} Assets)
                </div>
              </td>
              <td className="py-3 px-3.5 text-right text-emerald-400 font-bold">
                <div>{formatEur(totals.totalEur, 2)}</div>
                <div className="text-[10px] text-slate-500 font-normal">
                  ${totals.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </td>
              <td className="py-3 px-2.5 text-right font-bold">
                {((totals.totalEur / totalPortfolioValueEur) * 100).toFixed(1)}%
              </td>
              <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                +{formatEur(totals.totalProfit, 2)}
              </td>
              <td className="py-3 px-2.5 text-right text-teal-400 font-bold">
                {totals.weightedReturn.toFixed(1)}% wtd
              </td>
              <td className="py-3 px-3.5 text-right text-indigo-400 font-bold">
                {totals.weightedYield.toFixed(2)}% wtd
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* EXPANDABLE DETAIL DRAWER / POPUP FOR SELECTED HOLDING */}
      {selectedHolding && (
        <div id="holding-detail-card" className="mt-4 p-4 bg-slate-950 text-slate-100 rounded-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono font-bold text-white">{selectedHolding.ticker} - {selectedHolding.name}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                selectedHolding.strategy === 'Buy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : selectedHolding.strategy === 'Sell' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                Action: {selectedHolding.strategy}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              {selectedHolding.notes || 'Core strategic equity asset in high-growth technology portfolio.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Shares Held</div>
              <div className="font-bold text-white">{selectedHolding.shares ?? 'N/A'}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Cost vs Current</div>
              <div className="font-bold text-emerald-400">{selectedHolding.avgPrice} / {selectedHolding.currentPrice}</div>
            </div>
            <button
              onClick={() => setSelectedHolding(null)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
