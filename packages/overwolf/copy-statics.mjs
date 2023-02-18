import fs from 'node:fs/promises';

import manifest from './manifest.json' assert { type: 'json' };

manifest.meta.name = manifest.meta.name.replace('-DEV', '');
delete manifest.data.windows.controller.debug_url;
delete manifest.data.windows.main.debug_url;

await fs.writeFile('./dist/manifest.json', JSON.stringify(manifest));
await fs.cp('./icons/', './dist/icons/', { recursive: true });
