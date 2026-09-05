import { Button, Card, Chip, Tabs } from "@heroui/react";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Contact,
  Download,
  GraduationCap,
  Mail,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { ModeId, SectionId, SiteContent } from "../content/schema";
import {
  hrefWithMode,
  isModeId,
  isSectionId,
  MODE_CHANGE_EVENT,
  MODE_STORAGE_KEY,
  resolveMode,
} from "../lib/mode";

interface Props {
  content: SiteContent;
}

const sectionLabels: Record<SectionId, string> = {
  overview: "Overview",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  teaching: "Teaching",
  skills: "Skills",
};

type GenericSection = { type: string; [key: string]: unknown };
type Project = SiteContent["projects"][number];
type Teaching = SiteContent["teaching"][number];

function summaryFrom(sections: GenericSection[]): string {
  return String(
    sections.find((section) => section.type === "summary")?.content ?? "",
  );
}

export default function ResumeExplorer({ content }: Props) {
  const [mode, setMode] = useState<ModeId>("balanced");
  const [section, setSection] = useState<SectionId>("overview");
  const [desktopLayout, setDesktopLayout] = useState(false);

  useEffect(() => {
    const selectedMode = resolveMode(
      window.location.search,
      localStorage.getItem(MODE_STORAGE_KEY),
    );
    const config =
      content.modes.find((item) => item.id === selectedMode) ??
      content.modes[0];
    const requestedSection = new URLSearchParams(window.location.search).get(
      "section",
    );
    const selectedSection =
      isSectionId(requestedSection) &&
      config.sections.includes(requestedSection)
        ? requestedSection
        : config.defaultSection;
    queueMicrotask(() => {
      setMode(selectedMode);
      setSection(selectedSection);
    });

    const onMode = (event: Event) => {
      const detail = (
        event as CustomEvent<{ mode: ModeId; section?: SectionId }>
      ).detail;
      if (!detail || !isModeId(detail.mode)) return;
      const nextConfig = content.modes.find((item) => item.id === detail.mode);
      if (!nextConfig) return;
      setMode(detail.mode);
      setSection(
        detail.section && nextConfig.sections.includes(detail.section)
          ? detail.section
          : nextConfig.defaultSection,
      );
    };
    window.addEventListener(MODE_CHANGE_EVENT, onMode);
    return () => window.removeEventListener(MODE_CHANGE_EVENT, onMode);
  }, [content.modes]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 981px)");
    const sync = () => setDesktopLayout(query.matches);
    queueMicrotask(sync);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const config =
    content.modes.find((item) => item.id === mode) ?? content.modes[0];
  const currentResume =
    content.resumes.find((item) => item.current) ?? content.resumes[0];

  function changeSection(next: SectionId) {
    setSection(next);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    url.searchParams.set("section", next);
    window.history.pushState({}, "", url);
  }

  return (
    <>
      <section
        className={`profile-hero profile-hero-${mode}`}
        data-art-world={mode}
        aria-labelledby="profile-title"
      >
        <HeroOrnament />
        <div className="profile-photo-wrap">
          <img
            className="profile-photo"
            src={content.personal.photo}
            width={320}
            height={320}
            alt={`Portrait of ${content.personal.name}`}
            fetchPriority="high"
          />
          <span className="profile-status">
            <i /> Open to meaningful work
          </span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={14} aria-hidden="true" /> {config.eyebrow}
          </p>
          <h1 id="profile-title">{config.headline}</h1>
          <p className="hero-name">{content.personal.name}</p>
          <p className="hero-summary">{config.summary}</p>
          <div className="hero-actions">
            <a
              className="action action-primary"
              href={currentResume.file}
              download
            >
              <Download size={17} aria-hidden="true" /> Download resume
            </a>
            <a
              className="action action-secondary"
              href={hrefWithMode("/resume/", mode)}
            >
              Resume history <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <ContactLinks personal={content.personal} />
        </div>
      </section>

      <section className="resume-panel" aria-label="Resume sections">
        <Tabs
          selectedKey={section}
          onSelectionChange={(key) => {
            if (isSectionId(String(key)))
              changeSection(String(key) as SectionId);
          }}
          variant="secondary"
          orientation={
            mode === "job" && desktopLayout ? "vertical" : "horizontal"
          }
          className={`resume-tabs resume-tabs-${mode}`}
        >
          <div
            className="tabs-scroll"
            role="region"
            aria-label="Scrollable resume section tabs"
            tabIndex={0}
          >
            <Tabs.List aria-label={`${config.label} resume sections`}>
              {config.sections.map((id) => (
                <Tabs.Tab key={id} id={id}>
                  {sectionLabels[id]}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </div>

          {config.sections.map((id) => (
            <Tabs.Panel key={id} id={id} className={`tab-panel panel-${id}`}>
              {id === "overview" && <Overview content={content} mode={mode} />}
              {id === "experience" && (
                <ExperienceSection content={content} mode={mode} />
              )}
              {id === "projects" && (
                <ProjectsSection projects={content.projects} mode={mode} />
              )}
              {id === "education" && (
                <EducationSection content={content} mode={mode} />
              )}
              {id === "teaching" && (
                <TeachingSection items={content.teaching} mode={mode} />
              )}
              {id === "skills" && <SkillsSection content={content} />}
            </Tabs.Panel>
          ))}
        </Tabs>
      </section>
    </>
  );
}

function HeroOrnament() {
  return (
    <div className="hero-ornament" aria-hidden="true">
      <div className="hero-ornament-garden">
        <span className="garden-arch-line garden-arch-line-one" />
        <span className="garden-arch-line garden-arch-line-two" />
        <span className="garden-flower garden-flower-one" />
        <span className="garden-flower garden-flower-two" />
      </div>
      <div className="hero-ornament-cathedral">
        <span className="gothic-rib gothic-rib-one" />
        <span className="gothic-rib gothic-rib-two" />
        <span className="gothic-rose" />
      </div>
      <div className="hero-ornament-tomorrow">
        <span className="orbit-ring orbit-ring-one" />
        <span className="orbit-ring orbit-ring-two" />
        <span className="orbit-node orbit-node-one" />
        <span className="orbit-node orbit-node-two" />
        <span className="orbit-index">MK / KNOWLEDGE OBJECT 01</span>
      </div>
    </div>
  );
}

function ContactLinks({ personal }: { personal: SiteContent["personal"] }) {
  const links = [
    { href: `mailto:${personal.gmail}`, label: "Email", icon: Mail },
    { href: personal.linkedin, label: "LinkedIn", icon: Contact },
    { href: personal.github, label: "GitHub", icon: Code2 },
  ];
  return (
    <div className="contact-row" aria-label="Contact links">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          <Icon size={15} aria-hidden="true" /> {label}
        </a>
      ))}
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Overview({ content, mode }: Props & { mode: ModeId }) {
  const featuredProject =
    content.projects.find((item) => item.notable) ?? content.projects[0];
  const currentRole = content.experiences[0];
  return (
    <div className="section-stack">
      <SectionIntro
        eyebrow="At a glance"
        title="A connected engineering profile"
        text={content.personal.summary}
      />
      <div className="highlight-grid">
        <Card className="feature-card" variant="default">
          <Card.Header>
            <BriefcaseBusiness size={18} />
            <span>Current focus</span>
          </Card.Header>
          <Card.Content>
            <h3>{currentRole.header.title}</h3>
            <p>{currentRole.header.company}</p>
          </Card.Content>
          <Card.Footer>
            <a href={hrefWithMode(`/jobs/${currentRole.slug}/`, mode)}>
              Explore experience <ArrowUpRight size={14} />
            </a>
          </Card.Footer>
        </Card>
        <Card className="feature-card" variant="default">
          <Card.Header>
            <Sparkles size={18} />
            <span>Featured project</span>
          </Card.Header>
          <Card.Content>
            <h3>{featuredProject.topic}</h3>
            <p>{featuredProject.description}</p>
          </Card.Content>
        </Card>
        <Card className="feature-card" variant="default">
          <Card.Header>
            <BookOpen size={18} />
            <span>Knowledge sharing</span>
          </Card.Header>
          <Card.Content>
            <h3>{content.teaching.length} teaching roles</h3>
            <p>
              Assistantships and instruction across programming, AI,
              architecture, and engineering courses.
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

function ExperienceSection({ content, mode }: Props & { mode: ModeId }) {
  const initialCount = mode === "job" ? 4 : mode === "academic" ? 2 : 3;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll
    ? content.experiences
    : content.experiences.slice(0, initialCount);
  return (
    <div className="section-stack">
      <SectionIntro
        eyebrow="Work"
        title="Experience built across disciplines"
        text="Roles are presented around the systems, responsibilities, and capabilities developed—not an artificial hierarchy of nested skills."
      />
      <div className="timeline-list">
        {visible.map((item) => (
          <article className="timeline-item" key={item.slug}>
            <div className="timeline-date">{item.header.period}</div>
            <div className="timeline-content">
              <span className="timeline-dot" aria-hidden="true" />
              <h3>
                <a href={hrefWithMode(`/jobs/${item.slug}/`, mode)}>
                  {item.header.title}
                </a>
              </h3>
              <p className="timeline-meta">
                {item.header.company}
                {item.header.location ? ` · ${item.header.location}` : ""}
              </p>
              <p>{summaryFrom(item.sections as GenericSection[])}</p>
              <a
                className="text-link"
                href={hrefWithMode(`/jobs/${item.slug}/`, mode)}
              >
                View role details <ArrowUpRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
      {!showAll && content.experiences.length > initialCount && (
        <Button variant="outline" onPress={() => setShowAll(true)}>
          Show all experience
        </Button>
      )}
    </div>
  );
}

function ProjectsSection({
  projects,
  mode,
}: {
  projects: Project[];
  mode: ModeId;
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const ordered = useMemo(
    () => [...projects].sort((a, b) => Number(b.notable) - Number(a.notable)),
    [projects],
  );
  const filtered = ordered.filter((item) => {
    const text =
      `${item.topic} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });
  const initialCount = mode === "job" ? 8 : 6;
  const visible = showAll || query ? filtered : filtered.slice(0, initialCount);
  return (
    <div className="section-stack">
      <SectionIntro
        eyebrow="Selected work"
        title="Projects with range and depth"
        text="A curated first pass keeps the strongest work scannable; search still reaches the complete project history."
      />
      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search projects</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by project, technology, or field"
        />
      </label>
      <div className="project-grid">
        {visible.map((project) => (
          <ProjectCard key={project.topic} project={project} />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="empty-state">No projects match that search.</p>
      )}
      {!showAll && !query && filtered.length > initialCount && (
        <Button variant="outline" onPress={() => setShowAll(true)}>
          Show all {filtered.length} projects
        </Button>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="project-card" variant="default">
      <Card.Header>
        <div>
          {project.notable && (
            <Chip size="sm" variant="soft">
              Featured
            </Chip>
          )}
        </div>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.topic} source on GitHub`}
          >
            <Code2 size={17} />
          </a>
        )}
      </Card.Header>
      <Card.Content>
        <h3>{project.topic}</h3>
        <p>{project.description}</p>
      </Card.Content>
      <Card.Footer className="chip-row">
        {project.tags.map((tag) => (
          <Chip key={tag} size="sm" variant="secondary">
            {tag}
          </Chip>
        ))}
      </Card.Footer>
    </Card>
  );
}

function EducationSection({ content, mode }: Props & { mode: ModeId }) {
  return (
    <div className="section-stack">
      <SectionIntro
        eyebrow="Education"
        title="Foundations with practical reach"
        text="Coursework and academic detail stay available without overwhelming the first scan."
      />
      <div className="education-grid">
        {content.education.map((item) => (
          <Card key={item.slug} className="education-card" variant="default">
            <Card.Header>
              <GraduationCap size={19} />
              <span>{item.header.period}</span>
            </Card.Header>
            <Card.Content>
              <h3>{item.header.title}</h3>
              <p>{item.header.org}</p>
              {item.header.minor && (
                <p className="detail-line">Minor: {item.header.minor}</p>
              )}
              {item.header.gpaOverall !== undefined && (
                <p className="detail-line">GPA: {item.header.gpaOverall}/20</p>
              )}
            </Card.Content>
            <Card.Footer>
              <a href={hrefWithMode(`/education/${item.slug}/`, mode)}>
                View academic details <ArrowUpRight size={14} />
              </a>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeachingSection({ items, mode }: { items: Teaching[]; mode: ModeId }) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const limit = mode === "academic" ? 10 : 6;
  const filtered = items.filter((item) =>
    `${item.course} ${item.university} ${item.supervisor ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const visible = showAll || query ? filtered : filtered.slice(0, limit);
  return (
    <div className="section-stack">
      <SectionIntro
        eyebrow="Teaching"
        title="Learning reinforced through teaching"
        text="Assistantships and instruction are grouped clearly, with search for the full history instead of a dense wall of filters."
      />
      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search teaching experience</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses, universities, or supervisors"
        />
      </label>
      <div className="teaching-grid">
        {visible.map((item, index) => (
          <article
            className="teaching-card"
            key={`${item.course}-${item.time}-${index}`}
          >
            <div className="teaching-card-top">
              <Chip size="sm" variant="soft">
                {item.category === "instructor"
                  ? "Instructor"
                  : "Teaching assistant"}
              </Chip>
              <span>{item.time}</span>
            </div>
            <h3>{item.course}</h3>
            <p>
              {item.university}
              {item.supervisor ? ` · ${item.supervisor}` : ""}
            </p>
            {item.description && (
              <p className="teaching-description">{item.description}</p>
            )}
          </article>
        ))}
      </div>
      {!showAll && !query && filtered.length > limit && (
        <Button variant="outline" onPress={() => setShowAll(true)}>
          Show all {filtered.length} teaching roles
        </Button>
      )}
    </div>
  );
}

function SkillsSection({ content }: Props) {
  const hardSets = content.hardSkills.sets as Array<{
    name: string;
    subskills?: Array<{ name: string; subskills?: Array<{ name: string }> }>;
  }>;
  return (
    <div className="section-stack">
      <SectionIntro
        eyebrow="Capabilities"
        title="Skills grouped by evidence, not percentages"
        text="The rewrite removes arbitrary proficiency bars and presents technologies in readable, maintainable groups."
      />
      <div className="skills-layout">
        <section className="skill-block">
          <h3>Programming languages</h3>
          <div className="chip-row">
            {content.programmingLanguages.map((item) => (
              <Chip key={item.name} variant="secondary">
                {item.name}
              </Chip>
            ))}
          </div>
        </section>
        <section className="skill-block">
          <h3>Ways of working</h3>
          <div className="chip-row">
            {content.softSkills.items.map((item) => (
              <Chip key={item.name} variant="secondary">
                {item.name}
              </Chip>
            ))}
          </div>
        </section>
        {hardSets.map((set) => (
          <section className="skill-block skill-block-wide" key={set.name}>
            <h3>{set.name}</h3>
            <div className="skill-groups">
              {(set.subskills ?? []).map((group) => (
                <div key={group.name}>
                  <h4>{group.name}</h4>
                  <div className="chip-row">
                    {(group.subskills ?? []).map((skill) => (
                      <Chip key={skill.name} size="sm" variant="soft">
                        {skill.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className="skill-block">
          <h3>Languages</h3>
          <div className="language-list">
            {content.languages.items.map((item) => (
              <span key={item.name}>
                {item.name}
                {"note" in item && item.note ? ` · ${item.note}` : ""}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
