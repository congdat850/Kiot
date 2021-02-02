const model = require("../model/model");

class CoveredSurface {
    async getListWarehouseCoverSurface(req, res) {
        let data = req.query;
        let page = data.page || 1;
        let categorys= ["MaMau","LoaiMatPhu"];

        data.hasOwnProperty("page")&& delete data.page;

        let query = data||{};

        let maxPage = await model.getMaxPageListWarehouseCoverSurface(query);
        let result = await model.getListWarehouseCoverSurface(query,page);

        res.render("coveredSurface/listWarehouseCoveredSurface", {
            notIsLogin: true,
            coveredSurface: result,
            page: page,
            maxPage: maxPage,
            categorys:categorys
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
        let data = req.query;
        let page = data.page || 1;
        let categorys = ["MaNhap","MaMau","Film","LoaiMatPhu"];

        data.hasOwnProperty("page")&&delete data.page;
        
        let query = data || {};
        
        let maxPage = await model.getMaxPageListImportCoverSurface(query);
        let result = await model.getListImportCoverSurface(query,page);

        res.render("coveredSurface/listImportCoverSurface", {
            notIsLogin: true,
            coverSurfaces: result,
            maxPage: maxPage,
            page: page,
            categorys:categorys
        });
    }
}

module.exports = CoveredSurface;