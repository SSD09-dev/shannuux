import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { ArrowLeft, Globe, Info, Lock, Smile, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kissanPages } from "@/lib/kissan-case-study";
import { kissan } from "@/lib/kissan";
import signature from "@/assets/signature.png.asset.json";
import glassOfWater from "@/assets/glass-of-water.png.asset.json";

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
          <Button asChild className="press size-11 shrink-0 border border-border bg-surface/70 hover:bg-surface">
            <Link to="/" hash="work" aria-label="Back to selected work" title="Back to selected work"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div className="min-w-0 flex-1"><h1 className="text-lg font-semibold md:text-2xl">Kissan Agri Mall</h1><p className="font-mono text-xs text-muted-foreground">Case study · Shanmukha Sai</p></div>
          <Button onClick={() => setZoomed(!zoomed)} aria-label={zoomed ? "Fit case study to screen" : "Enlarge case study"} title={zoomed ? "Fit to screen" : "Enlarge case study"} aria-pressed={zoomed} className="press size-11 shrink-0 border border-border bg-surface/70 hover:bg-surface">{zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}</Button>
        </div>
      </header>
      <div className="overflow-x-auto" tabIndex={0} aria-label="Case study pages">
        <div className={zoomed ? "mx-auto w-[1800px]" : "mx-auto w-full max-w-[1440px]"}>
          {kissanPages.map((page, index) => (
            <Fragment key={page.title}>
            {index === kissanPages.length - 1 && <section aria-labelledby="product-status-title" className="mx-auto w-full max-w-[932px] px-4 pt-8 md:pt-12">
              <div className="mb-6 flex justify-center">
                <Button asChild className="glass glass-hover press rounded-full px-4 py-2 text-foreground"><a href={kissan.website.url} target="_blank" rel="noopener noreferrer"><Globe className="size-5" />{kissan.website.label}</a></Button>
              </div>
              <div className="rounded-lg bg-surface/70 p-4 md:p-6">
                <h2 id="product-status-title" className="flex items-center gap-2 text-lg font-semibold md:text-xl"><Info aria-hidden="true" className="size-5 shrink-0" />Product Status</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{kissan.status}</p>
              </div>
            </section>}
            {index === kissanPages.length - 1 ? <section aria-label={page.title} className="mx-auto w-full max-w-[932px] px-4 pt-6">
              <div className="rounded-lg bg-surface/70 p-4 md:p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold md:text-xl"><Smile aria-hidden="true" className="size-5 shrink-0" />What I worked to solve</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">I worked on bringing agricultural commerce and operational workflows together into a connected digital experience. My focus was on understanding different user needs, simplifying complex journeys, making information easier to navigate, and creating consistency across platforms.</p>
              </div>
              <div className="mt-6 rounded-lg bg-surface/70 p-4 md:p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold md:text-xl"><Lock aria-hidden="true" className="size-5 shrink-0" />A note on this project</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">Due to an NDA, certain product details, business information, and final design screens cannot be publicly shared. This case study showcases selected aspects of my UX process while respecting project confidentiality.</p>
              </div>
              <div className="mt-16 flex flex-col items-center gap-8 md:mt-24">
                <p className="glass heading-mono flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm sm:gap-3 sm:px-8 sm:py-3 sm:text-lg">Thanks for stopping by.<img src={glassOfWater.url} alt="" className="h-6 w-auto shrink-0 sm:h-9" /></p>
                <img src={signature.url} alt="Signature of Shanmukha Sai" className="h-12 w-[284px] max-w-full object-contain opacity-90" />
              </div>
            </section> : <section aria-label={page.title}>
              <h2 className="sr-only">{page.title}</h2>
              <p className="sr-only">{page.description}</p>
              <div className={page.narrow ? `mx-auto w-full px-4 ${page.compact ? "max-w-[640px]" : "max-w-[900px]"}` : undefined}>
                <img src={page.asset.url} alt={`${page.title}: ${page.description}`} width={1800} height={1200} loading={index === 0 ? "eager" : "lazy"} className="block h-auto w-full" />
              </div>
            </section>}
            </Fragment>
          ))}
        </div>
      </div>
      <footer className="mx-auto flex max-w-6xl justify-center px-6 py-12">
        <Button asChild className="glass glass-hover press px-6 py-3"><Link to="/" hash="work"><ArrowLeft className="size-4" />Back to selected work</Link></Button>
      </footer>
    </main>
  );
}