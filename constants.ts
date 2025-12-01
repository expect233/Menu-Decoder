import { DietaryRestriction } from './types';

export const DIETARY_OPTIONS = [
  { id: DietaryRestriction.NO_BEEF, label: '🚫 🐮 No Beef (不吃牛)' },
  { id: DietaryRestriction.NO_PORK, label: '🚫 🐷 No Pork (不吃豬)' },
  { id: DietaryRestriction.NO_SEAFOOD, label: '🚫 🦐 No Seafood (不吃海鮮)' },
  { id: DietaryRestriction.NO_CORIANDER, label: '🚫 🌿 No Coriander (不吃香菜)' },
  { id: DietaryRestriction.NO_SPICY, label: '🚫 🌶️ No Spicy (不吃辣)' },
  { id: DietaryRestriction.VEGETARIAN, label: '🥦 🥚 Vegetarian (蛋奶素)' },
];

export const MOCK_LOADING_STEPS = [
  "正在掃描菜單圖片...",
  "識別所有菜色與價格...",
  "進行中文翻譯與口味分析...",
  "檢查飲食禁忌並標示 🚫...",
  "正在生成數位菜單表格...",
];
