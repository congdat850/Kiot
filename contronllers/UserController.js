const model = require("../model/model");

class User {
    async getUser(req, res) {

        var users = await model.findAllUser()
        console.log("All user", users);
        if (req.query.query) {
            var query = JSON.parse(req.query.query);
            query.notIsLogin = true;
            query.users = users;
            return res.render("user/listUser", query);
        }
        res.render("user/listUser", { notIsLogin: true, users: users });
    }
    async getAddUser(req, res) {
        res.render("user/addUser", { notIsLogin: true });
    }

    async postAddUser(req, res) {
        var user = req.body;

        if (user) {
            var check = await model.findUser({ email: user.email });
            if (check) {
                return res.redirect("/user?query=" + JSON.stringify({ userAlreadyExists: true }));
            }
            var result = await model.insertUser(user);
            if (result) return res.redirect("/user?query=" + JSON.stringify({ signUpSuccess: true }));
        }
    }
}

module.exports = User;

