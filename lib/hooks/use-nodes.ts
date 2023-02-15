import useSWR from 'swr';
import { getNodes } from '../nodes';

export function useNodes({
  level,
  language,
}: {
  level?: number;
  language: string;
}) {
  return useSWR(`nodes/hogwarts/${level || 'all'}/${language}`, () =>
    getNodes({ level, language }),
  );
}
