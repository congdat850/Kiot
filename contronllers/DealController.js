var model = require("../model/model");
var ObjectId = require('mongodb').ObjectID;
class Deal {
    async getAddDeal(req, res) {
        var listProduct = await model.findAllProduct();
        res.render("deal/addDeal", { notIsLogin: true, listProduct: listProduct });
    }
    async postAddDeal(req, res) {
        var order = JSON.parse(req.body.data);
        var today = new Date();
        var date = today.getTime() ;
        var sumOMoney = 0;
        for (let i = 0; i < order.productOrder.length; i++) {
            var product = await model.findProduct({ _id: new ObjectId(order.productOrder[i]._id) });
            if (product.amount < order.productOrder[i].amount) {
                return res.send(order.productOrder[i].type + " vượt quá số lượng rồi. Có " + product.amount + " đòi hỏi " + order.productOrder[i].amount);
            }
            sumOMoney = sumOMoney + (+order.productOrder[i].unitPrice) * (+order.productOrder[i].amount);
            var updateProduct = await model.updateProduct({ _id: new ObjectId(order.productOrder[i]._id) }, { amount: (product.amount - order.productOrder[i].amount) });
        }
       
        order.totalPaymentAmount = sumOMoney;
        order.date= date;
        var result = await model.insertDeal(order);
        if (result)
            return res.send("Thêm đơn hàng thành công. Tổng tiền là: " + sumOMoney);
        return res.send("Thêm đơn hàng thất bại");
    }

    async getListDeal(req, res) {
        var result = await model.getAllDeal();
        
        for(let i=0;i<result.length;i++)
        {
            var date= new Date(result[i].date);
            result[i].date=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        }
        res.render("deal/listDeal",{notIsLogin:true,deals:result});
    }
}
module.exports = Deal;