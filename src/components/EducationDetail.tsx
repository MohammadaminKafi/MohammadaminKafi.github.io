import { Accordion, Card, Chip } from "@heroui/react";
import { ChevronDown } from "lucide-react";

import type { Education } from "../content/schema";

type Section = { type: string; [key: string]: unknown };
type Semester = {
  term: string;
  courses: Array<{
    course: string;
    units: number;
    professor?: string;
    score?: number | null;
  }>;
};

export default function EducationDetail({
  education,
}: {
  education: Education;
}) {
  const sections = education.sections as Section[];
  const summary = sections.find((item) => item.type === "summary")?.content as
    string | undefined;
  const semesters = (sections.find((item) => item.type === "semesters")
    ?.items ?? []) as Semester[];
  const publications = (sections.find((item) => item.type === "publications")
    ?.items ?? []) as Array<{
    title: string;
    authors?: string[];
    venue?: string;
    year?: number;
    link?: string;
  }>;
  const awards = (sections.find((item) => item.type === "awards")?.items ??
    []) as Array<{ title: string; org?: string; year?: number }>;

  return (
    <div className="detail-stack">
      {summary && (
        <Card className="detail-card" variant="default">
          <Card.Header>
            <span className="eyebrow">Overview</span>
            <Card.Title>Academic context</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="detail-prose">{summary}</p>
          </Card.Content>
        </Card>
      )}

      {semesters.length > 0 && (
        <section className="detail-section" aria-labelledby="coursework-title">
          <div className="section-intro">
            <p className="eyebrow">Coursework</p>
            <h2 id="coursework-title">Semesters and courses</h2>
            <p>
              Recent terms appear first. Course rows become stacked cards on
              narrow screens.
            </p>
          </div>
          <Accordion
            variant="surface"
            defaultExpandedKeys={new Set([semesters[0].term])}
            className="semester-accordion"
          >
            {semesters.map((semester) => (
              <Accordion.Item key={semester.term} id={semester.term}>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    <span>{semester.term}</span>
                    <span className="semester-summary">
                      {semester.courses.length} courses
                    </span>
                    <Accordion.Indicator>
                      <ChevronDown size={17} />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    <div
                      className="course-table"
                      role="table"
                      aria-label={`${semester.term} courses`}
                    >
                      <div className="course-row course-head" role="row">
                        <span role="columnheader">Course</span>
                        <span role="columnheader">Professor</span>
                        <span role="columnheader">Units</span>
                        <span role="columnheader">Score</span>
                      </div>
                      {semester.courses.map((course) => (
                        <div
                          className="course-row"
                          role="row"
                          key={`${semester.term}-${course.course}`}
                        >
                          <strong role="cell">{course.course}</strong>
                          <span role="cell" data-label="Professor">
                            {course.professor || "—"}
                          </span>
                          <span role="cell" data-label="Units">
                            {course.units}
                          </span>
                          <span role="cell" data-label="Score">
                            {course.score ?? "In progress"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </section>
      )}

      {publications.length > 0 && (
        <section className="detail-section">
          <div className="section-intro">
            <p className="eyebrow">Publications</p>
            <h2>Published work</h2>
          </div>
          <div className="project-grid">
            {publications.map((item) => (
              <Card key={item.title} className="project-card" variant="default">
                <Card.Content>
                  <h3>{item.title}</h3>
                  <p>
                    {item.authors?.join(", ")}
                    {item.venue ? ` · ${item.venue}` : ""}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                  {item.link && (
                    <a
                      className="text-link"
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read publication
                    </a>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {awards.length > 0 && (
        <section className="detail-section">
          <div className="section-intro">
            <p className="eyebrow">Recognition</p>
            <h2>Awards and honors</h2>
          </div>
          <div className="chip-row">
            {awards.map((item) => (
              <Chip key={item.title} variant="secondary">
                {item.title}
                {item.year ? ` · ${item.year}` : ""}
              </Chip>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
