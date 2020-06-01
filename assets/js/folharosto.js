var limpar_formulario = $('#limpar_formulario'),
    botao_imprimir = $('#imprimir_pagina'),
    botao_autenticar = $('#autenticar_usuario'),
    formulario_auth = $('#form_auth'),
    formulario_folha = $('.fr_folha'),

    email_formulario = $('.email-form'),
    password_formulario = $('.password-form'),

    gerir_utilizadores = $('#fr-gerir-utilizadores'),
    add_novo_utilizador = $('button[data-addNewUser="add"]'),
    button_add_utilizador = $('button[window-data-button="add-user"]'),

    button_close_windowAddUser = $('#janelaAddUser .modal-dialog [data-dismiss="modal"]');

let list_group_item = $('.lista_folha_rosto .list-group-item');

limpar_formulario.on("click", function() {
    $('body input').val('');
});

gerir_utilizadores.on("click", function() {
    listar_usuarios();
});

add_novo_utilizador.on("click", function() {
    $("#janelaDashboard .close").trigger('click');
});

button_close_windowAddUser.on("click", function() {
    gerir_utilizadores.trigger('click');
});

botao_imprimir.on("click", function() {
    window.print();
});

$('#formAddNewUser input#recipient-nome').on("keydown", function() {
    elemento = $(this);

    tempoDeEspera = setTimeout(function() {
        valor = elemento.val();
        $('#formAddNewUser input#recipient-usuario').val(removerAcentos(removerAcentos(valor)).toLowerCase().replace(" ", "."));
        clearTimeout(tempoDeEspera);
    }, 800);
});

botao_autenticar.on("click", function() {
    let email = email_formulario.val();
    let senha = password_formulario.val();

    if (typeof email != 'undefined' && email != '' && typeof senha != 'undefined' && senha != '') {
        autenticacao(email, senha);
    } else {
        alert('Ooopsss! Ocorreu um Erro: Introduza as suas credênciais para poder editar as Folhas de Rosto!');
    }
});

button_add_utilizador.on("click", function() {
    usuario = $('#formAddNewUser input#recipient-usuario').val();
    email = $('#formAddNewUser input#recipient-email').val();
    senha = $('#formAddNewUser input#recipient-senha').val();
    adicionar_usuario(usuario, email, senha);
});

$(document).on('click', '[data-action="update"]', function() {
    alert('Utilizador Atualizado!');
});

$(document).on('click', '[data-action="admin-access"]', function() {
    alert('Permição Consedida!');
});

$(document).on('click', '[data-action="user-access"]', function() {
    alert('Permição Consedida!');
});

$(document).on('click', '[data-action="delete"]', function() {

    var id_delete = $(this).closest('[data-idUser]').attr('data-idUser'),
        confirm_delete = confirm("Estás eliminando o utilizador \"\" permanentemente da base de dados, clique em \"OK\" para confirmar!");

    if (confirm_delete == true) {
        eliminar_usuario(id_delete);
    }
});

list_group_item.on("click", function() {
    list_group_item.removeClass('active');
    $(this).addClass('active');
    $('.fr_titulo_paginas').text($(this).text());

    formulario_folha.removeClass('active');
    $('.fr_folha[num="' + $(this).attr('num') + '"]').addClass('active');
});

formulario_auth.on("submit", function(e) {
    return false;
});

$('.fr_imput_nome').on('focusout', function() {
    $(this).val(removerAcentos($(this).val()));
})

// AUTORUN FUNCTIONS
verificar_auth();
//

