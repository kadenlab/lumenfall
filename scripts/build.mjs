import {build} from 'vite';
import {writeFile,readFile} from 'node:fs/promises';
await build({configFile:false,root:'standalone',base:'./',publicDir:false,build:{outDir:'../docs',emptyOutDir:true,sourcemap:false}});
await writeFile('docs/.nojekyll','');
await writeFile('docs/THIRD_PARTY_NOTICES.txt','Three.js — MIT License\n\n'+await readFile('node_modules/three/LICENSE','utf8'));
