// Pointer ownership remains explicit, including interrupted touches and lost capture.
export function bindJoystick(el:HTMLElement, move:(x:number,y:number)=>void){
 let pointer:number|null=null;
 const stop=()=>{const id=pointer;pointer=null;move(0,0);(el.firstElementChild as HTMLElement).style.transform='';if(id!==null&&el.hasPointerCapture(id))el.releasePointerCapture(id)};
 const update=(e:PointerEvent)=>{const r=el.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/40,y=(e.clientY-r.top-r.height/2)/40;const length=Math.hypot(x,y);if(length<.12)x=y=0;else if(length>1){x/=length;y/=length}move(x,y);(el.firstElementChild as HTMLElement).style.transform=`translate(${x*25}px,${y*25}px)`};
 const down=(e:PointerEvent)=>{if(pointer!==null||e.button!==0)return;e.preventDefault();pointer=e.pointerId;el.setPointerCapture(pointer);update(e)};
 const drag=(e:PointerEvent)=>{if(e.pointerId!==pointer)return;if(e.buttons===0){stop();return}update(e)};
 const end=(e:PointerEvent)=>{if(e.pointerId===pointer)stop()};
 const hidden=()=>{if(document.hidden)stop()};
 el.addEventListener('pointerdown',down);el.addEventListener('pointermove',drag);el.addEventListener('lostpointercapture',end);
 window.addEventListener('pointerup',end,true);window.addEventListener('pointercancel',end,true);window.addEventListener('blur',stop);document.addEventListener('visibilitychange',hidden);
 return()=>{stop();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',drag);el.removeEventListener('lostpointercapture',end);window.removeEventListener('pointerup',end,true);window.removeEventListener('pointercancel',end,true);window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',hidden)};
}
