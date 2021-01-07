const model = require("../model/model");
class CoveredSurface {
    async GetListWarehouseCoverSurface(req, res) {
        let result = await model.GetListWarehouseCoverSurface();
        console.log(result);
        res.render("coveredSurface/listWarehouseCoveredSurface", { notIsLogin: true,coveredSurface:result});
    }
}

module.exports = CoveredSurface;