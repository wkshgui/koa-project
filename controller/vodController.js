// var RPCClient = require("@alicloud/pop-core").RPCClient;
var RPCClient = function() {};

function initVodClient(accessKeyId, accessKeySecret,) {
    const regionId = 'cn-shanghai';
    const client = new RPCClient({
        accessKeyId,
        accessKeySecret,
        endpoint: 'http://vod.'+regionId+'.aliyuncs.com',
        apiVersion: '2017-03-21'
    });

    return client;
};

const getvodplay = async(vodid)=>{
    const client = initVodClient('', '');
    try {
        const response = await client.request("GetPlayInfo", {VideoId: vodid}, {});
        return response;
    } catch (error) {
        console.log(error);
    }
}

exports.getvod = async ctx => {
    const client = initVodClient('', '');
    const vodback = await client.request("CreateUploadVideo", {
        Title: ctx.request.query.title,
        FileName: ctx.request.query.filename
    }, {});

    ctx.body = vodback;
};

exports.getPlay = async ctx=>{
    const play = await getvodplay(ctx.request.query.vodid);
    ctx.body = play;
}

module.exports.getvodplay = getvodplay;
