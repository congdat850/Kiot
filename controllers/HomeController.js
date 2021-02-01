const { render } = require("jade");
const model = require("../model/model");


class Home {
    async GetHome(req,res)
    {
        res.render("home/home",{ notIsLogin: true,})
    }
}
module.exports = Home;