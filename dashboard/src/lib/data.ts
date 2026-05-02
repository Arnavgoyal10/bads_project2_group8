export const KPI_SUMMARY = {
  totalCustomers: 2400,
  totalRevenue: 159682,
  avgLTV: 66.53,
  avgLCR: 0.368,
  avgAOV: 58.87,
  avgROAS: 0.23,
  repeatRate90d: 0.243,
  giniCoefficient: 0.673,
  projectedClv6m: 141.28,
};

export const BUDGET_REALLOCATION = [
  { channel: "Paid Search", currentPct: 9.9, recommendedPct: 24.8, shift: 14.9, avgLtv: 66.55, roas: 0.360, compositeScore: 0.726 },
  { channel: "Search", currentPct: 5.9, recommendedPct: 18.4, shift: 12.5, avgLtv: 74.84, roas: 0.221, compositeScore: 0.539 },
  { channel: "Display", currentPct: 5.5, recommendedPct: 17.1, shift: 11.6, avgLtv: 74.59, roas: 0.173, compositeScore: 0.500 },
  { channel: "Email", currentPct: 12.9, recommendedPct: 13.7, shift: 0.8, avgLtv: 59.28, roas: 0.151, compositeScore: 0.400 },
  { channel: "Paid Social", currentPct: 16.0, recommendedPct: 14.6, shift: -1.4, avgLtv: 67.93, roas: 0.250, compositeScore: 0.426 },
  { channel: "Affiliate", currentPct: 42.7, recommendedPct: 9.4, shift: -33.3, avgLtv: 64.81, roas: 0.113, compositeScore: 0.276 },
  { channel: "Influencer", currentPct: 7.2, recommendedPct: 2.0, shift: -5.2, avgLtv: 76.22, roas: 0.155, compositeScore: 0.059 },
];

export const CHANNEL_QUALITY = [
  { channel: "Influencer", nCustomers: 172, avgLtv: 76.22, medianLtv: 39.94, avgAov: 67.70, repeatRate: 0.30, avgAcqCost: 38.36, ltvPerAcqCost: 1.987 },
  { channel: "Search", nCustomers: 64, avgLtv: 74.84, medianLtv: 24.66, avgAov: 62.21, repeatRate: 0.36, avgAcqCost: 32.34, ltvPerAcqCost: 2.314 },
  { channel: "Display", nCustomers: 172, avgLtv: 74.59, medianLtv: 44.50, avgAov: 66.40, repeatRate: 0.35, avgAcqCost: 32.71, ltvPerAcqCost: 2.280 },
  { channel: "Paid Social", nCustomers: 495, avgLtv: 67.93, medianLtv: 29.99, avgAov: 68.21, repeatRate: 0.29, avgAcqCost: 33.54, ltvPerAcqCost: 2.025 },
  { channel: "Paid Search", nCustomers: 454, avgLtv: 66.55, medianLtv: 38.96, avgAov: 55.68, repeatRate: 0.32, avgAcqCost: 39.22, ltvPerAcqCost: 1.697 },
  { channel: "Affiliate", nCustomers: 305, avgLtv: 64.81, medianLtv: 36.53, avgAov: 55.62, repeatRate: 0.33, avgAcqCost: 31.93, ltvPerAcqCost: 2.030 },
  { channel: "Email", nCustomers: 462, avgLtv: 59.28, medianLtv: 27.88, avgAov: 52.12, repeatRate: 0.30, avgAcqCost: 27.31, ltvPerAcqCost: 2.171 },
];

export const CATEGORY_ANALYSIS = [
  { category: "Baby", nTransactions: 474, totalRevenue: 39902.93, avgRevenue: 84.72, returnRate: 0.07, avgDiscount: 8.43, firstPurchaseRepeatRate: 0.524 },
  { category: "Home Care", nTransactions: 488, totalRevenue: 32014.97, avgRevenue: 65.60, returnRate: 0.08, avgDiscount: 8.21, firstPurchaseRepeatRate: 0.475 },
  { category: "Supplements", nTransactions: 458, totalRevenue: 31197.66, avgRevenue: 68.87, returnRate: 0.09, avgDiscount: 8.90, firstPurchaseRepeatRate: 0.477 },
  { category: "Personal Care", nTransactions: 463, totalRevenue: 26872.60, avgRevenue: 58.17, returnRate: 0.08, avgDiscount: 8.06, firstPurchaseRepeatRate: 0.580 },
  { category: "Snacks", nTransactions: 489, totalRevenue: 19533.30, avgRevenue: 40.27, returnRate: 0.08, avgDiscount: 8.47, firstPurchaseRepeatRate: 0.516 },
  { category: "Beverages", nTransactions: 436, totalRevenue: 14287.20, avgRevenue: 33.07, returnRate: 0.08, avgDiscount: 8.86, firstPurchaseRepeatRate: 0.527 },
];

