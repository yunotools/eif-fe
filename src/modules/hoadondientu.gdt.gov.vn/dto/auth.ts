export type AuthenticationRequest = {
  username: string;
  password: string;
  cvalue: string;
  ckey: string;
};

export type AuthenticationResponse = {
  session_id: string;
  expired_at: string;
};
