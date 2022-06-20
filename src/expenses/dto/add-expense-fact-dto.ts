export interface AddExpenseFactDto {
  categoryId: number;
  value: number;
  date: string;
  comment?: string;
}
