export class Modal {

    async load() {        
        await this.loadStyle();
        return await fetch("/components/modal/modal.html").then(x => x.text()).then(async y => {
            return y;
        })
    }


    async loadStyle() {
        const css = await fetch("/components/modal/modal.css").then(x => x.text()).then(y => {
            return y;
        });

        $("head").append(`<style>${css}</style>`);
    }


    setTitle(title) {
        $(".modal-title").text(title);
    }
    
    
    setContent(body) {
        $(".modal-body").html(body);

        this.formatCpf();
    }


    async formatCpf() {
        IMask(document.querySelector('.user-cpf'), {
            mask:[
                {
                    mask: '000.000.000-00',
                    maxLength: 11
                }
            ]
        });
    }


    show() {
        $('#modal').modal('show');
    }


    hide() {
        $("#modal").modal("hide");
    }


    setAction(action) {
        if (action == "delete") {
            $(".modal-btn-2").removeClass("btn-primary").addClass("btn-danger");
            $(".modal-btn-2").removeClass("create-modal").removeClass("update-modal").addClass("delete-modal");
            $(".modal-btn-2").text("Deletar");
        }

        if (action == "create") {
            $(".modal-btn-2").removeClass("btn-danger").addClass("btn-primary");
            $(".modal-btn-2").removeClass("delete-modal").removeClass("update-modal").addClass("create-modal");
            $(".modal-btn-2").text("Salvar");
        }

        if (action == "update") {
            $(".modal-btn-2").removeClass("btn-danger").addClass("btn-primary");
            $(".modal-btn-2").removeClass("delete-modal").removeClass("create-modal").addClass("update-modal");
            $(".modal-btn-2").text("Salvar");
        }
    }

}
