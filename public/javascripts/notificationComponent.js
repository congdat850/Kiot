
class notificationComponent extends HTMLElement {
    constructor() {
        super();
        this.status;
    }
    connectedCallback() {
        this.status = this.getAttribute("status");
        this.content = this.getAttribute("value");
        console.log(this.status);
        let wrap = $(`<div class="notification-component"></div>`);
        let notification = $(this.checkStatus());
        $(this).append(wrap);
        $(this).append(notification);

        this.getElementsByTagName("button")[0].addEventListener("click",this.hiddenNotification.bind(this));
    }

    hiddenNotification()
    {
        this.style.display="none";
    }

    checkStatus()
    {
        console.log(this);
        if(this.status=="success")
        {
            let success = `<div class="notification">
            <div class="icon">
               <i class="fas fa-check-circle"></i>
            </div>
            <div class="content-notification">
                <h3>${this.content}</h3>
            </div>
            <button class="btn-notifcation primary">TÔI HIỂU</button>
            </div>`
            return success;
        }
        else if(this.status=="defeat")
        {
            let defeat = `<div class="notification">
            <div class="icon defeat">
                <i class="fas fa-frown"></i>
            </div>
            <div class="content-notification">
                <h3>${this.content}</h3>
            </div>
            <button class="btn-notifcation secondary">TÔI HIỂU</button>
            </div>`;
            return defeat;
        }
    }
}

window.customElements.define("cd-notification", notificationComponent);