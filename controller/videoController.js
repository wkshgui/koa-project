const { Video, Videocomment } = require("../model/index");

// 创建视频
module.exports.createVideo = async ctx => {
    const body = ctx.request.body;
    body.user = ctx.user.userInfo._id;
    const videoModel = new Video(body);
    try {
        const dbback = videoModel.save();
        ctx.body = dbback;
    } catch (error) {
        ctx.throw(502, error);
    }
}

// 频道视频列表
module.exports.videoList = async ctx => {
    const userid = ctx.request.params.userid;
    const {pageNum=1, pageSize=10} = ctx.request.query;
    const videolist = await Video.find({user: userid}).skip((pageNum-1)*pageSize)
                .limit(pageSize).sort({createAt: -1})
                .populate("user", [
                    "cover",
                    "username",
                    "image",
                    "channeldes",
                    "subscribeCount"
                ]);
            
    ctx.body = videolist;
}

// 获取视频详情
module.exports.getVideo = async ctx=>{
    const videoid = ctx.request.params.videoid;
    const dbback = await Video.findById(videoid).populate("user", [
        "cover",
        "username",
        "image",
        "channeldes",
        "subscribeCount"
    ]);

    const videoinfo = dbback._doc;
    if(videoinfo) {
        const { getvodplay } = require("./vodController");
        const vodinfo = await getvodplay(videoinfo.vodvideoId);
        videoinfo.vod = vodinfo;

        ctx.body = videoinfo;
    } else {
        ctx.throw(501, "视频不存在");
    }
}

// 添加视频评论
module.exports.createComment = async ctx => {
    const videoId = ctx.request.params.videoid;
    const { content } = ctx.request.body;
    const userId = ctx.user.userInfo._id;

    const videoInfo = await Video.findById(videoId);
    if(videoInfo){
        const commentModel = new Videocomment({
            content,
            video: videoId,
            user: userId
        });
        const dbback = await commentModel.save();
        if(dbback) {
            videoInfo.commentCount++;
            await videoInfo.save();
            // redis hot +2
            ctx.body = {msg: "评论成功"};
        } else {
            ctx.throw(501, "评论失败");
        }
    }else{
        ctx.throw(404, "视频不存在");
    }
}