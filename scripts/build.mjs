import {build} from 'vite';
import {writeFile} from 'node:fs/promises';
await build({configFile:false,root:'standalone',base:'./',publicDir:false,build:{outDir:'../docs',emptyOutDir:true,sourcemap:false}});
await writeFile('docs/.nojekyll','');
