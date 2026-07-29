import { gameEn } from './en';
import { gamePt } from './pt';
import type { GameDictionary } from './types';

const gameDictionaries: Record<'en' | 'pt', GameDictionary> = {
  en: gameEn,
  pt: gamePt,
};

export function getGameDictionary(locale: string): GameDictionary {
  return gameDictionaries[locale === 'pt' ? 'pt' : 'en'];
}

/** Visual palette per zone (index-aligned with GameDictionary.zones). Not localized. */
export interface ZonePalette {
  skyTop: string;
  skyBottom: string;
  ground: string;
  groundTop: string;
  building: string;
}

export const zonePalettes: ZonePalette[] = [
  // 0 school — early morning, chalkboard green
  { skyTop: '#ffd9a0', skyBottom: '#fff3d9', ground: '#7c8a4d', groundTop: '#93a45e', building: '#b08968' },
  // 1 datatex — bright web-agency day
  { skyTop: '#8ecae6', skyBottom: '#e0f4ff', ground: '#6f8f5a', groundTop: '#84a86c', building: '#5e7ea0' },
  // 2 brpart/synchro — corporate gray-blue
  { skyTop: '#a3b6c9', skyBottom: '#e8eef4', ground: '#66788a', groundTop: '#7b8fa3', building: '#48607a' },
  // 3 it convergence — late afternoon consulting
  { skyTop: '#f4a261', skyBottom: '#ffe8d6', ground: '#8a6f4d', groundTop: '#a2855e', building: '#7a5236' },
  // 4 synchro — dusk purple, oracle era
  { skyTop: '#9d8fc2', skyBottom: '#e6ddf6', ground: '#5d5478', groundTop: '#726a90', building: '#453e60' },
  // 5 didi — global sunset
  { skyTop: '#e76f51', skyBottom: '#ffd6c2', ground: '#7a4b3a', groundTop: '#935c48', building: '#5c3226' },
  // 6 restoque — product studio teal
  { skyTop: '#2a9d8f', skyBottom: '#c9f2ec', ground: '#3f6b62', groundTop: '#4d8377', building: '#1f5a50' },
  // 7 dell — remote night blue
  { skyTop: '#264653', skyBottom: '#7a9eb1', ground: '#2f3e46', groundTop: '#3d5058', building: '#1b2f38' },
  // 8 dexco — industrial slate
  { skyTop: '#4a5759', skyBottom: '#b0c4b1', ground: '#4d5a4e', groundTop: '#5e6f5f', building: '#33403a' },
  // 9 ems — pharma clean blue
  { skyTop: '#5390d9', skyBottom: '#cfe7ff', ground: '#4f6d8f', groundTop: '#6184aa', building: '#33517a' },
  // 10 crefisa — finance navy
  { skyTop: '#1d3557', skyBottom: '#6b8cae', ground: '#22334d', groundTop: '#2e4364', building: '#152741' },
  // 11 r10 — stadium night, neon
  { skyTop: '#0f172a', skyBottom: '#3b0f6e', ground: '#181f33', groundTop: '#232d4a', building: '#0b1120' },
  // 12 epilogue — sunrise over the next chapter
  { skyTop: '#312e81', skyBottom: '#fbbf24', ground: '#3a3560', groundTop: '#4a4478', building: '#272352' },
];

export type { GameDictionary, GameZone, GameSkill, GameBoss, GameBadge, SkillTree } from './types';
