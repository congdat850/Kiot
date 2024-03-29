const { render } = require("jade");
const model = require("../model/model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passwordDefaul = "1";

function getEmployeeCode(userName) {
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

class User {
    async getListUser(req, res) {
        let data = req.query;
        let page = data.page || 1;
        let categorys = ["Ten", "Email", "DiaChi", "Sdt", "NgaySinh", "ChucVu", "Ma"];

        data.hasOwnProperty("page")&&delete data.page;
        let query = data||{};

        let maxPage = await model.getMaxPageListUser(query);
        let result = await model.getListUser(query,page);

        res.render("users/listUser", {
            notIsLogin: true,
            users: result,
            page: page,
            maxPage: maxPage,
            categorys: categorys
        });
    }
    async getAddUser(req, res) {
        res.render("users/addUser", { notIsLogin: true })
    }


    async postAddUser(req, res) {
        let userNew = req.body;
        if (userNew) {
            let salt = await bcrypt.genSalt(saltRounds);
            let hash = await bcrypt.hash(passwordDefaul, salt);
            let user = Object.assign(userNew, { "password": hash, "Ma": getEmployeeCode(userNew.Ten) });
            let result = await model.insertUser(user);
        }
        res.redirect("/user");
    }
}
module.exports = User;