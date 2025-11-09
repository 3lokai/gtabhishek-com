// src/data/events.ts
export type PeriodType = "Q" | "H";

export type TimelineEvent = {
  title: string;
  isChecked?: boolean;
};

export type TimelineItem = {
  year: number;
  periodType: PeriodType;     // "Q" (quarter) or "H" (half)
  periodNumber: number;       // 1..4 for Q, 1..2 for H
  isChecked: boolean;         // overall status chip on the card
  events: TimelineEvent[];    // bullet list inside the expandable panel
};

export const events: TimelineItem[] = [
  // ——— Publicis Sapient ———
  {
    year: 2025,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Associate Director — marketing systems, reporting cadence" },
      { title: "Weekly CGO → CEO updates; revenue leadership visibility" },
      { title: "AI + automation to improve exception tracking & team performance" },
    ],
  },
  {
    year: 2025,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "17+ multi-channel campaigns; 29k+ personalized outbound emails" },
      { title: "10+ qualified opportunities; measurable pipeline impact" },
      { title: "Recognized culture catalyst (Hyderabad); NextGen Leadership cohort" },
    ],
  },
  {
    year: 2024,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Partnered with CGO & CRO to scale sales/marketing systems" },
      { title: "Python outreach automations → +20% prospect coverage" },
      { title: "Pardot implementation; response time < 8 days" },
    ],
  },
  {
    year: 2024,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "Chief-of-Staff to CGO — ops, dashboards, alignment" },
      { title: "Executive stakeholder comms; cross-functional enablement" },
    ],
  },
  {
    year: 2023,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Marketing–Sales alignment programs; analytics & performance tracking" },
      { title: "Brand & GTM strategy inputs; change management execution" },
    ],
  },
  {
    year: 2022,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Joined Publicis Sapient (Associate Director), Hyderabad" },
      { title: "Built scalable systems across industry + BD teams" },
    ],
  },

  // ——— Hevo Data ———
  {
    year: 2022,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "AVP — Strategy & Business Ops" },
      { title: "Built Customer Success 0→5 in 6 months; owned 500+ enterprise customers (~$3.5M ARR)" },
      { title: "Predictive health scoring to improve retention & upsell" },
    ],
  },
  {
    year: 2021,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Scaled CS operations; partnered with product/marketing/support" },
    ],
  },

  // ——— ekincare ———
  {
    year: 2021,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "AVP — Marketing; 35 → 200+ enterprise clients; 95k → 340k users (2 yrs)" },
      { title: "Owned ₹1 Cr (~$125k) budget; strong ROI" },
    ],
  },
  {
    year: 2020,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "“Free Telemedicine” COVID campaign → 600 corporates in 2 months" },
      { title: "Consortium GTM with HRTech partners" },
    ],
  },
  {
    year: 2019,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "Built B2B marketing, engagement, inside-sales teams (to 12 FTE)" },
      { title: "↓40% CPL via digital/social innovation" },
      { title: "PO for website redesign still in use; top-rated manager" },
    ],
  },
  {
    year: 2018,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Joined ekincare (AVP — Marketing), Hyderabad" },
    ],
  },

  // ——— HCL Technologies ———
  {
    year: 2018,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "Senior Manager — Sales Transformation Office" },
      { title: "Client Partner Program for top 150 accounts (~65% revenue)" },
      { title: "3-yr STRAP; whitespace & pipeline health scoring" },
    ],
  },
  {
    year: 2017,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Owned digital sales apps; Agile builds for field enablement" },
      { title: "Cross-functional QBRs; revenue/pipeline KPIs" },
    ],
  },
  {
    year: 2016,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Manager → Senior Manager (promotion path)" },
      { title: "Case study with ACMP on engagement/experiential marketing" },
    ],
  },

  // ——— Early roles ———
  {
    year: 2014,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "Manager — New Applications, SicgilSol (Chennai)" },
      { title: "7 solutions vertical; ₹75L pipeline contract (first reference)" },
    ],
  },
  {
    year: 2012,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "Sr. Executive — Business Dev, AirLiquide (Delhi)" },
      { title: "5 new customers; up to ₹30L/yr; led 3 installations" },
    ],
  },

  // ——— Education ———
  {
    year: 2015,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "ISB — PGPM (Marketing & Ops); President, Marketing Club; Philippines GTM project" },
    ],
  },
  {
    year: 2010,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "BITS Pilani — BE (Chem Eng). Two industry projects (8 months total)" },
    ],
  },
];
