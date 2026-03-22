import { Timestamped } from './base.model';

export interface User extends Timestamped {
  id: string;
  email?: string;
  name: string;
  guestToken?: string;
  isGuest: boolean;
}

export interface GuestSession {
  user: User;
  token: string;
}
