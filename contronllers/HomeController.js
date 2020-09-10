var model=require("../model/model");

class HomeController{
    async getindex(req, res)
    {
        await model.findUser();
        res.render("home",{notIsLogin:true});
    }
}

module.exports=HomeController;