module.exports.authention=function (req,res,next)
{
    var sess=req.session;
    if(!sess.username||!sess.email)
    {
    return res.redirect("/login");
    }
    next();
}