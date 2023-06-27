"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[184],{9613:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>k});var r=a(9496);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var o=r.createContext({}),p=function(e){var t=r.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=p(e.components);return r.createElement(o.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=p(a),d=n,k=m["".concat(o,".").concat(d)]||m[d]||c[d]||l;return a?r.createElement(k,i(i({ref:t},u),{},{components:a})):r.createElement(k,i({ref:t},u))}));function k(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,i=new Array(l);i[0]=d;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[m]="string"==typeof e?e:n,i[1]=s;for(var p=2;p<l;p++)i[p]=a[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},6330:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>c,frontMatter:()=>l,metadata:()=>s,toc:()=>p});var r=a(1966),n=(a(9496),a(9613));const l={description:"See Reflex in example projects."},i="Examples",s={unversionedId:"quick-start/examples",id:"quick-start/examples",title:"Examples",description:"See Reflex in example projects.",source:"@site/docs/quick-start/examples.md",sourceDirName:"quick-start",slug:"/quick-start/examples",permalink:"/reflex/docs/quick-start/examples",draft:!1,tags:[],version:"current",frontMatter:{description:"See Reflex in example projects."},sidebar:"learnSidebar",previous:{title:"Installation",permalink:"/reflex/docs/quick-start/installation"},next:{title:"Guides",permalink:"/reflex/docs/guides/"}},o={},p=[{value:"TypeScript",id:"typescript",level:2},{value:"Usage",id:"usage",level:3},{value:"Pre-requisites",id:"pre-requisites",level:3},{value:"Recommended Extensions",id:"recommended-extensions",level:3},{value:"Luau",id:"luau",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Pre-requisites",id:"pre-requisites-1",level:3},{value:"Recommended Extensions",id:"recommended-extensions-1",level:3}],u={toc:p},m="wrapper";function c(e){let{components:t,...a}=e;return(0,n.kt)(m,(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"examples"},"Examples"),(0,n.kt)("p",null,"Reflex has a couple of example projects that you can use to get started."),(0,n.kt)("h2",{id:"typescript"},"TypeScript"),(0,n.kt)("p",null,"A minimal Roblox-TS example project using Reflex for state management."),(0,n.kt)("p",null,"Currently, this example has:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud83c\udf70 Shared producer slices"),(0,n.kt)("li",{parentName:"ul"},"\ud83d\udcbe Player data with Lapis"),(0,n.kt)("li",{parentName:"ul"},"\ud83d\udef0\ufe0f Server-to-client data syncing")),(0,n.kt)("h3",{id:"usage"},"Usage"),(0,n.kt)("p",null,"Clone this repository to get started."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/littensy/reflex-example-ts.git\n\ncd reflex-example-ts\nnpm install\nnpm run build\n")),(0,n.kt)("h3",{id:"pre-requisites"},"Pre-requisites"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://roblox-ts.com/docs/"},"Roblox-TS")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://rojo.space/docs/installation/"},"Rojo")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://nodejs.org/en/download/"},"Node.js"))),(0,n.kt)("h3",{id:"recommended-extensions"},"Recommended Extensions"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint"},"ESLint")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion"},"TestEZ Companion"))),(0,n.kt)("h2",{id:"luau"},"Luau"),(0,n.kt)("p",null,"A minimal Luau example project using Reflex for state management."),(0,n.kt)("p",null,"Currently, this example has:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud83c\udf70 Shared producer slices"),(0,n.kt)("li",{parentName:"ul"},"\ud83d\udcbe Player data with Lapis"),(0,n.kt)("li",{parentName:"ul"},"\ud83d\udef0\ufe0f Server-to-client data syncing")),(0,n.kt)("h3",{id:"usage-1"},"Usage"),(0,n.kt)("p",null,"Clone this repository to get started."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/littensy/reflex-example-luau.git\n\ncd reflex-example-luau\nwally install\nrojo sourcemap -o sourcemap.json\nwally-package-types --sourcemap sourcemap.json Packages\n")),(0,n.kt)("h3",{id:"pre-requisites-1"},"Pre-requisites"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/LPGhatguy/aftman"},"Aftman")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://rojo.space/docs/installation/"},"Rojo")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://wally.run"},"Wally"))),(0,n.kt)("h3",{id:"recommended-extensions-1"},"Recommended Extensions"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion"},"TestEZ Companion")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=Kampfkarren.selene-vscode"},"Selene")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=JohnnyMorganz.luau-lsp"},"Luau LSP")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=JohnnyMorganz.stylua"},"StyLua"))))}c.isMDXComponent=!0}}]);