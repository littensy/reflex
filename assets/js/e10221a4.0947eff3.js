"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[289],{9613:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var a=r(9496);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),i=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=i(e.components);return a.createElement(s.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=i(r),f=n,m=d["".concat(s,".").concat(f)]||d[f]||p[f]||o;return r?a.createElement(m,l(l({ref:t},u),{},{components:r})):a.createElement(m,l({ref:t},u))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[d]="string"==typeof e?e:n,l[1]=c;for(var i=2;i<o;i++)l[i]=r[i];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}f.displayName="MDXCreateElement"},5483:(e,t,r)=>{r.d(t,{Z:()=>k});var a=r(9496),n=r(5924),o=r(5773),l=r(7282),c=r(3355),s=r(8367);const i={cardContainer:"cardContainer_DSRY",cardTitle:"cardTitle_z686",cardDescription:"cardDescription_gekd"};function u(e){let{href:t,children:r}=e;return a.createElement(l.Z,{href:t,className:(0,n.Z)("card padding--lg",i.cardContainer)},r)}function d(e){let{href:t,icon:r,title:o,description:l}=e;return a.createElement(u,{href:t},a.createElement("h2",{className:(0,n.Z)("text--truncate",i.cardTitle),title:o},r," ",o),l&&a.createElement("p",{className:(0,n.Z)("text--truncate",i.cardDescription),title:l},l))}function p(e){let{item:t}=e;const r=(0,o.Wl)(t);return r?a.createElement(d,{href:r,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??(0,s.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function f(e){let{item:t}=e;const r=(0,c.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",n=(0,o.xz)(t.docId??void 0);return a.createElement(d,{href:t.href,icon:r,title:t.label,description:t.description??n?.description})}function m(e){let{item:t}=e;switch(t.type){case"link":return a.createElement(f,{item:t});case"category":return a.createElement(p,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function h(e){let{className:t}=e;const r=(0,o.jA)();return a.createElement(k,{items:r.items,className:t})}function k(e){const{items:t,className:r}=e;if(!t)return a.createElement(h,e);const l=(0,o.MN)(t);return a.createElement("section",{className:(0,n.Z)("row",r)},l.map(((e,t)=>a.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},a.createElement(m,{item:e})))))}},4575:(e,t,r)=>{r.d(t,{Z:()=>l});var a=r(9496),n=r(5924);const o={tabItem:"tabItem_rlDe"};function l(e){let{children:t,hidden:r,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,n.Z)(o.tabItem,l),hidden:r},t)}},7934:(e,t,r)=>{r.d(t,{Z:()=>y});var a=r(1966),n=r(9496),o=r(5924),l=r(6888),c=r(3442),s=r(4475),i=r(8423),u=r(1010);function d(e){return function(e){return n.Children.map(e,(e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:r,attributes:a,default:n}}=e;return{value:t,label:r,attributes:a,default:n}}))}function p(e){const{values:t,children:r}=e;return(0,n.useMemo)((()=>{const e=t??d(r);return function(e){const t=(0,i.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,r])}function f(e){let{value:t,tabValues:r}=e;return r.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:r}=e;const a=(0,c.k6)(),o=function(e){let{queryString:t=!1,groupId:r}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:t,groupId:r});return[(0,s._X)(o),(0,n.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(a.location.search);t.set(o,e),a.replace({...a.location,search:t.toString()})}),[o,a])]}function h(e){const{defaultValue:t,queryString:r=!1,groupId:a}=e,o=p(e),[l,c]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!f({value:t,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=r.find((e=>e.default))??r[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:o}))),[s,i]=m({queryString:r,groupId:a}),[d,h]=function(e){let{groupId:t}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,o]=(0,u.Nk)(r);return[a,(0,n.useCallback)((e=>{r&&o.set(e)}),[r,o])]}({groupId:a}),k=(()=>{const e=s??d;return f({value:e,tabValues:o})?e:null})();(0,n.useLayoutEffect)((()=>{k&&c(k)}),[k]);return{selectedValue:l,selectValue:(0,n.useCallback)((e=>{if(!f({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);c(e),i(e),h(e)}),[i,h,o]),tabValues:o}}var k=r(6648);const b={tabList:"tabList_t2F_",tabItem:"tabItem_TXTv"};function g(e){let{className:t,block:r,selectedValue:c,selectValue:s,tabValues:i}=e;const u=[],{blockElementScrollPositionUntilNextRender:d}=(0,l.o5)(),p=e=>{const t=e.currentTarget,r=u.indexOf(t),a=i[r].value;a!==c&&(d(t),s(a))},f=e=>{let t=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{const r=u.indexOf(e.currentTarget)+1;t=u[r]??u[0];break}case"ArrowLeft":{const r=u.indexOf(e.currentTarget)-1;t=u[r]??u[u.length-1];break}}t?.focus()};return n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":r},t)},i.map((e=>{let{value:t,label:r,attributes:l}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:c===t?0:-1,"aria-selected":c===t,key:t,ref:e=>u.push(e),onKeyDown:f,onClick:p},l,{className:(0,o.Z)("tabs__item",b.tabItem,l?.className,{"tabs__item--active":c===t})}),r??t)})))}function x(e){let{lazy:t,children:r,selectedValue:a}=e;const o=(Array.isArray(r)?r:[r]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return n.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function v(e){const t=h(e);return n.createElement("div",{className:(0,o.Z)("tabs-container",b.tabList)},n.createElement(g,(0,a.Z)({},e,t)),n.createElement(x,(0,a.Z)({},e,t)))}function y(e){const t=(0,k.Z)();return n.createElement(v,(0,a.Z)({key:String(t)},e))}},3784:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var a=r(1966),n=(r(9496),r(9613)),o=r(7934),l=r(4575),c=r(5483);const s={description:"Using Roact Reflex, bindings for Reflex and Roact Hooked."},i="Roact Reflex",u={unversionedId:"guides/roact-reflex/roact-reflex",id:"guides/roact-reflex/roact-reflex",title:"Roact Reflex",description:"Using Roact Reflex, bindings for Reflex and Roact Hooked.",source:"@site/docs/guides/roact-reflex/roact-reflex.md",sourceDirName:"guides/roact-reflex",slug:"/guides/roact-reflex/",permalink:"/reflex/docs/guides/roact-reflex/",draft:!1,tags:[],version:"current",frontMatter:{description:"Using Roact Reflex, bindings for Reflex and Roact Hooked."},sidebar:"learnSidebar",previous:{title:"Observers and Entities",permalink:"/reflex/docs/guides/observers-and-entities"},next:{title:"Using the Producer",permalink:"/reflex/docs/guides/roact-reflex/using-the-producer"}},d={},p=[{value:"Quick Start",id:"quick-start",level:2},{value:"Components",id:"components",level:2},{value:"Hooks",id:"hooks",level:2},{value:"Context Hooks",id:"context-hooks",level:3},{value:"State Hooks",id:"state-hooks",level:3},{value:"Guides",id:"guides",level:2}],f={toc:p},m="wrapper";function h(e){let{components:t,...r}=e;return(0,n.kt)(m,(0,a.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"roact-reflex"},"Roact Reflex"),(0,n.kt)("p",null,"Reflex offers bindings for ",(0,n.kt)("a",{parentName:"p",href:"https://roblox.github.io/roact/"},"Roact")," and ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/littensy/rbxts-roact-hooked"},"Roact Hooked")," that allow you to use Hooks to read and dispatch actions to a Reflex producer from a component."),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"quick-start"},"Quick Start"),(0,n.kt)("p",null,"The official bindings for Reflex and Roact Hooked are available under ",(0,n.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@rbxts/roact-reflex"},(0,n.kt)("inlineCode",{parentName:"a"},"@rbxts/roact-reflex")),". Currently, there is no support for Luau projects."),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://github.com/littensy/roact-reflex"},"See the source code on GitHub \u2192")),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"npm",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Terminal"',title:'"Terminal"'},"npm install @rbxts/roact-reflex\n"))),(0,n.kt)(l.Z,{value:"Yarn",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Terminal"',title:'"Terminal"'},"yarn add @rbxts/roact-reflex\n"))),(0,n.kt)(l.Z,{value:"pnpm",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Terminal"',title:'"Terminal"'},"pnpm add @rbxts/roact-reflex\n")))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"components"},"Components"),(0,n.kt)("p",null,"Roact Reflex allows you to use your root producer from Roact function components. It exposes a component that you can use to specify the producer for Hooks to use:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>"))," enables Reflex Hooks for a producer.",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/reflex-provider#setting-up-roact-reflex"},"Setting up Roact Reflex")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/reflex-provider#using-other-providers-with-reflexprovider"},"Using other providers with ",(0,n.kt)("inlineCode",{parentName:"a"},"ReflexProvider")))))),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"Roact.mount(\n    <ReflexProvider producer={producer}>\n        <App />\n    </ReflexProvider>,\n    playerGui,\n);\n")),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"hooks"},"Hooks"),(0,n.kt)("p",null,"You can use Hooks to read and subscribe to state, or to dispatch actions. Use these Hooks in function components that are wrapped in a ",(0,n.kt)("a",{parentName:"p",href:"docs/reference/roact-reflex/reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>")),"."),(0,n.kt)("h3",{id:"context-hooks"},"Context Hooks"),(0,n.kt)("p",null,"Use these Hooks to access the root producer and dispatch actions:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-producer"},(0,n.kt)("inlineCode",{parentName:"a"},"useProducer"))," lets components read and dispatch actions to the root producer.",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-producer#dispatching-actions"},"Dispatching actions")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-producer#typed-useproducer-hook"},"Typed ",(0,n.kt)("inlineCode",{parentName:"a"},"useProducer")," hook"))))),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"function Button() {\n    const { increment } = useProducer();\n    // ...\n")),(0,n.kt)("h3",{id:"state-hooks"},"State Hooks"),(0,n.kt)("p",null,"Use these Hooks to read and subscribe to state:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelector"))," lets a component subscribe to a Reflex producer.",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector#subscribing-to-a-producers-state"},"Subscribing to a producer's state")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector#custom-equality-comparison"},"Custom equality comparison")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector#using-selectors-with-curried-arguments"},"Using selectors with curried arguments")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector-creator"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelectorCreator"))," lets you call ",(0,n.kt)("inlineCode",{parentName:"li"},"useSelector")," with a ",(0,n.kt)("a",{parentName:"li",href:"docs/reference/reflex/create-selector#selector-factories"},"selector factory"),".",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector-creator#subscribing-to-state-with-selector-factories"},"Subscribing to state with selector factories"))))),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"function Counter() {\n    const count = useSelector((state) => state.count);\n    // ...\n")),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"guides"},"Guides"),(0,n.kt)(c.Z,{mdxType:"DocCardList"}))}h.isMDXComponent=!0}}]);