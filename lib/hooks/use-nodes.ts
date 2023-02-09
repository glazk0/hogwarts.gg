import useSWR from 'swr';
import { getNodes } from '../nodes';

export function useNodes({ level }: { level: number }) {
  return useSWR(`nodes/hogwarts/${level}`, () => getNodes({ level }));
}
