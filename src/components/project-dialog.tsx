import * as Dialog from "@radix-ui/react-dialog";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import medikto1 from "@/assets/medikto-screen-1.jpg.asset.json";
import medikto2 from "@/assets/medikto-screen-2.jpg.asset.json";
import medikto3 from "@/assets/medikto-screen-3.jpg.asset.json";
import medikto4 from "@/assets/medikto-screen-4.jpg.asset.json";
import kanchira1 from "@/assets/kanchira-screen-1.jpg.asset.json";
import kanchira2 from "@/assets/kanchira-screen-2.jpg.asset.json";
import kanchira3 from "@/assets/kanchira-screen-3.jpg.asset.json";
import dfs1 from "@/assets/dfs-screen-1.jpg.asset.json";
import dfs2 from "@/assets/dfs-screen-2.jpg.asset.json";
import dfs3 from "@/assets/dfs-screen-3.jpg.asset.json";
import dfs4 from "@/assets/dfs-screen-4.jpg.asset.json";
import dfs5 from "@/assets/dfs-screen-5.jpg.asset.json";
import dfs6 from "@/assets/dfs-screen-6.jpg.asset.json";

type Project = { title: string; desc: string; img: string; tags: string[] };
const details: Record<string, { images: { url: string; alt: string; wide?: boolean }[]; layout: string; description: string }> = {
  Medikto: { images: [
    { url: medikto1.url, alt: "Medikto home and health records overview" },
    { url: medikto2.url, alt: "Medikto medical reports library" },
    { url: medikto3.url, alt: "Medikto medication reminders and prescription upload" },
    { url: medikto4.url, alt: "Medikto vitals and reports data" },
  ], layout: "grid-cols-2 lg:grid-cols-4", description: "A digital health experience designed to help people organize their medical records and manage medication reminders in one place." },
  Kanchira: { images: [
    { url: kanchira1.url, alt: "Kanchira storefront and clothing categories" },
    { url: kanchira2.url, alt: "Kanchira search and popular products" },
    { url: kanchira3.url, alt: "Kanchira saree product details and delivery options" },
  ], layout: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", description: "Kanchira is a family fashion shopping experience designed to make discovering and shopping for clothing easier, with collections for women, men, and children." },
  "DFS Loan": { images: [
    { url: dfs1.url, alt: "DFS app launch screen" },
    { url: dfs2.url, alt: "DFS employee and agent role selection" },
    { url: dfs3.url, alt: "DFS agent dashboard and loan application totals" },
    { url: dfs4.url, alt: "DFS pending payment updates" },
    { url: dfs5.url, alt: "DFS payment updated confirmation" },
    { url: dfs6.url, alt: "DFS landscape payment table", wide: true },
  ], layout: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5", description: "A digital lending experience focused on making the loan application journey easier to navigate through clear steps, accessible information and thoughtful form design." },
};

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const detail = project ? details[project.title] : undefined;
  return (
    <Dialog.Root open={project !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md" />
        <Dialog.Content className="glass fixed left-1/2 top-1/2 z-[70] max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl p-5 md:p-8">
          {project && <>
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-2xl font-semibold md:text-4xl">{project.title}</Dialog.Title>
              <Dialog.Close asChild><Button aria-label="Close project" title="Close project" className="size-10 shrink-0 border border-border bg-surface/70 hover:bg-surface"><X className="size-5" /></Button></Dialog.Close>
            </div>
            <Dialog.Description className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{details[project.title]?.description ?? project.desc}</Dialog.Description>
            <div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-border bg-surface/70 px-3 py-1.5 text-sm">{tag}</span>)}</div>
            {detail ? (
              <div className={`mt-6 grid items-start gap-3 sm:gap-4 ${detail.layout}`}>
                {detail.images.map((image) => (
                  <img key={image.url} src={image.url} alt={image.alt} decoding="async" className={`block h-auto w-full min-w-0 object-contain ${image.wide ? "col-span-full mx-auto max-w-2xl" : ""}`} />
                ))}
              </div>
            ) : <img src={project.img} alt={`${project.title} detailed design screens`} className="mt-6 block h-auto w-full object-contain" />}
            <div className="mt-6 rounded-lg bg-surface/70 p-4"><h3 className="flex items-center gap-2 font-semibold"><Lock className="size-4" />A note on this project</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This project is covered by a non-disclosure agreement. I've shared only the design work I'm permitted to showcase, while respecting confidential information.</p></div>
          </>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}