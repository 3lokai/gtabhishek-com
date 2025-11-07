import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  fullScreen?: boolean;
};

export function PageShell({ children, fullScreen = false }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={cn(fullScreen ? "p-0" : "container mx-auto px-4 py-8")}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
