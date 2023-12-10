const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);

// 生成token
module.exports.createToken = async userInfo=>{
    const token = await tojwt({ userInfo }, "koa-video", {
        expiresIn: 60*60*24
    });
    
    return token;
}

// 验证token
module.exports.verifyToken = function(required = true) {
    return async(ctx, next) => {
        let token = ctx.headers.authorization;
        token = token ? token.split("Bearer ")[1] : null;
        if(token) {
            try {
                const userinfo = await verify(token, "koa-video");
                ctx.user = userinfo;
                await next();
            } catch (error) {
                ctx.throw(402, error);
            }
        } else if(required) {
            ctx.throw(402, "无效的token");
        } else {
            await next();
        }
    }
}