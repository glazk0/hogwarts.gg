'use client';

import { nodeSchema } from '#/lib/validations/node';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMapPin } from '@tabler/icons';
import type { LatLngExpression } from 'leaflet';
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import Drawer from './Drawer';
import { useMap } from './Map';
import Marker from './Marker';

type FormData = z.infer<typeof nodeSchema>;

const AddNode = () => {
  return (
    <Drawer
      title="Add Node"
      tooltip="Add Node"
      trigger={
        <button>
          <IconMapPin />
        </button>
      }
    >
      <NodeForm />
    </Drawer>
  );
};

export default AddNode;

const NodeForm = () => {
  const map = useMap();
  const { register, control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      title: '',
      description: '',
      type: '',
      latLng: [map.getCenter().lat, map.getCenter().lng],
    },
  });

  async function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="latLng"
        control={control}
        render={({ field }) => (
          <>
            <input placeholder={field.value.toString()} />
            <Marker
              src="https://aeternum-map.gg/pois/gold.webp"
              latLng={field.value as LatLngExpression}
              highlight
              draggable
              onLatLngChange={field.onChange}
            />
          </>
        )}
      />

      <input
        autoFocus
        placeholder="A node needs a title"
        {...register('title')}
      />
    </form>
  );
};
