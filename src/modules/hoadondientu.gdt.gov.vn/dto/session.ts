export type SessionResponse = {
  session_id: string;
  username: string;
  expired_at: string;
  remaining_seconds: number;
};

export type SessionRefreshRequest = {
  password: string;
  cvalue: string;
  ckey: string;
};
