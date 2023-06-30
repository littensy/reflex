"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[473],{1451:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>d,default:()=>k,frontMatter:()=>i,metadata:()=>p,toc:()=>u});var r=a(1966),n=(a(9496),a(9613)),o=a(6187),s=a(3469),l=a(4214);const i={sidebar_position:6,description:"Create a broadcaster to sync the server's shared state with clients."},d="createBroadcaster",p={unversionedId:"reference/reflex/create-broadcaster",id:"reference/reflex/create-broadcaster",title:"createBroadcaster",description:"Create a broadcaster to sync the server's shared state with clients.",source:"@site/docs/reference/reflex/create-broadcaster.md",sourceDirName:"reference/reflex",slug:"/reference/reflex/create-broadcaster",permalink:"/reflex/docs/reference/reflex/create-broadcaster",draft:!1,tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,description:"Create a broadcaster to sync the server's shared state with clients."},sidebar:"referenceSidebar",previous:{title:"Middleware",permalink:"/reflex/docs/reference/reflex/middleware"},next:{title:"createBroadcastReceiver",permalink:"/reflex/docs/reference/reflex/create-broadcast-receiver"}},c={},u=[{value:"Reference",id:"reference",level:2},{value:"<code>createBroadcaster(options)</code>",id:"createbroadcasteroptions",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"<code>broadcaster.middleware</code>",id:"broadcastermiddleware",level:3},{value:"<code>broadcaster.playerRequestedState(player)</code>",id:"broadcasterplayerrequestedstateplayer",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Usage",id:"usage",level:2},{value:"Sending server state to clients",id:"sending-server-state-to-clients",level:3},{value:"Syncing server state on the client",id:"syncing-server-state-on-the-client",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"The client receives invalid state",id:"the-client-receives-invalid-state",level:3},{value:"The client state diverges from the server state",id:"the-client-state-diverges-from-the-server-state",level:3}],m={toc:u},h="wrapper";function k(e){let{components:t,...a}=e;return(0,n.kt)(h,(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"createbroadcaster"},"createBroadcaster"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"createBroadcaster")," lets you sync the server's shared state with clients, who receive them using ",(0,n.kt)("a",{parentName:"p",href:"create-broadcast-receiver"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcastReceiver")),"."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"const broadcaster = createBroadcaster({ producer, options });\n")),(0,n.kt)(l.Z,{toc:u,mdxType:"TOCInline"}),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"reference"},"Reference"),(0,n.kt)("h3",{id:"createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"h3"},"createBroadcaster(options)")),(0,n.kt)("p",null,"Call ",(0,n.kt)("inlineCode",{parentName:"p"},"createBroadcaster")," to create a broadcaster object that syncs shared state and actions with clients."),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'import { createBroadcaster } from "@rbxts/reflex";\n\nconst broadcaster = createBroadcaster({\n    producers: sharedProducers,\n    broadcast: (players, actions) => {\n        // using @rbxts/net\n        remotes.Server.Get("broadcast").SendToPlayers(players, actions);\n    },\n});\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua"},'local Reflex = require(ReplicatedStorage.Packages.Reflex)\n\nlocal broadcaster = Reflex.createBroadcaster({\n    producers = producers,\n    broadcast = function(players, actions)\n        -- using RbxNet\n        remotes.Server:Get("broadcast"):SendToPlayers(players, actions)\n    end,\n})\n')))),(0,n.kt)("p",null,"After you've created the broadcaster, you will need to ",(0,n.kt)("strong",{parentName:"p"},"apply the middleware")," and ",(0,n.kt)("strong",{parentName:"p"},"call ",(0,n.kt)("a",{parentName:"strong",href:"#broadcasterplayerrequestedstateplayer"},(0,n.kt)("inlineCode",{parentName:"a"},"playerRequestedState")))," when a player requests state from the server:"),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'remotes.Server.OnFunction("requestState", (player) => {\n    return broadcaster.playerRequestedState(player);\n});\n\nproducer.applyMiddleware(broadcaster.middleware);\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua"},'remotes.Server:OnFunction("requestState", function(player)\n    return broadcaster:playerRequestedState(player)\nend)\n\nproducer:applyMiddleware(broadcaster.middleware)\n')))),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"createBroadcaster")," will automatically filter out server-only state & actions using the ",(0,n.kt)("inlineCode",{parentName:"p"},"producers")," map, and will call the ",(0,n.kt)("inlineCode",{parentName:"p"},"broadcast")," callback when actions are ready to be sent to clients. This allows for a smooth and easy way to share state between the server and clients."),(0,n.kt)("p",null,"On the client, call ",(0,n.kt)("a",{parentName:"p",href:"create-broadcast-receiver"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcastReceiver"))," to receive state and actions from the server."),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"#usage"},"See more examples below.")),(0,n.kt)("h4",{id:"parameters"},"Parameters"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"options")," - An object with options for the broadcaster.",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"producers")," - A map of shared producers used to filter private actions and state from the root producer."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"broadcast")," - A function called when actions are ready to be sent to clients.")))),(0,n.kt)("h4",{id:"returns"},"Returns"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"createBroadcaster")," returns a broadcaster with a ",(0,n.kt)("a",{parentName:"p",href:"#broadcastermiddleware"},(0,n.kt)("inlineCode",{parentName:"a"},"middleware"))," function and ",(0,n.kt)("a",{parentName:"p",href:"#broadcasterplayerrequestedstateplayer"},(0,n.kt)("inlineCode",{parentName:"a"},"playerRequestedState"))," method."),(0,n.kt)("admonition",{title:"caveats",type:"info"},(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"#the-client-receives-invalid-state"},(0,n.kt)("strong",{parentName:"a"},"Data that is not remote-friendly will be lost."))," Because data is sent through remote events, you will lose metatables, functions, and numeric keys.")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("strong",{parentName:"p"},"You need to set up two remotes:")," one to send actions to clients, and another to invoke ",(0,n.kt)("a",{parentName:"p",href:"#broadcasterplayerrequestedstateplayer"},(0,n.kt)("inlineCode",{parentName:"a"},"playerRequestedState"))," for a client. This can be done with a remote library of your choice.")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("inlineCode",{parentName:"p"},"createBroadcaster")," is not supported on the client. See ",(0,n.kt)("a",{parentName:"p",href:"create-broadcast-receiver"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcastReceiver"))," for receiving broadcasted actions on the client.")))),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"broadcastermiddleware"},(0,n.kt)("inlineCode",{parentName:"h3"},"broadcaster.middleware")),(0,n.kt)("p",null,"Apply the broadcaster ",(0,n.kt)("a",{parentName:"p",href:"middleware"},"middleware")," to hook up your broadcaster to the root producer."),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"producer.applyMiddleware(broadcaster.middleware);\n"))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua"},"producer:applyMiddleware(broadcaster.middleware)\n")))),(0,n.kt)("admonition",{title:"caveats",type:"info"},(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"You should only apply the middleware once to your ",(0,n.kt)("a",{parentName:"p",href:"combine-producers#using-multiple-producers"},(0,n.kt)("strong",{parentName:"a"},"root producer")),".")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"The middleware should come ",(0,n.kt)("em",{parentName:"p"},"before")," any middlewares that transform arguments to ensure the client receives the correct values.")))),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"broadcasterplayerrequestedstateplayer"},(0,n.kt)("inlineCode",{parentName:"h3"},"broadcaster.playerRequestedState(player)")),(0,n.kt)("p",null,"Process a player's request for state with ",(0,n.kt)("inlineCode",{parentName:"p"},"playerRequestedState"),"."),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'remotes.Server.OnFunction("requestState", (player) => {\n    return broadcaster.playerRequestedState(player);\n});\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua"},'remotes.Server:OnFunction("requestState", function(player)\n    return broadcaster:playerRequestedState(player)\nend)\n')))),(0,n.kt)("p",null,"Players will only be added to the ",(0,n.kt)("inlineCode",{parentName:"p"},"players")," argument of ",(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"options.broadcast"))," if they have requested state through ",(0,n.kt)("inlineCode",{parentName:"p"},"playerRequestedState"),". This is to prevent sending actions to players who are not ready to receive them."),(0,n.kt)("h4",{id:"parameters-1"},"Parameters"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"player")," - The player who requested state. Should be received from a remote function call.")),(0,n.kt)("h4",{id:"returns-1"},"Returns"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"playerRequestedState")," returns the state of the root producer. Non-shared state is automatically filtered out."),(0,n.kt)("admonition",{title:"caveats",type:"info"},(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"playerRequestedState")," throws an error if a player requests state more than once before leaving the game."))),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"usage"},"Usage"),(0,n.kt)("h3",{id:"sending-server-state-to-clients"},"Sending server state to clients"),(0,n.kt)("p",null,"Reflex is designed to be used in any environment, on the client and the server. However, in game development, many cases come up where you need to send state from the server to clients."),(0,n.kt)("p",null,"This is where the concept of ",(0,n.kt)("strong",{parentName:"p"},"shared producers")," comes in. Shared producers are producers that are managed by the server and synced with clients. With ",(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcaster")),", it's easy to sync these shared producers with clients."),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcaster"))," receives a map of shared producers. To create shared producers, we'll follow this project structure:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"shared\n\u251c\u2500\u2500 producers\n\u2502   \u251c\u2500\u2500 players\n\u2502   \u2514\u2500\u2500 world\n\u2514\u2500\u2500 remotes\n")),(0,n.kt)("p",null,"Your shared ",(0,n.kt)("inlineCode",{parentName:"p"},"producers")," module should look something like this:"),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="shared/producers/index.ts"',title:'"shared/producers/index.ts"'},'import { CombineStates } from "@rbxts/reflex";\nimport { playersSlice } from "./players";\nimport { worldSlice } from "./world";\n\nexport type SharedState = CombineStates<typeof sharedProducers>;\n\nexport const sharedProducers = {\n    players: playersSlice,\n    world: worldSlice,\n};\n')),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"Exporting ",(0,n.kt)("inlineCode",{parentName:"p"},"SharedState")," as a type makes it easier to create typed selectors without importing across the client/server boundary."),(0,n.kt)("pre",{parentName:"admonition"},(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'import { SharedState } from "shared/producers";\n\nexport const selectPlayers = (state: SharedState) => state.players;\n')))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua",metastring:'title="shared/producers/init.lua"',title:'"shared/producers/init.lua"'},"local Reflex = require(ReplicatedStorage.Packages.Reflex)\nlocal players = require(script.players)\nlocal world = require(script.world)\n\nexport type SharedState = players.PlayersState & world.WorldState\n\nexport type SharedActions = players.PlayersActions & world.WorldActions\n\nreturn {\n    players = players.playersSlice,\n    world = world.worldSlice,\n}\n")),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"Exporting ",(0,n.kt)("inlineCode",{parentName:"p"},"SharedState")," and ",(0,n.kt)("inlineCode",{parentName:"p"},"SharedActions")," helps to build a fully-typed Reflex producer. ",(0,n.kt)("a",{parentName:"p",href:"create-producer#importing-and-exporting-types"},"See more details on importing and exporting types."))))),(0,n.kt)("p",null,"In this example, we have two shared producers: ",(0,n.kt)("inlineCode",{parentName:"p"},"players")," and ",(0,n.kt)("inlineCode",{parentName:"p"},"world"),". They are put together in a map and returned by ",(0,n.kt)("inlineCode",{parentName:"p"},"shared/producers")," as a map of producers. The contents of these producers are not important - they're just like any other producer - but if you want to see how to write producers, ",(0,n.kt)("a",{parentName:"p",href:"create-producer#updating-state-with-actions"},"check out the reference page"),"."),(0,n.kt)("p",null,"The main benefit of using a ",(0,n.kt)("em",{parentName:"p"},"shared producer map")," like this is how simple it is to add them to your root producers:"),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Root producer"',title:'"Root','producer"':!0},'import { combineProducers } from "@rbxts/reflex";\nimport { sharedProducers } from "shared/producers";\nimport { fooSlice } from "./foo";\nimport { barSlice } from "./bar";\n\nexport type RootState = InferState<typeof producers>;\n\nexport const producer = combineProducers({\n    ...sharedProducers,\n    foo: fooSlice,\n    bar: barSlice,\n});\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua",metastring:'title="Root producer"',title:'"Root','producer"':!0},"local Reflex = require(ReplicatedStorage.Packages.Reflex)\nlocal producers = require(ReplicatedStorage.shared.producers)\nlocal foo = require(script.foo)\nlocal bar = require(script.bar)\n\nexport type RootState = producers.SharedState &\n    foo.FooState &\n    bar.BarState\n\nexport type RootActions = producers.SharedActions &\n    foo.FooActions &\n    bar.BarActions\n\nlocal map = {\n    foo = foo.fooSlice,\n    bar = bar.barSlice,\n}\n\nfor key, value in producers do\n    map[key] = value\nend\n\nreturn Reflex.combineProducers(map)\n")),(0,n.kt)("admonition",{type:"note"},(0,n.kt)("p",{parentName:"admonition"},"Libraries like ",(0,n.kt)("a",{parentName:"p",href:"https://csqrl.github.io/sift/"},"Sift")," can make it easier to merge tables.")))),(0,n.kt)("p",null,"Now that you have your shared producers set up, and include them in both your client and server's root producer, you can now use ",(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcaster"))," to send state to clients."),(0,n.kt)("p",null,"You should call ",(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcaster"))," on the server when your game initializes, either before or after you create your root producer. It receives your shared producer map and a function that sends actions to the clients, and returns a broadcaster object. Make sure you've set up remotes as well:"),(0,n.kt)("admonition",{title:"prerequisites",type:"tip"},(0,n.kt)("p",{parentName:"admonition"},"You need a networking solution to use ",(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcaster")),". We recommend ",(0,n.kt)("a",{parentName:"p",href:"http://rbxnet.australis.dev"},"RbxNet"),", which is used in the examples on this page. You need to specify two remotes:"),(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},"A server event that sends actions to a clients. The type of this event would be ",(0,n.kt)("inlineCode",{parentName:"li"},"(actions: BroadcastAction[]) => void"),"."),(0,n.kt)("li",{parentName:"ul"},"A server function that returns the state of the root producer. The type of this function would be ",(0,n.kt)("inlineCode",{parentName:"li"},"(player: Player) => SharedState"),"."))),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Server"',title:'"Server"'},'import { createBroadcaster } from "@rbxts/reflex";\nimport { sharedProducers } from "shared/producers";\nimport { remotes } from "shared/remotes";\nimport { producer } from "./producer";\n\nconst broadcaster = createBroadcaster({\n    producers: sharedProducers,\n    broadcast: (players, actions) => {\n        remotes.Server.Get("broadcast").SendToPlayers(players, actions);\n    },\n});\n\nremotes.Server.OnFunction("requestState", (player) => {\n    return broadcaster.playerRequestedState(player);\n});\n\nproducer.applyMiddleware(broadcaster.middleware);\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua",metastring:'title="Server"',title:'"Server"'},'local Reflex = require(ReplicatedStorage.Packages.Reflex)\nlocal producers = require(ReplicatedStorage.shared.producers)\nlocal remotes = require(ReplicatedStorage.shared.remotes)\nlocal producer = require(script.Parent.producer)\n\nlocal broadcaster = Reflex.createBroadcaster({\n    producers = producers,\n    broadcast = function(players, actions)\n        remotes.Server:Get("broadcast"):SendToPlayers(players, actions)\n    end,\n})\n\nremotes.Server:OnFunction("requestState", function(player)\n    return broadcaster:playerRequestedState(player)\nend)\n\nproducer:applyMiddleware(broadcaster.middleware)\n')))),(0,n.kt)("p",null,"This sets up a broadcaster that sends shared actions to the clients when they're dispatched. It also connects a ",(0,n.kt)("inlineCode",{parentName:"p"},"requestState")," remote that returns the state with ",(0,n.kt)("inlineCode",{parentName:"p"},"playerRequestedState"),", which automatically filters out any state that the client doesn't have access to."),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"#createbroadcasteroptions"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcaster"))," receives two options:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("inlineCode",{parentName:"li"},"producers"),": Your ",(0,n.kt)("em",{parentName:"li"},"shared producer map"),". This is used to determine which state and actions should be sent to the client."),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("inlineCode",{parentName:"li"},"broadcast"),": A user-defined callback that sends shared dispatched actions to the clients. It receives an array of actions and an array of players to send them to.")),(0,n.kt)("p",null,"It returns a broadcaster object, which has two properties:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("inlineCode",{parentName:"p"},"middleware"),": A Reflex middleware that helps do some of the heavy lifting for you. You should apply this middleware to your root producer. If you have any middlewares that change dispatched arguments, you should apply them after this middleware to ensure that the arguments are preserved.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("inlineCode",{parentName:"p"},"playerRequestedState"),": A method that receives the player that requested state, and returns the shared part of the root producer's state. It should only be called within a remote."))),(0,n.kt)("admonition",{title:"pitfall",type:"caution"},(0,n.kt)("p",{parentName:"admonition"},(0,n.kt)("strong",{parentName:"p"},"Make sure your shared state can be sent over a remote!")," Objects that use non-string keys or certain values will not be sent over intact. See ",(0,n.kt)("a",{parentName:"p",href:"#troubleshooting"},"Troubleshooting")," for more information on this common pitfall.")),(0,n.kt)("p",null,"Now that you have your broadcaster set up, you can use ",(0,n.kt)("a",{parentName:"p",href:"create-broadcast-receiver"},(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcastReceiver"))," to dispatch actions from the server."),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"syncing-server-state-on-the-client"},"Syncing server state on the client"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"create-broadcast-receiver"},"To connect a client to a broadcaster, see ",(0,n.kt)("inlineCode",{parentName:"a"},"createBroadcastReceiver"),".")),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,n.kt)("h3",{id:"the-client-receives-invalid-state"},"The client receives invalid state"),(0,n.kt)("p",null,"A common oversight when syncing state over remotes is that data that can't be serialized is lost or unexpectedly changed. This is because data is sent through remote events, which only support certain data structures."),(0,n.kt)("p",null,"Make sure your shared producers are free from:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Metatables:")," Instances of classes that have metatables will lose their metatables."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Mixed tables:")," Objects must consist entirely of either key-value pairs or numeric indices."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Non-string keys:")," Arrays that have blank spaces and objects with non-string keys will be converted to use string keys.")),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://create.roblox.com/docs/scripting/argument-limitations-for-bindables-and-remotes"},"See Roblox's API reference for an exhaustive list of unsupported data types.")),(0,n.kt)("hr",null),(0,n.kt)("h3",{id:"the-client-state-diverges-from-the-server-state"},"The client state diverges from the server state"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Your action functions should be ",(0,n.kt)("em",{parentName:"strong"},"idempotent"),".")," This means that they should always return the same result when given the same arguments. For example, if you need to generate a random value, it should be passed to the action function as an argument, rather than generated inside the function."),(0,n.kt)("p",null,"Here's an example of an action that is ",(0,n.kt)("em",{parentName:"p"},"not")," idempotent:"),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'const producer = createProducer(initialState, {\n    addItem: (state) => ({\n        ...items,\n        // error-next-line\n        // \ud83d\udd34 Syncing this action will cause state to diverge\n        // error-next-line\n        { id: HttpService.GenerateGUID(), name: "New Item" },\n    })\n})\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua"},'local producer = Reflex.createProducer(initialState, {\n    addItem = function(state)\n        local nextState = table.clone(state)\n\n        // error-next-line\n        -- \ud83d\udd34 Syncing this action will cause state to diverge\n        // error-next-line\n        table.insert(nextState.items, {\n            // error-next-line\n            id = HttpService:GenerateGUID(),\n            // error-next-line\n            name = "New Item"\n            // error-next-line\n        })\n\n        return nextState\n    end,\n})\n')))),(0,n.kt)("p",null,"Actions that are not idempotent will cause the client and server to diverge, as they will generate different results when the client tries to run them with the same arguments."),(0,n.kt)("p",null,"Instead, you should pass the random value as an argument to the action function:"),(0,n.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},'const producer = createProducer(initialState, {\n    addItem: (state, id: string) => ({\n        ...items,\n        // highlight-start\n        // \u2705 This will always output the same result\n        { id, name: "New Item" },\n        // highlight-end\n    })\n})\n'))),(0,n.kt)(s.Z,{value:"Luau",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-lua"},'local producer = Reflex.createProducer(initialState, {\n    addItem = function(state, id)\n        local nextState = table.clone(state)\n\n        // highlight-start\n        -- \u2705 This will always output the same result\n        table.insert(nextState.items, {\n            id = id,\n            name = "New Item"\n        })\n        // highlight-end\n\n        return nextState\n    end,\n})\n')))))}k.isMDXComponent=!0}}]);