import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Benchmark Lab | AI Labs Performance",
  description:
    "Testing 6 local models × 9 professional roles on consumer hardware. Real constraints, real performance.",
};

export default function AILabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

