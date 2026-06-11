export type Locale = 'en' | 'pt';

export interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  context: string;
  challenge: string;
  role: string;
  solution: string;
  stack: string[];
  impact: string[];
  learnings: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface Dictionary {
  locale: Locale;
  meta: Record<'home' | 'recruiters' | 'experience' | 'projects' | 'resume' | 'contact', PageMeta>;
  nav: {
    home: string;
    recruiters: string;
    experience: string;
    projects: string;
    resume: string;
    contact: string;
  };
  home: {
    availability: string;
    headline: string;
    subheadline: string;
    pitch: string;
    targetRolesLabel: string;
    targetRoles: string[];
    metrics: { value: string; label: string }[];
    ctas: { resume: string; contact: string; linkedin: string; cases: string };
    technical: {
      title: string;
      intro: string;
      areas: { title: string; body: string }[];
    };
    recruiterCta: { title: string; body: string; button: string };
  };
  recruiters: {
    title: string;
    intro: string;
    summary: string;
    rolesTitle: string;
    roles: string[];
    workModelTitle: string;
    workModel: string;
    competenciesTitle: string;
    competencies: string[];
    resultsTitle: string;
    results: string[];
    leadershipTitle: string;
    leadership: string;
    downloadCta: string;
    contactCta: string;
  };
  experience: {
    title: string;
    intro: string;
    items: ExperienceItem[];
    educationTitle: string;
    education: string;
    certificationsTitle: string;
    certifications: string;
    languagesTitle: string;
    languages: string;
  };
  projects: {
    title: string;
    intro: string;
    labels: {
      context: string;
      challenge: string;
      role: string;
      solution: string;
      stack: string;
      impact: string;
      learnings: string;
    };
    cases: CaseStudy[];
  };
  resume: {
    title: string;
    intro: string;
    downloadEn: string;
    downloadPt: string;
    highlightsTitle: string;
    highlights: string[];
  };
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    email: string;
    linkedinLabel: string;
    locationLabel: string;
    location: string;
    availabilityLabel: string;
    availability: string;
    note: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
}
