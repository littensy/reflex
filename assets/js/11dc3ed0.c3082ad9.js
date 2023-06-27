"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[994],{9613:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(9496);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),i=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):u(u({},t),e)),n},c=function(e){var t=i(e.components);return r.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=i(n),m=a,f=p["".concat(s,".").concat(m)]||p[m]||d[m]||l;return n?r.createElement(f,u(u({ref:t},c),{},{components:n})):r.createElement(f,u({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,u=new Array(l);u[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[p]="string"==typeof e?e:a,u[1]=o;for(var i=2;i<l;i++)u[i]=n[i];return r.createElement.apply(null,u)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3469:(e,t,n)=>{n.d(t,{Z:()=>u});var r=n(9496),a=n(5924);const l={tabItem:"tabItem_rlDe"};function u(e){let{children:t,hidden:n,className:u}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(l.tabItem,u),hidden:n},t)}},6187:(e,t,n)=>{n.d(t,{Z:()=>x});var r=n(1966),a=n(9496),l=n(5924),u=n(2180),o=n(3442),s=n(2799),i=n(441),c=n(1006);function p(e){return function(e){return a.Children.map(e,(e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}function d(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,i.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:n}=e;const r=(0,o.k6)(),l=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s._X)(l),(0,a.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(r.location.search);t.set(l,e),r.replace({...r.location,search:t.toString()})}),[l,r])]}function b(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,l=d(e),[u,o]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:l}))),[s,i]=f({queryString:n,groupId:r}),[p,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,l]=(0,c.Nk)(n);return[r,(0,a.useCallback)((e=>{n&&l.set(e)}),[n,l])]}({groupId:r}),g=(()=>{const e=s??p;return m({value:e,tabValues:l})?e:null})();(0,a.useLayoutEffect)((()=>{g&&o(g)}),[g]);return{selectedValue:u,selectValue:(0,a.useCallback)((e=>{if(!m({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);o(e),i(e),b(e)}),[i,b,l]),tabValues:l}}var g=n(4230);const h={tabList:"tabList_t2F_",tabItem:"tabItem_TXTv"};function y(e){let{className:t,block:n,selectedValue:o,selectValue:s,tabValues:i}=e;const c=[],{blockElementScrollPositionUntilNextRender:p}=(0,u.o5)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),r=i[n].value;r!==o&&(p(t),s(r))},m=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":n},t)},i.map((e=>{let{value:t,label:n,attributes:u}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:o===t?0:-1,"aria-selected":o===t,key:t,ref:e=>c.push(e),onKeyDown:m,onClick:d},u,{className:(0,l.Z)("tabs__item",h.tabItem,u?.className,{"tabs__item--active":o===t})}),n??t)})))}function k(e){let{lazy:t,children:n,selectedValue:r}=e;const l=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},l.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r}))))}function v(e){const t=b(e);return a.createElement("div",{className:(0,l.Z)("tabs-container",h.tabList)},a.createElement(y,(0,r.Z)({},e,t)),a.createElement(k,(0,r.Z)({},e,t)))}function x(e){const t=(0,g.Z)();return a.createElement(v,(0,r.Z)({key:String(t)},e))}},3254:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>f,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var r=n(1966),a=(n(9496),n(9613)),l=n(6187),u=n(3469);const o={description:"Get started with the basics of using Reflex.",slug:"/"},s="Quick Start",i={unversionedId:"quick-start/index",id:"quick-start/index",title:"Quick Start",description:"Get started with the basics of using Reflex.",source:"@site/docs/quick-start/index.md",sourceDirName:"quick-start",slug:"/",permalink:"/reflex/docs/",draft:!1,tags:[],version:"current",frontMatter:{description:"Get started with the basics of using Reflex.",slug:"/"},sidebar:"learnSidebar",next:{title:"Installation",permalink:"/reflex/docs/quick-start/installation"}},c={},p=[{value:"Installation",id:"installation",level:2},{value:"Start using Reflex",id:"start-using-reflex",level:2},{value:"Use your producer anywhere",id:"use-your-producer-anywhere",level:2}],d={toc:p},m="wrapper";function f(e){let{components:t,...n}=e;return(0,a.kt)(m,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"quick-start"},"Quick Start"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Reflex")," is a lightweight state management library that lets you write simple and predictable code to manage state throughout your Roblox game. It is based on the ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Sleitnick/rbxts-silo"},"Silo")," library and is inspired by ",(0,a.kt)("a",{parentName:"p",href:"https://redux.js.org/"},"Redux"),"."),(0,a.kt)("h2",{id:"installation"},"Installation"),(0,a.kt)("p",null,"Reflex is available on ",(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@rbxts/reflex"},"npm")," and ",(0,a.kt)("a",{parentName:"p",href:"https://wally.run/package/littensy/reflex"},"Wally"),":"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(u.Z,{value:"npm",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Terminal"',title:'"Terminal"'},"npm install @rbxts/reflex\n"))),(0,a.kt)(u.Z,{value:"Yarn",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Terminal"',title:'"Terminal"'},"yarn add @rbxts/reflex\n"))),(0,a.kt)(u.Z,{value:"pnpm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Terminal"',title:'"Terminal"'},"pnpm add @rbxts/reflex\n"))),(0,a.kt)(u.Z,{value:"Wally",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="wally.toml"',title:'"wally.toml"'},'[dependencies]\nReflex = "littensy/reflex@3.1.0"\n')))),(0,a.kt)("h2",{id:"start-using-reflex"},"Start using Reflex"),(0,a.kt)("p",null,"You're now ready to use Reflex! Where Rodux uses stores, reducers, and actions, Reflex revolves around ",(0,a.kt)("strong",{parentName:"p"},"actions")," and ",(0,a.kt)("a",{parentName:"p",href:"./reference/reflex/producer"},(0,a.kt)("strong",{parentName:"a"},"producers")),". Create a producer with an initial state and a set of actions, and you're ready to go."),(0,a.kt)(l.Z,{groupId:"languages",mdxType:"Tabs"},(0,a.kt)(u.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"showLineNumbers",showLineNumbers:!0},'import { createProducer } from "@rbxts/reflex";\n\ninterface State {\n    count: number;\n}\n\nconst initialState: State = {\n    count: 0,\n};\n\nconst producer = createProducer(initialState, {\n    increment: (state) => ({ ...state, count: state.count + 1 }),\n    reset: (state) => ({ ...state, count: 0 }),\n});\n'))),(0,a.kt)(u.Z,{value:"Luau",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-lua",metastring:"showLineNumbers",showLineNumbers:!0},"local Reflex = require(ReplicatedStorage.Packages.Reflex)\n\ntype Producer = Reflex.Producer<State, Actions>\n\ntype State = {\n    count: number,\n}\n\ntype Actions = {\n    increment: () -> (),\n    reset: () -> (),\n}\n\nlocal initialState: State = {\n    count = 0,\n}\n\nlocal producer = Reflex.createProducer(initialState, {\n    increment = function(state: State): State\n        return { count = state.count + 1 }\n    end,\n    reset = function(): State\n        return { count = 0 }\n    end,\n}) :: Producer\n")))),(0,a.kt)("h2",{id:"use-your-producer-anywhere"},"Use your producer anywhere"),(0,a.kt)("p",null,"Reflex was designed to make managing your state simple and straightforward. Dispatch actions by calling the action directly, and read & subscribe to state with selectors."),(0,a.kt)(l.Z,{groupId:"languages",mdxType:"Tabs"},(0,a.kt)(u.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"showLineNumbers",showLineNumbers:!0},"producer.subscribe(\n    (state) => state.count,\n    (count) => {\n        print(`The count is now ${count}`);\n    },\n);\n\nproducer.increment(); // The count is now 1\n"))),(0,a.kt)(u.Z,{value:"Luau",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-lua",metastring:"showLineNumbers",showLineNumbers:!0},'producer:subscribe(function(state)\n    return state.count\nend, function(count)\n    print("The count is now " .. count)\nend)\n\nproducer.increment() --\x3e The count is now 1\n')))))}f.isMDXComponent=!0}}]);