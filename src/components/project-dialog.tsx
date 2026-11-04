import * as Dialog from "@radix-ui/react-dialog";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mediktoDetail from "@/assets/project-detail-20.jpg.asset.json";
import kanchiraDetail from "@/assets/project-detail-21.jpg.asset.json";
import dfsDetail from "@/assets/project-detail-22.jpg.asset.json";

type Project = { title: string; desc: string; img: string; tags: string[] };
const details: Record<string, { image: string; description: string }> = {
  Medikto: { image: mediktoDetail.url, description: "A digital health experience designed to help people organize their medical records and manage medication reminders in one place." },
  Kanchira: { image: kanchiraDetail.url, description: "Kanchira is a family fashion shopping experience designed to make discovering and shopping for clothing easier, with collections for women, men, and children." },
  "DFS Loan": { image: dfsDetail.url, description: "A digital lending experience focused on making the loan application journey easier to navigate through clear steps, accessible information and thoughtful form design." },
};

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
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
            <img src={details[project.title]?.image ?? project.img} alt={`${project.title} detailed design screens`} className="mt-6 w-full rounded-lg" />
            <div className="mt-6 rounded-lg bg-surface/70 p-4"><h3 className="flex items-center gap-2 font-semibold"><Lock className="size-4" />A note on this project</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This project is covered by a non-disclosure agreement. I've shared only the design work I'm permitted to showcase, while respecting confidential information.</p></div>
          </>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}