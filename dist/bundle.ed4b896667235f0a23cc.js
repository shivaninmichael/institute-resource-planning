"use strict";(self.webpackChunks_erp_frontend=self.webpackChunks_erp_frontend||[]).push([[22],{799:(e,t,a)=>{a.d(t,{l$:()=>S,oR:()=>g});var i=a(6540),s=a(1724),r=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,o=(()=>{let e=0;return()=>(++e).toString()})(),n=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),l="default",d=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:i}=t;return d(e,{type:e.toasts.find(e=>e.id===i.id)?1:0,toast:i});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}},c=[],u={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},p={},m=(e,t=l)=>{p[t]=d(p[t]||u,e),c.forEach(([e,a])=>{e===t&&a(p[t])})},f=e=>Object.keys(p).forEach(t=>m(e,t)),y=(e=l)=>t=>{m(t,e)},h={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},b=e=>(t,a)=>{let i=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||o()}))(t,e,a);return y(i.toasterId||(e=>Object.keys(p).find(t=>p[t].toasts.some(t=>t.id===e)))(i.id))({type:2,toast:i}),i.id},g=(e,t)=>b("blank")(e,t);g.error=b("error"),g.success=b("success"),g.loading=b("loading"),g.custom=b("custom"),g.dismiss=(e,t)=>{let a={type:3,toastId:e};t?y(t)(a):f(a)},g.dismissAll=e=>g.dismiss(void 0,e),g.remove=(e,t)=>{let a={type:4,toastId:e};t?y(t)(a):f(a)},g.removeAll=e=>g.remove(void 0,e),g.promise=(e,t,a)=>{let i=g.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?r(t.success,e):void 0;return s?g.success(s,{id:i,...a,...null==a?void 0:a.success}):g.dismiss(i),e}).catch(e=>{let s=t.error?r(t.error,e):void 0;s?g.error(s,{id:i,...a,...null==a?void 0:a.error}):g.dismiss(i)}),e};var v=s.i7`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,x=s.i7`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,w=s.i7`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,E=(0,s.I4)("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${v} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${x} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${w} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,k=s.i7`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=(0,s.I4)("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${k} 1s linear infinite;
`,$=s.i7`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,D=s.i7`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,C=(0,s.I4)("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${D} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,z=(0,s.I4)("div")`
  position: absolute;
`,A=(0,s.I4)("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,O=s.i7`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=(0,s.I4)("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${O} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,j=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?i.createElement(P,null,t):t:"blank"===a?null:i.createElement(A,null,i.createElement(I,{...s}),"loading"!==a&&i.createElement(z,null,"error"===a?i.createElement(E,{...s}):i.createElement(C,{...s})))},N=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,H=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,M=(0,s.I4)("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,T=(0,s.I4)("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,L=i.memo(({toast:e,position:t,style:a,children:o})=>{let l=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[i,r]=n()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[N(a),H(a)];return{animation:t?`${(0,s.i7)(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${(0,s.i7)(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},d=i.createElement(j,{toast:e}),c=i.createElement(T,{...e.ariaProps},r(e.message,e));return i.createElement(M,{className:e.className,style:{...l,...a,...e.style}},"function"==typeof o?o({icon:d,message:c}):i.createElement(i.Fragment,null,d,c))});(0,s.mj)(i.createElement);var R=({id:e,className:t,style:a,onHeightUpdate:s,children:r})=>{let o=i.useCallback(t=>{if(t){let a=()=>{let a=t.getBoundingClientRect().height;s(e,a)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return i.createElement("div",{ref:o,className:t,style:a},r)},_=s.AH`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,S=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:o,toasterId:d,containerStyle:m,containerClassName:f})=>{let{toasts:b,handlers:v}=((e,t="default")=>{let{toasts:a,pausedAt:s}=((e={},t=l)=>{let[a,s]=(0,i.useState)(p[t]||u),r=(0,i.useRef)(p[t]);(0,i.useEffect)(()=>(r.current!==p[t]&&s(p[t]),c.push([t,s]),()=>{let e=c.findIndex(([e])=>e===t);e>-1&&c.splice(e,1)}),[t]);let o=a.toasts.map(t=>{var a,i,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(i=e[t.type])?void 0:i.duration)||(null==e?void 0:e.duration)||h[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:o}})(e,t),r=(0,i.useRef)(new Map).current,o=(0,i.useCallback)((e,t=1e3)=>{if(r.has(e))return;let a=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,a)},[]);(0,i.useEffect)(()=>{if(s)return;let e=Date.now(),i=a.map(a=>{if(a.duration===1/0)return;let i=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(!(i<0))return setTimeout(()=>g.dismiss(a.id,t),i);a.visible&&g.dismiss(a.id)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[a,s,t]);let n=(0,i.useCallback)(y(t),[t]),d=(0,i.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),m=(0,i.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),f=(0,i.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),b=(0,i.useCallback)((e,t)=>{let{reverseOrder:i=!1,gutter:s=8,defaultPosition:r}=t||{},o=a.filter(t=>(t.position||r)===(e.position||r)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...i?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,i.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[a,o]),{toasts:a,handlers:{updateHeight:m,startPause:d,endPause:f,calculateOffset:b}}})(a,d);return i.createElement("div",{"data-rht-toaster":d||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...m},className:f,onMouseEnter:v.startPause,onMouseLeave:v.endPause},b.map(a=>{let l=a.position||t,d=((e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:n()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...s}})(l,v.calculateOffset(a,{reverseOrder:e,gutter:s,defaultPosition:t}));return i.createElement(R,{id:a.id,key:a.id,onHeightUpdate:v.updateHeight,className:a.visible?_:"",style:d},"custom"===a.type?r(a.message,a):o?o(a):i.createElement(L,{toast:a,position:l}))}))}}}]);