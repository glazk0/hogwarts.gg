'use client';

import { IconMapPin } from '@tabler/icons';
import Drawer from './Drawer';

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
      TBA
    </Drawer>
  );
};

export default AddNode;
