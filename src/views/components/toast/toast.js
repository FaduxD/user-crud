export class Toast {

    isShowing = null;

    async load() {        
        await this.loadStyle();
        return await fetch("/components/toast/toast.html").then(x => x.text()).then(async y => {
            return y;
        })
    }


    async loadStyle() {
        const css = await fetch("/components/toast/toast.css").then(x => x.text()).then(y => {
            return y;
        });

        $("head").append(`<style>${css}</style>`);
    }


    show() {
        if (this.isShowing) clearTimeout(this.isShowing)
        $('#liveToast').show();
        this.isShowing = setTimeout(() => {
            $("#liveToast").hide();
            this.isShowing = null;
        }, 5000);
    }


    setTitle(title) {
        $(".me-auto").html(title);
    }


    setContent(content) {
        $(".toast-body").html(content);
    }

}