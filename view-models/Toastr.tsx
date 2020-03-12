export abstract class ToastrWarning {
  public static NOTHING_CHANGE = 'NOTHING_CHANGE';
  public code: string;
  constructor(code: string) {
    this.code = code;
  }
  public abstract getWarningMessage(): string;
}

export abstract class ToastrError {
  public code: string;
  constructor(code: string) {
    this.code = code;
  }
  public abstract getErrorMessage(): string;
}
