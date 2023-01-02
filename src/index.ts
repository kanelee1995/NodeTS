const express = require("express");
const app = express();

const hostname:string = "localhost";
const port:number = 8080;

app.get("/", (req:any, res:any) => {
    console.log(req.url);
    res.send("This is main page!")
})

app.get("/about", (req:any, res:any) => {
    res.send("This is about.")
})

app.get("/contact-me", (req:any, res:any) => {
    res.send("Contact")
})

app.use((req:any, res:any, next:any) => {
    res.status(404).send(
        "<h1>Page not found on the server</h1>")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });