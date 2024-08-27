export type BooleanObject<T extends string> = {
  [K in T]: boolean;
};
export interface VerifyAndSendEmailCodeInterface {
  userNotFound: boolean;
  codeExpired: boolean;
  hasCode: boolean;
  invalidCode: boolean;
}
