"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[352],{6194:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>i,toc:()=>u});var n=r(1966),o=(r(9496),r(9613)),a=(r(6187),r(3469),r(4214));const s={sidebar_position:3,description:"Subscribe to a selector's state with useSelector."},l="useSelector",i={unversionedId:"reference/roact-reflex/use-selector",id:"reference/roact-reflex/use-selector",title:"useSelector",description:"Subscribe to a selector's state with useSelector.",source:"@site/docs/reference/roact-reflex/use-selector.md",sourceDirName:"reference/roact-reflex",slug:"/reference/roact-reflex/use-selector",permalink:"/reflex/docs/reference/roact-reflex/use-selector",draft:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,description:"Subscribe to a selector's state with useSelector."},sidebar:"referenceSidebar",previous:{title:"useProducer",permalink:"/reflex/docs/reference/roact-reflex/use-producer"},next:{title:"useSelectorCreator",permalink:"/reflex/docs/reference/roact-reflex/use-selector-creator"}},c={},u=[{value:"Reference",id:"reference",level:2},{value:"<code>useSelector(selector, isEqual?)</code>",id:"useselectorselector-isequal",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"<code>isEqual</code> function",id:"isequal-function",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Usage",id:"usage",level:2},{value:"Subscribing to a producer&#39;s state",id:"subscribing-to-a-producers-state",level:3},{value:"Custom equality comparison",id:"custom-equality-comparison",level:3},{value:"Using selector factories",id:"using-selector-factories",level:3},{value:"Using selectors with curried arguments",id:"using-selectors-with-curried-arguments",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"I&#39;m getting an error: &quot;<code>useSelector</code> must be called from within a <code>ReflexProvider</code>&quot;",id:"im-getting-an-error-useselector-must-be-called-from-within-a-reflexprovider",level:3},{value:"My component is re-rendering too often",id:"my-component-is-re-rendering-too-often",level:3}],p={toc:u},d="wrapper";function m(e){let{components:t,...r}=e;return(0,o.kt)(d,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"useselector"},"useSelector"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"useSelector")," is a Reflex Hook that lets you read and subscribe to a ",(0,o.kt)("a",{parentName:"p",href:"../reflex/producer"},"producer"),"'s state from your component."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const state = useSelector((state) => state.value);\n")),(0,o.kt)(a.Z,{toc:u,mdxType:"TOCInline"}),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"reference"},"Reference"),(0,o.kt)("h3",{id:"useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"h3"},"useSelector(selector, isEqual?)")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"useSelector")," subscribes to the root producer with the given ",(0,o.kt)("inlineCode",{parentName:"p"},"selector"),", and returns the selected state."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelector } from "@rbxts/roact-reflex";\nimport { selectTodos } from "./selectors";\n\nfunction Todos() {\n    const todos = useSelector(selectTodos);\n    // ...\n}\n')),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"#usage"},"See more examples below.")),(0,o.kt)("h4",{id:"parameters"},"Parameters"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"selector")," - A function that, given the root producer's state, returns a new value."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"isEqual")," - An optional function that compares the previous and next values. If the function returns ",(0,o.kt)("inlineCode",{parentName:"li"},"true"),", the component will not re-render. By default, ",(0,o.kt)("inlineCode",{parentName:"li"},"===")," is used.")),(0,o.kt)("h4",{id:"returns"},"Returns"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"useSelector")," returns the selected value from the root producer's state. If the value changes, the component will re-render."),(0,o.kt)("admonition",{title:"caveat",type:"info"},(0,o.kt)("p",{parentName:"admonition"},(0,o.kt)("strong",{parentName:"p"},"Selectors that return ",(0,o.kt)("em",{parentName:"strong"},"new")," objects can cause excessive re-renders.")," If your selector performs array transformations or returns new objects, ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector"},"it should be memoized with ",(0,o.kt)("inlineCode",{parentName:"a"},"createSelector")),".")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"isequal-function"},(0,o.kt)("inlineCode",{parentName:"h3"},"isEqual")," function"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"isEqual")," is a function that compares the current and previous values. If the function returns ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),", the component will not re-render. By default, ",(0,o.kt)("inlineCode",{parentName:"p"},"===")," is used."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelector } from "@rbxts/roact-reflex";\nimport { selectTodos } from "./selectors";\n\nfunction Todos() {\n    const todos = useSelector(selectTodos, shallowEqual);\n    // ...\n}\n')),(0,o.kt)("h4",{id:"parameters-1"},"Parameters"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"current")," - The current value of the selector."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"previous")," - The previous value of the selector.")),(0,o.kt)("h4",{id:"returns-1"},"Returns"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"isEqual")," returns ",(0,o.kt)("inlineCode",{parentName:"p"},"true")," if the current and previous values are equal."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("h3",{id:"subscribing-to-a-producers-state"},"Subscribing to a producer's state"),(0,o.kt)("p",null,"Sometimes, components may want to access values from the producer's state. We'll go over how to create a basic todo list component that reads the producer's state. ",(0,o.kt)("a",{parentName:"p",href:"reflex-provider"},"Don't forget to include ",(0,o.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>")," in your app!")),(0,o.kt)("p",null,"Call ",(0,o.kt)("a",{parentName:"p",href:"#useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"a"},"useSelector"))," from a function component to read a value from the producer's state:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelector } from "@rbxts/roact-reflex";\nimport { selectTodos } from "./selectors";\n\nfunction Todos() {\n    // highlight-next-line\n    const todos = useSelector(selectTodos);\n    // ...\n}\n')),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"Todos")," will re-render whenever ",(0,o.kt)("inlineCode",{parentName:"p"},"selectTodos")," returns a new value. Functionally, ",(0,o.kt)("inlineCode",{parentName:"p"},"useSelector")," ",(0,o.kt)("a",{parentName:"p",href:"../reflex/producer#subscribeselector-predicate-listener"},"subscribes")," to the producer's state, and re-renders when the selected value changes."),(0,o.kt)("p",null,"You can then render a list of todos from the selected value:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"function Todos() {\n    const todos = useSelector(selectTodos);\n\n    return (\n        <scrollingframe>\n            // highlight-start\n            {todos.map((todo) => (\n                <Todo id={todo.id} />\n            ))}\n            // highlight-end\n        </scrollingframe>\n    );\n}\n")),(0,o.kt)("admonition",{title:"pitfall",type:"caution"},(0,o.kt)("p",{parentName:"admonition"},(0,o.kt)("strong",{parentName:"p"},"Selectors that return ",(0,o.kt)("em",{parentName:"strong"},"new")," objects can cause excessive re-renders.")," State updates are compared ",(0,o.kt)("strong",{parentName:"p"},"by reference (",(0,o.kt)("inlineCode",{parentName:"strong"},"==="),")"),", so if your selector creates a new object, Reflex will assume an update happened and re-render. Remember to ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector"},"memoize these selectors with ",(0,o.kt)("inlineCode",{parentName:"a"},"createSelector")),".")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"custom-equality-comparison"},"Custom equality comparison"),(0,o.kt)("p",null,"By default, ",(0,o.kt)("a",{parentName:"p",href:"#useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"a"},"useSelector"))," uses ",(0,o.kt)("inlineCode",{parentName:"p"},"===")," to compare the previous and next values. You can customize this behavior with the ",(0,o.kt)("a",{parentName:"p",href:"#isequal-function"},(0,o.kt)("inlineCode",{parentName:"a"},"isEqual"))," parameter."),(0,o.kt)("p",null,"For example, some components might want to receive the latest state ",(0,o.kt)("strong",{parentName:"p"},"only if it's defined")," and exclude ",(0,o.kt)("inlineCode",{parentName:"p"},"undefined")," values. You can write an equality function that compares the current and previous values, and returns ",(0,o.kt)("inlineCode",{parentName:"p"},"true")," if the new value is ",(0,o.kt)("inlineCode",{parentName:"p"},"undefined"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelector } from "@rbxts/roact-reflex";\nimport { selectValue } from "./selectors";\n\nfunction isEqualOrUndefined(current: unknown, previous: unknown) {\n    return current === previous || current === undefined;\n}\n\nfunction Button() {\n    const value = useSelector(selectValue, isEqualOrUndefined);\n    // ...\n}\n')),(0,o.kt)("p",null,"Remember that if the equality function returns ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),", the component ",(0,o.kt)("strong",{parentName:"p"},"will not")," re-render for that state update."),(0,o.kt)("p",null,"The logic can be a bit difficult to follow, so let's break down the two cases:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"current === previous")," - If the current and previous values are equal, return ",(0,o.kt)("inlineCode",{parentName:"li"},"true"),". This is the default behavior."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"current === undefined")," - If the current value is ",(0,o.kt)("inlineCode",{parentName:"li"},"undefined"),", return ",(0,o.kt)("inlineCode",{parentName:"li"},"true"),'. This tells Reflex that the values are "equal," and thus the component will not re-render for ',(0,o.kt)("inlineCode",{parentName:"li"},"undefined")," values.")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"using-selector-factories"},"Using selector factories"),(0,o.kt)("p",null,"Selectors can receive parameters other than state using ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector#selector-factories"},"selector factories"),", but using them with ",(0,o.kt)("a",{parentName:"p",href:"#useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"a"},"useSelector"))," can be unsafe."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"use-selector-creator"},"Use factories with the ",(0,o.kt)("inlineCode",{parentName:"a"},"useSelectorCreator")," hook.")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"using-selectors-with-curried-arguments"},"Using selectors with curried arguments"),(0,o.kt)("p",null,"Selectors can receive parameters other than state using ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector#dependency-currying"},"curried arguments"),". You can use these selectors with ",(0,o.kt)("a",{parentName:"p",href:"#useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"a"},"useSelector"))," by wrapping them in a function:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { useSelector } from "@rbxts/roact-reflex";\nimport { selectTodo } from "./selectors";\n\nfunction Todo({ id }: Props) {\n    const todo = useSelector((state) => selectTodo(state, id));\n    // ...\n}\n')),(0,o.kt)("p",null,"But you might wonder: ",(0,o.kt)("em",{parentName:"p"},"why isn't this selector memoized?")," This is safe because ",(0,o.kt)("a",{parentName:"p",href:"#useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"a"},"useSelector"))," will only re-render when the selected value changes, and not necessarily when the selector function changes. It's safe to leave the selector function like this."),(0,o.kt)("p",null,"On the other hand, ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector#selector-factories"},"selector factories")," ",(0,o.kt)("em",{parentName:"p"},"should")," be memoized, because creating a new selector with ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector"},(0,o.kt)("inlineCode",{parentName:"a"},"createSelector"))," on render also creates a new, empty argument cache, causing the selector to re-run when it shouldn't."),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,o.kt)("h3",{id:"im-getting-an-error-useselector-must-be-called-from-within-a-reflexprovider"},"I'm getting an error: \"",(0,o.kt)("inlineCode",{parentName:"h3"},"useSelector")," must be called from within a ",(0,o.kt)("inlineCode",{parentName:"h3"},"ReflexProvider"),'"'),(0,o.kt)("p",null,"This error means that you're trying to use ",(0,o.kt)("a",{parentName:"p",href:"#useselectorselector-isequal"},(0,o.kt)("inlineCode",{parentName:"a"},"useSelector"))," in a function component that isn't wrapped in a ",(0,o.kt)("a",{parentName:"p",href:"reflex-provider"},(0,o.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>")),", which throws this error because it uses ",(0,o.kt)("a",{parentName:"p",href:"use-producer"},(0,o.kt)("inlineCode",{parentName:"a"},"useProducer"))," internally."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"function TodosApp() {\n    const todos = useSelector(selectTodos);\n    // ...\n}\n\n// error-next-line\n// \ud83d\udd34 Don't forget to wrap your root elements in a <ReflexProvider>\n// error-next-line\nRoact.mount(<TodosApp />, container);\n")),(0,o.kt)("p",null,"Roact Reflex uses ",(0,o.kt)("a",{parentName:"p",href:"https://roblox.github.io/roact/advanced/context/"},"Roact contexts")," to pass the producer to your components and allow them to use Reflex Hooks. If you don't wrap your root elements in a ",(0,o.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>"),", your components won't be able to access the producer."),(0,o.kt)("p",null,"If your app or components use Reflex, you should wrap your root elements in a ",(0,o.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"function TodosApp() {\n    const todos = useSelector(selectTodos);\n    // ...\n}\n\n// \u2705 You can use the root producer in your components\nRoact.mount(\n    // highlight-start\n    <ReflexProvider producer={producer}>\n        <TodosApp />\n    </ReflexProvider>,\n    // highlight-end\n    container,\n);\n")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"my-component-is-re-rendering-too-often"},"My component is re-rendering too often"),(0,o.kt)("p",null,"If your component is re-rendering too often, you might be using a selector that returns a new object every time it's called. Remember that Reflex uses ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality"},"reference equality (",(0,o.kt)("inlineCode",{parentName:"a"},"==="),")")," to compare the previous and next values, so if your selector returns a new object, Reflex will assume an update happened and re-render."),(0,o.kt)("p",null,"Here's an example of a ",(0,o.kt)("strong",{parentName:"p"},"bad")," selector that returns a new object every time it's called:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const selectTodos = (state: RootState) => {\n    state.todos;\n};\n\n// error-next-line\n// \ud83d\udd34 This selector creates a new array every time it's called\n// error-next-line\nconst selectTodosDone = (state: RootState) => {\n    // error-next-line\n    return state.todos.filter((todo) => todo.done);\n    // error-next-line\n};\n")),(0,o.kt)("p",null,"Because selectors are called every time the producer updates, and ",(0,o.kt)("inlineCode",{parentName:"p"},"selectTodosDone")," works by creating a new array, Reflex assumes that the value changed. This will cause the component to re-render with the new value, even if the underlying ",(0,o.kt)("inlineCode",{parentName:"p"},"todos")," state didn't change."),(0,o.kt)("p",null,"To fix this, you can use ",(0,o.kt)("a",{parentName:"p",href:"../reflex/create-selector"},(0,o.kt)("inlineCode",{parentName:"a"},"createSelector"))," to memoize your selectors and prevent unnecessary re-renders:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { createSelector } from \"@rbxts/roact-reflex\";\n\nconst selectTodos = (state: RootState) => {\n    state.todos;\n};\n\n// highlight-start\n// \u2705 This selector is memoized, and won't re-render unless 'todos' changes\nconst selectTodosDone = createSelector([selectTodos], (todos) => {\n    return todos.filter((todo) => todo.done);\n});\n// highlight-end\n")))}m.isMDXComponent=!0}}]);