export const RETURN_RATE_BY_CHANNEL = [
  { channel: "Email", returnRate: 0.089, nTransactions: 406, avgRevenue: 61.73 },
  { channel: "Paid Search", returnRate: 0.088, nTransactions: 396, avgRevenue: 61.15 },
  { channel: "Affiliate", returnRate: 0.084, nTransactions: 395, avgRevenue: 50.94 },
  { channel: "Paid Social", returnRate: 0.082, nTransactions: 402, avgRevenue: 68.21 },
  { channel: "Direct", returnRate: 0.079, nTransactions: 392, avgRevenue: 62.23 },
  { channel: "Organic", returnRate: 0.077, nTransactions: 391, avgRevenue: 54.49 },
  { channel: "Influencer", returnRate: 0.066, nTransactions: 407, avgRevenue: 52.87 },
  { channel: "Search", returnRate: 0.000, nTransactions: 19, avgRevenue: 39.21 },
];

export const SEGMENTS = [
  { name: "Champions", nCustomers: 18, avgRevenue: 1346.85, totalRevenue: 24243, avgOrders: 2.11, avgSessions: 7.6, avgAddToCart: 2.8, avgAge: 33.3, color: "#f59e0b" },
  { name: "Core Buyers", nCustomers: 532, avgRevenue: 146.62, totalRevenue: 78004, avgOrders: 2.87, avgSessions: 7.5, avgAddToCart: 2.6, avgAge: 32.8, color: "#3b82f6" },
  { name: "Engaged Browsers", nCustomers: 784, avgRevenue: 37.58, totalRevenue: 29465, avgOrders: 0.77, avgSessions: 10.3, avgAddToCart: 4.7, avgAge: 34.0, color: "#10b981" },
  { name: "Dormant / At Risk", nCustomers: 1066, avgRevenue: 26.24, totalRevenue: 27970, avgOrders: 0.55, avgSessions: 6.3, avgAddToCart: 1.9, avgAge: 33.0, color: "#ef4444" },
];

export const RFM_TIERS = [
  { tier: "Champions", count: 365, avgRevenue: 154.12, totalRevenue: 56254 },
  { tier: "At Risk", count: 339, avgRevenue: 136.25, totalRevenue: 46190 },
  { tier: "Average", count: 742, avgRevenue: 73.62, totalRevenue: 54624 },
  { tier: "Lost Causes", count: 11, avgRevenue: 159.67, totalRevenue: 1756 },
  { tier: "New Customers", count: 19, avgRevenue: 45.20, totalRevenue: 859 },
  { tier: "No Orders", count: 924, avgRevenue: 0, totalRevenue: 0 },
];

export const LOYALTY_TIERS = [
  { tier: "Platinum", avgLtv: 88.69, avgAov: 69.37, count: 142 },
  { tier: "Gold", avgLtv: 82.04, avgAov: 62.94, count: 502 },
  { tier: "Silver", avgLtv: 69.63, avgAov: 60.94, count: 704 },
  { tier: "Bronze", avgLtv: 54.07, avgAov: 53.39, count: 1052 },
];

export const LEAD_MODELS = [
  { model: "Logistic Regression", accuracy: 0.5972, auc: 0.6359, cvAuc: 0.6191, f1: 0.5047, selected: true },
  { model: "Gradient Boosting", accuracy: 0.6378, auc: 0.6205, cvAuc: 0.6071, f1: 0.2309, selected: false },
  { model: "Naive Bayes", accuracy: 0.6348, auc: 0.6195, cvAuc: 0.6020, f1: 0.2116, selected: false },
  { model: "Random Forest", accuracy: 0.6240, auc: 0.6065, cvAuc: 0.5846, f1: 0.2976, selected: false },
  { model: "KNN", accuracy: 0.5911, auc: 0.5591, cvAuc: 0.5331, f1: 0.3582, selected: false },
];

