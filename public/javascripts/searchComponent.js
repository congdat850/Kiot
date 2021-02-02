class searchComponent extends HTMLElement {
    constructor() {
        super();
        this.url;
        this.categorys;
        window.that = this;
    }

    connectedCallback() {
        this.url = this.getAttribute("for");
        this.categorys = this.getAttribute("categorys");

        $(this).append(`
        <label>Tìm kiếm: </label>
        <input type="text">
        <label>Thể loại: </label>
        <select>${this.fillCategoryForSelect()}</select>
        <button>
            <a href="">Tìm kiếm</a>
        </button>`);

        this.getElementsByTagName("button")[0].addEventListener("click",this.submitSearch.bind(this));
    
    }

    submitSearch()
    {
        let url = this.url||"";
        let category = this.getElementsByTagName("select")[0].value||"";
        let search = this.getElementsByTagName("input")[0].value||"";
        that.getElementsByTagName("a")[0].href = `${url}?${category}=${search}`
    }
    
    fillCategoryForSelect() {
        let str = ``;
        this.categorys.split(",").forEach(element => {
            str = str + `<option value="${element}">${element}</option>`;
        });
        return str;
    }
}
window.customElements.define("cd-search", searchComponent);