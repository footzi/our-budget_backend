import { CATEGORIES_TYPES } from '../constants.categories';

export interface AddCategoryDto {
  name: string;
  type: CATEGORIES_TYPES;
  startDate?: string;
  endDate?: string;
}
