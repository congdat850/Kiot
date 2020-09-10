module.exports.authention=function (req,res,next)
{
    var sess=req.session;
    if(!sess.name||!sess.password)
    {
    return res.redirect("/login");
    }
    next();
}