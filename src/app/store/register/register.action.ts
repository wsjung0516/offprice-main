export class RegisterUpdate {
  public static readonly type = '[Register] Register Update';
  constructor(public payload: boolean) {}
}
export class MenuUpdate {
  public static readonly type = '[Register] Menu Update';
  constructor(public payload: boolean) {}
}