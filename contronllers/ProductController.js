const model = require("../model/model");

class Product {
    async getListProduct(req, res) {

        var result= await model.findAllProduct();

        if (req.query.query) var query = JSON.parse(req.query.query);
        if (query) {
            query.notIsLogin = true;
            query.products= result
            return res.render("product/listProduct", query);
        }
        return res.render("product/listProduct", { notIsLogin: true, products:result });
    }

    async getAddProduct(req, res) {
        res.render("product/addProduct", { notIsLogin: true });
    }
    async postAddProduct(req, res) {
        var result = await model.insertProduct(req.body);
        if (result) {
            return res.redirect("/products?query=" + JSON.stringify({addProductSuccess: true, notIsLogin: true}));
        }
        return res.render("/product?query="+JSON.stringify({ addProductFail: true, notIsLogin: true }));
    }
}

module.exports = Product;