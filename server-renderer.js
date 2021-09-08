/* eslint-disable @typescript-eslint/no-var-requires */
// noinspection NodeCoreCodingAssistance

const vsr = require("vue-server-renderer");
const clientManifest = require("./dist/vue-ssr-client-manifest.json")
const serverBundle = require("./dist/vue-ssr-server-bundle.json")
const fs = require("fs")
const express = require("express")
const path = require("path");


const renderer = vsr.createBundleRenderer(serverBundle, {
    template: fs.readFileSync("public/index.template.html", "utf-8"),
    clientManifest,
    runInNewContext: false,
    // basedir: path.resolve("dist")
})

const server = express()

server.use(express.static(path.join("dist")))

server.get("*", (req, res)=>{
    const context = {url: req.url, state: {msg: "hello world"}};
    renderer.renderToString(context)
        .then(html=>{
            res.send(html)
        })
        .catch(err => {
            console.error(err)
            res.status(500).send("Internal Server Error")
        })
})

server.listen(8080)
