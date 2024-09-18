export interface CategoryInterface {
  id: number;
  name: string;
  description: string;
  observation: string;
  isActive: boolean;
  isSuggested: boolean;
  analizedByName: string;
  createdByName: string;
  approvalStatus:
    | 'pendente'
    | 'aprovado'
    | 'rejeitado'
    | 'aprovado com modificação';
  createdAt: Date;
  updatedAt: Date;
}
