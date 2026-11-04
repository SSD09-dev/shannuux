import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kissanPages } from "@/lib/kissan-case-study";

export const Route = createFileRoute("/work/kissan-agri-mall")({
  head: () => ({ meta: [
    { title: "Kissan Agri Mall — Case Study | Shanmukha Sai" },
    { name: "description", content: "Shanmukha Sai's full Kissan Agri Mall case study: a unified B2B + B2C agricultural commerce ecosystem, CRM, research, userflows and design system." },
    { property: "og:title", content: "Kissan Agri Mall — Shanmukha Sai's Case Study" },
    { property: "og:description", content: "Explore the complete design process behind Kissan Agri Mall's connected ecommerce and CRM ecosystem." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: KissanCaseStudy,
});

function KissanCaseStudy() {
  const [zoomed, setZoomed] = useState(false);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-8">
          <Button asChild className="size-11 shrink-0 border border-border bg-surface/70 hover:bg-surface">
            <Link to="/" hash="work" aria-label="Back to selected work" title="Back to selected work"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div className="min-w-0 flex-1"><h1 className="text-lg font-semibold md:text-2xl">Kissan Agri Mall</h1><p className="font-mono text-xs text-muted-foreground">Case study · Shanmukha Sai</p></div>
          <Button onClick={() => setZoomed(!zoomed)} aria-label={zoomed ? "Fit case study to screen" : "Enlarge case study"} title={zoomed ? "Fit to screen" : "Enlarge case study"} aria-pressed={zoomed} className="size-11 shrink-0 border border-border bg-surface/70 hover:bg-surface">{zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}</Button>
        </div>
      </header>
      <div className="overflow-x-auto" tabIndex={0} aria-label="Case study pages">
        <div className={zoomed ? "mx-auto w-[1800px]" : "mx-auto w-full max-w-[1440px]"}>
          {kissanPages.map((page, index) => (
            <section key={page.title} aria-label={page.title}>
              <h2 className="sr-only">{page.title}</h2>
              <p className="sr-only">{page.description}</p>
              <div className={page.narrow ? "mx-auto w-full max-w-[900px] px-4" : undefined}>
                <img src={page.asset.url} alt={`${page.title}: ${page.description}`} width={1800} height={1200} loading={index === 0 ? "eager" : "lazy"} className="block h-auto w-full" />
              </div>
            </section>
          ))}
        </div>
      </div>
      <footer className="mx-auto flex max-w-6xl justify-center px-6 py-12">
        <Button asChild className="glass glass-hover px-6 py-3"><Link to="/" hash="work"><ArrowLeft className="size-4" />Back to selected work</Link></Button>
      </footer>
    </main>
  );
}