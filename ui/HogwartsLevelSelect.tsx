'use client';

import { getMapTile, HOGWARTS_LEVELS } from '#/lib/map';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AppLink from './AppLink';
import Dialog from './Dialog';

export default function HogwartsLevelSelect() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const level = +searchParams.get('level')!;
  return (
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
    >
      <div className="flex gap-4 flex-wrap justify-center content-center overflow-auto h-full max-w-7xl mx-auto">
        {HOGWARTS_LEVELS.map((level) => (
          <AppLink
            key={level}
            href={`/map/hogwarts?level=${level}`}
            className="relative transition hover:scale-150 hover:z-30"
            onClick={() => setOpen(false)}
          >
            <Image
              src={getMapTile(level)}
              width={120}
              height={120}
              alt={`Level ${level}`}
              className="border rounded"
            />
            <p className="absolute right-1 bottom-1">{level}</p>
          </AppLink>
        ))}
      </div>
    </Dialog>
  );
}
