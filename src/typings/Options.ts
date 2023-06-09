export interface UserAgent {
  mobile?: boolean;
  desktop?: boolean;
}

export interface IOptions {
  safe?: boolean;
  include?: string;
  userAgent?: UserAgent;
}
