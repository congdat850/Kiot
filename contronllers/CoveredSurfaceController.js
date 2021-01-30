const model = require("../model/model");
class CoveredSurface {
    async GetListWarehouseCoverSurface(req, res) {
        let result = await model.GetListWarehouseCoverSurface();
        console.log(result);
        res.render("coveredSurface/listWarehouseCoveredSurface", { notIsLogin: true,coveredSurface:result});
    }
    async CreateCoveredSurface(req,res)
    {
        res.render("coveredSurface/createCoveredSurface", { notIsLogin: true});
    }
    async postAddPCoveredSurface(req,res)
    {
        const param = req.body;
        let date = new Date();
        let MaNhap = date.getTime();
        let NgayNhap = `${("0"+date.getHours()).slice(-2)}:${("0"+date.getMinutes()).slice(-2)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        
        let valueUpdate = {"LoaiMatPhu":"Min",...param};
        let result = await model.findAndUpdateCoverSuface(valueUpdate); 

        let valueInsert={"MaNhap":MaNhap,"NgayNhap":NgayNhap,...valueUpdate};
        let resultNew = await model.insertCoverSurface(valueInsert);
        res.redirect("/coveredSurface")
    }

    async listImportCoverSurface(req,res)
    {
        let result = await model.getListImportCoverSurface();
        res.render("coveredSurface/listImportCoverSurface",{ notIsLogin: true,coverSurfaces: result});
    }
}

module.exports = CoveredSurface;