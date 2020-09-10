const model= require("../model/model");
const bcrypt=require("bcrypt");
const saltRounds = 10;

class login{
    async getLogin(req,res)
    {
        res.render("login/login",{notIsLogin:false});
    }

    async postLogin(req,res)
    {
        var sess=req.session
        var email=req.body.email||"";
        var password=req.body.password||"";
        var user= await model.findUser({email:email});

        if(!user)
        {
            return res.render("login/login",{notIsLogin:false,notUser:true});
        }

        var result= await bcrypt.compare(password,user.password)
        if(result)
        {
            sess.name=req.body.email;
            sess.password=req.body.password;
            return res.redirect("/");
        }
        res.render("login/login",{passwordFalse:true});
    }

    async getRegister(req,res)
    {
        res.render("login/register",{notIsLogin:false});
    }

    async postRegister(req,res)
    {
        var body=req.body;
        if(body.password==body.retype_password&&body.password)
        {
            var salt = await bcrypt.genSalt(saltRounds)
            var hash= await bcrypt.hash(body.password,salt)
            var user= {
                username:body.username,
                email:body.email,
                password:hash
            }
            var result= await model.insertUser(user);
            if(result)
            return res.redirect("/login");
            return res.redirect("/register");
        }
     
        res.redirect("/register");
    }
}

module.exports=login;