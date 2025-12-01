export enum DietaryRestriction {
  NO_BEEF = '不吃牛',
  NO_PORK = '不吃豬',
  NO_SEAFOOD = '不吃海鮮',
  NO_CORIANDER = '不吃香菜',
  NO_SPICY = '不吃辣',
  VEGETARIAN = '蛋奶素'
}

export interface MenuItem {
  originalName: string;
  translatedName: string;
  ingredients: string;
  price: string;
  score: number; // 1-5 stars
}

export interface AnalysisResponse {
  cuisineType: string;
  menuItems: MenuItem[];
}

export interface AnalysisState {
  isLoading: boolean;
  result: AnalysisResponse | null;
  error: string | null;
}
