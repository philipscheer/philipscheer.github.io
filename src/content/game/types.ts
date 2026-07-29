export type SkillTree = 'dev' | 'mgmt' | 'biz';

export interface GameSkill {
  id: string;
  name: string;
  tree: SkillTree;
  evidence: string;
}

export interface GameBoss {
  name: string;
  intro: string;
  question: string;
  options: string[];
  correct: number;
  hint: string;
  result: string;
}

export interface GameBadge {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface GameZone {
  id: string;
  year: string;
  company: string;
  role: string;
  miniCv: string[];
  skills: GameSkill[];
  boss?: GameBoss;
  badge?: GameBadge;
}

export interface GameDictionary {
  page: { title: string; intro: string; noscript: string };
  ui: {
    startTitle: string;
    tagline: string;
    howTitle: string;
    how: string[];
    recruiterNote: string;
    startBtn: string;
    openMapBtn: string;
    hudXp: string;
    hudSkills: string;
    hudMap: string;
    hudCv: string;
    bossPrompt: string;
    skillUnlocked: string;
    badgeEarned: string;
    bossChallenge: string;
    wrongTitle: string;
    tryAgain: string;
    victoryTitle: string;
    continueBtn: string;
    closeBtn: string;
    mapTitle: string;
    mapHint: string;
    travelBtn: string;
    cvTitle: string;
    shareBtn: string;
    shareCopied: string;
    trees: Record<SkillTree, string>;
    touchLeft: string;
    touchRight: string;
    touchJump: string;
    touchAction: string;
  };
  final: {
    title: string;
    body: string;
    statsXp: string;
    statsSkills: string;
    statsBadges: string;
    ctaContact: string;
    ctaResume: string;
    ctaLinkedin: string;
    replay: string;
    shareText: string;
  };
  zones: GameZone[];
}
