import { Card, Chip } from "@heroui/react";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";

import type { LivePage } from "../content/schema";

export default function LivePagesGrid({ pages }: { pages: LivePage[] }) {
  return (
    <div className="live-pages-grid">
      {pages.map((page, index) => (
        <Card
          key={page.id}
          className={`live-page-card accent-${page.accent}`}
          variant="default"
        >
          <Card.Header>
            <span className="project-index">0{index + 1}</span>
            <ExternalLink size={18} aria-hidden="true" />
          </Card.Header>
          <Card.Content>
            <p className="eyebrow">Live project</p>
            <h2>{page.title}</h2>
            <p className="page-tagline">{page.tagline}</p>
            <p>{page.description}</p>
            <div className="chip-row">
              {page.tags.map((tag) => (
                <Chip key={tag} size="sm" variant="soft">
                  {tag}
                </Chip>
              ))}
            </div>
          </Card.Content>
          <Card.Footer className="page-actions">
            <a
              className="action action-primary"
              href={page.url}
              target="_blank"
              rel="noreferrer"
            >
              Open live page <ArrowUpRight size={15} />
            </a>
            <a
              className="action action-secondary"
              href={page.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={15} /> Source
            </a>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}
