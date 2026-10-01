import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/features/users/api/users-api';

export const userKeys = {
  detail: (userId) => ['user', String(userId)],
  analysis: ['usersAnalysis'],
};

export function useUser(userId) {
  return useQuery({ queryKey: userKeys.detail(userId), queryFn: () => fetchUser(userId), enabled: Boolean(userId) });
}
