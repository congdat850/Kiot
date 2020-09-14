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
  // user
  async findUser(query)
  {
    var result = await dbo.collection("users").findOne(query);
    return result;
  }
  async findAllUser()
  {
    var result = await dbo.collection("users").find({}).toArray();
    return result;
  }
  async insertUser(user)
  {
    var result= await dbo.collection("users").insertOne(user);
    return result;
  }
  // product
  async insertProduct(product)
  {
    var result = await dbo.collection("products").insertOne(product);
    return result;
  }

  async findAllProduct()
  {
    var result= await dbo.collection("products").find({}).toArray();
    return result;
  }
  async findProduct(query)
  {
    var result= await dbo.collection("products").findOne(query);
    return result
  }
  async updateProduct(myquery,newvalue)
  {
    var result = await dbo.collection("products").updateOne(myquery,{$set:newvalue});
    return result;
  }
  //Deal
  async insertDeal(data)
  {
    var result = await dbo.collection("deals").insertOne(data);
    return result;
  }
  async getAllDeal()
  {
    var result= await dbo.collection("deals").find({}).toArray();
    return result;
  }
}
module.exports= new Model();