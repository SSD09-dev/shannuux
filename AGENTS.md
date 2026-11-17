<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

<!-- AGENT-MEMORY:BEGIN -->
- Keep full project case studies in dedicated TanStack routes; use accessible Radix dialogs for NDA project previews so navigation and focus behavior stay predictable.
- Render original case-study pages through CDN asset pointers with accessible descriptions and zoom controls to retain source typography, diagrams, and layouts.
- Split uploaded preview PDF sheets only at empty gaps between complete screens and render CDN-backed images in adaptive grids with natural aspect ratios, so smaller devices retain every screen without cropping.
- Keep live project destinations and project-specific notes in shared browser-safe data, rendering external actions as accessible links within the existing project dialog.
- Keep Kissan thumbnail status and its case-study website and product-status note in shared browser-safe data so the overview and full case study stay aligned.
- Render Kissan's closing notes as accessible text preserving the original slide wording, with matching note widths and natural heights so they remain readable on phones.
- Render replacement composite project frames intact at their natural aspect ratio through CDN pointers, so overlapping artwork is never split or cropped.
- Interactive glow lives in styles.css utilities (glow-spot, glass-hover, press, glow-link, dock-link) gated by hover/pointer media queries, fed by one delegated rAF pointer listener and a touch-only IntersectionObserver in src/hooks/use-interactive-glow.ts; lift/press use the individual `translate`/`scale` properties so they compose without overriding each other. Never put glow-spot on fixed-position elements (it sets position: relative).
- Active dock icons must use knockout fill SVGs (src/components/dock-icons.tsx), never `fill` on outline icons, so inner details stay visible.
- The site-wide starfield is one canvas (src/components/cosmic-starfield.tsx) mounted in __root with tunable rules in src/lib/starfield.ts; page wrappers must stay transparent (body supplies the background) or they hide the -z-10 star canvas; shooting stars use a second z-30 canvas (below dock/header/dialogs) so they show through glass content.
<!-- AGENT-MEMORY:END -->
