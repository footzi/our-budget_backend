export interface AddExpensePlanDto {
  categoryId: number;
  value: number;
  date: Date;
  comment?: string;
}