export const LEAD_FEATURE_IMPORTANCE = [
  { feature: "lead_score", importance: 0.1287 },
  { feature: "avg_time_on_site", importance: 0.0940 },
  { feature: "avg_pages_viewed", importance: 0.0892 },
  { feature: "age", importance: 0.0797 },
  { feature: "total_sessions", importance: 0.0635 },
  { feature: "discount_pct", importance: 0.0602 },
  { feature: "total_add_to_cart", importance: 0.0487 },
  { feature: "total_checkout_started", importance: 0.0393 },
  { feature: "lead_source_Google", importance: 0.0217 },
  { feature: "lead_source_Meta", importance: 0.0214 },
];

export const LEAD_TIERS = [
  { tier: "High", count: 1430, avgProb: 0.779, color: "#10b981" },
  { tier: "Medium", count: 773, avgProb: 0.457, color: "#f59e0b" },
  { tier: "Low", count: 3021, avgProb: 0.151, color: "#ef4444" },
];

export const RETENTION_MODELS = [
  { model: "Gradient Boosting", accuracy: 0.7398, auc: 0.7205, cvAuc: 0.7460, f1: 0.2381, selected: true },
  { model: "Random Forest", accuracy: 0.7425, auc: 0.6994, cvAuc: 0.7373, f1: 0.0777, selected: false },
  { model: "Logistic Regression", accuracy: 0.6721, auc: 0.6800, cvAuc: 0.6867, f1: 0.4622, selected: false },
];

export const RETENTION_FEATURE_IMPORTANCE = [
  { feature: "total_revenue", importance: 0.2399 },
  { feature: "total_acquisition_cost", importance: 0.1050 },
  { feature: "avg_pages_viewed", importance: 0.0944 },
  { feature: "age", importance: 0.0882 },
  { feature: "total_sessions", importance: 0.0700 },
  { feature: "total_add_to_cart", importance: 0.0558 },
  { feature: "gender_male", importance: 0.0203 },
  { feature: "region_south_west", importance: 0.0185 },
  { feature: "loyalty_tier_gold", importance: 0.0170 },
  { feature: "loyalty_tier_silver", importance: 0.0158 },
];

export const SLR_RESULTS = [
  { model: "Campaign Spend → Leads", n: 39, r2: 0.0192, pValue: 0.400, significant: false, slope: -0.0000 },
  { model: "Lead Score → Revenue", n: 2129, r2: 0.0069, pValue: 0.0001, significant: true, slope: 0.8307 },
  { model: "Time on Site → Conversion", n: 2131, r2: 0.0011, pValue: 0.128, significant: false, slope: 0.0001 },
  { model: "Pages Viewed → Add-to-Cart", n: 2400, r2: 0.0543, pValue: 0.0000, significant: true, slope: 0.4799 },
  { model: "Discount % → Revenue", n: 2698, r2: 0.0148, pValue: 0.0000, significant: true, slope: -0.5032 },
  { model: "Acquisition Cost → LTV", n: 2400, r2: 0.0007, pValue: 0.192, significant: false, slope: 0.1627 },
  { model: "Impressions → Clicks", n: 28, r2: 0.1101, pValue: 0.085, significant: false, slope: 0.2618 },
  { model: "Session Quality → Repeat", n: 2400, r2: 0.0003, pValue: 0.388, significant: false, slope: -0.0099 },
];

export const MLR_RESULTS = [
  { model: "A: Predict Customer LTV", r2: 0.851, adjR2: 0.846, nTrain: 971, nTest: 324, topPredictor: "AOV", status: "success" },
  { model: "B: Predict Revenue/Transaction", r2: 0.716, adjR2: 0.706, nTrain: 2048, nTest: 683, topPredictor: "units", status: "success" },
  { model: "C: Predict Days-to-Convert", r2: -0.010, adjR2: -0.107, nTrain: 723, nTest: 242, topPredictor: "src_Google", status: "failed" },
];