function adicionar_usuario(usuario, email, senha) {

    let url = 'http://localhost:3000/auth/register/';

    var dados = {
        'name': usuario,
        'email': email,
        'password': senha
    };

    $.ajax({
            url: url,
            method: "POST",
            data: dados,
            dataType: 'json'
        })
        .done(function(dadosResposta) {
            console.log(dadosResposta);

            if (dadosResposta[0].tipo == 'sucesso') {
                alert(dadosResposta[0].mensagem);

                button_close_windowAddUser.trigger('click');
            } else {
                alert(dadosResposta[0].mensagem);
            }
        })
        .fail(function(jqXHR, textStatus) {
            alert("Ocorreu um erro interno, O Servidor de Base de Dados está Offline. Por Favor, Contacte a assistêcia técnica para a resolução deste problema.");
        });
}

function autenticacao(usuario, senha) {

    let url = 'http://localhost:3000/auth/session';

    var dados = {
        'usuario': usuario,
        'senha': senha
    };

    $.ajax({
            url: url,
            method: "POST",
            data: dados,
            dataType: 'json'
        })
        .done(function(dadosResposta) {
            console.log(dadosResposta);

            if (dadosResposta[0].tipo == 'sucesso') {
                alert(dadosResposta[0].mensagem);
                $('#fr_id_usuario').text(dadosResposta[1].id_utilizador)
                accao_pagina_autenticacao('done');
            } else {
                alert(dadosResposta[0].mensagem);
            }
        })
        .fail(function(jqXHR, textStatus) {
            alert("Ocorreu um erro interno, O Servidor de Base de Dados está Offline. Por Favor, Contacte a assistêcia técnica para a resolução deste problema.");
        });
}

function listar_usuarios() {

    let url = 'http://localhost:3000/auth/list',
        htmlListaUsuario = '';

    $.ajax({
            url: url,
            method: "GET",
            dataType: 'json'
        })
        .done(function(dadosListaUsuario) {
            console.log(dadosListaUsuario);

            if (typeof dadosListaUsuario != 'undefined') {
                //alert(dadosResposta[0].mensagem);
                //$('#fr_id_usuario').text(dadosResposta[1].id_utilizador)
                //accao_pagina_autenticacao('done');
                for (let i = 0; i < dadosListaUsuario.length; i++) {
                    htmlListaUsuario += `
                    <tr data-idUser="${dadosListaUsuario[i].id}">
                        <th scope="row">${dadosListaUsuario[i].id}</th>
                        <td>${dadosListaUsuario[i].nome_utilizador}</td>
                        <td>${dadosListaUsuario[i].email_utilizador}</td>
                        <td><strong>${dadosListaUsuario[i].id_utilizador}</strong></td>
                        <td data-action-state="on">
                            <button class="btn btn-outline-dark" data-action="update"><i class="fas fa-user-edit"></i></button>
                            ` + ((dadosListaUsuario[i].id != 1) ? `<button class="btn btn-danger" data-action="delete"><i class="fas fa-trash-alt"></i></button>` : '') + `
                            ` + ((dadosListaUsuario[i].id == 1) ? '' : ((dadosListaUsuario[i].id_perfil != 1) ? `<button class="btn btn-dark" data-action="admin-access"><i class="fas fa-user-shield"></i></button>` : `<button class="btn btn-dark" data-action="user-access"><i class="fas fa-user-alt"></i></button>`)) + `
                        </td>
                    </tr>
                    `;
                }

                $('#janelaDashboard .modal-body tbody').html(htmlListaUsuario);

            } else {
                alert('Ocorreu um erro interno, por favor, contacte a assistência técnica para uma melhor resolução do problema.');
            }
        })
        .fail(function(jqXHR, textStatus) {
            alert("Ocorreu um erro interno, O Servidor de Base de Dados está Offline. Por Favor, Contacte a assistêcia técnica para a resolução deste problema.");
        });
}

