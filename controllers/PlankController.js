const model = require("../model/model");

function formatNameCodePlank(name) {

}

class Plank {
    async GetListWarehousePlank(req, res) {
        let query = req.query;
        let page = query.page || 1;
        let result = await model.GetListWarehousePlank(page);
        let maxPage = await model.getMaxPageListWarehousePlank();

        res.render("planks/listWarehousePlank", {
            notIsLogin: true,
            planks: result,
            page: page,
            maxPage: maxPage
        });
    }
    async CreatePlank(req, res) {
        res.render("planks/createPlank", { notIsLogin: true });
    }

    async postAddPlank(req, res) {
        const param = req.body;
        let date = new Date();
        let MaNhap = date.getTime();
        let NgayNhap = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        let result = await model.insertOrUpdatePlank(param);
        let valueNew = { "MaNhap": MaNhap, "NgayNhap": NgayNhap, ...param };
        let resultNew = await model.insertListImportPlanks(valueNew);
        res.redirect("/warehousePlank");
    }

    async getListImportPlanks(req, res) {
        let query = req.query;
        let page = query.page || 1;

        let result = await model.getListImportPlanks(page);
        let maxPage = await model.getMaxPageListImportPlanks();
        
        res.render("planks/listImportPlanks", {
            notIsLogin: true,
            planks: result,
            page: page,
            maxPage: maxPage
        });
    }

    async getListExportPlanks(req, res) {
        res.render("planks/listExportPlanks", { notIsLogin: true });
    }
}
module.exports = Plank;