export type SaleRecord = {
  storeId: string;
  category: string;
  revenue: number;
  unitsSold: number;
  date: string; // YYYY-MM-DD
};

export type GroupMetrics = {
  totalRevenue: number;
  totalUnits: number;
  averagePricePerUnit: number;
  count: number;
};

export type AggregationResult = Record<string, GroupMetrics>;

type GroupAccumulator = {
  totalRevenue: number;
  totalUnits: number;
  count: number;
};

export function aggregateSales(
  records: SaleRecord[],
  groupByKeys: (keyof SaleRecord)[],
): AggregationResult {
  const rawGrouped = records.reduce<Record<string, GroupAccumulator>>(
    (acc, record) => {
      const key = groupByKeys.map((k) => record[k]).join(":") || "_total_";

      const current = acc[key] || {
        totalRevenue: 0,
        totalUnits: 0,
        count: 0,
      };

      acc[key] = {
        totalRevenue: current.totalRevenue + record.revenue,
        totalUnits: current.totalUnits + record.unitsSold,
        count: current.count + 1,
      };

      return acc;
    },
    {},
  );

  const aggregationResult: AggregationResult = {};

  for (const key in rawGrouped) {
    const { totalRevenue, totalUnits, count } = rawGrouped[key];
    aggregationResult[key] = {
      totalRevenue,
      totalUnits,
      averagePricePerUnit:
        totalUnits > 0 ? Number((totalRevenue / totalUnits).toFixed(2)) : 0,
      count,
    };
  }

  return aggregationResult;
}

export const salesData: SaleRecord[] = [
  {
    storeId: "s1",
    category: "Tech",
    revenue: 1200,
    unitsSold: 4,
    date: "2026-03-01",
  },
  {
    storeId: "s1",
    category: "Tech",
    revenue: 800,
    unitsSold: 2,
    date: "2026-03-02",
  },
  {
    storeId: "s2",
    category: "Tech",
    revenue: 2000,
    unitsSold: 5,
    date: "2026-03-01",
  },
  {
    storeId: "s1",
    category: "Home",
    revenue: 300,
    unitsSold: 3,
    date: "2026-03-01",
  },
  {
    storeId: "s2",
    category: "Home",
    revenue: 450,
    unitsSold: 6,
    date: "2026-03-03",
  },
];

console.log("=== Group by storeId & category ===");
console.log(
  JSON.stringify(aggregateSales(salesData, ["storeId", "category"]), null, 2),
);

console.log("\n=== Group by category ===");
console.log(JSON.stringify(aggregateSales(salesData, ["category"]), null, 2));
