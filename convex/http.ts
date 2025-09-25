import { HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = new HttpRouter();

export const doSomething = httpAction(async (ctx, request) => {
    const { data, type } = await request.json();
    console.log("Received webhook:", { data, type });

    switch (type) {
        case "user.created":
            console.log("User created:", data);
            break;
    }

    return new Response(null, { status: 200 });
});

http.route({
    path: "/clerk-users-webhook",
    method: "GET",
    handler: doSomething,
})

//https://neat-rhinoceros-328.convex.site/clerk-users-webhook

export default http;