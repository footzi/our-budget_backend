export interface UpdateExpenseFactDto {
  id: number;
  categoryId?: number;
  value?: number;
  date?: string;
  comment?: string;
}
