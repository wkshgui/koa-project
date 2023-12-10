const mongoose = require("mongoose");
const { mongoPath } = require("../config/confit.default");

async function main() {
    await mongoose.connect(mongoPath);
}

main().then(res => {
    console.log("mongoDB连接成功");
}).catch(err=>{
    console.log("mongoDB连接失败：", err);
});

module.exports = {
    User: mongoose.model('User', require('./userModel')),
    Video: mongoose.model("Video", require("./videoModel")),
    Subscribe: mongoose.model("Subscribe", require("./subscribeModel")),
    Videocomment: mongoose.model("Videocomment", require("./videocommentModel")),
    Videolike: mongoose.model("Videolike", require("./videolikeModel")),
    Collect: mongoose.model("Collect", require("./collectModel"))
}