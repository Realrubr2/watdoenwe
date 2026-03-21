export interface User {
  id: string;
  email?: string;
  name: string;
  guestToken?: string;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestSession {
  user: User;
  token: string;
}
