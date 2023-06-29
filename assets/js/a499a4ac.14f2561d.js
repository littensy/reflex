"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[461],{9613:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>h});var a=r(9496);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,o=function(e,t){if(null==e)return{};var r,a,o={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=a.createContext({}),i=function(e){var t=a.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},d=function(e){var t=i(e.components);return a.createElement(u.Provider,{value:t},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,n=e.originalType,u=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=i(r),m=o,h=c["".concat(u,".").concat(m)]||c[m]||p[m]||n;return r?a.createElement(h,s(s({ref:t},d),{},{components:r})):a.createElement(h,s({ref:t},d))}));function h(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=r.length,s=new Array(n);s[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[c]="string"==typeof e?e:o,s[1]=l;for(var i=2;i<n;i++)s[i]=r[i];return a.createElement.apply(null,s)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},3469:(e,t,r)=>{r.d(t,{Z:()=>s});var a=r(9496),o=r(5924);const n={tabItem:"tabItem_rlDe"};function s(e){let{children:t,hidden:r,className:s}=e;return a.createElement("div",{role:"tabpanel",className:(0,o.Z)(n.tabItem,s),hidden:r},t)}},6187:(e,t,r)=>{r.d(t,{Z:()=>T});var a=r(1966),o=r(9496),n=r(5924),s=r(2180),l=r(3442),u=r(2799),i=r(441),d=r(1006);function c(e){return function(e){return o.Children.map(e,(e=>{if(!e||(0,o.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:r,attributes:a,default:o}}=e;return{value:t,label:r,attributes:a,default:o}}))}function p(e){const{values:t,children:r}=e;return(0,o.useMemo)((()=>{const e=t??c(r);return function(e){const t=(0,i.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,r])}function m(e){let{value:t,tabValues:r}=e;return r.some((e=>e.value===t))}function h(e){let{queryString:t=!1,groupId:r}=e;const a=(0,l.k6)(),n=function(e){let{queryString:t=!1,groupId:r}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:t,groupId:r});return[(0,u._X)(n),(0,o.useCallback)((e=>{if(!n)return;const t=new URLSearchParams(a.location.search);t.set(n,e),a.replace({...a.location,search:t.toString()})}),[n,a])]}function f(e){const{defaultValue:t,queryString:r=!1,groupId:a}=e,n=p(e),[s,l]=(0,o.useState)((()=>function(e){let{defaultValue:t,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=r.find((e=>e.default))??r[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:n}))),[u,i]=h({queryString:r,groupId:a}),[c,f]=function(e){let{groupId:t}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,n]=(0,d.Nk)(r);return[a,(0,o.useCallback)((e=>{r&&n.set(e)}),[r,n])]}({groupId:a}),g=(()=>{const e=u??c;return m({value:e,tabValues:n})?e:null})();(0,o.useLayoutEffect)((()=>{g&&l(g)}),[g]);return{selectedValue:s,selectValue:(0,o.useCallback)((e=>{if(!m({value:e,tabValues:n}))throw new Error(`Can't select invalid tab value=${e}`);l(e),i(e),f(e)}),[i,f,n]),tabValues:n}}var g=r(4230);const b={tabList:"tabList_t2F_",tabItem:"tabItem_TXTv"};function y(e){let{className:t,block:r,selectedValue:l,selectValue:u,tabValues:i}=e;const d=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.o5)(),p=e=>{const t=e.currentTarget,r=d.indexOf(t),a=i[r].value;a!==l&&(c(t),u(a))},m=e=>{let t=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{const r=d.indexOf(e.currentTarget)+1;t=d[r]??d[0];break}case"ArrowLeft":{const r=d.indexOf(e.currentTarget)-1;t=d[r]??d[d.length-1];break}}t?.focus()};return o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,n.Z)("tabs",{"tabs--block":r},t)},i.map((e=>{let{value:t,label:r,attributes:s}=e;return o.createElement("li",(0,a.Z)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>d.push(e),onKeyDown:m,onClick:p},s,{className:(0,n.Z)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":l===t})}),r??t)})))}function k(e){let{lazy:t,children:r,selectedValue:a}=e;const n=(Array.isArray(r)?r:[r]).filter(Boolean);if(t){const e=n.find((e=>e.props.value===a));return e?(0,o.cloneElement)(e,{className:"margin-top--md"}):null}return o.createElement("div",{className:"margin-top--md"},n.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function v(e){const t=f(e);return o.createElement("div",{className:(0,n.Z)("tabs-container",b.tabList)},o.createElement(y,(0,a.Z)({},e,t)),o.createElement(k,(0,a.Z)({},e,t)))}function T(e){const t=(0,g.Z)();return o.createElement(v,(0,a.Z)({key:String(t)},e))}},1121:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>u,default:()=>h,frontMatter:()=>l,metadata:()=>i,toc:()=>c});var a=r(1966),o=(r(9496),r(9613)),n=r(6187),s=r(3469);const l={description:"Learn how to write a producer in Reflex."},u="Your First Producer",i={unversionedId:"guides/your-first-producer",id:"guides/your-first-producer",title:"Your First Producer",description:"Learn how to write a producer in Reflex.",source:"@site/docs/guides/your-first-producer.md",sourceDirName:"guides",slug:"/guides/your-first-producer",permalink:"/reflex/docs/guides/your-first-producer",draft:!1,tags:[],version:"current",frontMatter:{description:"Learn how to write a producer in Reflex."},sidebar:"learnSidebar",previous:{title:"Guides",permalink:"/reflex/docs/guides/"},next:{title:"Organizing Producers",permalink:"/reflex/docs/guides/organizing-producers"}},d={},c=[{value:"What is a producer?",id:"what-is-a-producer",level:2},{value:"Creating a producer",id:"creating-a-producer",level:2},{value:"State",id:"state",level:3},{value:"Actions",id:"actions",level:3},{value:"Selectors",id:"selectors",level:3},{value:"Using a producer",id:"using-a-producer",level:2},{value:"Organizing producers",id:"organizing-producers",level:3},{value:"Summary",id:"summary",level:2}],p={toc:c},m="wrapper";function h(e){let{components:t,...r}=e;return(0,o.kt)(m,(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"your-first-producer"},"Your First Producer"),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"Producers")," are the building blocks of Reflex. They are the state containers that hold your state and actions, and you can use them to read and subscribe to your state."),(0,o.kt)("admonition",{title:"what you'll learn",type:"note"},(0,o.kt)("ul",{parentName:"admonition"},(0,o.kt)("li",{parentName:"ul"},"\ud83d\udd0d What a producer is"),(0,o.kt)("li",{parentName:"ul"},"\u2728 How to create a producer"),(0,o.kt)("li",{parentName:"ul"},"\ud83d\udee0\ufe0f How to use your producer"))),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"what-is-a-producer"},"What is a producer?"),(0,o.kt)("p",null,"A ",(0,o.kt)("a",{parentName:"p",href:"../reference/reflex/producer"},"producer")," is a state container that you can use to dispatch actions or observe state changes. They're designed to be used as a single source of truth for your state, and provide an all-in-one interface for managing your game's state."),(0,o.kt)("p",null,"Where ",(0,o.kt)("a",{parentName:"p",href:"https://roblox.github.io/"},"Rodux")," uses a reducer to return the next state of a store, Reflex has actions that return the next state of the producer. Reflex aims to be quick to set up and easy to use, so creating a producer is simple and straightforward."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"creating-a-producer"},"Creating a producer"),(0,o.kt)("p",null,"Traditionally, ",(0,o.kt)("a",{parentName:"p",href:"https://roblox.github.io/rodux"},"Rodux")," uses a reducer function that takes in an action and returns a new state. Reflex takes a slightly different approach and allows the actions themselves to update the state. Here's what a producer might look like:"),(0,o.kt)(n.Z,{groupId:"languages",mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todos.ts" showLineNumbers',title:'"todos.ts"',showLineNumbers:!0},'import { createProducer } from "@rbxts/reflex";\n\nexport interface TodosState {\n    readonly todos: readonly string[];\n}\n\nconst initialState: TodosState = {\n    todos: [],\n};\n\nexport const todos = createProducer(initialState, {\n    addTodo: (state, todo: string) => ({\n        ...state,\n        todos: [...state.todos, todo],\n    }),\n\n    removeTodo: (state, todo: string) => ({\n        ...state,\n        todos: state.todos.filter((t) => t !== todo),\n    }),\n});\n'))),(0,o.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-lua",metastring:'title="todos.lua" showLineNumbers',title:'"todos.lua"',showLineNumbers:!0},"local Reflex = require(ReplicatedStorage.Packages.Reflex)\n\nexport type TodosProducer = Reflex.Producer<TodosState, TodosActions>\n\nexport type TodosState = {\n    todos: { string },\n}\n\nexport type TodosActions = {\n    addTodo: (todo: string) -> (),\n    removeTodo: (todo: string) -> (),\n}\n\nlocal initialState: TodosState = {\n    todos = {},\n}\n\nlocal todos = Reflex.createProducer(initialState, {\n    addTodo = function(state: TodosState, todo: string): TodosState\n        local nextState = table.clone(state)\n        local nextTodos = table.clone(state.todos)\n\n        table.insert(nextTodos, todo)\n        nextState.todos = nextTodos\n\n        return nextState\n    end,\n\n    removeTodo = function(state: TodosState, todo: string): TodosState\n        local nextState = table.clone(state)\n        local nextTodos = table.clone(state.todos)\n\n        table.remove(nextTodos, table.find(nextTodos, todo) or -1)\n        nextState.todos = nextTodos\n\n        return nextState\n    end,\n}) :: TodosProducer\n\nreturn todos\n")))),(0,o.kt)("p",null,"A producer consists of:"),(0,o.kt)("h3",{id:"state"},"State"),(0,o.kt)("p",null,"The ",(0,o.kt)("strong",{parentName:"p"},"state")," is the data that your producer holds. It's the source of truth for your game or app, and can only be modified by your actions. In the example above, the state is an object with a ",(0,o.kt)("inlineCode",{parentName:"p"},"todos")," property, which is an array of strings."),(0,o.kt)("p",null,"You've probably noticed that the state is marked as ",(0,o.kt)("inlineCode",{parentName:"p"},"readonly"),". This is because Reflex is an ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Immutable_object"},"immutable")," state container. You can't write to the state directly, and instead must return a new state from your actions."),(0,o.kt)("h3",{id:"actions"},"Actions"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Actions")," are functions that modify your state. They should be ",(0,o.kt)("em",{parentName:"p"},"idempotent"),", meaning that they should always return the same result when given the same arguments. In the example above, ",(0,o.kt)("inlineCode",{parentName:"p"},"addTodo")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"removeTodo")," are actions that modify the ",(0,o.kt)("inlineCode",{parentName:"p"},"todos")," property of the state."),(0,o.kt)("p",null,"To add a todo to the list, you would simply run ",(0,o.kt)("inlineCode",{parentName:"p"},"todos.addTodo(name)"),". Note that these are not methods, so you shouldn't use the ",(0,o.kt)("inlineCode",{parentName:"p"},":")," operator to call them in Luau."),(0,o.kt)("h3",{id:"selectors"},"Selectors"),(0,o.kt)("p",null,"Coming up are ",(0,o.kt)("strong",{parentName:"p"},"selectors"),", functions that receive the state and return a subset of it. They're useful for reading and subscribing to your state, and you'll learn more about them in the next guides."),(0,o.kt)("p",null,"You can get the state with a selector by running ",(0,o.kt)("inlineCode",{parentName:"p"},"todos.getState(selectTodos)"),", or you can use a ",(0,o.kt)("inlineCode",{parentName:"p"},"producer.subscribe")," to listen for changes in the selector's results."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"using-a-producer"},"Using a producer"),(0,o.kt)("p",null,"Now that you've created a producer, you're free to read and modify its state. For example, you can print the list of todos whenever it changes:"),(0,o.kt)(n.Z,{groupId:"languages",mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:"showLineNumbers",showLineNumbers:!0},'import { TodosState, todos } from "./todos";\n\nconst selectTodos = (state: TodosState) => state.todos;\n\ntodos.subscribe(selectTodos, (todos) => {\n    print(`TODO: ${todos.join(", ")}`);\n});\n\ntodos.addTodo("Buy milk");\ntodos.addTodo("Buy eggs");\n'))),(0,o.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-lua",metastring:"showLineNumbers",showLineNumbers:!0},'local todos = require(script.Parent.todos)\n\nlocal function selectTodos(state: todos.TodosState)\n    return state.todos\nend\n\ntodos:subscribe(selectTodos, function(todos)\n    print("TODO: " .. table.concat(todos, ", "))\nend)\n\ntodos.addTodo("Buy milk")\ntodos.addTodo("Buy eggs")\n')))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-lua"},"--\x3e TODO: Buy milk, Buy eggs\n")),(0,o.kt)("p",null,"This example ",(0,o.kt)("a",{parentName:"p",href:"../reference/reflex/producer#subscribeselector-predicate-listener"},"subscribes")," to changes in ",(0,o.kt)("inlineCode",{parentName:"p"},"state.todos")," and prints the list of todos whenever it changes. After adding ",(0,o.kt)("inlineCode",{parentName:"p"},"Buy milk")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"Buy eggs")," to the list, it prints the updated list."),(0,o.kt)("h3",{id:"organizing-producers"},"Organizing producers"),(0,o.kt)("p",null,"Reflex is designed to have one root producer be the ",(0,o.kt)("strong",{parentName:"p"},"single source of truth")," for your state. This producer can be composed of smaller slices that handle different parts of your state."),(0,o.kt)("p",null,"For example, you could have a ",(0,o.kt)("inlineCode",{parentName:"p"},"calendar")," producer that stores important dates, and a ",(0,o.kt)("inlineCode",{parentName:"p"},"todos")," producer that handles the list of todos. You will learn more about this in the ",(0,o.kt)("a",{parentName:"p",href:"organizing-producers"},"next guide"),"."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"summary"},"Summary"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Producers")," are state containers that hold your state and actions."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Actions")," are functions that modify your state."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"State")," is the immutable data that your producer holds."),(0,o.kt)("li",{parentName:"ul"},"You can ",(0,o.kt)("strong",{parentName:"li"},"subscribe")," to changes in your state using ",(0,o.kt)("inlineCode",{parentName:"li"},"subscribe"),"."),(0,o.kt)("li",{parentName:"ul"},"The producer exposes your actions as callbacks, which you can call to change the state.")))}h.isMDXComponent=!0}}]);