export const HYPOTHESIS_TESTS = [
  { test: "Chi-Square: Income Band × Loyalty Tier", stat: "χ²=16.11", pValue: 0.1861, significant: false, decision: "No association between income band and loyalty tier." },
  { test: "Chi-Square: Landing Page × Conversion", stat: "χ²=10.22", pValue: 0.0692, significant: false, decision: "No significant landing page effect on conversion." },
  { test: "Chi-Square: Discount Flag × Conversion", stat: "χ²=0.011", pValue: 0.9177, significant: false, decision: "Discount presence does not significantly affect conversion." },
  { test: "Chi-Square: Device × Conversion", stat: "χ²=4.578", pValue: 0.3334, significant: false, decision: "Device type does not significantly affect conversion." },
  { test: "ANOVA: LTV across Loyalty Tiers", stat: "F=6.754", pValue: 0.0002, significant: true, decision: "LTV differs significantly across loyalty tiers — tiered investment is justified." },
  { test: "Kruskal-Wallis: Channel → AOV", stat: "H=20.39", pValue: 0.0402, significant: true, decision: "Average Order Value differs significantly across acquisition channels." },
  { test: "ANOVA: Days-to-Convert across Channels", stat: "F=0.602", pValue: 0.7290, significant: false, decision: "No significant difference in conversion speed across channels (~15 days all)." },
  { test: "IPTW Causal: Discount → Conversion", stat: "ATE=−0.009", pValue: 0.001, significant: true, decision: "Discounts causally reduce conversion rate by 0.9pp after controlling for selection bias." },
];

export const DISCOUNT_UPLIFT_CHANNEL = [
  { channel: "Influencer", uplift: 5.1 },
  { channel: "Affiliate", uplift: 4.9 },
  { channel: "Paid Search", uplift: 2.6 },
  { channel: "Email", uplift: 1.6 },
  { channel: "Paid Social", uplift: -2.8 },
  { channel: "Display", uplift: -5.7 },
  { channel: "Search", uplift: -7.0 },
];

export const DISCOUNT_UPLIFT_TIER = [
  { tier: "Silver", uplift: 3.4 },
  { tier: "Platinum", uplift: 1.5 },
  { tier: "Bronze", uplift: -1.2 },
  { tier: "Gold", uplift: -1.9 },
];

export const DECEPTIVE_CAMPAIGNS = [
  { id: "MKT2013", channel: "Paid Social", roas: 0.667, repeatRate: 0.296, avgLtv: 79.87 },
  { id: "MKT2006", channel: "Paid Social", roas: 0.596, repeatRate: 0.306, avgLtv: 67.95 },
  { id: "MKT2031", channel: "Paid Social", roas: 0.370, repeatRate: 0.310, avgLtv: 66.53 },
  { id: "MKT2022", channel: "Email", roas: 0.356, repeatRate: 0.279, avgLtv: 53.49 },
  { id: "MKT2032", channel: "Search", roas: 0.339, repeatRate: 0.266, avgLtv: 70.49 },
  { id: "MKT2000", channel: "Paid Social", roas: 0.304, repeatRate: 0.276, avgLtv: 48.93 },
  { id: "MKT2017", channel: "Paid Social", roas: 0.194, repeatRate: 0.260, avgLtv: 67.96 },
  { id: "MKT2023", channel: "Email", roas: 0.189, repeatRate: 0.302, avgLtv: 73.32 },
];

export const DATA_QUALITY_ISSUES = [
  { table: "Campaigns", issue: "3 duplicate campaign_ids (MKT2012, MKT2013, MKT2028)", treatment: "Dropped duplicates, kept first occurrence", severity: "high" },
  { table: "Campaigns", issue: "3 campaigns with spend_usd = −5000 (MKT2005, MKT2008, MKT2020)", treatment: "Set to NaN (impossible negative spend)", severity: "high" },
  { table: "Campaigns", issue: "11 channel name variants (e-mail, Email, Paid-Social, etc.)", treatment: "Normalized to 7 canonical channel names", severity: "high" },
  { table: "Customers", issue: "Duplicate customer_ids", treatment: "Dropped duplicates on customer_id", severity: "medium" },
  { table: "Customers", issue: "Invalid ages (< 0 or > 120)", treatment: "Set to NaN", severity: "low" },
  { table: "Customers", issue: "Gender label variants (m, M, Male, male)", treatment: "Normalized to 'male'/'female'", severity: "low" },
  { table: "Leads", issue: "26 anonymous leads (no customer_id) & 33 unattributed leads (no campaign_id)", treatment: "Kept for aggregate analysis; excluded from customer-level joins", severity: "medium" },
  { table: "Transactions", issue: "9+ product category variants (baby, baby care, etc.)", treatment: "Normalized to 6 canonical categories", severity: "high" },
  { table: "Transactions", issue: "Revenue ≤ 0 transactions", treatment: "Flagged, kept in dataset", severity: "low" },
  { table: "Website Sessions", issue: "22% of sessions are anonymous (no customer_id)", treatment: "Kept for aggregate analysis; excluded from joins", severity: "medium" },
];

