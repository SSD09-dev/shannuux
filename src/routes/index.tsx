import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, Heart, Smile, Globe, Lock, ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/project-dialog";

import portraitHero from "@/assets/portrait-hero.jpg";
import portraitAbout from "@/assets/portrait-about.jpg";
import workKissan from "@/assets/work-kissan.jpg";
import workMedikto from "@/assets/work-medikto.jpg";
import workKanchira from "@/assets/work-kanchira.jpg";
import workDfs from "@/assets/work-dfs.jpg";
import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";
import book4 from "@/assets/book-4.jpg";
import book5 from "@/assets/book-5.jpg";
import book6 from "@/assets/book-6.jpg";
import sketch1 from "@/assets/sketch-1.jpg";
import sketch2 from "@/assets/sketch-2.jpg";
import sketch3 from "@/assets/sketch-3.jpg";
import sketch4 from "@/assets/sketch-4.jpg";
import sketch5 from "@/assets/sketch-5.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shanmukha Sai — Product Designer" },
      {
        name: "description",
        content: "Portfolio of Shanmukha Sai, a product designer with three years of experience in B2B, B2C and enterprise UX.",
      },
      { property: "og:title", content: "Shanmukha Sai — Product Designer" },
      {
        property: "og:description",
        content: "Selected work: Kissan Agri Mall, Medikto, Kanchira and DFS Loan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const works = [
  {
    title: "Kissan Agri Mall",
    desc: "A connected digital ecosystem helping farmers shop for agricultural products while enabling teams to manage retail operations and field activities.",
    img: workKissan,
    tags: ["CRM", "B2C", "B2B", "E-commerce", "Dashboard", "Role-Based UX"],
    nda: false,
  },
  {
    title: "Medikto",
    desc: "A digital health document experience designed to help people organize and access their medical records in one place.",
    img: workMedikto,
    tags: ["B2C", "Health Tech", "Medication Reminder", "Digital Health Records"],
    nda: true,
  },
  {
    title: "Kanchira",
    desc: "A fashion shopping experience designed to present collections clearly and make product discovery and browsing feel effortless.",
    img: workKanchira,
    tags: ["B2C", "E-commerce", "Fashion", "Product Discovery"],
    nda: true,
  },
  {
    title: "DFS Loan",
    desc: "A digital loan experience focused on simplifying application steps and helping users navigate the borrowing journey with greater clarity.",
    img: workDfs,
    tags: ["Web & Mobile", "Loan Application", "Digital Lending", "FinTech"],
    nda: true,
  },
];

const books = [book1, book2, book3, book4, book5, book6];
const sketches = [sketch1, sketch2, sketch3, sketch4, sketch5];

const nav = [
  { id: "home", icon: Home, label: "Home" },
  { id: "work", icon: Heart, label: "Selected work" },
  { id: "about", icon: Smile, label: "About" },
  { id: "contact", icon: Globe, label: "Contact" },
];

function SideNav() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <nav
      aria-label="Sections"
      className="glass fixed z-50 flex gap-3 rounded-full p-2 max-md:bottom-4 max-md:left-1/2 max-md:-translate-x-1/2 md:left-6 md:top-1/2 md:-translate-y-1/2 md:flex-col"
    >
      {nav.map(({ id, icon: Icon, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          title={label}
          className={`grid size-11 place-items-center rounded-full border border-border transition-all duration-300 hover:scale-105 hover:bg-surface ${
            active === id ? "bg-surface text-foreground" : "bg-card/60 text-muted-foreground"
          }`}
        >
          <Icon className="size-5" fill={active === id ? "currentColor" : "none"} strokeWidth={1.75} />
        </a>
      ))}
    </nav>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="glass-hover rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-sm text-foreground">
      {children}
    </span>
  );
}

