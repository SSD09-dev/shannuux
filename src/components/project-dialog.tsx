import * as Dialog from "@radix-ui/react-dialog";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Project = { title: string; desc: string; img: string; tags: string[] };

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
            <Dialog.Description className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{project.desc}</Dialog.Description>
            <img src={project.img} alt={`${project.title} project preview`} className="mt-6 w-full rounded-lg" />
            <div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-border bg-surface/70 px-3 py-1.5 text-sm">{tag}</span>)}</div>
            <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><Lock className="mt-0.5 size-4 shrink-0" />Covered by a non-disclosure agreement. Only design work I'm permitted to showcase is shared.</p>
          </>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}