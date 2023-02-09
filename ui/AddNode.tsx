'use client';

import { useMe } from '#/lib/hooks/use-me';
import { getZRange } from '#/lib/map';
import { creatableNodeTypes, getNodeType } from '#/lib/node-types';
import { insertNode } from '#/lib/nodes';
import { createNodeTooltip } from '#/lib/tooltips';
import { nodeSchema } from '#/lib/validations/node';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMapPin } from '@tabler/icons-react';
import type { LatLngExpression } from 'leaflet';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import type z from 'zod';
import Button from './Button';
import Drawer from './Drawer';
import Input from './Input';
import { useMap } from './Map';
import Marker from './Marker';
import Select from './Select';
import Stack from './Stack';
import Text from './Text';

type FormData = z.infer<typeof nodeSchema>;

const AddNode = () => {
  const { data: me } = useMe();
  const searchParams = useSearchParams();
  const level = searchParams.get('level')!;

  if (!me || !['admin', 'moderator'].includes(me.role)) {
    return <></>;
  }
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
      <NodeForm level={level} />
    </Drawer>
  );
};

export default AddNode;

const NodeForm = ({ level }: { level: string }) => {
  const map = useMap();
  const mapCenter = map.getCenter();

  const {
    register,
    reset,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      title: '',
      description: '',
      type: creatableNodeTypes[0].value,
      world: 'hogwarts',
      coordinates: [mapCenter.lat, mapCenter.lng],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const z = getZRange(level);
  async function onSubmit({ coordinates, ...data }: FormData) {
    setIsLoading(true);
    const node = {
      ...data,
      x: coordinates[1],
      y: coordinates[0],
      z: z[0],
    };
    const { error } = await insertNode(node);
    setIsLoading(false);
    if (error) {
      setError('title', { message: error.message });
    } else {
      reset();
      mutate(`nodes/hogwarts/${level}`);
    }
  }
  const type = watch('type');
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Controller
          name="coordinates"
          control={control}
          render={({ field }) => {
            const nodeType = getNodeType(type);
            const title = watch('title');
            return (
              <>
                <Input
                  label="Coordinates"
                  description="Move the marker to change the coordinates"
                  value={`${field.value[0]} ${field.value[1]} ${z[0]}`}
                  required
                  error={errors.coordinates?.message}
                  disabled
                />
                {nodeType.value === 'text' ? (
                  <Text
                    latLng={field.value as LatLngExpression}
                    draggable
                    onLatLngChange={field.onChange}
                  >
                    {title || 'Enter title'}
                  </Text>
                ) : (
                  <Marker
                    src={nodeType.icon}
                    latLng={field.value as LatLngExpression}
                    draggable
                    tooltip={createNodeTooltip({
                      title,
                      type,
                    })}
                    onLatLngChange={field.onChange}
                  />
                )}
              </>
            );
          }}
        />
        <Select
          label="Type"
          options={creatableNodeTypes}
          required
          error={errors.type?.message}
          {...register('type')}
        />

        {type === 'text' && (
          <Input
            autoFocus
            label="Title"
            description="Does the node has a specific name?"
            placeholder="A node might have a title"
            error={errors.title?.message}
            {...register('title')}
          />
        )}
        {/* 
        <Textarea
          label="Description"
          description="Additional information about this node"
          error={errors.description?.message}
          {...register('description')}
        /> */}
        <Button type="submit" kind="brand" disabled={isLoading}>
          Save
        </Button>
      </Stack>
    </form>
  );
};
