export interface UpdateExpensePlanDto {
  id: number;
  categoryId?: number;
  value?: number;
  date?: Date;
  comment?: string;
}
