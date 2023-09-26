"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[158],{7750:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>m,frontMatter:()=>n,metadata:()=>c,toc:()=>u});var o=r(8028),a=(r(9496),r(9613)),s=(r(5297),r(7233),r(7847));const n={sidebar_position:4,description:"Memoize and subscribe to to a selector factory with useSelectorCreator."},l="useSelectorCreator",c={unversionedId:"reference/roact-reflex/use-selector-creator",id:"reference/roact-reflex/use-selector-creator",title:"useSelectorCreator",description:"Memoize and subscribe to to a selector factory with useSelectorCreator.",source:"@site/docs/reference/roact-reflex/use-selector-creator.md",sourceDirName:"reference/roact-reflex",slug:"/reference/roact-reflex/use-selector-creator",permalink:"/reflex/docs/reference/roact-reflex/use-selector-creator",draft:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4,description:"Memoize and subscribe to to a selector factory with useSelectorCreator."},sidebar:"referenceSidebar",previous:{title:"useSelector",permalink:"/reflex/docs/reference/roact-reflex/use-selector"}},i={},u=[{value:"Reference",id:"reference",level:2},{value:"<code>useSelectorCreator(factory, ...args)</code>",id:"useselectorcreatorfactory-args",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Usage",id:"usage",level:2},{value:"Subscribing to state with selector factories",id:"subscribing-to-state-with-selector-factories",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"<code>useSelectorCreator</code> is creating a new selector every render",id:"useselectorcreator-is-creating-a-new-selector-every-render",level:3}],d={toc:u},p="wrapper";function m(e){let{components:t,...r}=e;return(0,a.kt)(p,(0,o.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"useselectorcreator"},"useSelectorCreator"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"useSelectorCreator")," is a Reflex Hook that lets you memoize and subscribe to a ",(0,a.kt)("a",{parentName:"p",href:"../reflex/create-selector#selector-factories"},"selector factory"),"'s state from your component."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const state = useSelectorCreator(factory, ...args);\n")),(0,a.kt)(s.Z,{toc:u,mdxType:"TOCInline"}),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"reference"},"Reference"),(0,a.kt)("h3",{id:"useselectorcreatorfactory-args"},(0,a.kt)("inlineCode",{parentName:"h3"},"useSelectorCreator(factory, ...args)")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"useSelectorCreator")," creates a selector with the given ",(0,a.kt)("a",{parentName:"p",href:"../reflex/create-selector#selector-factories"},"selector factory")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"args"),", and uses the result to subscribe to the state. It returns the selected state."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelectorCreator } from "@rbxts/roact-reflex";\nimport { selectTodo } from "./selectors";\n\nfunction Todo({ id }: Props) {\n    const todo = useSelectorCreator(selectTodo, id);\n    // ...\n}\n')),(0,a.kt)("p",null,"The selector returned by the factory will be memoized in ",(0,a.kt)("inlineCode",{parentName:"p"},"useMemo")," with the given ",(0,a.kt)("inlineCode",{parentName:"p"},"args")," to preserve the cache. If the ",(0,a.kt)("inlineCode",{parentName:"p"},"args")," change, the selector will be re-created."),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"#usage"},"See more examples below.")),(0,a.kt)("h4",{id:"parameters"},"Parameters"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"factory")," - A function that returns a selector for the given arguments."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"...args")," - Arguments to pass to the selector factory and memoize with.")),(0,a.kt)("h4",{id:"returns"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"useSelectorCreator")," returns the selected value from the root producer's state. If the value changes, the component will re-render."),(0,a.kt)("admonition",{title:"caveats",type:"info"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},"Avoid creating new objects and passing them to ",(0,a.kt)("inlineCode",{parentName:"li"},"...args"),", as this will cause ",(0,a.kt)("inlineCode",{parentName:"li"},"useSelectorCreator")," to re-create the selector every re-render. If you need to pass an object, ",(0,a.kt)("a",{parentName:"li",href:"https://react.dev/reference/react/useMemo"},"memoize it with ",(0,a.kt)("inlineCode",{parentName:"a"},"useMemo")),"."))),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("h3",{id:"subscribing-to-state-with-selector-factories"},"Subscribing to state with selector factories"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"../reflex/create-selector#selector-factories"},"Selector factories")," are useful for creating selectors that depend on external arguments. For example, a selector that selects a todo by its ID might look like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const selectTodo = (id: number) => {\n    return createSelector(selectTodos, (todos) => {\n        return todos.find((todo) => todo.id === id);\n    });\n};\n")),(0,a.kt)("p",null,"Roact Reflex provides ",(0,a.kt)("a",{parentName:"p",href:"use-selector"},(0,a.kt)("inlineCode",{parentName:"a"},"useSelector"))," to connect a function component to selectors, but it's not safe to create a selector inside of a component without memoizing it. This is because the selector will be re-created on every render, which will create a new cache, causing further re-renders."),(0,a.kt)("p",null,"To solve this, you might try to memoize the selector with the ",(0,a.kt)("inlineCode",{parentName:"p"},"useMemo")," hook:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { selectTodo } from "./selectors";\n\nfunction Todo({ id }: Props) {\n    // highlight-start\n    const selector = useMemo(() => {\n        return selectTodo(id);\n    }, [id]);\n    // highlight-end\n\n    const todo = useSelector(selector);\n\n    // ...\n}\n')),(0,a.kt)("p",null,"This works, and it's essentially what ",(0,a.kt)("a",{parentName:"p",href:"#useselectorcreatorfactory-args"},(0,a.kt)("inlineCode",{parentName:"a"},"useSelectorCreator"))," does. It creates a selector with the given arguments, memoizes it with the arguments you passed, and subscribes to the selector's state."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelectorCreator } from "@rbxts/roact-reflex";\nimport { selectTodo } from "./selectors";\n\nfunction Todo({ id }: Props) {\n    const todo = useSelectorCreator(selectTodo, id);\n    // ...\n}\n')),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,a.kt)("h3",{id:"useselectorcreator-is-creating-a-new-selector-every-render"},(0,a.kt)("inlineCode",{parentName:"h3"},"useSelectorCreator")," is creating a new selector every render"),(0,a.kt)("p",null,"If your selector factory is being called on every render, make sure you're not creating new arrays or objects and passing them to ",(0,a.kt)("inlineCode",{parentName:"p"},"...args"),". This will cause ",(0,a.kt)("inlineCode",{parentName:"p"},"useSelectorCreator")," to re-create the selector every render."),(0,a.kt)("p",null,"Here's an example of what ",(0,a.kt)("em",{parentName:"p"},"not")," to do:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { selectTodos } from "./selectors";\n\nfunction Todo() {\n    // error-next-line\n    // \ud83d\udd34 This array is not memoized\n    // error-next-line\n    const todos = useSelectorCreator(selectTodos, [1, 2, 3]);\n    // ...\n}\n')),(0,a.kt)("p",null,"Instead, you should memoize the array with ",(0,a.kt)("inlineCode",{parentName:"p"},"useMemo"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { selectTodos } from "./selectors";\n\nfunction Todo() {\n    // highlight-start\n    // \u2705 This array is memoized\n    const ids = useMemo(() => [1, 2, 3], []);\n    const todos = useSelectorCreator(selectTodos, ids);\n    // highlight-end\n    // ...\n}\n')))}m.isMDXComponent=!0}}]);