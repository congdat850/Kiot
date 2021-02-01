const { json, query } = require("express");
const model = require("../model/model");
const { param } = require("../routes");

function FormatQuerySearch(data) {
    switch (data.typeSearch) {
        case "":
            return {};
        case "MaLenDon":
            return { "MaLenDon": +data.contentSearch };
        case "MaKhachHang":
            return { "MaKhachHang": data.contentSearch };
        case "TenKhachHang":
            return { "TenKhachHang": data.contentSearch };
        case "NguoiLenDon":
            return { "NguoiLenDon": data.contentSearch };
    }
}

function FormatQueryFilter(data) {
    let fromDate = data.fromDate || "";
    let toDate = data.toDate || "";

    if (fromDate != "" && toDate != "") {
        let dateFromDate = new Date(data.fromDate);
        let timeFromDate = dateFromDate.getTime();

        let dateToDate = new Date(data.toDate);
        let timeToDate = dateToDate.getTime() + (24 * 60 * 60 * 1000);

        let query = data.filterProcess == "TatCa" ? {} : { "TienDo": data.filterProcess }

        return { ...query, "MaLenDon": { $gte: timeFromDate, $lte: timeToDate } }
    }
    else return data.filterProcess == "TatCa" ? {} : { "TienDo": data.filterProcess }
}

class Order {
    async GetListOrderManagement(req, res) {
        let data = req.query;
        let page = data.page || 1;
        let result = [];
        let maxPage;
        let filterProcess = data.filterProcess || "TatCa";
        let fromDate = data.fromDate || "";
        let toDate = data.toDate || "";

        if (data.contentSearch) {
            maxPage = await model.getMaxPageListOrderManagement(FormatQuerySearch(data));
            result = await model.GetListOrderManagement(FormatQuerySearch(data), page);
        }
        else if (data.filterProcess) {
            maxPage = await model.getMaxPageListOrderManagement(FormatQueryFilter(data));
            result = await model.GetListOrderManagement(FormatQueryFilter(data), page);
        }
        else {
            maxPage = await model.getMaxPageListOrderManagement({});
            result = await model.GetListOrderManagement({}, page);
        }

        res.render("orderManagement/listOrderManagement", {
            notIsLogin: true, orders: result,
            page: page,
            maxPage: maxPage,
            filterProcess: filterProcess,
            fromDate: fromDate,
            toDate: toDate
        });
    }
    async PostProcess(req, res) {
        let data = JSON.parse(req.body.data);
        let result = await model.ChangeOrderProcess({ "MaLenDon": data.id }, { "TienDo": data.process });

        res.send("success");
    }

    // page createOrderManagement
    async GetCreateOrderManagement(req, res) {
        let customers = await model.GetListCustomer();
        let planks = await model.GetListWarehousePlank();
        let coveredSurface = await model.getListWarehouseCoverSurface();

        res.render("orderManagement/createOrderManagement", { notIsLogin: true, data: JSON.stringify({ "customers": customers, "planks": planks, "coveredSurface": coveredSurface }) });
    }

    async PostCreateOrderManagement(req, res) {
        const params = req.body;
        let result;
        let resultSurface;
        let resultUpdate;
        let resultUpdateSurface;

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

                updatePlank.push({ "MaVan": arrayNameProduct[0], "SoLuong": result[i].SoLuong - SanPhamLenDon[i].SoLuong });
    
                if (arrayNameProduct[2] == "Min")
                    valueCoverSurface.push({ "MaMau": arrayNameProduct[3], "SoLuong": SanPhamLenDon[i].SoLuong * arrayNameProduct[5][0] });
            }

            for (let i = 0; i < resultSurface.length; i++) {
                resultUpdateSurface = await model.updateCoverSurface({ "MaMau": resultSurface[i].MaMau, "SoLuong": (resultSurface[i].SoLuong - valueCoverSurface[i].SoLuong) });
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

        if (data.contentSearch) res.redirect("/orderManagement?contentSearch=" + data.contentSearch + "&typeSearch=" + data.typeSearch);
        else res.redirect("/orderManagement");
    }

    async PostFilterOder(req, res) {
        const data = req.body;

        if (data.filterProcess) 
        res.redirect("/orderManagement?filterProcess=" + data.filterProcess + "&fromDate=" + data.fromDate + "&toDate=" + data.toDate);
        else res.redirect("/orderManagement");
    }
}
module.exports = Order;