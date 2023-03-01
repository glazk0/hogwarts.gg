'use client';

import { getMapTile, HOGWARTS_LEVELS } from '#/lib/map';
import { useMapStore } from '#/lib/store/map';
import { cn } from '#/lib/utils';
import { IconArrowBigDown, IconArrowBigUp, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';
import Dialog from '../Dialog';
import Tooltip from '../Tooltip';

export default function HogwartsLevelSelect() {
  const [open, setOpen] = useState(false);
  const mapStore = useMapStore();

  const isFirst = mapStore.hogwartsLevel === 0;
  const isLast =
    mapStore.hogwartsLevel === HOGWARTS_LEVELS[HOGWARTS_LEVELS.length - 1];

  return (
    <div>
      <div className="p-2 flex gap-1 justify-center">
        <Tooltip label="Hogwarts Level Down">
          <button
            disabled={isFirst}
            className={cn({
              'text-gray-400': isFirst,
            })}
            onClick={mapStore.decreaseHogwartsLevel}
          >
            <IconArrowBigDown />
          </button>
        </Tooltip>
        <Tooltip label="Hogwarts Level Up">
          <button
            disabled={isLast}
            className={cn({
              'text-gray-400': isLast,
            })}
            onClick={mapStore.increaseHogwartsLevel}
          >
            <IconArrowBigUp />
          </button>
        </Tooltip>
        <Tooltip label="Clear">
          <button
            disabled={!mapStore.hogwartsLevel}
            className={cn({
              'text-gray-400': !mapStore.hogwartsLevel,
            })}
            onClick={() => {
              mapStore.setHogwartsLevel(0);
            }}
          >
            <IconX />
          </button>
        </Tooltip>
      </div>
      <Dialog
        title="Select Hogwarts Level"
        tooltip="Select Hogwarts Level"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button className="relative">
            <Image
              src={getMapTile(mapStore.hogwartsLevel)}
              width={120}
              height={120}
              alt="Current level"
              className="border rounded"
            />
            {mapStore.hogwartsLevel > 0 && (
              <p className="absolute right-1 bottom-1">
                {mapStore.hogwartsLevel}
              </p>
            )}
          </button>
        }
        className="p-4 right-96"
      >
        <div className="flex flex-wrap justify-center content-center overflow-auto grow mx-auto">
          <button
            className="relative transition scale-90 hover:scale-150 hover:z-30"
            onClick={() => {
              mapStore.setHogwartsLevel(0);
              setOpen(false);
            }}
          >
            <Image
              src={getMapTile()}
              width={100}
              height={100}
              alt={'Full'}
              className="border rounded"
            />
            <p className="absolute right-1 bottom-1">
              <IconX />
            </p>
          </button>
          {HOGWARTS_LEVELS.map((level) => (
            <button
              key={level}
              className="relative transition scale-90 hover:scale-150 hover:z-30"
              onClick={() => {
                mapStore.setHogwartsLevel(level);
                setOpen(false);
              }}
            >
              <Image
                src={getMapTile(level)}
                width={100}
                height={100}
                alt={`Level ${level}`}
                className="border rounded"
              />
              <p className="absolute right-1 bottom-1">{level}</p>
            </button>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
