import createApp from "@/createApp";
import Vue from "vue";

export default function (context: {url: string, state: any}): Vue | Promise<Vue> {
    const {app, router, store} = createApp();
    return new Promise((resolve, reject)=>{
        router.push(context.url);
        router.onReady(()=>{
            const matchedComments = router.getMatchedComponents()
            if(!matchedComments.length) return reject({code: 404});

            // Promise.all(
            //     matchedComments
            //         .filter(c=>typeof (c as any).asyncData === "function")
            //         .map(c=>(c as any).asyncData(store, router))
            // ).then(()=>{
            //     context.state = store.state;
            //     resolve(app)
            // })
            context.state = store.state;
            resolve(app)
        }, reject)
    })
}
