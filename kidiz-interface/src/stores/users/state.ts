import type { IUser } from '@/types/user';

export function useState() {
  return {
    users: [] as IUser[]
  };
}

export type IUserState = ReturnType<typeof useState>;