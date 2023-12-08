const Koa = require("koa");
const { koaBody } = require("koa-body");
const router = require("./router");
const cors = require("@koa/cors");

const app = new Koa();
app.use(cors());
app.use(koaBody());
app.use(router.routes());

app.on("error", (err, ctx)=>{
    console.log(err);
    ctx.body = 'Server error: '+err;
});


app.listen(3000, ()=>{
    console.log("http://localhost:3000");
});