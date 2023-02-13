import type { Database } from './database.types';
import type { SavefilePlayer } from './savefiles';
import supabase from './supabase-browser';

const toPlayer = (player: Database['public']['Tables']['players']['Row']) => {
  return {
    id: player.id,
    houseId: player.house_id,
    firstName: player.first_name,
    lastName: player.last_name,
    year: player.year,
    position: {
      x: player.position_x,
      y: player.position_y,
      z: player.position_z,
      pitch: player.position_pitch,
      roll: player.position_roll,
      yaw: player.position_yaw,
      world: player.position_world,
    },
    updatedAt: player.updated_at,
  };
};

const toPlayerRow = (player: SavefilePlayer) => {
  return {
    house_id: player.houseId,
    first_name: player.firstName,
    last_name: player.lastName,
    year: player.year,
    position_pitch: player.position.pitch,
    position_roll: player.position.roll,
    position_world: player.position.world,
    position_x: player.position.x,
    position_y: player.position.y,
    position_yaw: player.position.yaw,
    position_z: player.position.z,
  };
};

export const getPlayer = async (id: string): Promise<Player | null> => {
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!player) {
    return null;
  }

  return toPlayer(player);
};

export const getPlayers = async (userId: string): Promise<Player[]> => {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return players.map(toPlayer);
};

export type Player = Pick<
  Database['public']['Tables']['players']['Row'],
  'id'
> &
  SavefilePlayer & {
    updatedAt: string;
  };

export const upsertPlayer = async (userId: string, payload: SavefilePlayer) => {
  const id = `${userId}_${payload.firstName}_${payload.lastName}`;
  return await supabase.from('players').upsert({
    id,
    user_id: userId,
    ...toPlayerRow(payload),
    updated_at: new Date().toISOString(),
  });
};
