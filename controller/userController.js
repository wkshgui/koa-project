const { User, Subscribe } = require("../model");
const { createToken } = require("../util/jwt");

module.exports.index = async(ctx, next)=>{
    const user = await User.findById(ctx.params.userId);
    ctx.body = user;
}

// 用户注册
module.exports.register = async(ctx, next)=>{
    const userModel = new User(ctx.request.body);
    const dbback =  await userModel.save();

    ctx.body = dbback;
}

// 用户登录
module.exports.login = async(ctx, next)=>{
    const dbback = await User.findOne(ctx.request.body);
    if(!dbback) {
        return ctx.throw(402, "邮箱或者密码不正确");
    }

    const token = await createToken(dbback._doc);
    dbback._doc.token = token;

    ctx.body = dbback._doc;
}

// 获取用户信息
module.exports.getuser = async ctx=>{
    const userid = ctx.request.params.userid;
    const registerUserid = ctx.user ? ctx.user.userInfo._id : null;
    let isSubscribed = false;
    if(registerUserid) {
        const subscribe = await Subscribe({
            user: registerUserid,
            channel: userid
        });
        if(subscribe) {
            isSubscribed = true;
        }
    }

    const userInfoDb = await User.findById(userid, [
        "cover",
        "username",
        "image",
        "channeldes"
    ]);
    const userinfo = userInfoDb._doc;
    userinfo.isSubscribed = isSubscribed;

    ctx.body = userinfo;
}

// 关注频道
module.exports.subscribe = async ctx => {
    const subscribeid = ctx.params.subscribeid;
    const userid = ctx.user.userInfo._id;
    if(subscribeid === userid) {
        return ctx.throw(403, "不能关注自己");
    }

    const subinfo = await Subscribe.findOne({
        user: userid,
        channel: subscribeid
    });
    if(subinfo) {
        return ctx.throw(403, "已经关注了");
    }

    const sub = new Subscribe({
        user: userid,
        channel: subscribeid
    });
    const subDb = await sub.save();
    if(subDb) {
        const subscribeUser = await User.findById(subscribeid, [
            "username",
            "image",
            "cover",
            "channeldes"
        ]);
        subscribeUser.subscribeCount++;
        await subscribeUser.save();
        ctx.body = subscribeUser;
    } else {
        ctx.throw(501, "关注失败");
    }
}

// 
module.exports.subscribeList = async ctx=>{
    const userid = ctx.user.userInfo._id;
    const subList = await Subscribe.find({ user: userid }).populate('channel', [
        "username",
        "image",
        "channeldes", 
        "subscribeCount"
    ]);

    ctx.body = subList;
}