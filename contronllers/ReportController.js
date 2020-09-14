const model = require("../model/model");

class Report {

    async getReport(req, res) {
        var result = await model.getAllDeal();
        for (let i = 0; i < result.length; i++) {
            var date = new Date(result[i].date);
            result[i].day = date.getDate();
            result[i].month = date.getMonth();
            result[i].year = date.getFullYear();
        }
        res.render("report/report", { notIsLogin: true });
    }

    async postReport(req, res) {
        var data = req.body.data;
        data = data.split("-");
        var time = new Date(data[0], data[1]-1, data[2]);
        var dateStart = time.getTime();
        var dateEnd= new Date(dateStart+86400*1000);
        var arrResult=[];
        var dataModel = await model.getAllDeal();

        // object return
        var amountOrder=0;
        var amountProductOrder=0;
        var profit=0;
        for(let i=0;i<dataModel.length;i++)
        {
            if(dataModel[i].date>=dateStart && dataModel[i].date< dateEnd)
            {
                amountOrder++;
                arrResult= arrResult.concat(dataModel[i].productOrder);
            }
        }
        
        for(let i=0;i<arrResult.length;i++)
        {
            amountProductOrder=amountProductOrder+(+arrResult[i].amount);
            profit= profit+(+arrResult[i].amount)*(+arrResult[i].unitPrice);
        }
        var result={
            amountOrder: amountOrder,
            amountProductOrder:amountProductOrder,
            profit:profit
        }
        res.send(result);
    }
}
module.exports = Report;