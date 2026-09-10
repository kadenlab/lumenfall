import test from 'node:test';
import assert from 'node:assert/strict';
import {bindJoystick} from '../app/input.ts';

test('joystick stops on release outside, capture loss, cancellation, blur and hide',()=>{
 const win=new EventTarget(),doc=new EventTarget();doc.hidden=false;
 globalThis.window=win;globalThis.document=doc;
 const el=new EventTarget();el.firstElementChild={style:{transform:''}};
 const captured=new Set();el.setPointerCapture=id=>captured.add(id);el.hasPointerCapture=id=>captured.has(id);el.releasePointerCapture=id=>captured.delete(id);
 el.getBoundingClientRect=()=>({left:0,top:0,width:110,height:110});
 let velocity=[0,0],route=['destination'];
 const cleanup=bindJoystick(el,(x,y)=>{velocity=[x,y];route=[]});
 const emit=(target,type,props={})=>{const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId:1,button:0,buttons:1,clientX:90,clientY:55},props);target.dispatchEvent(e)};
 for(const [target,type] of [[win,'pointerup'],[el,'lostpointercapture'],[win,'pointercancel'],[win,'blur'],[doc,'visibilitychange']]){
  doc.hidden=false;emit(el,'pointerdown');assert.ok(velocity[0]>0);assert.deepEqual(route,[]);
  emit(win,'pointerup',{pointerId:2});assert.ok(velocity[0]>0,'other finger does not stop movement');
  doc.hidden=true;emit(target,type);assert.deepEqual(velocity,[0,0],type);assert.equal(el.firstElementChild.style.transform,'');
 }
 emit(el,'pointerdown');emit(el,'pointermove',{buttons:0});assert.deepEqual(velocity,[0,0]);
 emit(el,'pointerdown');cleanup();assert.deepEqual(velocity,[0,0]);emit(el,'pointerdown');assert.deepEqual(velocity,[0,0],'listeners removed on teardown');
 delete globalThis.window;delete globalThis.document;
});
