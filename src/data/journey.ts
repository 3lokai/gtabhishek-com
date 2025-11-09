// Simple, company-first data for the journey map
export type JourneyStop = {
  id: string;
  period: string; // "2022—Now"
  company: string; // "Publicis Sapient"
  role: string; // "Associate Director"
  points: string[]; // 2–3 punchy wins
  href?: string; // optional link to /work#ps or company site
};

export const journey: JourneyStop[] = [
  {
    id: "ps",
    period: "2022—Now",
    company: "Publicis Sapient",
    role: "Associate Director",
    points: [
      "17+ campaigns → 10+ QOs; exec reporting cadence",
      "AI + automations; exception tracking & team performance",
      "NextGen Leadership cohort; culture catalyst (Hyd)",
    ],
    href: "/work#ps",
  },
  {
    id: "hevo",
    period: "2021—22",
    company: "Hevo Data",
    role: "AVP — Strategy & Biz Ops",
    points: [
      "CS org from 0→5; owned 500+ enterprise accounts (~$3.5M ARR)",
      "Predictive health scoring → better retention & upsell",
    ],
    href: "/work#hevo",
  },
  {
    id: "ekincare",
    period: "2018—21",
    company: "ekincare",
    role: "AVP — Marketing",
    points: [
      "35→200+ enterprise clients; 95k→340k users",
      "₹1Cr budget, ↓40% CPL; 'Free Telemedicine' → 600 corporates",
    ],
    href: "/work#ekincare",
  },
  {
    id: "hcl",
    period: "2015—18",
    company: "HCL Technologies",
    role: "Sr. Manager — Sales Transformation",
    points: [
      "Top-150 Client Partner Program (~65% revenue)",
      "STRAP planning; pipeline/whitespace scoring; sales apps",
    ],
    href: "/work#hcl",
  },
  {
    id: "early",
    period: "2010—14",
    company: "Early Roles",
    role: "AirLiquide • SicgilSol",
    points: [
      "First reference contract (₹75L); 3 project installs (led team of 5)",
      "New apps vertical; multi-industry wins",
    ],
  },
];

