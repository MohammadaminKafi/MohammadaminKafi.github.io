import { Card, Chip } from "@heroui/react";
import { Check, Layers3 } from "lucide-react";

import type { Experience } from "../content/schema";

type Section = { type: string; [key: string]: unknown };
type Skillset = {
  name: string;
  description?: string;
  skills?: Array<{
    name: string;
    description?: string;
    subskills?: Array<{ name: string; description?: string }>;
  }>;
};

export default function ExperienceDetail({
  experience,
}: {
  experience: Experience;
}) {
  const sections = experience.sections as Section[];
  const summary = sections.find((item) => item.type === "summary")?.content as
    string | undefined;
  const responsibilities = sections.find(
    (item) => item.type === "responsibilities",
  )?.items as string[] | undefined;
  const achievements = sections.find((item) => item.type === "achievements")
    ?.items as string[] | undefined;
  const skillsets = (sections.find((item) => item.type === "skills-tree")
    ?.skillsets ?? []) as Skillset[];
  const projects = sections.find((item) => item.type === "projects")?.items as
    | Array<{ title: string; description?: string; technologies?: string[] }>
    | undefined;

  return (
    <div className="detail-stack">
      {summary && (
        <Card className="detail-card" variant="default">
          <Card.Header>
            <span className="eyebrow">Overview</span>
            <Card.Title>About the role</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="detail-prose">{summary}</p>
          </Card.Content>
        </Card>
      )}

      {responsibilities?.length ? (
        <Card className="detail-card" variant="default">
          <Card.Header>
            <span className="eyebrow">Scope</span>
            <Card.Title>Responsibilities</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="detail-list">
              {responsibilities.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      ) : null}

      {achievements?.length ? (
        <Card className="detail-card achievement-card" variant="default">
          <Card.Header>
            <span className="eyebrow">Outcomes</span>
            <Card.Title>Selected achievements</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="detail-list">
              {achievements.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      ) : null}

      {skillsets.length > 0 && (
        <section
          className="detail-section"
          aria-labelledby="capabilities-title"
        >
          <div className="section-intro">
            <p className="eyebrow">
              <Layers3 size={14} /> Capabilities
            </p>
            <h2 id="capabilities-title">Skills developed in context</h2>
            <p>
              Grouped in a single readable layer; supporting tools remain
              visible without another expandable tree.
            </p>
          </div>
          <div className="capability-grid">
            {skillsets.map((set) => (
              <Card
                key={set.name}
                className="capability-card"
                variant="default"
              >
                <Card.Header>
                  <Card.Title>{set.name}</Card.Title>
                  {set.description && (
                    <Card.Description>{set.description}</Card.Description>
                  )}
                </Card.Header>
                <Card.Content className="capability-list">
                  {(set.skills ?? []).map((skill) => (
                    <div key={skill.name} className="capability-group">
                      <h3>{skill.name}</h3>
                      {skill.description && <p>{skill.description}</p>}
                      <div className="chip-row">
                        {(skill.subskills ?? []).map((subskill) => (
                          <Chip key={subskill.name} size="sm" variant="soft">
                            {subskill.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {projects?.length ? (
        <section className="detail-section">
          <div className="section-intro">
            <p className="eyebrow">Applied work</p>
            <h2>Projects from this role</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <Card
                key={project.title}
                className="project-card"
                variant="default"
              >
                <Card.Content>
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                </Card.Content>
                <Card.Footer className="chip-row">
                  {(project.technologies ?? []).map((tech) => (
                    <Chip key={tech} size="sm" variant="secondary">
                      {tech}
                    </Chip>
                  ))}
                </Card.Footer>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
