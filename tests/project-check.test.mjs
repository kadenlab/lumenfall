import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {checkProject} from '../scripts/check-project.mjs';
test('build reference checker follows template imports and rejects missing/stale chunks',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'lumenfall-check-'));
 try{
  await mkdir(path.join(root,'assets'));
  for(const name of ['.nojekyll','THIRD_PARTY_NOTICES.txt'])await writeFile(path.join(root,name),'');
  await writeFile(path.join(root,'index.html'),'<script src="./assets/main.js"></script>');
  await writeFile(path.join(root,'assets/main.js'),'import(`./chapter.js`)');
  await assert.rejects(checkProject(root,{features:false}));
  await writeFile(path.join(root,'assets/chapter.js'),'export default 1');
  assert.equal((await checkProject(root,{features:false})).assets,2);
  await writeFile(path.join(root,'assets/old.js'),'unused');
  await assert.rejects(checkProject(root,{features:false}),/Unreferenced/);
 }finally{await rm(root,{recursive:true,force:true})}
});
