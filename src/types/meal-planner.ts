import { type Recipe } from './recipe';

export interface MealPlanDay {
  id: string;
  date: Date;
  meals: Recipe[];
}

export interface MealPlanData {
  id: string;
  day_of_week: number;
  recipe: {
    id: string;
    title: string;
    image_url: string;
    prep_time: number;
    cook_time: number;
    influencer: {
      id: string;
      name: string;
      avatar_url: string;
    };
  };
}

export interface MealPlanContextType {
  mealPlan: MealPlanDay[];
  loading: boolean;
  addRecipeToMealPlan: (recipe: Recipe, date?: Date) => Promise<void>;
  removeRecipeFromMealPlan: (recipeId: string, date: Date) => Promise<void>;
}

export interface MealPlanProviderProps {
  children: React.ReactNode;
}

export interface WeeklyCalendarProps {
  weekDays: MealPlanDay[];
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
  onAddClick: () => void;
}

export interface DaySelectorDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}