function selecionar_usuario() {

    let url = 'http://localhost:3000/auth/list',
        htmlListaUsuario = '';

    $.ajax({
            url: url,
            method: "GET",
            dataType: 'json'
        })
        .done(function(dadosListaUsuario) {
            console.log(dadosListaUsuario);

            if (typeof dadosListaUsuario != 'undefined') {
                //alert(dadosResposta[0].mensagem);
                //$('#fr_id_usuario').text(dadosResposta[1].id_utilizador)
                //accao_pagina_autenticacao('done');
                for (let i = 0; i < dadosListaUsuario.length; i++) {
                    htmlListaUsuario += `
                    <tr data-idUser="${dadosListaUsuario[i].id}">
                        <th scope="row">${dadosListaUsuario[i].id}</th>
                        <td>${dadosListaUsuario[i].nome_utilizador}</td>
                        <td>${dadosListaUsuario[i].email_utilizador}</td>
                        <td>${dadosListaUsuario[i].id_utilizador}</td>
                        <td data-action-state="on">
                            <button class="btn btn-outline-dark" data-action="update"><i class="fas fa-user-edit"></i></button>
                            <button class="btn btn-dark" data-action="update-password"><i class="fas fa-key"></i></button>
                            ` + ((dadosListaUsuario[i].id != 1) ? `<button class="btn btn-danger" data-action="delete"><i class="fas fa-trash-alt"></i></button>` : '') + `
                        </td>
                    </tr>
                    `;
                }

                $('#janelaDashboard .modal-body tbody').html(htmlListaUsuario);

            } else {
                alert('Ocorreu um erro interno, por favor, contacte a assistência técnica para uma melhor resolução do problema.');
            }
        })
        .fail(function(jqXHR, textStatus) {
            alert("Ocorreu um erro interno, O Servidor de Base de Dados está Offline. Por Favor, Contacte a assistêcia técnica para a resolução deste problema.");
        });
}

function eliminar_usuario(id) {

    let url = 'http://localhost:3000/auth/delete/user/' + id;

    $.ajax({
            url: url,
            method: "DELETE",
            dataType: 'json'
        })
        .done(function(dadosResposta) {
            console.log(dadosResposta);

            if (dadosResposta[0].tipo == 'sucesso') {
                alert(dadosResposta[0].mensagem);
                listar_usuarios();
            } else {
                alert(dadosResposta[0].mensagem);
            }
        })
        .fail(function(jqXHR, textStatus) {
            alert("Ocorreu um erro interno, O Servidor de Base de Dados está Offline. Por Favor, Contacte a assistêcia técnica para a resolução deste problema.");
        });
}

function accao_pagina_autenticacao(accao) {
    formulario = $('#form_auth');

    if (accao == 'done') {
        $('body').attr('aproved-login', 'aproved');
        $('#form_auth').removeClass('animate__fadeInUp');
        $('#form_auth').addClass('animate__fadeOutUp');

        window.setTimeout(function() { $('#fr_janela_modal').css({ 'display': 'none' }); }, 1000);
    } else {
        $('body').attr('aproved-login', 'no-aproved');
        $('#form_auth').removeClass('animate__fadeOutUp');
        $('#form_auth').addClass('animate__fadeInUp');

        $('#fr_janela_modal').css({ 'display': 'block' });
    }
}

function removerAcentos(stringAcentuada) {

    text = stringAcentuada.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'E');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'I');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'O');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'U');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'C');

    return text;
}

function verificar_auth() {
    if ($('body').attr('aproved-login') == 'aproved') {
        $('#fr_janela_modal').css({ 'display': 'none' });
    }
}

// Regras para formulários

$('.fr_imput_cartao').mask('0000 0000 0000 0000');
$('.fr_imput_conta').mask('000000000000');
$('.fr_imput_montante').mask('000.000.000.000.000,00', { reverse: true });
$('.fr_imput_proposta').mask('00000');
$('.fr_imput_agencia').mask('000');
$('.fr_imput_data').mask('00-00-0000');

// Regras para formulários
//$('#formAddNewUser input#recipient-nome').mask('00-00-0000');

$(function() {
    $("#abrir-janela").click(function() {
        $("#janela-modal").modal();
    });
});