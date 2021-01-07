

let MongoClinet=require('mongodb').MongoClient;
let url= "mongodb+srv://datnc:Datnc123456@cluster0.5ajak.mongodb.net/CtyGoAChau?retryWrites=true&w=majority";
let dbo;
class Model{
  constructor()
  {
    MongoClinet.connect(url,{ useUnifiedTopology: true ,useNewUrlParser: true},function(err, db){
      if (err) throw err;
      console.log("connect DB");
      dbo=db.db("CtyGoAChau");
    })
  }
  // user
  async GetListUser(query)
  {
    let result = await dbo.collection("NhanVien").find({}).toArray();
    return result; 
  }

  async insertUser(query)
  {
    var result= await dbo.collection("NhanVien").insertOne(query);
    return result;
  }
  // customer
  async GetListCustomer(query)
  {
    let result = await dbo.collection("KhachHang").find({}).toArray();
    return result; 
  }
  async GetListWarehousePlank(query)
  {
    let result = await dbo.collection("KhoVan").find({}).toArray();
    return result;
  }
  // Order management
  async GetListOrderManagement(query)
  {
    let result = await dbo.collection("LenDon").find({}).toArray();
    return result;
  }

  async ChangeOrderProcess(query,newvalues)
  {
    let result =  await dbo.collection("LenDon").updateOne(query,{$set:newvalues});
    return result;
  }

  async FindMultiplePlank(query)
  {
    let result = await dbo.collection("KhoVan").find({$or:query}).toArray();
    return result;
  }

  async InsertNewOrder(query)
  {
    let result =  await dbo.collection("LenDon").insertOne(query)
    return result;
  }
  //Covered Surface
  async GetListWarehouseCoverSurface(query)
  {
    let result = await dbo.collection("KhoMatPhu").find({}).toArray();
    return result;
  }

 
}
module.exports= new Model();