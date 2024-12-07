import { supabase } from '@/lib/supabase';
import { startOfWeek, format } from 'date-fns';
import { validate as isUUID } from 'uuid';
import { type DayOfWeek, dayMapping } from '@/types/database';
import { type MealPlanData } from '@/types/meal-planner';

const validateUUID = (id: string, label: string) => {
  if (!isUUID(id)) {
    throw new Error(`Invalid ${label} format`);
  }
};

interface RawMealPlanResponse {
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

export const MealPlanService = {
  getMealPlan: async (userId: string, weekStartDate: Date): Promise<MealPlanData[]> => {
    try {
      validateUUID(userId, 'user ID');

      const formattedDate = weekStartDate.toISOString().split('T')[0];
      console.log('Fetching meal plan for:', { userId, weekStartDate: formattedDate });

      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          id,
          day_of_week,
          recipe:recipes (
            id,
            title,
            image_url,
            prep_time,
            cook_time,
            influencer:influencers (
              id,
              name,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .eq('week_start_date', formattedDate);

      if (error) throw error;

      const rawData = data as unknown as RawMealPlanResponse[];
      if (!rawData) return [];

      return rawData.map(item => ({
        id: item.id,
        day_of_week: item.day_of_week,
        recipe: {
          id: item.recipe.id,
          title: item.recipe.title,
          image_url: item.recipe.image_url,
          prep_time: item.recipe.prep_time,
          cook_time: item.recipe.cook_time,
          influencer: {
            id: item.recipe.influencer.id,
            name: item.recipe.influencer.name,
            avatar_url: item.recipe.influencer.avatar_url
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      return [];
    }
  },

  addToMealPlan: async (userId: string, recipeId: string, date: Date) => {
    try {
      validateUUID(userId, 'user ID');
      validateUUID(recipeId, 'recipe ID');

      const weekStart = startOfWeek(date);
      const dayName = format(date, 'EEEE').toLowerCase() as DayOfWeek;
      const dayOfWeek = dayMapping[dayName];

      if (dayOfWeek === undefined) {
        throw new Error(`Invalid day of week: ${dayName}`);
      }

      const { data, error } = await supabase
        .from('meal_plans')
        .insert([{ 
          user_id: userId, 
          week_start_date: weekStart.toISOString().split('T')[0],
          day_of_week: dayOfWeek, 
          recipe_id: recipeId 
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to meal plan:', error);
      throw new Error('Could not add to the meal plan. Please try again.');
    }
  },

  removeMealPlan: async (userId: string, recipeId: string, date: Date) => {
    try {
      validateUUID(userId, 'user ID');
      validateUUID(recipeId, 'recipe ID');

      const weekStart = startOfWeek(date);
      const dayName = format(date, 'EEEE').toLowerCase() as DayOfWeek;
      const dayOfWeek = dayMapping[dayName];

      if (dayOfWeek === undefined) {
        throw new Error(`Invalid day of week: ${dayName}`);
      }

      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .match({ 
          user_id: userId, 
          week_start_date: weekStart.toISOString().split('T')[0],
          day_of_week: dayOfWeek,
          recipe_id: recipeId 
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from meal plan:', error);
      throw new Error('Could not remove from the meal plan. Please try again.');
    }
  }
};