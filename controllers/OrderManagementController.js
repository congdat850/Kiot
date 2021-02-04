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
    async getListOrderManagement(req, res) {
        let data = req.query || {};
        let page = data.page || 1;
        let result = [];
        let maxPage;
        let filterProcess = data.filterProcess || "TatCa";
        let fromDate = data.fromDate || "";
        let toDate = data.toDate || "";
        let categorys = ["MaLenDon", "MaKhachHang", "TenKhachHang", "NguoiLenDon"]

        if (data.hasOwnProperty("MaLenDon") || data.hasOwnProperty("MaKhachHang") || data.hasOwnProperty("TenKhachHang") || data.hasOwnProperty("NguoiLenDon")) {
            if (data.hasOwnProperty("MaLenDon")) {
                data.MaLenDon = +data.MaLenDon;
            }
            data.hasOwnProperty("page") && delete data.page;
            maxPage = await model.getMaxPageListOrderManagement(data);
            result = await model.getListOrderManagement(data, page);
        }
        else if (data.filterProcess) {
            maxPage = await model.getMaxPageListOrderManagement(FormatQueryFilter(data));
            result = await model.getListOrderManagement(FormatQueryFilter(data), page);
        }
        else {
            maxPage = await model.getMaxPageListOrderManagement({});
            result = await model.getListOrderManagement({}, page);
        }

        res.render("orderManagement/listOrderManagement", {
            notIsLogin: true, orders: result,
            page: page,
            maxPage: maxPage,
            filterProcess: filterProcess,
            fromDate: fromDate,
            toDate: toDate,
            categorys: categorys
        });
    }
    async postProcess(req, res) {
        let result;
        let data = JSON.parse(req.body.data);

        if (data.beforeChangeProcess !== "DaGiao" && data.beforeChangeProcess != "HuyDon") {
            if (data.process == "HuyDon") {
                let query = { MaLenDon: data.id };
                result = await model.findOrderManagement(query);
                let soLuongVanLenDon = result.SoLuongVanLenDon;
                let soLuongMatPhuLenDon = result.SoLuongMatPhuLenDon;
                //update Plank
                for (let i = 0; i < soLuongVanLenDon.length; i++) {
                    let queryPlank = { MaVan: soLuongVanLenDon[i].MaVan }

                    let resultPlank = await model.findOnePlank(queryPlank);

                    let soLuong = resultPlank.SoLuong;
                    let newvalue = { $set: { SoLuong: (soLuong + soLuongVanLenDon[i].SoLuong) } }

                    let resultUpdatePlank = await model.updatePlank(queryPlank, newvalue);
                }
                //update Surface
                for (let i = 0; i < soLuongMatPhuLenDon.length; i++) {
                    let querySurface = { MaMau: soLuongMatPhuLenDon[i].MaMau };

                    let resultSurface = await model.findOneSurface(querySurface);

                    let soLuong = resultSurface.SoLuong;
                    let newvalue = { $set: { SoLuong: (soLuong + soLuongMatPhuLenDon[i].SoLuong) } };

                    let resultUpdateSurface = await model.updateCoverSurface(querySurface, newvalue);
                }
            }

            result = await model.changeOrderProcess({ "MaLenDon": data.id }, { "TienDo": data.process });
        }
        res.send("success");
    }

    // page createOrderManagement
    async getCreateOrderManagement(req, res) {
        let data = req.query;

        let createOrderSuccess = data.createOrderSuccess || false;
        let createOrderDefeat = data.createOrderDefeat|| false;
        let customers = await model.getListCustomer();
        let planks = await model.getListWarehousePlank();
        let coveredSurface = await model.getListWarehouseCoverSurface();

        res.render("orderManagement/createOrderManagement", {
            notIsLogin: true,
            data: JSON.stringify({ "customers": customers, "planks": planks, "coveredSurface": coveredSurface }),
            createOrderSuccess:createOrderSuccess,
            createOrderDefeat:createOrderDefeat
        });
    }

    async postCreateOrderManagement(req, res) {
        const params = req.body;
        let result = [];
        let resultSurface = [];

        let resultUpdatePlank;
        let resultUpdateSurface;

        let KiemTraSoLuongVan = JSON.parse(params.KiemTraSoLuongVan);
        let KiemTraSoLuongMatPhu = JSON.parse(params.KiemTraSoLuongMatPhu);
        let CapNhatSoLuongVan = JSON.parse(params.CapNhatSoLuongVan);
        let CapNhatSoLuongMatPhu = JSON.parse(params.CapNhatSoLuongMatPhu);

        console.log("Cap Nhat SL Van", CapNhatSoLuongMatPhu);
        console.log("Kiem Tra So Luong Van", KiemTraSoLuongMatPhu);

        if (KiemTraSoLuongVan.length > 0)
            result = await model.findMultiplePlank(KiemTraSoLuongVan);
        if (KiemTraSoLuongMatPhu.length > 0)
            resultSurface = await model.findMultipleCoverSurface(KiemTraSoLuongMatPhu);
        if (result.length == KiemTraSoLuongVan.length && resultSurface.length == KiemTraSoLuongMatPhu.length) {

            let date = new Date();
            let MaLenDon = date.getTime();
            let NgayLenDon = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            let SanPhamLenDon = JSON.parse(params.DanhSachSanPham);

            let soLuongVanLenDon = [];
            let soLuongMatPhuLenDon = [];

            for (let i = 0; i < CapNhatSoLuongVan.length; i++) {
                let query = { MaVan: CapNhatSoLuongVan[i].MaVan };
                let newvalue = { $set: { SoLuong: CapNhatSoLuongVan[i].SoLuong } };
                soLuongVanLenDon.push({ ...query, SoLuong: (KiemTraSoLuongVan[i].SoLuong - CapNhatSoLuongVan[i].SoLuong) });
                resultUpdatePlank = await model.updatePlank(query, newvalue);
            }

            for (let i = 0; i < CapNhatSoLuongMatPhu.length; i++) {
                let query = { MaMau: CapNhatSoLuongMatPhu[i].MaMau }
                let newvalue = { $set: { SoLuong: CapNhatSoLuongMatPhu[i].SoLuong } }
                soLuongMatPhuLenDon.push({ ...query, SoLuong: (KiemTraSoLuongMatPhu[i].SoLuong - CapNhatSoLuongMatPhu[i].SoLuong) })
                resultUpdateSurface = await model.updateCoverSurface(query, newvalue);
            }

            let newOrder = {
                "MaLenDon": MaLenDon,
                "MaKhachHang": params.MaKhachHang,
                "TenKhachHang": params.TenKhachHang,
                "NguoiLenDon": "DatNC",
                "NgayLenDon": NgayLenDon,
                "TienDo": params.GhiChu == "" ? "SanXuat" : "ThieuHang",
                "GhiChu": params.GhiChu,
                "ChiTietDon": SanPhamLenDon,
                "SoLuongVanLenDon": soLuongVanLenDon,
                "SoLuongMatPhuLenDon": soLuongMatPhuLenDon
            }

            result = await model.insertNewOrder(newOrder);
            res.redirect("/createOrderManagement?createOrderSuccess=true");
        }
        else res.redirect('/createOrderManagement?createOrderDefeat=true');
    }

    async postFilterOder(req, res) {
        const data = req.body;

        if (data.filterProcess)
            res.redirect("/orderManagement?filterProcess=" + data.filterProcess + "&fromDate=" + data.fromDate + "&toDate=" + data.toDate);
        else res.redirect("/orderManagement");
    }
}
module.exports = Order;