import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const json=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));
test('VS Code launch targets and background readiness match fixed npm ports',async()=>{
 const [tasks,launch,pkg,settings]=await Promise.all(['.vscode/tasks.json','.vscode/launch.json','package.json','.vscode/settings.json'].map(json));
 for(const [name,script]of [['Dev','dev'],['Test','test'],['Build','build'],['Preview','preview'],['Check','check']])assert.equal(tasks.tasks.find(t=>t.label==='Lumenfall: '+name)?.script,script);
 for(const [name,port]of [['Dev',5173],['Preview',4173]]){
  const task=tasks.tasks.find(t=>t.label==='Lumenfall: '+name);assert.equal(task.isBackground,true);
  assert.match(pkg.scripts[task.script],new RegExp(`--port ${port} --strictPort`));
  assert.ok(new RegExp(task.problemMatcher.background.endsPattern).test(`  ➜  Local:   http://127.0.0.1:${port}/`));
 }
 for(const [name,query]of [['Play',''],['DEBUG','?debug=1'],['Editor','?editor=1']]){
  const config=launch.configurations.find(c=>c.name==='Lumenfall: '+name);assert.equal(config.type,'pwa-chrome');assert.equal(config.preLaunchTask,'Lumenfall: Dev');assert.equal(config.url,'http://127.0.0.1:5173/'+query);
 }
 assert.equal(settings['editor.formatOnSave'],false);
});
