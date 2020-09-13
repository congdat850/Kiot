var model= require("../model/model");
class Deal{
    async getAddDeal(req,res)
    {
        var listProduct = await model.findProducts();
        console.log(listProduct);
        res.render("deal/addDeal",{notIsLogin:true,listProduct:listProduct});
    }
    async postAddDealProduct(req,res)
    {
        var order=JSON.parse(req.body.data);
        res.send(order);
    }
}
module.exports=Deal;