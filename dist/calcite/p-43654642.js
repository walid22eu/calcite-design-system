import{C as e,p as o,w as t,a as s,d as n,N as r}from"./p-c1f86727.js";const a="undefined"!=typeof Deno,c=!(a||"undefined"==typeof global||"function"!=typeof require||!global.process||"string"!=typeof __filename||global.origin&&"string"==typeof global.origin),p=(a&&Deno,c?process:a&&Deno,c?process:a&&Deno,()=>e&&e.supports&&e.supports("color","var(--c)")?s():__sc_import_calcite("./p-516c777c.js").then(()=>(o.o=t.__cssshim)?(!1).i():0)),i=()=>{o.o=t.__cssshim;const e=Array.from(n.querySelectorAll("script")).find(e=>RegExp(`/${r}(\\.esm)?\\.js($|\\?|#)`).test(e.src)||e.getAttribute("data-stencil-namespace")===r),a=e["data-opts"]||{};return"onbeforeload"in e&&!history.scrollRestoration?{then(){}}:(a.resourcesUrl=new URL(".",new URL(e.getAttribute("data-resources-url")||e.src,t.location.href)).href,l(a.resourcesUrl,e),t.customElements?s(a):__sc_import_calcite("./p-621bed09.js").then(()=>a))},l=(e,o)=>{const s="__sc_import_"+r.replace(/\s|-/g,"_");try{t[s]=Function("w","return import(w);//"+Math.random())}catch(a){const r=new Map;t[s]=a=>{const c=new URL(a,e).href;let p=r.get(c);if(!p){const e=n.createElement("script");e.type="module",e.crossOrigin=o.crossOrigin,e.src=URL.createObjectURL(new Blob([`import * as m from '${c}'; window.${s}.m = m;`],{type:"application/javascript"})),p=new Promise(o=>{e.onload=()=>{o(t[s].m),e.remove()}}),r.set(c,p),n.head.appendChild(e)}return p}}};export{p as a,i as p}