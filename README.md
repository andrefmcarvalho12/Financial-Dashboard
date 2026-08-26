# 🚀 Portfolio Wealth & Performance Projection Dashboard

> **Senior Portfolio Management View | Tech & AI Alpha Strategy**  
> Tailored for high-growth tech portfolios under Portuguese Tax Jurisdiction (CIRS Art. 43º & 72º).

![Project License](https://img.shields.io/badge/License-MIT-emerald.svg)
![React Version](https://img.shields.io/badge/React-19.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38BDF8.svg)

---

## 📖 Overview

This dashboard is a high-precision portfolio management and forecasting web application designed for active tech and AI investors. It models real-time asset allocations, dynamic multi-scenario compounding projections, €500k milestone timelines, and Portuguese tax alpha optimization (accumulating UCITS ETFs, CIRS holding period discounts, PPR credits, and tax-loss harvesting).

---

## ⚡ Quick Start: Running the Project

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn** / **pnpm**

### 2. Installation & Launch
Clone the repository and install dependencies:

```bash
# 1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd portfolio-projection-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will start on **`http://localhost:3000`**.

---

## 🔄 Two-File Data Generation Workflow

The entire dashboard is powered by **two dedicated input files** located in the `/inputs` directory:

| Input File | Format | Description |
| :--- | :---: | :--- |
| **`inputs/portfolio_summary.json`** | `JSON` | Macro assumptions, total account balances, emergency cash, PPR funds, crypto, and monthly contribution targets. |
| **`inputs/holdings_export.csv`** | `CSV` | Individual broker export with ETF and stock tickers, share counts, cost bases, market values, and sector classifications. |

Whenever you update your broker positions or balances, replace these two files and run the generation script:

```bash
# Ingest the 2 files and regenerate src/data/portfolioData.ts
npm run update-data
```

You can also run:
```bash
npx tsx scripts/update_portfolio_data.ts
```

> 💡 **In-App Sync Available**: You can also click **"Sync 2 Files"** directly in the top header navigation inside the web app to view, download sample templates, or sync files in real time.

---

## 📄 File Formats & Schemas

### 1. `inputs/portfolio_summary.json` (File 1)

This file defines the high-level macro baseline, cash reserves, and category groupings:

```json
{
  "totalValueEur": 315991.04,
  "investmentsTotalEur": 274334.28,
  "emergencyFundTotalEur": 27264.00,
  "pprTotalEur": 8800.00,
  "cashTotalEur": 3326.00,
  "cryptoTotalEur": 2266.77,
  "monthlyDepositEur": 2000.00,
  "defaultAnnualReturnPct": 10.0,
  "conservativeReturnPct": 5.0,
  "moderateReturnPct": 7.5,
  "aggressiveReturnPct": 12.0,
  "dividendYieldTargetPct": 2.0,
  "inflationRatePct": 1.5,
  "targetMilestoneEur": 500000.00,
  "asOfDate": "2026-08-25",
  "categories": [
    {
      "category": "etfs",
      "label": "Exchange Traded Funds (ETFs)",
      "valueEur": 152697.70,
      "color": "#3b82f6",
      "subcategories": [
        { "name": "iShares NASDAQ 100 (CNDX)", "valueEur": 72120.00 },
        { "name": "iShares Core S&P 500 (CSPX)", "valueEur": 52585.14 },
        { "name": "iShares Core MSCI World (IWDA)", "valueEur": 14712.28 },
        { "name": "iShares S&P 500 Info Tech (IUIT)", "valueEur": 13280.28 }
      ]
    },
    {
      "category": "stocks",
      "label": "Individual Equities",
      "valueEur": 104524.00,
      "color": "#10b981",
      "subcategories": [
        { "name": "Interactive Brokers Portfolio", "valueEur": 83323.33 },
        { "name": "Degiro / XTB Portfolio", "valueEur": 21201.01 }
      ]
    },
    {
      "category": "emergency",
      "label": "Emergency Liquidity & Cash Reserves",
      "valueEur": 27264.00,
      "color": "#f59e0b",
      "subcategories": [
        { "name": "Revolut Savings (2% APY)", "valueEur": 25000.00 },
        { "name": "Certificados Aforro (Série E)", "valueEur": 2234.00 }
      ]
    },
    {
      "category": "ppr",
      "label": "Plano Poupança Reforma (PPR)",
      "valueEur": 8800.00,
      "color": "#8b5cf6",
      "subcategories": [
        { "name": "PPR Tax-Advantaged Fund", "valueEur": 8800.00 }
      ]
    },
    {
      "category": "cash",
      "label": "Brokerage & Operational Cash",
      "valueEur": 3326.00,
      "color": "#64748b",
      "subcategories": [
        { "name": "Uninvested Cash & Settlement", "valueEur": 3326.00 }
      ]
    },
    {
      "category": "crypto",
      "label": "Cryptocurrency & Digital Assets",
      "valueEur": 2266.77,
      "color": "#ec4899",
      "subcategories": [
        { "name": "Bitcoin (Staking/Hold)", "valueEur": 1757.59 },
        { "name": "DeFi Wallet Earn", "valueEur": 466.16 }
      ]
    }
  ]
}
```

---

### 2. `inputs/holdings_export.csv` (File 2)

This CSV file contains the tabular positions export from your brokers (Interactive Brokers, Degiro, Trading 212, XTB). European and US price/currency notations are automatically parsed:

```csv
Ticker,Name,AssetClass,Industry,Market,Shares,AvgPrice,CurrentPrice,TotalCostEur,CurrentValueUsd,CurrentValueEur,ProfitEur,ProfitPct,DividendYieldPct,ExpectedReturnPct,Strategy,AiTrendRelevance,Notes
AMS:CNDX,iShares NASDAQ 100 UCITS ETF USD (Acc),ETF,Exchange-traded fund,XETRA / Euronext,50,807.40 €,1 442.40 €,40370.00,84089.76,72120.00,31750.00,78.65,0.0,11.5,Keep,Broad Tech Index,Accumulating ETF (zero dividend tax drag in PT). High beta exposure to top 100 US tech giants.
AMS:CSPX,iShares Core S&P 500 UCITS ETF USD (Acc),ETF,Exchange-traded fund,XETRA / Euronext,74,530.04 €,710.61 €,39223.31,61312.70,52585.14,13361.83,34.07,0.0,9.5,Buy,Broad Tech Index,Core foundational anchor. High quality US market exposure automatically reinvests dividends tax-free.
LON:IUIT,iShares S&P 500 Info Tech Sector UCITS ETF,ETF,Exchange-traded fund,XETRA / London,310,35.08 €,42.84 €,10875.97,15484.41,13280.28,2404.31,22.11,0.0,13.0,Buy,Direct Core AI,Pure-play S&P 500 Technology sector. Heavily weighted in Microsoft Apple and NVIDIA.
AMD,Advanced Micro Devices Inc,Stock,Semiconductors,NASDAQ,34,$71.20,$456.75,2076.07,15529.50,13318.88,11242.81,541.54,0.0,15.0,Keep,AI Infrastructure & Semis,Instinct MI300/MI400 AI GPU datacenter acceleration driver.
NVDA,NVIDIA Corp,Stock,Semiconductors,NASDAQ,48,$31.31,$208.48,1288.95,10007.04,8582.54,7293.59,565.86,0.05,18.0,Buy,AI Infrastructure & Semis,The undisputed dominant compute leader in AI accelerator architectures.
```

#### Supported Field Reference:
- **`Ticker`**: Asset symbol (e.g. `AMS:CNDX`, `NVDA`, `TSM`).
- **`Name`**: Full asset or company name.
- **`AssetClass`**: `Stock`, `ETF`, `Crypto`, `Cash`, or `Bond`.
- **`Industry`**: Sector or fund description (e.g. `Semiconductors`, `Exchange-traded fund`, `Energy`).
- **`Shares`**: Number of units held.
- **`AvgPrice` & `CurrentPrice`**: Formatted or raw price string (e.g. `1 442.40 €`, `$208.48`).
- **`TotalCostEur`**: Total invested capital base in EUR.
- **`CurrentValueEur`**: Total current market value in EUR.
- **`ProfitPct` & `ProfitEur`**: Unrealized capital return.
- **`Strategy`**: Action recommendation (`Buy`, `Keep`, `Sell`, `Trim`).
- **`AiTrendRelevance`**: Thematic tag (`Direct Core AI`, `AI Infrastructure & Semis`, `Energy / Power Grid`, `Broad Tech Index`, `Diversifier`, `Defensive / Cash`).

---

## 📊 Core Calculation Mechanics

### 1. Monthly Compounding & Annuity Equation
Future portfolio value $V(t)$ with continuous monthly deposits is computed as:

$$V(t) = P_0 \cdot \left(1 + \frac{r}{12}\right)^{12t} + PMT \cdot \left[ \frac{\left(1 + \frac{r}{12}\right)^{12t} - 1}{\frac{r}{12}} \right]$$

Where:
- $P_0$ = Starting portfolio value (€315,991.04)
- $PMT$ = Monthly savings deposit (€2,000.00)
- $r$ = Annual compounding rate (e.g. 10.0% baseline CAGR)
- $t$ = Horizon in years (1 to 20 years)

### 2. Inflation-Adjusted (Real) Purchasing Power
$$V_{\text{real}}(t) = \frac{V(t)}{(1 + i)^t}$$
Where $i$ = Baseline inflation rate (1.5% / yr default).

### 3. Portuguese CIRS Tax Rules (Art. 43º & 72º)
- **Accumulating UCITS ETFs**: 0% annual tax drag; 100% of dividends reinvested gross within the fund structure.
- **Holding Period Capital Gains Relief**:
  - Held **2 to 5 years**: 10% taxable base reduction (25.2% effective tax rate).
  - Held **5 to 8 years**: 20% taxable base reduction (22.4% effective tax rate).
  - Held **>8 years**: 30% taxable base reduction (19.6% effective tax rate).
- **PPR Annual Tax Credit**: 20% direct IRS deduction on deposits up to €2,000 (€400 tax refund/year).

---

## 🛠️ Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **`npm run dev`** | `vite --port=3000 --host=0.0.0.0` | Starts the local dev server on port 3000. |
| **`npm run update-data`** | `tsx scripts/update_portfolio_data.ts` | Ingests `inputs/*.json` & `inputs/*.csv` and updates TypeScript data. |
| **`npm run build`** | `vite build` | Builds optimized production bundle in `/dist`. |
| **`npm run preview`** | `vite preview` | Previews production build locally. |
| **`npm run lint`** | `tsc --noEmit` | Validates TypeScript types. |

---

## 📁 Project Structure

```
├── inputs/                       # 📂 The 2 source data files
│   ├── portfolio_summary.json    # File 1: Balances, cash, & macro settings
│   └── holdings_export.csv       # File 2: Detailed stock & ETF positions
├── scripts/
│   └── update_portfolio_data.ts  # CLI ingestion & code generation script
├── src/
│   ├── components/               # React UI modules (Dark Executive Theme)
│   │   ├── Header.tsx            # Navigation, quick stats, & sync modal trigger
│   │   ├── DataImporterModal.tsx # In-app modal for uploading/syncing 2 files
│   │   ├── ExecutiveSummary.tsx  # Executive overview cards
│   │   ├── MilestoneTracker.tsx  # €500k milestone trajectory & velocity
│   │   ├── AssetBreakdownTable.tsx# Interactive sortable holdings table & drawer
│   │   ├── FutureProjections.tsx # 20-year Recharts growth visualizer & sliders
│   │   ├── StrategyScenarioAnalysis.tsx # Rate sensitivity matrix & action steps
│   │   └── PortugalTaxAdvisor.tsx# CIRS Art. 43º & 72º tax structuring
│   ├── data/
│   │   └── portfolioData.ts      # Generated typed dataset
│   ├── utils/
│   │   └── financialCalculations.ts # Compounding math & currency formatters
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                   # Main dashboard layout container
│   ├── main.tsx                  # React DOM entry point
│   └── index.css                 # Tailwind CSS v4 entry
├── metadata.json                 # AI Studio configuration
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Documentation & usage guide
```

---
## 🤖 Prompt
Atua como um analista de dados financeiros. A tua tarefa é usar o interpretador de Python (ferramenta de análise de dados/pandas) para ler, processar e agregar dados de dois ficheiros de folha de cálculo e gerar dois outputs precisos (um JSON e um CSV).

**Atenção aos ficheiros de Input:**
Vais receber exatamente dois ficheiros com os seguintes nomes:
```My Finances```
```Stocks 2026```
Não inventes nem procures outros nomes de ficheiros. Ambos os ficheiros contêm várias tabs (folhas). Deves usar o código para listar e inspecionar as tabs disponíveis em cada ficheiro (pd.ExcelFile(ficheiro).sheet_names) antes de extrair os dados.

Output 1: portfolio_summary.json

Fontes a utilizar: Dados agregados e macro do ficheiro "My Finances".
Objetivo: Gerar um sumário macro do portefólio. Calcula os totais e preenche a seguinte estrutura JSON exata. A soma de todos os ativos tem de corresponder a totalValueEur, e a soma da categoria etfs e stocks tem de corresponder a investmentsTotalEur.

Usa esta estrutura exata (preenchendo com os valores extraídos e calculados):
```
JSON
{
  "totalValueEur": 0.0,
  "investmentsTotalEur": 0.0,
  "emergencyFundTotalEur": 0.0,
  "pprTotalEur": 0.0,
  "cashTotalEur": 0.0,
  "cryptoTotalEur": 0.0,
  "monthlyDepositEur": 0.0,
  "defaultAnnualReturnPct": 10.0,
  "conservativeReturnPct": 5.0,
  "moderateReturnPct": 7.5,
  "aggressiveReturnPct": 12.0,
  "dividendYieldTargetPct": 2.0,
  "inflationRatePct": 1.5,
  "targetMilestoneEur": 500000.0,
  "asOfDate": "YYYY-MM-DD",
  "categories": [
    {
      "category": "etfs",
      "label": "Exchange Traded Funds (ETFs)",
      "valueEur": 0.0,
      "color": "#3b82f6",
      "subcategories": [
        { "name": "Nome do ETF 1", "valueEur": 0.0 },
        { "name": "Nome do ETF 2", "valueEur": 0.0 }
      ]
    },
    {
      "category": "stocks",
      "label": "Individual Equities",
      "valueEur": 0.0,
      "color": "#10b981",
      "subcategories": [
        { "name": "Corretora A", "valueEur": 0.0 },
        { "name": "Corretora B", "valueEur": 0.0 }
      ]
    },
    {
      "category": "emergency",
      "label": "Emergency Liquidity & Cash Reserves",
      "valueEur": 0.0,
      "color": "#f59e0b",
      "subcategories": [
        { "name": "Conta Poupança A", "valueEur": 0.0 },
        { "name": "Certificados B", "valueEur": 0.0 }
      ]
    },
    {
      "category": "ppr",
      "label": "Plano Poupança Reforma (PPR)",
      "valueEur": 0.0,
      "color": "#8b5cf6",
      "subcategories": [
        { "name": "Nome do Fundo PPR", "valueEur": 0.0 }
      ]
    },
    {
      "category": "cash",
      "label": "Brokerage & Operational Cash",
      "valueEur": 0.0,
      "color": "#64748b",
      "subcategories": [
        { "name": "Uninvested Cash & Settlement", "valueEur": 0.0 }
      ]
    },
    {
      "category": "crypto",
      "label": "Cryptocurrency & Digital Assets",
      "valueEur": 0.0,
      "color": "#ec4899",
      "subcategories": [
        { "name": "Ativo Cripto 1", "valueEur": 0.0 },
        { "name": "Ativo Cripto 2", "valueEur": 0.0 }
      ]
    }
  ]
}
```

Output 2: holdings_export.csv

Fontes a utilizar: Dados detalhados do portefólio de ações e ETFs nas tabs relevantes do ficheiro "Stocks 2026".
Objetivo: Consolidar os ativos individuais num único formato CSV. O CSV final deve conter o seguinte cabeçalho exato:
```
Ticker,Name,AssetClass,Industry,Market,Shares,AvgPrice,CurrentPrice,TotalCostEur,CurrentValueUsd,CurrentValueEur,ProfitEur,ProfitPct,DividendYieldPct,ExpectedReturnPct,Strategy,AiTrendRelevance,Notes
```
Exemplo de linha formatada:
```
AMS:CNDX,iShares NASDAQ 100 UCITS ETF USD (Acc),ETF,Exchange-traded fund,XETRA / Euronext,50,807.40 €,1 442.40 €,40370.00,84089.76,72120.00,31750.00,78.65,0.0,11.5,Keep,Broad Tech Index,Accumulating ETF (zero dividend tax drag in PT). High beta exposure to top 100 US tech giants.
```
Regras de Execução:
Leitura Rigorosa: Lê os ficheiros e as tabs usando código Python. Não tentes estimar ou inventar dados.
Consistência Matemática: Garante que o investmentsTotalEur calculado para o JSON bate certo ao cêntimo com a soma da coluna CurrentValueEur gerada no ficheiro holdings_export.csv.
Exclusão Específica: O utilizador não detém a ação Broadcom (AVGO). Caso apareça em alguma tabela de acompanhamento geral, ignora e garante que não é incluída nos totais do portefólio nem exportada para o CSV.
Formatação de Output: O teu output final deve ser estritamente o código JSON contido num bloco Markdown json, seguido do código CSV contido num bloco Markdown csv.

## 🛡️ License

MIT License. Designed for private wealth analysis and long-term tech growth compounding.
