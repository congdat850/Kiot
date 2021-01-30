

let MongoClinet = require('mongodb').MongoClient;
let url = "mongodb+srv://datnc:Datnc123456@cluster0.5ajak.mongodb.net/CtyGoAChau?retryWrites=true&w=majority";
let dbo;

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
  console.log("vào được fromatQueryFilter");
  if (data.fromDate && data.toDate) {
    let valueFromDate = new Date(data.fromDate);
    let valueToDate = new Date(data.toDate);
    console.log(data.fromDate, valueFromDate.getTime());
    let query = data.filterProcess == "TatCa" ? {} : { "TienDo": data.filterProcess }
    return { ...query, "MaLenDon": { $gte: valueFromDate.getTime(), $lte: valueToDate.getTime() } }
  }
  else return data.filterProcess == "TatCa" ? {} : { "TienDo": data.filterProcess }
}
class Model {
  constructor() {
    MongoClinet.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      console.log("connect DB");
      dbo = db.db("CtyGoAChau");
    })
  }
  // user
  async GetListUser(query) {
    let result = await dbo.collection("NhanVien").find({}).toArray();
    return result;
  }

  async insertUser(query) {
    var result = await dbo.collection("NhanVien").insertOne(query);
    return result;
  }
  // customer
  async DeleteCustomer(query) {
    let result = await dbo.collection("KhachHang").deleteOne(query);
    return result;
  }

  async GetListCustomer(query) {
    let param = query || {};
    let result = await dbo.collection("KhachHang").find(param).toArray();
    return result;
  }

  async insertCustomer(query) {
    var result = await dbo.collection("KhachHang").insertOne(query);
    return result;
  }

  async UpdateCustomer(query) {
    let myquery = { "MaKhachHang": query.MaKhachHang };
    let newvalues = { $set: query };
    let result = await dbo.collection("KhachHang").updateOne(myquery, newvalues);
    return result;
  }

  // Plank management
  async GetListWarehousePlank(query) {
    let result = await dbo.collection("KhoVan").find({}).toArray();
    return result;
  }


  async insertOrUpdatePlank(param) {
    var result;
    const query = { MaVan: param.MaVan };
    let checkExistPlank = await dbo.collection("KhoVan").findOne(query);
    if (checkExistPlank != null) {
      checkExistPlank.SoLuong = (+checkExistPlank.SoLuong) + (+param.SoLuong);
      result = await dbo.collection("KhoVan").updateOne({ MaVan: checkExistPlank.MaVan }, { $set: checkExistPlank });
    }
    else {
      result = await dbo.collection("KhoVan").insertOne(param);
    }
    return result;
  }

  async getListImportPlanks(query) {
    let result = await dbo.collection("NhapVan").find({}).sort({ "MaNhap": -1 }).toArray();
    return result;
  }

  async insertListImportPlanks(query) {
    let result = await dbo.collection("NhapVan").insertOne(query);
    return result;
  }


  // Order management
  async GetListOrderManagement(query) {
    let result
    if (query.contentSearch) result = await dbo.collection("LenDon").find(FormatQuerySearch(query)).sort({ "MaLenDon": -1 }).toArray();
    else if (query.filterProcess) result = await dbo.collection("LenDon").find(FormatQueryFilter(query)).sort({ "MaLenDon": -1 }).toArray();
    else result = await dbo.collection("LenDon").find({}).sort({ "MaLenDon": -1 }).toArray();
    return result;
  }

  async ChangeOrderProcess(query, newvalues) {
    let result = await dbo.collection("LenDon").updateOne(query, { $set: newvalues });
    return result;
  }

  async FindMultiplePlank(query) {
    let result = await dbo.collection("KhoVan").find({ $or: query }).toArray();
    return result;
  }

  async updatePlank(query) {
    let myquery = { "MaVan": query.MaVan };
    let newvalue = { $set: query };
    let result = await dbo.collection("KhoVan").updateOne(myquery, newvalue);
    return result;
  }

  async InsertNewOrder(query) {
    let result = await dbo.collection("LenDon").insertOne(query)
    return result;
  }
  //Covered Surface
  async GetListWarehouseCoverSurface(query) {
    let result = await dbo.collection("KhoMatPhu").find({}).toArray();
    return result;
  }

  async findAndUpdateCoverSuface(query) {
    const myquery = { "MaMau": query.MaMau };
    let result;
    let checkExsitCoverSurface = await dbo.collection("KhoMatPhu").findOne(myquery);
    if (checkExsitCoverSurface != null) {
      result = await dbo.collection("KhoMatPhu").updateOne(myquery, { $set: { "SoLuong": ((+checkExsitCoverSurface.SoLuong) + (+query.SoLuong)) } })
    }
    else {
      result = await dbo.collection("KhoMatPhu").insertOne(query);
    }
  }

  async FindMultipleCoverSurface(query) {
    let result = await dbo.collection("KhoMatPhu").find({ $or: query }).toArray();
    return result;
  }

  async updateCoverSurface(query) {
    let myquery = { "MaMau": query.MaMau };
    let newvalue = { $set: query };
    let result = await dbo.collection("KhoMatPhu").updateOne(myquery, newvalue);
    return result;
  }

  async getListImportCoverSurface(query) {
    let result = await dbo.collection("NhapMatPhu").find({}).sort({ "MaNhap": -1 }).toArray();
    return result;
  }

  async insertCoverSurface(query)
  {
    let result = await dbo.collection("NhapMatPhu").insertOne(query);
    return result;
  }

}
module.exports = new Model();