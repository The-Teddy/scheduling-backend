import { BooleanObject } from 'src/interfaces/interfaces';

export type UpdateCriticalResult =
  | BooleanObject<'notFound'>
  | BooleanObject<'outTime'>
  | BooleanObject<'hasAutomaticUpdate'>
  | BooleanObject<'success'>;
