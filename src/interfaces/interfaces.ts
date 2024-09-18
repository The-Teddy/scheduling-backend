import { CategoryEntity } from 'src/database/entities/category.entity';

export type BooleanObject<T extends string> = {
  [K in T]: boolean;
};
export interface VerifyAndSendEmailCodeInterface {
  userNotFound: boolean;
  codeExpired: boolean;
  hasCode: boolean;
  invalidCode: boolean;
}
export interface updateCategoryResponseInterface {
  notFound: boolean;
  isUnchanged: boolean;
  category: CategoryEntity | null;
  notAuthorized: boolean;
}
