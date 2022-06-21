export interface UpdateExpensePlanDto {
  id: number;
  categoryId?: number;
  value?: number;
  date?: string;
  comment?: string;
}
