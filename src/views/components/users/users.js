import { formatCpf } from "../../helpers/common.js";
import { Modal } from "../modal/modal.js";
import { Toast } from "../toast/toast.js";

var _users = [];
var _actionUser;

const modal = new Modal();
const toast = new Toast();

async function init() {
    const modalContent = await modal.load();
    $("body").append(modalContent);

    const toastContent = await toast.load();
    $("body").append(toastContent);

    await getUsers();
}

init();


async function getUsers() {
    $.ajax({
        type: "GET",
        url: "/users",
        success: function (response) {
            $(".user-table tbody").html("");
            buildUsers(response);
            _users = response
        }
    });
}


function clearFields() {
    $(".user-name").val("");
    $(".user-cpf").val("");
    $(".user-login").val("");
    $(".user-password").val("");
}


async function saveUser() {
    const name = $(".user-name").val();
    const cpf = $(".user-cpf").val();
    const login = $(".user-login").val();
    const password = $(".user-password").val();

    const user = {
        name, cpf, login, password
    }

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "/user",
        data: JSON.stringify(user),
        success: function (response) {
            toast.setContent(response.message);
            toast.show();
            modal.hide();
            clearFields();
            getUsers();
        },
        error: function (response) {
            toast.setContent(response.responseJSON.message);
            toast.show();
        }
    });
}


async function deleteUser(id) {
    $.ajax({
        type: "DELETE",
        url: `/user/${id}`,
        success: function (response) {
            toast.setContent(response.message);
            toast.show();
            getUsers();
            modal.hide();
        },
        error: function (response) {
            toast.setContent(response.responseJSON.message);
            toast.show();
        }
    });
}


async function updateUser(id) {
    const name = $(".user-name").val();
    const password = $(".user-password").val();

    const user = {
        name, password
    }

    $.ajax({
        type: "PUT",
        contentType: 'application/json',
        url: `/user/${id}`,
        data: JSON.stringify(user),
        success: function (response) {
            toast.setContent(response.message);
            toast.show();
            getUsers();
            modal.hide();
        },
        error: function (response) {
            toast.setContent(response.responseJSON.message);
            toast.show();
        }
    });
}


function buildUsers(users) {
    if (!users) return;

    for (const user of users) {
        const userContent = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.login}</td>
                <td>${formatCpf(user.cpf)}</td>
                <td>
                    <i class="fa fa-edit" data-user-id="${user.id}"></i>
                    <i class="fa fa-trash mx-2" data-user-id="${user.id}"></i>
                </td>
            </tr>
        `;

        $(".user-table tbody").append(userContent);
    }
}


$(document).on("click", ".user-new", function() {
    const modalBody = `
        <div>
            <label>Nome</label>
            <input type="text" class="form-control user-name">
            <label>CPF</label>
            <input type="text" class="form-control user-cpf" placeholder="000.000.000-00">
            <label>Login</label>
            <input type="text" class="form-control user-login">
            <label>Senha</label>
            <input type="password" class="form-control user-password">
        </div>
    `;

    modal.setAction("create");
    modal.setTitle("Cadastro");
    modal.setContent(modalBody);
    modal.show();
});


$(document).on("click", ".fa-edit", function() {
    const userId = $(this).attr("data-user-id");
    const user = _users.find(user => user.id == userId);
    _actionUser = user;
    const modalBody = `
        <div>
            <label>Nome</label>
            <input type="text" class="form-control user-name" value="${user.name}">
            <label>CPF</label>
            <input type="text" class="form-control user-cpf" value="${user.cpf}" disabled>
            <label>Login</label>
            <input type="text" class="form-control user-login" value="${user.login}" disabled>
            <label>Senha</label>
            <input type="password" class="form-control user-password" value="12345678">
        </div>
    `;

    modal.setAction("update");
    modal.setTitle(`Edição de ${user.login}`);
    modal.setContent(modalBody);
    modal.show();
});


$(document).on("click", ".fa-trash", function() {
    const userId = $(this).attr("data-user-id");
    const user = _users.find(user => user.id == userId);
    _actionUser = user;

    modal.setAction("delete");
    modal.setTitle(`Remoção`);
    modal.setContent(`Tem certeza que deseja deletar o usuário <strong>${user.login}</strong>?`);
    modal.show();
})


$(document).on("click", ".create-modal", function() {
    saveUser();
});


$(document).on("click", ".delete-modal", function() {
    deleteUser(_actionUser.id);
});


$(document).on("click", ".update-modal", function() {
    updateUser(_actionUser.id);
});
