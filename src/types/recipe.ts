export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  tags: string[];
  ingredients?: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions?: string[];
  nutritionalInfo?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  influencer: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ScrapedRecipe {
  title: string;
  description: string;
  image: string;
  ingredients: { name: string; amount: string; unit: string; }[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onInfluencerClick?: (name: string) => void;
}

export interface RecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecipe?: Recipe;
}