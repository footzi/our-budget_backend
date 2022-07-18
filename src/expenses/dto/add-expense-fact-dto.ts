export interface AddExpenseFactDto {
  categoryId: number;
  value: number;
  date: Date;
  comment?: string;
}
