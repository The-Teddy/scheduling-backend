import { BooleanObject } from 'src/interfaces/interfaces';

export type UpdateCriticalProviderResult =
  | BooleanObject<'notFound'>
  | BooleanObject<'outTime'>
  | BooleanObject<'hasAutomaticUpdate'>
  | BooleanObject<'success'>;

export type UpdateDefaultProviderResult =
  | BooleanObject<'notFound'>
  | BooleanObject<'success'>;
