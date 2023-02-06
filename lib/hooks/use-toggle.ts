import { useState } from 'react';

export default function useToggle() {
  const [value, setValue] = useState(false);
  return [value, () => setValue(!value)] as [boolean, () => void];
}
