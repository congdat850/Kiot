const model = require("../model/model");
class CoveredSurface {
    async getListWarehouseCoverSurface(req, res) {
        let query = req.query;
        let page = query.page || 1;

        let maxPage = await model.getMaxPageListWarehouseCoverSurface();
        let result = await model.getListWarehouseCoverSurface(page);

        res.render("coveredSurface/listWarehouseCoveredSurface", {
            notIsLogin: true,
            coveredSurface: result,
            page: page,
            maxPage: maxPage
        });
    }

    async createCoveredSurface(req, res) {
        res.render("coveredSurface/createCoveredSurface", { notIsLogin: true });
    }

    async postAddPCoveredSurface(req, res) {
        const param = req.body;

        let date = new Date();
        let MaNhap = date.getTime();
        let NgayNhap = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

        let valueUpdate = { "LoaiMatPhu": "Min", ...param };
        let result = await model.findAndUpdateCoverSuface(valueUpdate);

        let valueInsert = { "MaNhap": MaNhap, "NgayNhap": NgayNhap, ...valueUpdate };
        let resultNew = await model.insertCoverSurface(valueInsert);

        res.redirect("/coveredSurface")
    }

    async getListImportCoverSurface(req, res) {
        let query = req.query;
        let page = query.page || 1;
        
        let maxPage = await model.getMaxPageListImportCoverSurface();
        let result = await model.getListImportCoverSurface(page);

        res.render("coveredSurface/listImportCoverSurface", {
            notIsLogin: true,
            coverSurfaces: result,
            maxPage: maxPage,
            page: page
        });
    }
}

module.exports = CoveredSurface;