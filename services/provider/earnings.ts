// services/provider/earnings.ts
export type EarningsPeriod = "today" | "week" | "month" | "custom";

export type EarningTxn = {
  id: string;
  orderId: string;
  date: string; // ISO
  summary: string;
  source: "order" | "meal_plan";
  gross: number;
  fees: number;
  refunds: number;
  net: number;
  payoutStatus: "pending" | "paid" | "processing";
};

export type Payout = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "processing";
  reference: string;
};

export type EarningsData = {
  summary: {
    today: number;
    week: number;
    month: number;
    total: number;
    completedOrders: number;
    avgOrderValue: number;
  };
  breakdown: {
    gross: number;
    fees: number;
    discounts: number;
    refunds: number;
    adjustments: number;
    net: number;
  };
  bySource: { orders: number; mealPlans: number };
  chart: { label: string; value: number }[];
  transactions: EarningTxn[];
  payouts: {
    availableBalance: number;
    pending: number;
    upcomingPayoutDate: string;
    totalPaid: number;
    history: Payout[];
  };
};

const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const rand = (a: number, b: number) => Math.round(a + Math.random() * (b - a));

function buildTxns(count: number): EarningTxn[] {
  return Array.from({ length: count }).map((_, i) => {
    const gross = rand(180, 1400);
    const fees = Math.round(gross * 0.05);
    const refunds = i % 9 === 0 ? rand(40, 120) : 0;
    const isPlan = i % 3 === 0;
    return {
      id: `txn_${i + 1}`,
      orderId: `HB${25000 + i * 7}`,
      date: new Date(Date.now() - i * 5.5 * 3600 * 1000).toISOString(),
      summary: isPlan
        ? ["Weekly Lunch Plan — Day 3", "Monthly Tiffin Plan — Week 2"][i % 2]
        : [
            "Dal Tadka, Jeera Rice",
            "Paneer Masala, 3 Roti",
            "Veg Biryani",
            "Khichdi, Kadhi",
          ][i % 4],
      source: isPlan ? "meal_plan" : "order",
      gross,
      fees,
      refunds,
      net: gross - fees - refunds,
      payoutStatus: i < 4 ? "pending" : i < 7 ? "processing" : "paid",
    };
  });
}

// TODO: replace with real backend call — GET /provider/earnings?period=
export async function getEarnings(
  period: EarningsPeriod,
  range?: { from: string; to: string },
): Promise<EarningsData> {
  await wait();
  if (Math.random() < 0.05) throw new Error("Couldn't load earnings.");

  const count = period === "today" ? 6 : period === "week" ? 14 : 26;
  const transactions = buildTxns(count);

  const gross = transactions.reduce((s, t) => s + t.gross, 0);
  const fees = transactions.reduce((s, t) => s + t.fees, 0);
  const refunds = transactions.reduce((s, t) => s + t.refunds, 0);
  const discounts = Math.round(gross * 0.03);
  const adjustments = 0;
  const net = gross - fees - refunds - discounts + adjustments;

  const mealPlans = transactions
    .filter((t) => t.source === "meal_plan")
    .reduce((s, t) => s + t.net, 0);

  const chart =
    period === "today"
      ? ["8a", "11a", "2p", "5p", "8p", "11p"].map((label) => ({
          label,
          value: rand(150, 1600),
        }))
      : period === "week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
            label,
            value: rand(600, 4200),
          }))
        : ["W1", "W2", "W3", "W4", "W5"].map((label) => ({
            label,
            value: rand(4000, 18000),
          }));

  return {
    summary: {
      today: rand(900, 2600),
      week: rand(9000, 18000),
      month: rand(32000, 62000),
      total: rand(180000, 320000),
      completedOrders: transactions.length,
      avgOrderValue: Math.round(gross / Math.max(transactions.length, 1)),
    },
    breakdown: { gross, fees, discounts, refunds, adjustments, net },
    bySource: { orders: net - mealPlans, mealPlans },
    chart,
    transactions,
    payouts: {
      availableBalance: rand(4000, 9000),
      pending: rand(1500, 4000),
      upcomingPayoutDate: "Every Monday",
      totalPaid: rand(120000, 240000),
      history: Array.from({ length: 5 }).map((_, i) => ({
        id: `po_${i}`,
        date: new Date(Date.now() - (i + 1) * 7 * 86400000).toISOString(),
        amount: rand(6000, 15000),
        status: i === 0 ? "processing" : "paid",
        reference: `UTR${900000 + i * 431}`,
      })),
    },
  };
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
