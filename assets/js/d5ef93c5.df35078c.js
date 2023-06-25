"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[623],{1952:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>c,default:()=>m,frontMatter:()=>u,metadata:()=>i,toc:()=>p});var o=r(1966),n=(r(9496),r(9613)),a=(r(7934),r(4575),r(5488));const u={sidebar_position:2,description:"Get the root producer from a function component with useProducer."},c="useProducer",i={unversionedId:"reference/roact-reflex/use-producer",id:"reference/roact-reflex/use-producer",title:"useProducer",description:"Get the root producer from a function component with useProducer.",source:"@site/docs/reference/roact-reflex/use-producer.md",sourceDirName:"reference/roact-reflex",slug:"/reference/roact-reflex/use-producer",permalink:"/reflex/docs/reference/roact-reflex/use-producer",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,description:"Get the root producer from a function component with useProducer."},sidebar:"referenceSidebar",previous:{title:"<ReflexProvider>",permalink:"/reflex/docs/reference/roact-reflex/reflex-provider"},next:{title:"useSelector",permalink:"/reflex/docs/reference/roact-reflex/use-selector"}},s={},p=[{value:"Reference",id:"reference",level:2},{value:"<code>useProducer&lt;T&gt;()</code>",id:"useproducert",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Usage",id:"usage",level:2},{value:"Dispatching actions",id:"dispatching-actions",level:3},{value:"Pre-typed <code>useProducer</code> hook",id:"pre-typed-useproducer-hook",level:3},{value:"Subscribing to state",id:"subscribing-to-state",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"I&#39;m getting an error: &quot;<code>useProducer</code> must be called from within a <code>ReflexProvider</code>&quot;",id:"im-getting-an-error-useproducer-must-be-called-from-within-a-reflexprovider",level:3},{value:"My component won&#39;t stop dispatching actions",id:"my-component-wont-stop-dispatching-actions",level:3}],d={toc:p},l="wrapper";function m(e){let{components:t,...r}=e;return(0,n.kt)(l,(0,o.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"useproducer"},"useProducer"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"useProducer")," is a Reflex Hook that lets you use the ",(0,n.kt)("a",{parentName:"p",href:"../reflex/producer"},"producer")," you passed to ",(0,n.kt)("a",{parentName:"p",href:"reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>"))," from your component."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"const producer = useProducer<Producer>();\n")),(0,n.kt)(a.Z,{toc:p,mdxType:"TOCInline"}),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"reference"},"Reference"),(0,n.kt)("h3",{id:"useproducert"},(0,n.kt)("inlineCode",{parentName:"h3"},"useProducer<T>()")),(0,n.kt)("p",null,"Call ",(0,n.kt)("inlineCode",{parentName:"p"},"useProducer")," from a function component to access the producer for the app."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'import { useProducer } from "@rbxts/roact-reflex";\nimport { RootProducer } from "./producer";\n\nfunction Button() {\n    const producer = useProducer<RootProducer>();\n    // ...\n}\n')),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"#usage"},"See more examples below.")),(0,n.kt)("h4",{id:"parameters"},"Parameters"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"useProducer")," takes no parameters."),(0,n.kt)("h4",{id:"returns"},"Returns"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"useProducer")," returns the ",(0,n.kt)("a",{parentName:"p",href:"../reflex/producer"},"Reflex producer")," passed to the ",(0,n.kt)("a",{parentName:"p",href:"reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>"))," component. If there is more than one provider, the value is the producer from the closest provider above the component in the tree."),(0,n.kt)("admonition",{title:"caveats",type:"info"},(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("strong",{parentName:"p"},"This is intended for dispatching actions.")," If you want to subscribe to state, prefer ",(0,n.kt)("a",{parentName:"p",href:"use-selector"},(0,n.kt)("inlineCode",{parentName:"a"},"useSelector"))," instead.")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("strong",{parentName:"p"},"Your app should only have one root producer.")," Roact Reflex expects only ",(0,n.kt)("em",{parentName:"p"},"one")," producer to be used in your components. ",(0,n.kt)("a",{parentName:"p",href:"../reflex/combine-producers#using-multiple-producers"},"Learn more about using a root producer."))))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"usage"},"Usage"),(0,n.kt)("h3",{id:"dispatching-actions"},"Dispatching actions"),(0,n.kt)("p",null,"Call ",(0,n.kt)("inlineCode",{parentName:"p"},"useProducer")," from a component to reference your app's ",(0,n.kt)("a",{parentName:"p",href:"../reflex/producer"},"producer"),"."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'import { useProducer } from "@rbxts/roact-reflex";\nimport { RootProducer } from "./producer";\n\nfunction Button() {\n    // highlight-next-line\n    const producer = useProducer<RootProducer>();\n    // ...\n}\n')),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"useProducer")," returns the ",(0,n.kt)("a",{parentName:"p",href:"../reflex/producer"},"producer")," you passed to the ",(0,n.kt)("a",{parentName:"p",href:"reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>"))," component. It doesn't matter how many components are between your component and the provider because of Roact's ",(0,n.kt)("a",{parentName:"p",href:"https://roblox.github.io/roact/advanced/context/"},"context"),"."),(0,n.kt)("p",null,"You will mainly use this to dispatch actions to your producer. As a shorthand, you can ",(0,n.kt)("em",{parentName:"p"},"destructure")," the producer into its actions:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"function Button() {\n    // highlight-next-line\n    const { increment } = useProducer<RootProducer>();\n\n    return <textbutton Event={{ Activated: () => increment(1) }} />;\n}\n")),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"reflex-provider"},"To pass a producer to your components, see ",(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>"),".")),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"pre-typed-useproducer-hook"},"Pre-typed ",(0,n.kt)("inlineCode",{parentName:"h3"},"useProducer")," hook"),(0,n.kt)("p",null,"On its own, ",(0,n.kt)("a",{parentName:"p",href:"#useproducert"},(0,n.kt)("inlineCode",{parentName:"a"},"useProducer"))," doesn't know what type of producer you're using. It receives a generic type parameter that lets you specify the type of the producer, but that can be repetitive."),(0,n.kt)("p",null,"To reduce the amount of typing you have to do, we recommend using the ",(0,n.kt)("inlineCode",{parentName:"p"},"UseProducerHook")," type:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'import { UseProducerHook, useProducer } from "@rbxts/roact-reflex";\n\n// highlight-next-line\nconst useAppProducer: UseProducerHook<RootProducer> = useProducer;\n')),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"subscribing-to-state"},"Subscribing to state"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"use-selector"},"To access the state from a Roact function component, see ",(0,n.kt)("inlineCode",{parentName:"a"},"useSelector"),".")),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,n.kt)("h3",{id:"im-getting-an-error-useproducer-must-be-called-from-within-a-reflexprovider"},"I'm getting an error: \"",(0,n.kt)("inlineCode",{parentName:"h3"},"useProducer")," must be called from within a ",(0,n.kt)("inlineCode",{parentName:"h3"},"ReflexProvider"),'"'),(0,n.kt)("p",null,"This error means that you're trying to use ",(0,n.kt)("a",{parentName:"p",href:"#useproducert"},(0,n.kt)("inlineCode",{parentName:"a"},"useProducer"))," in a function component that isn't wrapped in a ",(0,n.kt)("a",{parentName:"p",href:"reflex-provider"},(0,n.kt)("inlineCode",{parentName:"a"},"<ReflexProvider>")),":"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"function App() {\n    const producer = useProducer<RootProducer>();\n    // ...\n}\n\n// error-next-line\n// \ud83d\udd34 You need to wrap your root elements in a <ReflexProvider>\n// error-next-line\nRoact.mount(<App />, container);\n")),(0,n.kt)("p",null,"Roact Reflex uses ",(0,n.kt)("a",{parentName:"p",href:"https://roblox.github.io/roact/advanced/context/"},"Roact contexts")," to pass the producer to your components and allow them to use Reflex Hooks. If you don't wrap your root elements in a ",(0,n.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>"),", your components won't be able to access the producer."),(0,n.kt)("p",null,"If your app or components use Reflex, you should wrap your root elements in a ",(0,n.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>"),":"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"function App() {\n    const producer = useProducer<RootProducer>();\n    // ...\n}\n\n// \u2705 You can use the root producer in your components\nRoact.mount(\n    // highlight-start\n    <ReflexProvider producer={producer}>\n        <App />\n    </ReflexProvider>,\n    // highlight-end\n    container,\n);\n")),(0,n.kt)("h3",{id:"my-component-wont-stop-dispatching-actions"},"My component won't stop dispatching actions"),(0,n.kt)("p",null,"If your component is dispatching actions in a loop, it's likely that your action is running within the body of the component, or it indirectly triggers itself. This can become an issue if components that depend on the state are re-rendered every time the action is dispatched:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"function Button() {\n    const { increment } = useProducer<RootProducer>();\n    const counter = useSelector((state) => state.counter);\n\n    // error-next-line\n    // \ud83d\udd34 This action updates counter and causes a re-render loop\n    // error-next-line\n    increment(1);\n}\n")),(0,n.kt)("p",null,"To fix this, you can use ",(0,n.kt)("a",{parentName:"p",href:"https://roblox.github.io/roact/advanced/hooks/#useeffect"},(0,n.kt)("inlineCode",{parentName:"a"},"useEffect"))," to dispatch the action when a specific dependency changes:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"function Button() {\n    const { increment } = useProducer<RootProducer>();\n    const counter = useSelector((state) => state.counter);\n\n    // highlight-start\n    // \u2705 This action is dispatched once when the component mounts\n    useEffect(() => {\n        increment(1);\n    }, []);\n    // highlight-end\n}\n")))}m.isMDXComponent=!0}}]);