import { atom } from 'jotai';

export const answerBot = atom('');
export const messageUser = atom('');
export const chatHistoryAtom = atom([]);
export const isClear = atom(false);
export const openDrawer = atom(false);
export const activeModelAI = atom('gpt-4o');
