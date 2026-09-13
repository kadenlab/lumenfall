import {build} from 'vite';
import {writeFile,readFile,rm} from 'node:fs/promises';
// Remove only generated assets; repeated upload/build must not retain stale chunks.
await rm('docs/assets',{recursive:true,force:true});
await build({configFile:false,root:'standalone',base:'./',publicDir:false,build:{outDir:'../docs',emptyOutDir:true,sourcemap:false}});
await writeFile('docs/.nojekyll','');
await writeFile('docs/THIRD_PARTY_NOTICES.txt','Three.js — MIT License\n\n'+await readFile('node_modules/three/LICENSE','utf8'));
