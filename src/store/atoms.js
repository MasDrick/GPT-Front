import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const answerBot = atom('');
export const messageUser = atom('');
export const chatHistoryAtom = atomWithStorage('chatHistory', []);
export const isClear = atom(false);
export const openDrawer = atom(false);
export const activeModelAI = atom('gpt-4o');
