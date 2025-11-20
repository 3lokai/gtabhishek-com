import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arda — My Local AI Lab & Ops Box | Local Setup",
  description:
    "A single desktop that runs my models, workflows, and experiments. Ryzen 7, RTX 3060, 32GB RAM — fast enough to be dangerous, and just constrained enough to keep me honest.",
};

export default function LocalSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
