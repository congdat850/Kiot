const model = require("../model/model");

class Customer {
    async GetListCustomer(req, res) {
        let result = await model.GetListCustomer();
        res.render("customers/listCustomer", { notIsLogin: true,customers: result });
    }
}
module.exports = Customer;