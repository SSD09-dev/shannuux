<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep full project case studies in dedicated TanStack routes; use accessible Radix dialogs for NDA project previews so navigation and focus behavior stay predictable.
- Render original case-study pages through CDN asset pointers with accessible descriptions and zoom controls to retain source typography, diagrams, and layouts.
- Split uploaded preview PDF sheets only at empty gaps between complete screens and render CDN-backed images in adaptive grids with natural aspect ratios, so smaller devices retain every screen without cropping.
- Keep live project destinations and project-specific notes in shared browser-safe data, rendering external actions as accessible links within the existing project dialog.
- Keep Kissan thumbnail status and its case-study website and product-status note in shared browser-safe data so the overview and full case study stay aligned.
- Render replacement composite project frames intact at their natural aspect ratio through CDN pointers, so overlapping artwork is never split or cropped.
