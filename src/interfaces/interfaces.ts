import { CategoryEntity } from 'src/database/entities/category.entity';

export type BooleanObject<T extends string> = {
  [K in T]: boolean;
};
export type StringObject<T extends string> = {
  [K in T]: string | Date;
};
export type NumberObject<T extends string> = {
  [K in T]: number;
};
export interface VerifyAndSendEmailCodeInterface {
  userNotFound: boolean;
  codeExpired: boolean;
  hasCode: boolean;
  invalidCode: boolean;
  differentEmail?: boolean;
}
export interface updateCategoryResponseInterface {
  notFound: boolean;
  isUnchanged: boolean;
  category: CategoryEntity | null;
  notAuthorized: boolean;
}

export interface ProviderInterface {
  name: string;
  about: string;
  category: string;
  url: string;
  rating: number;
  logo: string;
  cover: string;
  hasAutomaticUpdate: boolean;
}
export interface UserInterface {
  name: string;
  email: string;
  role: string;
  birthDate: Date;
  emailVerified: boolean;
  createdAt: Date;
  isActive: boolean;
  business: ProviderInterface;
}
export interface RemainingTimeInterface {
  minutes: number;
  hours: number;
  days: number;
}
