"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[241],{1416:(e,r,o)=>{o.r(r),o.d(r,{assets:()=>d,contentTitle:()=>a,default:()=>f,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var t=o(1966),n=(o(9496),o(9613)),l=(o(7934),o(4575),o(5488));const i={sidebar_position:1,title:"<ReflexProvider>",description:"The root component for Roact Reflex."},a="&lt;ReflexProvider>",p={unversionedId:"reference/roact-reflex/reflex-provider",id:"reference/roact-reflex/reflex-provider",title:"<ReflexProvider>",description:"The root component for Roact Reflex.",source:"@site/docs/reference/roact-reflex/reflex-provider.md",sourceDirName:"reference/roact-reflex",slug:"/reference/roact-reflex/reflex-provider",permalink:"/reflex/docs/reference/roact-reflex/reflex-provider",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"<ReflexProvider>",description:"The root component for Roact Reflex."},sidebar:"referenceSidebar",previous:{title:"Roact Reflex",permalink:"/reflex/docs/reference/roact-reflex/"},next:{title:"useProducer",permalink:"/reflex/docs/reference/roact-reflex/use-producer"}},d={},s=[{value:"Reference",id:"reference",level:2},{value:"<code>&lt;ReflexProvider&gt;</code>",id:"reflexprovider-1",level:3},{value:"Props",id:"props",level:4},{value:"Usage",id:"usage",level:2},{value:"Setting up Roact Reflex",id:"setting-up-roact-reflex",level:3},{value:"Using other providers with <code>ReflexProvider</code>",id:"using-other-providers-with-reflexprovider",level:3}],c={toc:s},u="wrapper";function f(e){let{components:r,...o}=e;return(0,n.kt)(u,(0,t.Z)({},c,o,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"reflexprovider"},"<","ReflexProvider>"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>")," lets you specify a producer to use with Roact Reflex in your application."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},"<ReflexProvider producer={producer}>\n    <App />\n</ReflexProvider>\n")),(0,n.kt)(l.Z,{toc:s,mdxType:"TOCInline"}),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"reference"},"Reference"),(0,n.kt)("h3",{id:"reflexprovider-1"},(0,n.kt)("inlineCode",{parentName:"h3"},"<ReflexProvider>")),(0,n.kt)("p",null,"Use ",(0,n.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>")," to make a Reflex ",(0,n.kt)("inlineCode",{parentName:"p"},"producer")," available to the rest of your app. The Hooks can then be used by any component nested inside of ",(0,n.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>"),"."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},'import Roact from "@rbxts/roact";\nimport { ReflexProvider } from "@rbxts/roact-reflex";\n\nRoact.mount(\n    <ReflexProvider producer={producer}>\n        <App />\n    </ReflexProvider>,\n    Players.LocalPlayer.WaitForChild("PlayerGui"),\n);\n')),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"#usage"},"See more examples below.")),(0,n.kt)("h4",{id:"props"},"Props"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"producer")," - The root Reflex producer to use for the rest of the app.")),(0,n.kt)("admonition",{title:"caveats",type:"info"},(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},"You should only use ",(0,n.kt)("inlineCode",{parentName:"li"},"<ReflexProvider>")," once at the root of your app. ",(0,n.kt)("a",{parentName:"li",href:"../reflex/combine-producers#using-multiple-producers"},"Learn more about using a root producer.")))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"usage"},"Usage"),(0,n.kt)("h3",{id:"setting-up-roact-reflex"},"Setting up Roact Reflex"),(0,n.kt)("p",null,"Roact Reflex allows you to use Hooks to access the Reflex state from anywhere in your app. To do this, you need to wrap your root component in ",(0,n.kt)("inlineCode",{parentName:"p"},"<ReflexProvider>")," when you render it:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},'import Roact from "@rbxts/roact";\nimport { ReflexProvider } from "@rbxts/roact-reflex";\n\nRoact.mount(\n    // highlight-next-line\n    <ReflexProvider producer={producer}>\n        <App />\n        // highlight-next-line\n    </ReflexProvider>,\n    Players.LocalPlayer.WaitForChild("PlayerGui"),\n);\n')),(0,n.kt)("p",null,"Reflex uses this provider to allow components to hook into the state of your game with Hooks like ",(0,n.kt)("a",{parentName:"p",href:"use-producer"},(0,n.kt)("inlineCode",{parentName:"a"},"useProducer")),". This component should be present somewhere in the root of your application anywhere you want to use a Reflex Hook."),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"using-other-providers-with-reflexprovider"},"Using other providers with ",(0,n.kt)("inlineCode",{parentName:"h3"},"ReflexProvider")),(0,n.kt)("p",null,"Your app may have other providers that you want to use with Roact Reflex. To do this, you can nest the providers in any order:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},'import Roact from "@rbxts/roact";\nimport { ReflexProvider } from "@rbxts/roact-reflex";\n\nRoact.mount(\n    // highlight-next-line\n    <ReflexProvider producer={producer}>\n        <OtherProvider>\n            <App />\n        </OtherProvider>\n        // highlight-next-line\n    </ReflexProvider>,\n    Players.LocalPlayer.WaitForChild("PlayerGui"),\n);\n')),(0,n.kt)("p",null,"It can also help to create a custom provider that combines all of your providers into one:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx"},'import Roact from "@rbxts/roact";\nimport { RootProvider } from "./RootProvider";\n\nRoact.mount(\n    <RootProvider>\n        <App />\n    </RootProvider>,\n    Players.LocalPlayer.WaitForChild("PlayerGui"),\n);\n')),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="RootProvider.tsx"',title:'"RootProvider.tsx"'},"function RootProvider(props: Roact.PropsWithChildren) {\n    return (\n        <ReflexProvider producer={producer}>\n            <OtherProvider>{props[Roact.Children]}</OtherProvider>\n        </ReflexProvider>\n    );\n}\n")))}f.isMDXComponent=!0}}]);