import fs from 'node:fs/promises';

import manifest from './manifest.json' assert { type: 'json' };

manifest.meta.name = manifest.meta.name.replace('-DEV', '');
delete manifest.data.windows.controller.debug_url;
delete manifest.data.windows.desktop.debug_url;
delete manifest.data.windows.overlay.debug_url;
delete manifest.data.windows.authDiscord.debug_url;
delete manifest.data.windows.authGitHub.debug_url;

await fs.writeFile('./dist/manifest.json', JSON.stringify(manifest));
await fs.cp('./icons/', './dist/icons/', { recursive: true });
await fs.cp('./plugins/', './dist/plugins/', { recursive: true });
