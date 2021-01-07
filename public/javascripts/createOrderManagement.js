    // get data from sever
    let data = JSON.parse(document.getElementById("my-name").value);
    let customers = data.customers;
    let planks = data.planks;
    let coveredSurface = data.coveredSurface;
    // autocomplete customers
    let autocompleteCustomers = [];
    let compareCustomers = [];
    for (let i = 0; i < customers.length; i++) {
        let codeCustomer = customers[i].MaKhachHang;
        let nameCustomer = customers[i].TenKhachHang;
        let debt = customers[i].CongNo;
        compareCustomers[codeCustomer] = { "debt": debt, "nameCustomer": nameCustomer };
        autocompleteCustomers.push(codeCustomer);
    }
    $(function () {
        $("#tags-code-customer").autocomplete({
            source: autocompleteCustomers
        });
    });
    //==========check debt
    let checkDebt = document.getElementById("check-debt");
    let tagsCodeCustomer = document.getElementById("tags-code-customer");
    let tabsNameCustomer = document.getElementById("tags-name-customer");
    let debt = document.getElementById("debt");


    tagsCodeCustomer.addEventListener("focusout", () => {
        if (compareCustomers[tagsCodeCustomer.value]) {
            debt.value = compareCustomers[tagsCodeCustomer.value].debt || "0";
            tabsNameCustomer.value = compareCustomers[tagsCodeCustomer.value].nameCustomer || "";
        }

    })
    // ====== autocomplete plank
    let autocompletePlanks = [];
    let comparePlanks = [];

    for (let i = 0; i < planks.length; i++) {
        let codePlank = planks[i].MaVan;
        let informationPlank = {
            "namePlank": planks[i].TenVan,
            "thinkness": planks[i].DoDay,
            "amount": planks[i].SoLuong
        }
        autocompletePlanks.push(codePlank);
        comparePlanks[codePlank] = informationPlank;
    }
    $(function () {
        $("#tags-code-plank").autocomplete({
            source: autocompletePlanks
        });
    });
    // check quantily
    let codeTagsPlank = document.getElementById("tags-code-plank");
    let tagsThickness = document.getElementById("tags-thickness");
    let maxNumberPlank = document.getElementById("max-number-plank");
    let tagsNamePlank = document.getElementById("tags-name-plank");
    function checkQuantily() {
        let plank = comparePlanks[codeTagsPlank.value];
        maxNumberPlank.value = "0";
        // tagsUnitPrice.value = "0";
        tagsNamePlank.value = "";
        if (plank) {
            if (tagsThickness.value == plank.thinkness) {
                maxNumberPlank.value = plank.amount || "0";
                //  tagsUnitPrice.value = plank.unitPrice || "0";
                tagsNamePlank.value = plank.namePlank || "";
            }
        }
    }
    // select covered surface
    let selectCoveredSurface = document.getElementById("select-covered-surface");
    let arrayCoveredSuface = document.getElementsByClassName("covered-surface");
    arrayCoveredSuface[0].style.display = "inline-block";
    selectCoveredSurface.addEventListener("change", () => {
        for (let i = 0; i < arrayCoveredSuface.length; i++) {
            arrayCoveredSuface[i].style.display = (selectCoveredSurface.value == arrayCoveredSuface[i].getAttribute("for")) ? "inline-block" : "none";
        }
    })
    // autocomplete surface 
    let autocompleteSurface = [];
    let compareCoveredSurface = [];
    for (let i = 0; i < coveredSurface.length; i++) {
        let codeColor = coveredSurface[i].MaMau;
        let maxNumberSurface = coveredSurface[i].SoLuong;
        console.log(codeColor);
        compareCoveredSurface[codeColor] = { "maxNumberSurface": maxNumberSurface };
        autocompleteSurface.push(codeColor);
    }
    $(function () {
        $("#tags-code-surface-min").autocomplete({
            source: autocompleteSurface
        });
    });
    // check quanlity coveredsurface 
    let inputMaxNumberCoveredSurface = document.getElementById("max-Number-covered-surface");
    let tagCodeCoveredSurface = document.getElementById("tags-code-surface-min");
    function quanlityCoverSurface() {
        let maxNumberCoverSurface = compareCoveredSurface[tagCodeCoveredSurface.value];
        inputMaxNumberCoveredSurface.value = "0";
        if (maxNumberCoverSurface) {
            inputMaxNumberCoveredSurface.value = maxNumberCoverSurface.maxNumberSurface;
        }
    }
    // money calculation
    let tagsUnitPrice = document.getElementById("tags-unit-price");
    let tagsNumberPlank = document.getElementById("tags-number-plank");
    let tagsIntoMoney = document.getElementById("tags-into-money")
    tagsUnitPrice.value = 0;
    tagsNumberPlank.value = 0;
    function moneyCalculation() {
        tagsIntoMoney.value = tagsUnitPrice.value * tagsNumberPlank.value;
    }
    // ADD PLANK
    // ván
    codeTagsPlank
    tagsThickness
    tagsUnitPrice
    tagsNumberPlank
    maxNumberPlank
    tagsIntoMoney
    // mặt phủ
    selectCoveredSurface
    // min
    tagCodeCoveredSurface
    let tagsFilm = document.getElementById("tags-film");
    inputMaxNumberCoveredSurface
    let tagNumberFace = document.getElementById("tags-number-face");
    //table
    let tagTablePlanks = document.getElementsByTagName("table");
    // add plank
    let tagsAddPlanks = document.getElementById("tags-add-planks");
    let contentTable = `<tr>
                    <th>Loại ván - Độ dày - Loại mặt phủ - Số mặt</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Sửa - Xóa</th>
                </tr>`;
    let arrayPlanks = [];

    tagsAddPlanks.addEventListener("click", () => {
        if (confirm("Bạn có muốn đặt ván")) {
            let objectPlank = {
                LoaiVanDoDayMatPhuSoMat: codeTagsPlank.value + " " + tagsThickness.value + " " + selectCoveredSurface.value + "." + tagCodeCoveredSurface.value + " " + tagNumberFace.value + "M",
                DonGia: tagsUnitPrice.value,
                SoLuong: tagsNumberPlank.value,
                ThanhTien: tagsUnitPrice.value
            }
            arrayPlanks.push(objectPlank);

            contentTable = contentTable + ` <tr>
                    <td>`+ objectPlank.LoaiVanDoDayMatPhuSoMat + `</td>
                    <td>`+ objectPlank.DonGia + `</td>
                    <td>`+ objectPlank.SoLuong + `</td>
                    <td>`+ objectPlank.ThanhTien + `</td>
                    <td>`+ arrayPlanks.length + `</td>
                </tr>`;
            tagTablePlanks[0].innerHTML = contentTable;
        }
    })
    // submit form create Order
    let inputResTenKhachHang = document.getElementById("inputResTenKhachHang");
    let inputResMaKhachHang = document.getElementById("inputResMaKhachHang");
    let inputResDanhSachSanPham = document.getElementById("inputResDanhSachSanPham");
    let inputResCongNo
    let submitCreateOrder = document.getElementById("submit-create-order");
    
    submitCreateOrder.addEventListener("click", () => {
        inputResMaKhachHang.value = tagsCodeCustomer.value;
        inputResTenKhachHang.value = tabsNameCustomer.value;
        inputResCongNo = 
        inputResDanhSachSanPham.value = JSON.stringify(arrayPlanks);
    })
