var MongoClient=require("mongodb").MongoClient;
var url="mongodb://datnc:dat123456@ds215019.mlab.com:15019/kiot"

var dbo;

class Model{
  constructor()
  {
    MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true},(err,db)=>{
      if(err) throw err;
      console.log("START CONNECT DB");
      dbo=db.db("kiot");
    })
  }

  // async createDb()
  // {
  //   var result = await dbo.createCollection("customers",(err,res)=>
  //   {
  //     if (err) throw err;
  //   })

  //   return result;
  // }

  async findUser(query)
  {
    var result = await dbo.collection("users").findOne(query);
    return result;
  }
  async insertUser(user)
  {
    var result= await dbo.collection("users").insertOne(user);
    return result;
  }
}
module.exports= new Model();