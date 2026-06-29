const http = require("http");
const { users } = require("./data");
const url = require("url");
const fs = require("fs");
const { json } = require("stream/consumers");
const { stringify } = require("querystring");

const server = http.createServer((req, res) => {
    const rUrl = req.url;
    const method = req.method;
    const myUrl = url.parse(rUrl, true);
    let log = `logged data : ${myUrl.pathname} , Method: ${method} at time:${Date.now()} \n`;
    console.log(myUrl);
    fs.appendFile("./logs.txt", log, (err, data) => {
        console.log("Logged");
    });
    if (myUrl.pathname === "/favicon.ico") return res.end();
    if (myUrl.pathname === "/") {
        res.write("Path name must be /users ");
        return res.end();
    }

    if (myUrl.pathname === "/users" && method === "GET") {
        console.log(users);
        res.statusCode = 200;

        if (myUrl.query.type === "json") {
            res.setHeader("Content-Type", "application/json");

            let activeUsers = users.filter(u => u.isActive == true)

            res.write(JSON.stringify(activeUsers));
            return res.end();
        }
        if (myUrl.query.type === "html") {
            res.setHeader("Content-Type", "text/html");
            let html = ``;
              let activeUsers = users.filter((u) => u.isActive == true);
            activeUsers.forEach((element) => {
                html += `
            <table>
            <tbody>
                <tr>
                    <td>||------ID: ${element.id}  </td>
                    <td>------Name: ${element.name}   </td>
                    <td>------Email: ${element.email}  </td>
                    <td>------Role: ${element.role}   </td>
                    <td>------Position: ${element.position}  </td>
                    <td>------Phone Number : ${element.phone} || </td>
                </tr>
            </tbody>
            </table>
            `;
            });
            res.write(html);
            return res.end();
        }
        res.statusCode = 400;
        return res.end("select a type for get response 'type = html or JSON'  ");
    }
    // post body
    else if (myUrl.pathname === "/users" && method === "POST") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            let data = JSON.parse(body);
            let user = users.at(-1);
            let autoId = user.id + 1; // generating id from lat user id
            console.log("auto id is :", autoId);
            let parseId = parseInt(data.id);
            let id = isNaN(parseId) ? autoId : parseId;
            let name = data.name ?? "noName";
            let email = data.email ?? "email@example.com";
            let role = data.role ?? "javascript";
            let position = data.position ?? "intern";
            let phone = data.phone ?? "0000000000000";

            const newUSer = { id, name, email, role, position, phone };

            users.push(newUSer);

            // res.statusCode = 201;
            // res.write("user added");
            // return res.end();
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User created!!" }));
        });
    } // PUT body
    else if (myUrl.pathname.startsWith("/users/") && method === "PUT") {
        let id = parseInt(myUrl.pathname.split("/users/")[1]);
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            console.log("this is put user id ", id);
            let data = JSON.parse(body);
            let userFound = users.find((u) => u.id == id);
            if (!userFound) {
                // user not found
                res.writeHead(404, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "User not found" }));
                return;
            }
            let index = users.findIndex((u) => u.id == id); // user index

            if (index >= 0) {
                users[index] = { id, ...data };
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated!!" }));
            return;
        });
    } //// Body of Deleted
    else if (myUrl.pathname.startsWith("/users/") && method === "DELETE") {
        let id = parseInt(myUrl.pathname.split("/users/")[1]);

        let userExists = users.find((u) => u.id == id);
        if (!userExists) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
        }
        let userIndex = users.findIndex((u) => u.id == id);
        if (userIndex >= 0) {
             users[userIndex].isActive = false;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User Deleted!!" }));
        return;
    } else {
        res.write("Hello ? Need help?");
        return res.end();
    }
});

server.listen(3001, () => console.log("server started"));
