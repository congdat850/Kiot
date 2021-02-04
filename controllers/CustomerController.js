const model = require("../model/model");

function getNameCode(userName) {
    userName = xoa_dau(userName);
    let myArray = userName.split(" ");
    let result = myArray[myArray.length - 1];
    for (let i = 0; i < myArray.length - 1; i++) {
        result = result + myArray[i][0];
    }
    return result.toUpperCase();
}

function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

class Customer {
    async getListCustomer(req, res) {
        let data = req.query;
        let page = data.page || 1;
        let categorys = ["MaKhachHang", "TenKhachHang", "DiaChi", "Sdt", "Email"];
        data.hasOwnProperty("page") && delete data.page;
        let query = data || {};

        let maxPage = await model.getMaxPageListCustomer(query);
        let result = await model.getListCustomer(query, page);

        res.render("customers/listCustomer", {
            notIsLogin: true,
            customers: result,
            page: page,
            maxPage: maxPage,
            categorys: categorys
        });
    }

    async getAddCustomer(req, res) {
        let data = req.query;
        let createCustomerSuccess = data.createCustomerSuccess || false;
        res.render("customers/createCustomer", {
            notIsLogin: true,
            createCustomerSuccess: createCustomerSuccess
        });
    }
    async postAddCustomer(req, res) {
        const customer = req.body;
        const nameCodeCustomer = getNameCode(customer.TenKhachHang);
        let checkExistCustomer = [];
        let nameCodeCustomerNew = "";
        let stt = 0;
        let customerNew = {};
        let result;
        do {
            nameCodeCustomerNew = stt == 0 ? nameCodeCustomer : nameCodeCustomer + stt;
            checkExistCustomer = await model.getListCustomer({ "MaKhachHang": nameCodeCustomerNew });
            stt++;
            console.log(nameCodeCustomerNew);
        }
        while (checkExistCustomer[0])
        customerNew = { "MaKhachHang": nameCodeCustomerNew, ...customer };
        console.log(customerNew);
        result = await model.insertCustomer(customerNew);
        res.redirect("/addCustomer?createCustomerSuccess=true");
    }

    async postDeleteCustomer(req, res) {
        let result;
        let params = req.params;
        let idCustomer = params.id || "";

        if (req.params.id)
            result = await model.deleteCustomer({ "MaKhachHang": idCustomer });

        res.send("Success");
    }
    async postUpdateCustomer(req, res) {
        let param = req.body;
        let result = await model.updateCustomer(param);

        res.redirect("/customer");
    }
}
module.exports = Customer;