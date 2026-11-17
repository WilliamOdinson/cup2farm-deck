// Illustrative return model for Cup2Farm. Pure functions, no React, so the arithmetic
// can be tested on its own (see test/roi.test.js). All money is yearly gross profit.

export const ASSUMPTIONS = {
  cupsPerPound: 22, // 12 oz cups at 20 g of coffee each
  scansPerPerson: 2, // average scans per scanning drinker per year
  profitPerDrinker: 60, // about $150 a year in bags and cafe visits at 40% margin
  researchLift: 0.41, // Urban and Sultan: 1.24 x 1.14 = 1.41 times sales potential
  liftTransfer: 0.3, // share of that study lift we assume carries over to Coda
  profitPerAccount: 6000, // a cafe buying about 60 lb a week at about $2 a pound margin
  fundPerThanker: 1, // tips reaching co-op funds per thanking drinker per year
};

// Scenario inputs by phase. Year 3 stays below the roughly 500,000 lb a year Coda
// already roasted in 2013, so no phase assumes growth the company has not shown.
export const PRESETS = [
  { id: "pilot", label: "Year 1 pilot", pounds: 40000, scanRate: 0.03, thankRate: 0.25, accounts: 2, cost: 120000 },
  { id: "partners", label: "Year 2 partners", pounds: 200000, scanRate: 0.02, thankRate: 0.2, accounts: 8, cost: 180000 },
  { id: "network", label: "Year 3 network", pounds: 400000, scanRate: 0.02, thankRate: 0.2, accounts: 20, cost: 240000 },
];

/**
 * @param {{pounds:number, scanRate:number, thankRate:number, accounts:number, cost:number}} input
 * @param {typeof ASSUMPTIONS} [a]
 */
export function roi(input, a = ASSUMPTIONS) {
  const pounds = Math.max(0, Number(input.pounds) || 0);
  const scanRate = Math.min(1, Math.max(0, Number(input.scanRate) || 0));
  const thankRate = Math.min(1, Math.max(0, Number(input.thankRate) || 0));
  const accounts = Math.max(0, Number(input.accounts) || 0);
  const cost = Math.max(0, Number(input.cost) || 0);

  const cups = pounds * a.cupsPerPound;
  const scans = cups * scanRate;
  const people = scans / a.scansPerPerson;
  const thankers = people * thankRate;

  const liftPerThanker = a.profitPerDrinker * a.researchLift * a.liftTransfer;
  const drinkerProfit = thankers * liftPerThanker;
  const wholesaleProfit = accounts * a.profitPerAccount;
  const value = drinkerProfit + wholesaleProfit;

  const perDollar = cost > 0 ? value / cost : 0;
  // Wholesale accounts needed to cover what drinker loyalty does not.
  const accountsToBreakEven = Math.max(0, Math.ceil((cost - drinkerProfit) / a.profitPerAccount));

  return {
    cups,
    scans,
    people,
    thankers,
    fund: thankers * a.fundPerThanker,
    drinkerProfit,
    wholesaleProfit,
    value,
    net: value - cost,
    perDollar,
    accountsToBreakEven,
  };
}

export const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
export const count = (n) => {
  const v = Math.round(n);
  if (v >= 1e6) return `${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M`;
  if (v >= 10000) return `${Math.round(v / 1000)}K`;
  return v.toLocaleString("en-US");
};
