"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7],{9347:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>c,default:()=>g,frontMatter:()=>d,metadata:()=>p,toc:()=>u});var r=t(1966),a=(t(9496),t(9613)),i=t(6187),l=t(3469),o=t(4214);const d={sidebar_position:5,description:"Middleware functions provided by Reflex."},c="Middleware",p={unversionedId:"reference/reflex/middleware",id:"reference/reflex/middleware",title:"Middleware",description:"Middleware functions provided by Reflex.",source:"@site/docs/reference/reflex/middleware.md",sourceDirName:"reference/reflex",slug:"/reference/reflex/middleware",permalink:"/reflex/docs/reference/reflex/middleware",draft:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,description:"Middleware functions provided by Reflex."},sidebar:"referenceSidebar",previous:{title:"createSelector",permalink:"/reflex/docs/reference/reflex/create-selector"},next:{title:"createBroadcaster",permalink:"/reflex/docs/reference/reflex/create-broadcaster"}},s={},u=[{value:"Built-in middleware",id:"built-in-middleware",level:2},{value:"<code>loggerMiddleware</code>",id:"loggermiddleware",level:3},{value:"Building middleware",id:"building-middleware",level:2},{value:"Your first middleware",id:"your-first-middleware",level:3},{value:"Cancelling actions",id:"cancelling-actions",level:3}],m={toc:u},h="wrapper";function g(e){let{components:n,...t}=e;return(0,a.kt)(h,(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"middleware"},"Middleware"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Middleware")," lets you enhance the behavior of your producers and actions. You can either use the built-in middleware or write your own."),(0,a.kt)(o.Z,{toc:u,mdxType:"TOCInline"}),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"built-in-middleware"},"Built-in middleware"),(0,a.kt)("h3",{id:"loggermiddleware"},(0,a.kt)("inlineCode",{parentName:"h3"},"loggerMiddleware")),(0,a.kt)("p",null,"Logs all actions, their payloads, and the new state to the output."),(0,a.kt)(i.Z,{groupId:"languages",mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { createProducer, loggerMiddleware } from "@rbxts/reflex";\n\nconst producer = createProducer(0, {\n    increment: (state, amount: number) => state + amount,\n});\n\nproducer.applyMiddleware(loggerMiddleware);\nproducer.increment(1);\n\n// Output:\n// [Reflex] Mounted with state 0\n// [Reflex] Dispatching increment(1)\n// [Reflex] State changed to 1\n'))),(0,a.kt)(l.Z,{value:"Luau",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-lua"},"local Reflex = require(ReplicatedStorage.Packages.Reflex)\n\nlocal producer = Reflex.createProducer(0, {\n    increment = function(state, amount: number)\n        return state + amount\n    end,\n})\n\nproducer:applyMiddleware(Reflex.loggerMiddleware)\nproducer.increment(1)\n\n-- Output:\n-- [Reflex] Mounted with state 0\n-- [Reflex] Dispatching increment(1)\n-- [Reflex] State changed to 1\n")))),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"building-middleware"},"Building middleware"),(0,a.kt)("h3",{id:"your-first-middleware"},"Your first middleware"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Middleware is a powerful tool for extending the behavior of producers and actions.")," In Reflex, middleware can be used to add logging, cancel actions, add undo/redo functionality, and more."),(0,a.kt)("p",null,"Middlewares are essentially a chain of functions that wrap around actions and producers. They are called in the order they are applied, and can be used to perform side effects or modify the arguments and return values of actions."),(0,a.kt)("p",null,"They sound complicated, but can become straightforward when observing how they work in practice."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"This example is a custom implementation of ",(0,a.kt)("inlineCode",{parentName:"strong"},"loggerMiddleware"),":")),(0,a.kt)(i.Z,{groupId:"languages",mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'const loggerMiddleware: ProducerMiddleware = (producer) => {\n    // Producer-level, called by applyMiddleware\n\n    producer.subscribe((state) => {\n        print("state changed to", state);\n    });\n\n    return (dispatch, name) => {\n        // Action-level, called per action function\n\n        return (...args) => {\n            // Dispatch-level, wraps around action dispatch\n\n            print("dispatching", name, "with", args);\n\n            return dispatch(...args);\n        };\n    };\n};\n\nproducer.applyMiddleware(loggerMiddleware);\n'))),(0,a.kt)(l.Z,{value:"Luau",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-lua"},'local loggerMiddleware: Reflex.Middleware = function(producer)\n    -- Producer-level, called by applyMiddleware\n\n    producer:subscribe(function(state)\n        print("state changed to", state)\n    end)\n\n    return function(dispatch, name)\n        -- Action-level, called per action function\n\n        return function(...)\n            -- Dispatch-level, wraps around action dispatch\n\n            print("dispatching", name, "with", ...)\n\n            return dispatch(...)\n        end\n    end\nend\n\nproducer:applyMiddleware(loggerMiddleware)\n')))),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"A middleware has three layers of control that allow you to fine-tune behavior:")),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"The producer"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"The first level, the middleware itself, is called when it is applied to a producer."),(0,a.kt)("li",{parentName:"ul"},"You can make subscriptions or patch methods here."))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"An action"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"The second level is called once for every action in the producer, and receives a ",(0,a.kt)("inlineCode",{parentName:"li"},"dispatch")," function and the action name."),(0,a.kt)("li",{parentName:"ul"},"You might log a list of actions or permanently disable an action here."))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"On dispatch"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"The final level receives the action's arguments and calls ",(0,a.kt)("inlineCode",{parentName:"li"},"dispatch")," to invoke the next middleware in the chain."),(0,a.kt)("li",{parentName:"ul"},"You can cancel an action or log individual dispatches here.")))),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},(0,a.kt)("strong",{parentName:"p"},"The third level of middleware acts as a wrapper for actions.")," Calling ",(0,a.kt)("inlineCode",{parentName:"p"},"dispatch")," will invoke the next middleware in the chain, or the original action if it is the last middleware."),(0,a.kt)("p",{parentName:"admonition"},"Additionally, transforming the arguments or return value in the third level will ",(0,a.kt)("strong",{parentName:"p"},"pass them on")," to the next middleware or action.")),(0,a.kt)("details",null,(0,a.kt)("summary",null,"How does this look internally?"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"producer.applyMiddleware(firstMiddleware, secondMiddleware, thirdMiddleware);\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"// The first level is called once with the producer,\n// and returns a function that will wrap actions\nconst firstWrapper = firstMiddleware(producer);\nconst secondWrapper = secondMiddleware(producer);\nconst thirdWrapper = thirdMiddleware(producer);\n\nfor (const [key, action] of actions) {\n    // Action middlewares wrap around the original action,\n    // each one receiving the next function in the chain:\n    // first -> second -> third -> action\n    actions[key] = thirdWrapper(secondWrapper(firstWrapper(action, key), key), key);\n}\n\nproducer.increment(1);\n\n// Dispatching increment now invokes the middleware chain:\n// producer.increment -> first -> second -> third -> action, or\n// producer.increment -> increment(third(second(first(1)))\n"))),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"cancelling-actions"},"Cancelling actions"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Middleware can also be used to conditionally run actions.")," This is useful for throttling or cancelling actions based on the current state. We'll go over how to implement a middleware that throttles actions."),(0,a.kt)("p",null,"A throttle middleware would cancel actions if they're called within a certain time frame. You can throttle actions by updating a cooldown timer when the action is called, and conditionally cancel it by ",(0,a.kt)("em",{parentName:"p"},"not")," calling ",(0,a.kt)("inlineCode",{parentName:"p"},"dispatch"),"."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"This example is a custom implementation of ",(0,a.kt)("inlineCode",{parentName:"strong"},"throttleMiddleware"),",")," which cancels actions if they're called within one second of each other:"),(0,a.kt)(i.Z,{groupId:"languages",mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"TypeScript",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const throttleMiddleware: ProducerMiddleware = (producer) => {\n    return (dispatch, name) => {\n        let resumptionTime = 0;\n\n        return (...args) => {\n            // highlight-start\n            if (os.clock() < resumptionTime) {\n                // Cancel the action by returning early\n                return producer.getState();\n            }\n            // highlight-end\n            resumptionTime = os.clock() + 1;\n            return dispatch(...args);\n        };\n    };\n};\n\nproducer.applyMiddleware(throttleMiddleware);\n\nproducer.increment(1); // { counter: 1 }\nproducer.increment(1); // { counter: 1 } (cancelled)\n\ntask.wait(1);\nproducer.increment(1); // { counter: 2 }\n"))),(0,a.kt)(l.Z,{value:"Luau",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-lua"},"local throttleMiddleware: Reflex.Middleware = function(producer)\n    return function(dispatch, name)\n        local resumptionTime = 0\n\n        return function(...)\n            // highlight-start\n            if os.clock() < resumptionTime then\n                -- Cancel the action by returning early\n                return producer:getState()\n            end\n            // highlight-end\n            resumptionTime = os.clock() + 1\n            return dispatch(...)\n        end\n    end\nend\n\nproducer:applyMiddleware(throttleMiddleware)\n\nproducer.increment(1) --\x3e { counter = 1 }\nproducer.increment(1) --\x3e { counter = 1 } (cancelled)\n\ntask.wait(1)\nproducer.increment(1) --\x3e { counter = 2 }\n")))),(0,a.kt)("p",null,"This implementation throttles individual actions by storing their ",(0,a.kt)("inlineCode",{parentName:"p"},"resumptionTime"),' on the second "action" level, which runs once for every action function in the producer. On the third "dispatch" level, we check if the ',(0,a.kt)("inlineCode",{parentName:"p"},"resumptionTime")," is over yet, and if so, we call ",(0,a.kt)("inlineCode",{parentName:"p"},"dispatch")," and update the ",(0,a.kt)("inlineCode",{parentName:"p"},"resumptionTime")," to resume again in one second."),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},(0,a.kt)("strong",{parentName:"p"},"Cancelling actions also cancels the middlewares after it in the chain.")," For example, if we had a ",(0,a.kt)("inlineCode",{parentName:"p"},"loggerMiddleware")," ",(0,a.kt)("em",{parentName:"p"},"after")," ",(0,a.kt)("inlineCode",{parentName:"p"},"throttleMiddleware"),", it would not log actions that were throttled. If we wanted to log throttled actions, we would have to move ",(0,a.kt)("inlineCode",{parentName:"p"},"loggerMiddleware")," ",(0,a.kt)("em",{parentName:"p"},"before")," ",(0,a.kt)("inlineCode",{parentName:"p"},"throttleMiddleware"),".")))}g.isMDXComponent=!0}}]);