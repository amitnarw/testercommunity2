export interface ImmediateAttentionItem {
  id: number;
  userId: string;
  title: string;
  description: string;
  url: string | null;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
