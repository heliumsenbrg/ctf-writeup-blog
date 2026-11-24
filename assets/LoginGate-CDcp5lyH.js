import{c,j as r}from"./index-C1DqnREs.js";import{u as s,L as i}from"./react-vendor-Dg1TH6cw.js";import{u as y}from"./activity-BMH8KFCA.js";import{L as l}from"./loader-2-BD3vExxx.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=c("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=c("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=c("LockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=c("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);function g(n){const t=new Date(n).getTime();if(!Number.isFinite(t))return"";const e=Date.now()-t;return e<6e4?"刚刚":e<36e5?`${Math.floor(e/6e4)} 分钟前`:e<864e5?`${Math.floor(e/36e5)} 小时前`:e<30*864e5?`${Math.floor(e/864e5)} 天前`:new Date(t).toLocaleDateString("zh-CN")}function k({action:n="发言",children:t}){const e=s(),{user:a,loading:o}=y();return o?r.jsxs("div",{className:"flex items-center gap-2 rounded-lg border border-cyber-grid/20 bg-cyber-darker/50 px-4 py-3 font-mono text-xs text-cyber-grid",children:[r.jsx(l,{className:"h-4 w-4 animate-spin text-cyber-cyan"}),"检查登录状态…"]}):a?t:r.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cyber-cyan/20 bg-cyber-cyan/5 px-4 py-3",children:[r.jsxs("span",{className:"flex items-center gap-2 text-xs text-cyber-grid",children:[r.jsx(d,{className:"h-4 w-4 text-cyber-cyan"}),"登录后才能",n]}),r.jsx(i,{to:"/login",state:{from:e.pathname},className:"rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-1.5 font-mono text-xs text-cyber-cyan transition-colors hover:bg-cyber-cyan/20",children:"去登录"})]})}export{b as A,h as C,k as L,p as S,g as t};