function Index() {
  const [selectedProject, setSelectedProject] = useState<(typeof works)[number] | null>(null);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SideNav />
      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
      <main className="mx-auto max-w-6xl px-6 pb-32 md:pl-28">
        {/* Intro */}
        <section id="home" className="flex min-h-screen items-center py-16">
          <div className="panel grid w-full overflow-hidden rounded-[2.5rem] md:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
              <p className="font-script text-3xl md:text-4xl">Hello, I'm</p>
              <h1 className="font-display mt-2 text-5xl tracking-wide italic md:text-7xl">SHANMUKHA SAI</h1>
              <p className="mt-4 text-lg text-muted-foreground">Product Designer with three years of experience.</p>
            </div>
            <img
              src={portraitHero}
              alt="Portrait of Shanmukha Sai"
              className="h-full max-h-[32rem] w-full object-cover grayscale"
            />
          </div>
        </section>

        {/* Work */}
        <section id="work" className="py-16">
          <h2 className="heading-mono text-4xl md:text-6xl">Selected Work</h2>
          <div className="mt-16 space-y-20">
            {works.map((w) => (
              <article key={w.title} className="grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    {w.nda ? <Button onClick={() => setSelectedProject(w)} className="text-left text-3xl font-semibold hover:text-muted-foreground md:text-4xl">{w.title}</Button> : <Link to="/work/kissan-agri-mall" className="rounded-md transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{w.title}</Link>}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{w.desc}</p>
                </div>
                <div className="glass glass-hover group rounded-[2rem] p-4">
                  {w.nda ? <Button onClick={() => setSelectedProject(w)} aria-label={`View ${w.title} project`} className="block w-full overflow-hidden rounded-2xl">
                    <img
                      src={w.img}
                      alt={`${w.title} project preview`}
                      loading="lazy"
                      className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </Button> : <Link to="/work/kissan-agri-mall" aria-label="View Kissan Agri Mall case study" className="block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><img src={w.img} alt={`${w.title} project preview`} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-[1.03]" /></Link>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {w.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-16">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="heading-mono text-4xl md:text-6xl">About</h2>
              <div className="mt-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  I enjoy observing the little things around me, exploring new ideas, and learning from everyday
                  experiences. I love sketching and drawing, and often find inspiration in things that might seem
                  ordinary to others.
                </p>
                <p>
                  Over the past three years, I've grown as a Product Designer, but I'm still curious, still learning,
                  and always finding new ways to look at the world.
                </p>
              </div>
              <h3 className="mt-10 text-2xl font-semibold tracking-tight">Experience</h3>
              <ul className="mt-4 space-y-3 text-lg">
                <li>Hyde Studio (Product Designer) · 2026–Present</li>
                <li>VBLP Tech Solutions (UI/UX Lead) · 2025–2026</li>
                <li>Xiga Design Studio (UX Designer) · Freelance · 2024</li>
              </ul>
            </div>
            <div className="glass glass-hover self-center overflow-hidden rounded-[2rem] p-2">
              <img src={portraitAbout} alt="Shanmukha Sai" loading="lazy" className="w-full rounded-[1.6rem] grayscale" />
            </div>
          </div>

          <h2 className="heading-mono mt-28 text-4xl md:text-6xl">Things I Love</h2>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight">Books That Shaped Me</h3>
          <div className="mt-6 grid grid-cols-3 gap-4 md:grid-cols-6">
            {books.map((b, i) => (
              <img
                key={i}
                src={b}
                alt="Book cover"
                loading="lazy"
                className="aspect-[2/3] w-full rounded-md object-cover shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:rotate-[-2deg]"
              />
            ))}
          </div>

          <h3 className="mt-16 text-2xl font-semibold tracking-tight">The Way I See Things</h3>
          <div className="mt-6 flex flex-wrap items-end gap-4">
            {sketches.map((s, i) => (
              <div key={i} className="glass glass-hover rounded-xl p-2">
                <img src={s} alt="Pencil sketch by Shanmukha" loading="lazy" className="h-48 w-auto rounded-lg md:h-56" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16">
          <h2 className="heading-mono text-4xl md:text-6xl">Contact</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Email", value: "shannuux@gmail.com", href: "mailto:shannuux@gmail.com", icon: Mail },
              { label: "LinkedIn", value: "Connect", href: "https://www.linkedin.com", icon: ArrowUpRight },
              { label: "Behance", value: "View projects", href: "https://www.behance.net", icon: ArrowUpRight },
            ].map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="glass glass-hover flex items-center justify-between rounded-2xl p-6"
              >
                <span>
                  <span className="heading-mono block text-lg">{label}</span>
                  <span className="mt-1 block text-muted-foreground">{value}</span>
                </span>
                <Icon className="size-5" />
              </a>
            ))}
          </div>
          <div className="mt-24 flex flex-col items-center gap-8">
            <p className="glass heading-mono rounded-full px-8 py-4 text-lg">Thanks for stopping by. 🥤</p>
            <img
              src={signature.url}
              alt="Signature of Shanmukha Sai"
              className="h-12 w-[284px] object-contain opacity-90"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
