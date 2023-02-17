'use client';
import { useMe } from '#/lib/hooks/use-me';
import { getLevelByZ } from '#/lib/map';
import { upsertPlayer } from '#/lib/players';
import type { SavefilePlayer } from '#/lib/savefiles';
import { extractDatabase, extractPlayer } from '#/lib/savefiles';
import { IconCloudUpload, IconCurrentLocation } from '@tabler/icons-react';
import Script from 'next/script';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import Button from './Button';
import Input from './Input';
import Popover from './Popover';

export default function PlayerSync() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [player, setPlayer] = useState<SavefilePlayer | null>(null);
  const { data: me } = useMe();
  const { mutate } = useSWRConfig();

  const processFile = async (file: File) => {
    try {
      setErrorMessage('');
      const initSqlJs = window.initSqlJs;
      const rawdb = await extractDatabase(file);
      const SQL = await initSqlJs({
        // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
        // You can omit locateFile completely when running in node
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
      const db = await new SQL.Database(rawdb);

      const player = extractPlayer(db);
      setPlayer(player);
      if (me) {
        await upsertPlayer(me.id, player);
        mutate(`users/${me.id}/players`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Something went wrong');
      }
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      tooltip={'Sync Player Position'}
      trigger={
        <Button aria-label={'Sync character'} kind="brand" shape="round">
          <IconCurrentLocation />
        </Button>
      }
    >
      <div className="flex flex-col gap-2 p-4">
        <p>
          Please upload your latest savefile to sync your profile and position
          on the map.
        </p>
        <Input
          label="Windows folder path"
          disabled
          value="C:\Users\<user>\AppData\Local\Hogwarts Legacy\Saved\SaveGames"
        />
        <label
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-900 hover:bg-gray-700"
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
              processFile(event.dataTransfer.files[0]);
            }
          }}
        >
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js" />
          <div className="flex flex-col gap-2 items-center justify-center pt-5 pb-6">
            {player ? (
              <>
                <p>
                  Welcome{' '}
                  <b>
                    {player.firstName} {player.lastName}
                  </b>{' '}
                  of house <b>{player.houseId}</b>. It&apos;s your{' '}
                  <b>{player.year}th</b> year.
                </p>
                <p>
                  You are in <b>{player.position.world}</b> at level{' '}
                  <b>{getLevelByZ(player.position.z)}</b>.
                </p>
                <p>
                  Coordinates: x{player.position.x} y{player.position.y} z
                  {player.position.z}
                </p>
              </>
            ) : (
              <>
                <IconCloudUpload size={40} />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </>
            )}
            {errorMessage && (
              <p className="font-bold text-orange-500">{errorMessage}</p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.[0]) {
                processFile(event.target.files[0]);
              }
            }}
          />
        </label>
        {!me && (
          <p className="font-bold text-orange-500">
            You need to sign-in to use this feature.
          </p>
        )}
      </div>
    </Popover>
  );
}
