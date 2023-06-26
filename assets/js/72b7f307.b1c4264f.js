"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[117],{9613:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>h});var r=o(9496);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function s(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function i(e,t){if(null==e)return{};var o,r,n=function(e,t){if(null==e)return{};var o,r,n={},a=Object.keys(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var l=r.createContext({}),c=function(e){var t=r.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):s(s({},t),e)),o},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var o=e.components,n=e.mdxType,a=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=c(o),m=n,h=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return o?r.createElement(h,s(s({ref:t},u),{},{components:o})):r.createElement(h,s({ref:t},u))}));function h(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=o.length,s=new Array(a);s[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[d]="string"==typeof e?e:n,s[1]=i;for(var c=2;c<a;c++)s[c]=o[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,o)}m.displayName="MDXCreateElement"},401:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var r=o(1966),n=(o(9496),o(9613));const a={description:"Learn how to use the useSelector and useSelectorCreator hook to subscribe to state."},s="Selecting State",i={unversionedId:"guides/roact-reflex/selecting-state",id:"guides/roact-reflex/selecting-state",title:"Selecting State",description:"Learn how to use the useSelector and useSelectorCreator hook to subscribe to state.",source:"@site/docs/guides/roact-reflex/selecting-state.md",sourceDirName:"guides/roact-reflex",slug:"/guides/roact-reflex/selecting-state",permalink:"/reflex/docs/guides/roact-reflex/selecting-state",draft:!1,tags:[],version:"current",frontMatter:{description:"Learn how to use the useSelector and useSelectorCreator hook to subscribe to state."},sidebar:"learnSidebar",previous:{title:"Using the Producer",permalink:"/reflex/docs/guides/roact-reflex/using-the-producer"},next:{title:"Advanced Guides",permalink:"/reflex/docs/advanced-guides/"}},l={},c=[{value:"Subscribing to state",id:"subscribing-to-state",level:2},{value:"Passing arguments to selectors",id:"passing-arguments-to-selectors",level:2},{value:"Sorting todos",id:"sorting-todos",level:3},{value:"The wrong way to use a selector factory",id:"the-wrong-way-to-use-a-selector-factory",level:3},{value:"Using a selector factory",id:"using-a-selector-factory",level:3},{value:"Typed <code>useSelector</code> hook",id:"typed-useselector-hook",level:2},{value:"Summary",id:"summary",level:2}],u={toc:c},d="wrapper";function p(e){let{components:t,...o}=e;return(0,n.kt)(d,(0,r.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"selecting-state"},"Selecting State"),(0,n.kt)("p",null,"Similar to the ",(0,n.kt)("a",{parentName:"p",href:"docs/reference/reflex/producer#subscribeselector-predicate-listener"},(0,n.kt)("inlineCode",{parentName:"a"},"subscribe"))," method, the ",(0,n.kt)("a",{parentName:"p",href:"docs/reference/roact-reflex/use-selector"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelector"))," hook lets you select a value from the producer's state."),(0,n.kt)("admonition",{title:"what you'll learn",type:"note"},(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},"\ud83c\udf70 How to select a value from the producer"),(0,n.kt)("li",{parentName:"ul"},"\u2699\ufe0f How to select state with a selector factory"),(0,n.kt)("li",{parentName:"ul"},"\ud83d\udce6 How to write a typed ",(0,n.kt)("inlineCode",{parentName:"li"},"useSelector")," hook"))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"subscribing-to-state"},"Subscribing to state"),(0,n.kt)("p",null,"Let's say we had the same ",(0,n.kt)("inlineCode",{parentName:"p"},"todos")," slice from the ",(0,n.kt)("a",{parentName:"p",href:"using-the-producer"},"previous guide")," in our root producer:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todos.ts"',title:'"todos.ts"'},"interface TodosState {\n    readonly list: readonly string[];\n}\n\n// ...\n\nexport const todosSlice = createProducer(initialState, {\n    addTodo: (state, todo: string) => ({\n        ...state,\n        list: [...state.list, todo],\n    }),\n});\n")),(0,n.kt)("p",null,"If you want to select the todo list from the state in your component, you might try to subscribe to the producer and update the component's state whenever the todo list changes:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"const selectTodos = (state: RootState) => state.todos.list;\n\nfunction TodoList() {\n    const producer = useRootProducer();\n    const [todos, setTodos] = useState(producer.getState(selectTodos)));\n\n    useEffect(() => {\n        return producer.subscribe(selectTodos, setTodos);\n    }, [])\n    // ...\n}\n")),(0,n.kt)("p",null,"Now you have the todo list in your component's state, but you have to update it manually whenever the todo list changes. This is where the ",(0,n.kt)("inlineCode",{parentName:"p"},"useSelector")," hook comes in:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"const selectTodos = (state: RootState) => state.todos.list;\n\nfunction TodoList() {\n    // highlight-next-line\n    const todos = useSelector(selectTodos);\n    // ...\n}\n")),(0,n.kt)("p",null,"The ",(0,n.kt)("a",{parentName:"p",href:"docs/reference/roact-reflex/use-selector"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelector"))," hook automatically subscribes to the producer you passed to the ",(0,n.kt)("a",{parentName:"p",href:"docs/reference/roact-reflex/reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>"))," and updates the component whenever the selected value changes!"),(0,n.kt)("admonition",{type:"caution"},(0,n.kt)("p",{parentName:"admonition"},(0,n.kt)("strong",{parentName:"p"},"The same rules apply to the ",(0,n.kt)("inlineCode",{parentName:"strong"},"useSelector")," hook as the ",(0,n.kt)("a",{parentName:"strong",href:"docs/reference/reflex/producer#subscribeselector-predicate-listener"},(0,n.kt)("inlineCode",{parentName:"a"},"subscribe"))," method.")," If you pass a selector that creates a new object or array every time it's called, your component can re-render more often than you expect."),(0,n.kt)("p",{parentName:"admonition"},(0,n.kt)("a",{parentName:"p",href:"../using-selectors"},"Read more about writing good selectors \u2192"))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"passing-arguments-to-selectors"},"Passing arguments to selectors"),(0,n.kt)("p",null,"Often, you'll want to select a value from the producer that depends on props passed to your component. For example, if you have a ",(0,n.kt)("inlineCode",{parentName:"p"},"TodoList")," component that takes a ",(0,n.kt)("inlineCode",{parentName:"p"},"sortDirection")," prop, you might want to select the todos that match the filter."),(0,n.kt)("h3",{id:"sorting-todos"},"Sorting todos"),(0,n.kt)("p",null,"First, let's write a selector factory that takes the ",(0,n.kt)("inlineCode",{parentName:"p"},"sortDirection")," argument:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'const selectTodos = (state: RootState) => state.todos.list;\n\nconst selectSortedTodos = (sortDirection: "asc" | "desc") => {\n    return createSelector([selectTodos] as const, (todos) => {\n        return [...todos].sort((a, b) => {\n            return sortDirection === "asc" ? a < b : a > b;\n        });\n    });\n};\n')),(0,n.kt)("admonition",{type:"tip"},(0,n.kt)("p",{parentName:"admonition"},"This selector factory creates a ",(0,n.kt)("strong",{parentName:"p"},"memoized")," selector, which will only recompute the value when the ",(0,n.kt)("inlineCode",{parentName:"p"},"todos")," dependency changes. It's good practice to memoize selectors that return new objects or arrays."),(0,n.kt)("p",{parentName:"admonition"},(0,n.kt)("a",{parentName:"p",href:"../using-selectors"},"Read more about writing good selectors \u2192"))),(0,n.kt)("h3",{id:"the-wrong-way-to-use-a-selector-factory"},"The wrong way to use a selector factory"),(0,n.kt)("p",null,"To use this selector in your component, you might try to call the selector factory in your component on its own:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"function TodoList({ sortDirection }: Props) {\n    // error-next-line\n    // \ud83d\udd34 Avoid: creates a selector every render, re-runs too often\n    // error-next-line\n    const todos = useSelector(selectSortedTodos(sortDirection));\n    // ...\n}\n")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"But calling selector factories like this is dangerous!")," It's not safe to create a selector inside of a component without passing it to ",(0,n.kt)("inlineCode",{parentName:"p"},"useMemo"),". This is because of ",(0,n.kt)("a",{parentName:"p",href:"../using-selectors#passing-arguments-to-selectors"},"how selector factories work")," when the selector is created with ",(0,n.kt)("inlineCode",{parentName:"p"},"createSelector"),"."),(0,n.kt)("p",null,"When you call a selector factory, it creates a ",(0,n.kt)("em",{parentName:"p"},"new"),' memoized selector initialized with a new cache. This means that the selector will "forget" its previous values and recompute it from scratch. So, how do we use a selector factory in a component?'),(0,n.kt)("h3",{id:"using-a-selector-factory"},"Using a selector factory"),(0,n.kt)("p",null,"To use a selector factory, you need to avoid creating the selector unless the arguments change. You can do this with ",(0,n.kt)("inlineCode",{parentName:"p"},"useMemo"),":"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"function TodoList({ sortDirection }: Props) {\n    // highlight-start\n    // \u2705 Good: create a selector when the sortDirection changes\n    const selector = useMemo(() => {\n        return selectSortedTodos(sortDirection);\n    }, [sortDirection]);\n    // highlight-end\n\n    const todos = useSelector(selector);\n    // ...\n}\n")),(0,n.kt)("p",null,"Now, the selector will only be created when the ",(0,n.kt)("inlineCode",{parentName:"p"},"sortDirection")," prop changes, allowing the selector to properly memoize its value."),(0,n.kt)("p",null,"This is also exactly what the ",(0,n.kt)("a",{parentName:"p",href:"docs/reference/roact-reflex/use-selector-creator"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelectorCreator"))," hook does!"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"function TodoList({ sortDirection }: Props) {\n    // highlight-start\n    // \u2705 Good: use the useSelectorCreator hook\n    const todos = useSelectorCreator(selectSortedTodos, sortDirection);\n    // highlight-end\n    // ...\n}\n")),(0,n.kt)("admonition",{type:"caution"},(0,n.kt)("p",{parentName:"admonition"},"Because your factory is memoized by its arguments, you should avoid passing arguments that change every re-render. For example, if you pass a function as an argument, it could be re-created every render, causing extra re-renders:"),(0,n.kt)("pre",{parentName:"admonition"},(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"function TodoList() {\n    // error-next-line\n    // \ud83d\udd34 Avoid: selector re-created for a new function every render\n    // error-next-line\n    const todos = useSelectorCreator(selectSortedTodos, (a, b) => a < b);\n    // ...\n}\n")),(0,n.kt)("p",{parentName:"admonition"},"Remember to memoize any arguments that change every render, including arrays and objects!"),(0,n.kt)("pre",{parentName:"admonition"},(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="TodoList.tsx"',title:'"TodoList.tsx"'},"function TodoList() {\n    // highlight-start\n    // \u2705 Good: memoizes the argument\n    const sorter = useMemo(() => (a, b) => a < b, []);\n    const todos = useSelectorCreator(selectSortedTodos, sorter);\n    // highlight-end\n    // ...\n}\n"))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"typed-useselector-hook"},"Typed ",(0,n.kt)("inlineCode",{parentName:"h2"},"useSelector")," hook"),(0,n.kt)("p",null,"You might want to create a selector and pass it to ",(0,n.kt)("inlineCode",{parentName:"p"},"useSelector")," manually:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="Button.tsx"',title:'"Button.tsx"'},"function Button() {\n    const todos = useSelector((state: RootState) => state.todos.list);\n    // ...\n}\n")),(0,n.kt)("p",null,"But this can get repetitive if you have to write the same ",(0,n.kt)("inlineCode",{parentName:"p"},"state")," type for every selector. You can create a typed ",(0,n.kt)("inlineCode",{parentName:"p"},"useSelector")," hook to avoid this:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},'import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/roact-reflex";\nimport { RootProducer } from "./producer";\n\nexport const useRootProducer: UseProducerHook<RootProducer> = useProducer;\n// highlight-next-line\nexport const useRootSelector: UseSelectorHook<RootProducer> = useSelector;\n')),(0,n.kt)("p",null,"Now, you can use the typed ",(0,n.kt)("inlineCode",{parentName:"p"},"useSelector")," hook in your components:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"function Button() {\n    // highlight-next-line\n    const todos = useRootSelector((state) => state.todos.list);\n    // ...\n}\n")),(0,n.kt)("admonition",{type:"caution"},(0,n.kt)("p",{parentName:"admonition"},"You shouldn't create a typed ",(0,n.kt)("inlineCode",{parentName:"p"},"useSelectorCreator")," hook because the ",(0,n.kt)("inlineCode",{parentName:"p"},"state")," types should be manually defined by the selector factory ",(0,n.kt)("em",{parentName:"p"},"outside")," of the component.")),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"summary"},"Summary"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"You can call ",(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelector"))," to select a value from the producer."),(0,n.kt)("li",{parentName:"ul"},"Use the ",(0,n.kt)("a",{parentName:"li",href:"docs/reference/roact-reflex/use-selector-creator"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelectorCreator"))," hook to create a memoized selector factory that takes arguments."),(0,n.kt)("li",{parentName:"ul"},"You can create a typed ",(0,n.kt)("inlineCode",{parentName:"li"},"useSelector")," hook to avoid writing the same ",(0,n.kt)("inlineCode",{parentName:"li"},"state")," type if you create selectors manually.")))}p.isMDXComponent=!0}}]);