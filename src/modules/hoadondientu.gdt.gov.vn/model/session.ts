export type StoredHddtSession = {
  id: string;
  username: string;
  expiredAt: string;
  remainingSeconds: number;
  remember: boolean;
  lastSyncedAt: string;
};
