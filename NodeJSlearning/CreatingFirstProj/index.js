const http = require("http");
const fs = require("fs");
const url = require("url");
const { serialize } = require("v8");

const myServer = http.createServer((req, res) => {
    const onUrl = req.url;
    const log = `new request received at : ${Date.now()} ,with ${onUrl}: \n`;
    // res.end(result)  shows the url that the request came from (default is /)
    if (req.url === "/favicon.ico") return res.end();
    const myUrl = url.parse(onUrl, true);
    console.log(myUrl);
    fs.appendFile("log.txt", log, (error, data) => {
        res.end("server is running on this");
    });

    switch (
        myUrl.pathname // now using the url to do something
    ) {
        case "/":
           res.end("Home");
            break;
        case "/home":
            
             const usr = myUrl.query.username;
             res.end(`HOME \n Welcome ${usr} `);
            break;
        case "/about":
            res.end("ABOUT ");
            break;
        case '/search':
            const searchR = myUrl.query.search_q;
            res.end(`Result for: ${searchR}`)
        default:
            res.end("404 NOT Found");
            break;
    }
});

myServer.listen(8000, () => console.log("server started at"));
