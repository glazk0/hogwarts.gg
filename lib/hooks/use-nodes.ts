import useSWR from 'swr';
import { getNodes } from '../nodes';

export function useNodes({ language }: { language: string }) {
  return useSWR(`nodes/hogwarts/${language}`, () => getNodes({ language }));
}
