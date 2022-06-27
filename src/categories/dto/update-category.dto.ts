import { CATEGORIES_TYPES } from '../constants.categories';

export interface UpdateCategoryDto {
  id: number;
  name: string;
  type: CATEGORIES_TYPES;
  startDate?: string;
  endDate?: string;
}
