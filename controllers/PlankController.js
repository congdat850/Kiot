const model = require("../model/model");

function formatNameCodePlank(name) {

}

class Plank {
    async getListWarehousePlank(req, res) {
        let data = req.query || {};
        let page = data.page || 1;
        let categorys = ["MaVan", "TenVan", "NhaCungCap"];

        data.hasOwnProperty("page") && delete data.page;

        let query = data || {};

        let result = await model.getListWarehousePlank(query, page);
        let maxPage = await model.getMaxPageListWarehousePlank(query);

        res.render("planks/listWarehousePlank", {
            notIsLogin: true,
            planks: result,
            page: page,
            maxPage: maxPage,
            categorys: categorys
        });
    }
    async createPlank(req, res) {
        let data = req.query;
        let createPlankSuccess = data.createPlankSuccess || false;
        res.render("planks/createPlank", {
            notIsLogin: true,
            createPlankSuccess: createPlankSuccess
        });
    }

    async postAddPlank(req, res) {
        const param = req.body;
        let date = new Date();
        let MaNhap = date.getTime();
        let NgayNhap = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

        let result = await model.insertOrUpdatePlank(param);

        let valueNew = { "MaNhap": MaNhap, "NgayNhap": NgayNhap, ...param };

        let resultNew = await model.insertListImportPlanks(valueNew);
        res.redirect("/addPlank?createPlankSuccess=true");
    }

    async getListImportPlanks(req, res) {
        let data = req.query || {};
        let page = data.page || 1;
        let categorys = ["MaNhap", "MaVan", "TenVan", "DoDay"];

        data.hasOwnProperty("page") && delete data.page;
        data.hasOwnProperty("MaNhap") && (data.MaNhap = +data.MaNhap);

        let query = data || {};

        let result = await model.getListImportPlanks(query, page);
        let maxPage = await model.getMaxPageListImportPlanks(query);

        res.render("planks/listImportPlanks", {
            notIsLogin: true,
            planks: result,
            page: page,
            maxPage: maxPage,
            categorys: categorys
        });
    }

    async getListExportPlanks(req, res) {
        res.render("planks/listExportPlanks", { notIsLogin: true });
    }
}
module.exports = Plank;