export class UpdateExpenseFactDto {
  id: number;
  categoryId?: number;
  value?: number;
  date?: Date;
  comment?: string;
}
