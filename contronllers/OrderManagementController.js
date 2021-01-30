const { json, query } = require("express");
const model = require("../model/model");
const { param } = require("../routes");

class Order {
    async GetListOrderManagement(req, res) {
        let data = req.query;
        let result = [];
        result = await model.GetListOrderManagement(data);
        res.render("orderManagement/listOrderManagement", { notIsLogin: true, orders: result });
    }
    async PostProcess(req, res) {
        let data = JSON.parse(req.body.data);
        console.log(data);
        let result = await model.ChangeOrderProcess({ "MaLenDon": data.id }, { "TienDo": data.process });
        res.send("success");
    }

    // page createOrderManagement
    async GetCreateOrderManagement(req, res) {
        let customers = await model.GetListCustomer();
        let planks = await model.GetListWarehousePlank();
        let coveredSurface = await model.GetListWarehouseCoverSurface();
        res.render("orderManagement/createOrderManagement", { notIsLogin: true, data: JSON.stringify({ "customers": customers, "planks": planks, "coveredSurface": coveredSurface }) });
    }

    async PostCreateOrderManagement(req, res) {
        const params = req.body;
        console.log(params);
        let result;
        let resultSurface;
        let resultUpdate;
        let resultUpdateSurface;
        console.log(params);
        let KiemTraSoLuongVan = JSON.parse(params.KiemTraSoLuongVan);
        let KiemTraSoLuongMatPhu = JSON.parse(params.KiemTraSoLuongMatPhu);
        if (KiemTraSoLuongVan.length > 0)
            result = await model.FindMultiplePlank(KiemTraSoLuongVan);
        if (KiemTraSoLuongMatPhu.length > 0)
            resultSurface = await model.FindMultipleCoverSurface(KiemTraSoLuongMatPhu);
        if (result.length == KiemTraSoLuongVan.length && resultSurface.length == KiemTraSoLuongMatPhu.length) {
            let d = new Date();
            let MaLenDon = d.getTime();
            let NgayLenDon = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
            let SanPhamLenDon = JSON.parse(params.DanhSachSanPham);
            let updatePlank = [];
            let updateCoverSurface = [];
            let valueCoverSurface = [];

            for (let i = 0; i < SanPhamLenDon.length; i++) {
                let arrayNameProduct = SanPhamLenDon[i].LoaiVanDoDayMatPhuSoMat.split(" ");
                updatePlank.push({ "MaVan": arrayNameProduct[0], "SoLuong": result[i].SoLuong - SanPhamLenDon[i].SoLuong })
                if (arrayNameProduct[2] == "Min")
                    valueCoverSurface.push({ "MaMau": arrayNameProduct[3], "SoLuong": SanPhamLenDon[i].SoLuong * arrayNameProduct[5][0] });
            }
            console.log("valueCoverSurface", valueCoverSurface);

            for (let i = 0; i < resultSurface.length; i++) {
                resultUpdateSurface = await model.updateCoverSurface({ "MaMau": resultSurface[i].MaMau, "SoLuong": (resultSurface[i].SoLuong - valueCoverSurface[i].SoLuong )});
            }

            for (let i = 0; i < updatePlank.length; i++) {
                resultUpdate = await model.updatePlank(updatePlank[i]);
            }

            let newOrder = {
                "MaLenDon": MaLenDon,
                "MaKhachHang": params.MaKhachHang,
                "TenKhachHang": params.TenKhachHang,
                "NguoiLenDon": "DatNC",
                "NgayLenDon": NgayLenDon,
                "TienDo": params.GhiChu == "" ? "SanXuat" : "ThieuHang",
                "GhiChu": params.GhiChu,
                "ChiTietDon": SanPhamLenDon
            }
            result = await model.InsertNewOrder(newOrder);
            res.redirect("/orderManagement");
        }
        else res.redirect('/createOrderManagement');
    }
    async PostSearchOrder(req, res) {
        const data = req.body;
        console.log(data);
        if (data.contentSearch) res.redirect("/orderManagement?contentSearch=" + data.contentSearch + "&typeSearch=" + data.typeSearch);
        else res.redirect("/orderManagement");
    }

    async PostFilterOder(req, res) {
        const data = req.body;
        console.log(data);
        if (data.filterProcess) res.redirect("/orderManagement?filterProcess=" + data.filterProcess + "&fromDate=" + data.fromDate + "&toDate=" + data.toDate);
        else res.redirect("/orderManagement");
    }
}
module.exports = Order;