export const LANDING_PAGE_LCR = [
  { page: "/landing-b", n: 891, lcr: 0.396 },
  { page: "/bundle-offer", n: 895, lcr: 0.384 },
  { page: "/new-arrivals", n: 859, lcr: 0.374 },
  { page: "/quiz", n: 873, lcr: 0.353 },
  { page: "/landing-a", n: 832, lcr: 0.347 },
  { page: "/promo-summer", n: 874, lcr: 0.336 },
];

export const DAYS_TO_CONVERT = [
  { channel: "Affiliate", meanDays: 14.47, medianDays: 15, n: 98 },
  { channel: "Influencer", meanDays: 14.62, medianDays: 14, n: 81 },
  { channel: "Search", meanDays: 15.07, medianDays: 15, n: 99 },
  { channel: "Paid Social", meanDays: 15.09, medianDays: 15, n: 334 },
  { channel: "Email", meanDays: 15.15, medianDays: 15, n: 235 },
  { channel: "Paid Search", meanDays: 15.73, medianDays: 16, n: 283 },
  { channel: "Display", meanDays: 16.58, medianDays: 17, n: 65 },
];

export const CHANNEL_PERFORMANCE = [
  { channel: "Email", leads: 882, conversions: 356, lcr: 0.4036, cpl: 67762.5 },
  { channel: "Paid Search", leads: 1147, conversions: 447, lcr: 0.3897, cpl: 31649.5 },
  { channel: "Search", leads: 426, conversions: 164, lcr: 0.3850, cpl: 51490 },
  { channel: "Affiliate", leads: 446, conversions: 157, lcr: 0.3520, cpl: 346666 },
  { channel: "Paid Social", leads: 1572, conversions: 545, lcr: 0.3467, cpl: 46055 },
  { channel: "Display", leads: 292, conversions: 95, lcr: 0.3253, cpl: 71837 },
  { channel: "Influencer", leads: 419, conversions: 133, lcr: 0.3174, cpl: 62953 },
];

export const REGION_ANALYSIS = [
  { region: "South West", customers: 791, avgRevenue: 71.47, avgLcr: 0.397, totalRevenue: 56531 },
  { region: "South South", customers: 559, avgRevenue: 69.03, avgLcr: 0.394, totalRevenue: 38589 },
  { region: "North Central", customers: 441, avgRevenue: 67.59, avgLcr: 0.366, totalRevenue: 29806 },
  { region: "South East", customers: 186, avgRevenue: 69.79, avgLcr: 0.336, totalRevenue: 12981 },
  { region: "North West", customers: 396, avgRevenue: 50.10, avgLcr: 0.289, totalRevenue: 19841 },
];

export const DEVICE_ANALYSIS = [
  { device: "Mobile", nCustomers: 1621, avgRevenue: 64.88, avgEngagement: 1.574 },
  { device: "Desktop", nCustomers: 559, avgRevenue: 71.50, avgEngagement: 1.647 },
  { device: "Tablet", nCustomers: 202, avgRevenue: 66.78, avgEngagement: 1.583 },
];

export const CREATIVE_TYPE = [
  { type: "Carousel", leads: 1262, conversions: 473, lcr: 0.3748 },
  { type: "UGC", leads: 1266, conversions: 470, lcr: 0.3712 },
  { type: "Promo", leads: 439, conversions: 163, lcr: 0.3713 },
  { type: "Video", leads: 593, conversions: 217, lcr: 0.3659 },
  { type: "Static", leads: 1041, conversions: 377, lcr: 0.3622 },
  { type: "Testimonial", leads: 583, conversions: 197, lcr: 0.3379 },
];

export const CAMPAIGN_OBJECTIVE = [
  { objective: "Awareness", leads: 1446, conversions: 539, lcr: 0.3728 },
  { objective: "Lead Gen", leads: 1766, conversions: 658, lcr: 0.3726 },
  { objective: "Retention", leads: 1002, conversions: 365, lcr: 0.3643 },
  { objective: "Conversion", leads: 970, conversions: 335, lcr: 0.3454 },
];
