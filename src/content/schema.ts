import { z } from "zod";

export const modeIds = ["balanced", "job", "academic"] as const;
export const sectionIds = [
  "overview",
  "experience",
  "projects",
  "education",
  "teaching",
  "skills",
] as const;

const nonEmpty = z.string().trim().min(1);
const externalUrl = z
  .url()
  .refine((value) => value.startsWith("https://"), "URL must use HTTPS");
const localAsset = nonEmpty.refine(
  (value) => value.startsWith("/"),
  "Asset paths must start with /",
);

export const ModeSchema = z.object({
  id: z.enum(modeIds),
  label: nonEmpty,
  eyebrow: nonEmpty,
  headline: nonEmpty,
  summary: nonEmpty,
  defaultSection: z.enum(sectionIds),
  sections: z.array(z.enum(sectionIds)).min(1),
});

export const PersonalSchema = z.object({
  name: nonEmpty,
  title: nonEmpty,
  photo: localAsset,
  gmail: z.email(),
  academic: z.email(),
  linkedin: externalUrl,
  github: externalUrl,
  teams: externalUrl.optional(),
  telegram: externalUrl.optional(),
  resume: localAsset,
  summary: nonEmpty,
});

const ExperienceHeaderSchema = z.object({
  title: nonEmpty,
  company: nonEmpty,
  period: nonEmpty,
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  location: z.string().optional(),
  type: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: nonEmpty.regex(/^[a-z0-9-]+$/),
  slug: nonEmpty.regex(/^[a-z0-9-]+$/),
  header: ExperienceHeaderSchema,
  sections: z.array(z.looseObject({ type: nonEmpty })).min(1),
});

const EducationHeaderSchema = z.object({
  title: nonEmpty,
  org: nonEmpty,
  period: nonEmpty,
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  degree: z.string().optional(),
  minor: z.string().optional(),
  gpaOverall: z.number().optional(),
});

export const EducationSchema = z.object({
  id: nonEmpty.regex(/^[a-z0-9-]+$/),
  slug: nonEmpty.regex(/^[a-z0-9-]+$/),
  header: EducationHeaderSchema,
  sections: z.array(z.looseObject({ type: nonEmpty })).min(1),
});

export const LivePageSchema = z.object({
  id: nonEmpty.regex(/^[a-z0-9-]+$/),
  title: nonEmpty,
  tagline: nonEmpty,
  description: nonEmpty,
  url: externalUrl,
  sourceUrl: externalUrl,
  tags: z.array(nonEmpty).min(1),
  accent: z.enum(["green", "cyan", "violet"]),
});

export const ResumeSchema = z.object({
  id: nonEmpty.regex(/^[a-z0-9-]+$/),
  label: nonEmpty,
  file: localAsset.refine(
    (value) => value.toLowerCase().endsWith(".pdf"),
    "Resume must be a PDF",
  ),
  published: z.iso.date(),
  notes: z.string().optional(),
  current: z.boolean(),
});

export const GalleryItemSchema = z.object({
  id: nonEmpty.regex(/^[a-z0-9-]+$/),
  src: localAsset,
  caption: nonEmpty,
  alt: nonEmpty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  generated: z.boolean(),
});

export const ProjectSchema = z.object({
  topic: nonEmpty,
  time: z.string().optional(),
  tags: z.array(nonEmpty).default([]),
  description: nonEmpty,
  github: z.union([externalUrl, z.literal("")]).optional(),
  notable: z.boolean().default(false),
  year: z.string().optional(),
});

export const TeachingSchema = z.object({
  course: nonEmpty,
  university: nonEmpty,
  supervisor: z.string().optional(),
  time: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["assistant", "instructor"]),
  notable: z.boolean().default(false),
});

export const ContentSchema = z.object({
  personal: PersonalSchema,
  modes: z.array(ModeSchema).length(3),
  experiences: z.array(ExperienceSchema).min(1),
  education: z.array(EducationSchema).min(1),
  projects: z.array(ProjectSchema),
  teaching: z.array(TeachingSchema),
  pages: z.array(LivePageSchema).min(1),
  resumes: z.array(ResumeSchema).min(1),
  gallery: z.array(GalleryItemSchema),
  softSkills: z.object({
    summary: z.string().optional(),
    items: z.array(z.looseObject({ name: nonEmpty })),
  }),
  hardSkills: z.object({
    summary: z.string().optional(),
    sets: z.array(z.looseObject({ name: nonEmpty })),
  }),
  programmingLanguages: z.array(z.looseObject({ name: nonEmpty })),
  languages: z.object({
    items: z.array(z.looseObject({ name: nonEmpty })),
  }),
  awards: z.object({
    items: z.array(z.looseObject({ title: nonEmpty })),
  }),
  research: z.object({
    items: z.array(z.looseObject({ topic: nonEmpty })),
  }),
});

export type SiteContent = z.infer<typeof ContentSchema>;
export type Mode = z.infer<typeof ModeSchema>;
export type ModeId = (typeof modeIds)[number];
export type SectionId = (typeof sectionIds)[number];
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type LivePage = z.infer<typeof LivePageSchema>;
export type ResumeRecord = z.infer<typeof ResumeSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
