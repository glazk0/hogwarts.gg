'use client';

import { getMapTile, HOGWARTS_LEVELS } from '#/lib/map';
import { cn } from '#/lib/utils';
import { IconArrowBigDown, IconArrowBigUp } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AppLink from '../AppLink';
import Dialog from '../Dialog';
import Tooltip from '../Tooltip';

export default function HogwartsLevelSelect() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams()!;
  const level = +searchParams.get('level')!;
  const router = useRouter();
  const isFirst = level === 1;
  const isLast = level === HOGWARTS_LEVELS[HOGWARTS_LEVELS.length - 1];
  return (
    <div>
      <div className="p-2 flex gap-1 justify-center">
        <Tooltip label="Level Down">
          <button
            disabled={isFirst}
            className={cn({
              'text-gray-500': isFirst,
            })}
            onClick={() => {
              const href =
                location.pathname +
                location.search.replace(`level=${level}`, `level=${level - 1}`);

              router.prefetch(href);
              router.push(href);
            }}
          >
            <IconArrowBigDown />
          </button>
        </Tooltip>
        <Tooltip label="Level Up">
          <button
            disabled={isLast}
            className={cn({
              'text-gray-500': isLast,
            })}
            onClick={() => {
              const href =
                location.pathname +
                location.search.replace(`level=${level}`, `level=${level + 1}`);

              router.prefetch(href);
              router.push(href);
            }}
          >
            <IconArrowBigUp />
          </button>
        </Tooltip>
      </div>
      <Dialog
        title="Select Level"
        tooltip="Select Level"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button className="relative">
            <Image
              src={getMapTile(level)}
              width={120}
              height={120}
              alt="Current level"
              className="border rounded"
            />
            <p className="absolute right-1 bottom-1">{level}</p>
          </button>
        }
        className="p-4 right-96"
      >
        <div className="flex flex-wrap justify-center content-center overflow-auto grow mx-auto">
          {HOGWARTS_LEVELS.map((level) => (
            <AppLink
              key={level}
              href={`/map/hogwarts?level=${level}`}
              className="relative transition scale-90 hover:scale-150 hover:z-30"
              onClick={() => setOpen(false)}
            >
              <Image
                src={getMapTile(level)}
                width={100}
                height={100}
                alt={`Level ${level}`}
                className="border rounded"
              />
              <p className="absolute right-1 bottom-1">{level}</p>
            </AppLink>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
