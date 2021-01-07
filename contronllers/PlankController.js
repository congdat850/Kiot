const model = require("../model/model");
class Plank {
    async GetListWarehousePlank(req, res) {
        let result = await model.GetListWarehousePlank();
        res.render("planks/listWarehousePlank", { notIsLogin: true,planks: result });
    }
}
module.exports = Plank;