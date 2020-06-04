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
    button_edit_utilizador = $('button[window-data-button="edit-user"]'),
    button_close_windowAddUser = $('#janelaAddUser .modal-dialog [data-dismiss="modal"]'),
    button_close_windowEditUser = $('#janelaEditUser .modal-dialog [data-dismiss="modal"]');

let list_group_item = $('.lista_folha_rosto .list-group-item');

$(window).bind("afterprint", function() {
    limpar_formulario.trigger('click');
})

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

button_close_windowEditUser.on("click", function() {
    $(document).find('#janelaEditUser #update-recipient-usuario').removeAttr('disabled');
    $(document).find('#janelaEditUser #update-recipient-email').removeAttr('disabled');
    gerir_utilizadores.trigger('click');
});

botao_imprimir.on("click", function() {
    let imputs_folha_activa = $('.fr_folha_a4 .fr_folha.active input').length,
        elementos_prenchidos = 0;

    for (let i = 0; i < (imputs_folha_activa); i++) {
        var valor_elemento = $('.fr_folha_a4 .fr_folha.active tr:nth-child(' + (i + 1) + ') td .fr_a4_input').val();

        console.log('elemento: ' + (i + 1), valor_elemento);

        if (typeof valor_elemento != 'undefined' && valor_elemento != '' && valor_elemento != null) { elementos_prenchidos++; }
    }

    //console.log(imputs_folha_activa, elementos_prenchidos);

    if (imputs_folha_activa == elementos_prenchidos) {
        window.print();
    } else {
        alert('Por Favor, Preencha todos os campos.');
    }
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

button_edit_utilizador.on("click", function() {

    let type_auth = parseInt($('body').attr('type-auth')),
        id_auth = parseInt($('body').attr('id-user-auth')),
        user_edit = parseInt($(this).attr('user-id'));

    if (type_auth == 1 && user_edit == 1 && id_auth != 1) {
        $(document).find('#janelaEditUser #update-recipient-usuario').attr('disabled', 'disabled');
        $(document).find('#janelaEditUser #update-recipient-email').attr('disabled', 'disabled');
        alert('Não lhe foi consedida a autorização de alterar os dados desse Administrador!');
    } else {
        id = $(this).attr('user-id');
        usuario = $('#janelaEditUser #formEditUser input#update-recipient-usuario').val();
        email = $('#janelaEditUser #formEditUser input#update-recipient-email').val();
        senha = $('#janelaEditUser #formEditUser input#update-recipient-senha').val();
        //console.log(id, usuario, email, senha);
        editar_usuario(id, usuario, email, senha);
    }
});

// EVENTOS DO INPUT SENHA DO UTILIZADOR
$(document).on('dblclick', '#janelaEditUser #update-recipient-senha', function() {
    let input_senha = $(this),
        type_auth = parseInt($('body').attr('type-auth')),
        id_auth = parseInt($('body').attr('id-user-auth')),
        user_edit = parseInt(button_edit_utilizador.attr('user-id'));

    if (type_auth == 1 && user_edit != 1 || type_auth == 1 && user_edit == 1 && id_auth == 1) {
        input_senha.removeAttr('disabled');
        input_senha.attr('placeholder', 'Digite a Senha do Utilizador');
        input_senha.focus();
    } else {
        alert('Não lhe foi consedida a autorização de Alterar a Senha deste Administrador!');
    }
});

$(document).on('focusout', '#janelaEditUser #update-recipient-senha', function() {
    $(this).attr('placeholder', 'Clique duas vezes para Mudar a Senha do Utilizador');
    $(this).attr('disabled', 'disabled');
});
// FIM EVENTOS DO INPUT SENHA DO UTILIZADOR

$(document).on('click', '[data-action="update"]', function() {
    var type_auth = parseInt($('body').attr('type-auth')),
        id_auth = parseInt($('body').attr('id-user-auth')),
        user_edit = parseInt(button_edit_utilizador.attr('user-id')),
        id_update = $(this).closest('[data-idUser]').attr('data-idUser');

    $("#janelaDashboard .close").trigger('click');

    selecionar_usuario(id_update);
});

$(document).on('click', '[data-action="admin-access"]', function() {
    var id_access = $(this).closest('[data-idUser]').attr('data-idUser'),
        username = $(this).closest('[data-userName]').attr('data-userName'),
        userAccess = $(this).closest('[data-userName]').attr('data-userAccess'),
        confirm_access = confirm("Estás alterar o tipo de utilizador \" " + username + "\" para \"" + ((userAccess == 1) ? 'Usuário Credenciado' : 'Administrador') + "\" na aplicação, clique em \"OK\" para confirmar!");

    if (confirm_access == true) {
        alternar_acesso(id_access);
    }
});

$(document).on('click', '[data-action="delete"]', function() {

    var id_delete = $(this).closest('[data-idUser]').attr('data-idUser'),
        username = $(this).closest('[data-userName]').attr('data-userName'),
        confirm_delete = confirm("Estás eliminando o utilizador \" " + username + "\" permanentemente da base de dados, clique em \"OK\" para confirmar!");

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
verificar_access();
//e

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
            //console.log(dadosResposta);

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
            //console.log(dadosResposta);

            if (dadosResposta[0].tipo == 'sucesso') {
                alert(dadosResposta[0].mensagem);
                $('#fr_id_usuario').text(dadosResposta[1].id_utilizador);
                $('body').attr('type-auth', dadosResposta[1].id_perfil);
                $('body').attr('id-user-auth', dadosResposta[1].id);
                verificar_access();
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
            //console.log(dadosListaUsuario);

            if (typeof dadosListaUsuario != 'undefined') {
                //alert(dadosResposta[0].mensagem);
                //$('#fr_id_usuario').text(dadosResposta[1].id_utilizador)
                //accao_pagina_autenticacao('done');
                for (let i = 0; i < dadosListaUsuario.length; i++) {
                    htmlListaUsuario += `
                    <tr data-idUser="${dadosListaUsuario[i].id}" data-userName="${dadosListaUsuario[i].nome_utilizador}" data-userAccess="${dadosListaUsuario[i].id_perfil}">
                        <th scope="row">${dadosListaUsuario[i].id}</th>
                        <td>${dadosListaUsuario[i].nome_utilizador}</td>
                        <td>${dadosListaUsuario[i].email_utilizador}</td>
                        <td><strong>${dadosListaUsuario[i].id_utilizador}</strong></td>
                        <td data-action-state="on">
                            <button class="btn btn-outline-dark" data-editUser="edit" data-action="update" data-toggle="modal" data-target="#janelaEditUser" data-whatever="@getbootstrap"><i class="fas fa-user-edit"></i></button>
                            ` + ((dadosListaUsuario[i].id != 1) ? `<button class="btn btn-danger" data-action="delete"><i class="fas fa-trash-alt"></i></button>` : '') + `
                            ` + ((dadosListaUsuario[i].id == 1) ? '' : ((dadosListaUsuario[i].id_perfil != 1) ? `<button class="btn btn-dark" data-action="admin-access"><i class="fas fa-user-shield"></i></button>` : `<button class="btn btn-dark" data-action="admin-access"><i class="fas fa-user-alt"></i></button>`)) + `
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

function selecionar_usuario(id) {

    let url = 'http://localhost:3000/auth/list/user/' + id;

    $.ajax({
            url: url,
            method: "GET",
            dataType: 'json'
        })
        .done(function(dadosUsuario) {
            //console.log(dadosUsuario);

            if (typeof dadosUsuario != 'undefined') {
                $('#janelaEditUser .modal-footer [window-data-button="edit-user"]').attr('user-id', dadosUsuario[1].id);
                $('#janelaEditUser #formEditUser input#update-recipient-usuario').val(dadosUsuario[1].nome_utilizador);
                $('#janelaEditUser #formEditUser input#update-recipient-email').val(dadosUsuario[1].email_utilizador);
                $('#janelaEditUser #formEditUser input#update-recipient-senha').val();

            } else {
                alert('Ocorreu um erro interno, por favor, contacte a assistência técnica para uma melhor resolução do problema.');
            }
        })
        .fail(function(jqXHR, textStatus) {
            alert("Ocorreu um erro interno, O Servidor de Base de Dados está Offline. Por Favor, Contacte a assistêcia técnica para a resolução deste problema.");
        });
}

function editar_usuario(id, usuario, email, senha) {

    let url = 'http://localhost:3000/auth/edit/';

    var dados = {
        'id': id,
        'name': usuario,
        'email': email,
        'password': senha
    };

    $.ajax({
            url: url,
            method: "PUT",
            data: dados,
            dataType: 'json'
        })
        .done(function(dadosResposta) {
            //console.log(dadosResposta);

            if (dadosResposta[0].tipo == 'sucesso') {
                alert(dadosResposta[0].mensagem);

                button_close_windowEditUser.trigger('click');
            } else {
                alert(dadosResposta[0].mensagem);
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
            //console.log(dadosResposta);

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

function alternar_acesso(id) {

    let url = 'http://localhost:3000/auth/edit/access';

    var dados = {
        'id': id
    };

    $.ajax({
            url: url,
            method: "PUT",
            data: dados,
            dataType: 'json'
        })
        .done(function(dadosResposta) {
            //console.log(dadosResposta);

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

function verificar_access() {
    if (typeof $('body').attr('type-auth') != 'undefined' && $('body').attr('type-auth') == '2') {
        $('#fr-gerir-utilizadores').css({ 'display': 'none', 'visibility': 'hidden', 'opacity': 0 });
    }
}
// Adicionar Métodos
var element = $('#janelaAddUser #recipient-nome');

element.on('keyup keypress', function() {
    let _value = $(this).val().split(' ');

    if (_value.length >= 3) {
        $(this).attr('data-invalid', 'invalid');

        primeiroNome = (_value[0] != 'undefined') ? _value[0].length : 0;
        ultimoNome = (_value[1] != 'undefined') ? _value[1].length : 0;

        $(this).val($(this).val().substring(0, 1 + (primeiroNome + ultimoNome)));
        $(this).removeAttr('data-invalid');
        //console.log($(this).val().substring(0, 1 + (primeiroNome + ultimoNome)));
    } else {
        $(this).removeAttr('data-invalid');
    }
})

// Regras para formulários

$('.fr_imput_cartao').mask('0000 0000 0000 0000');
$('.fr_imput_conta').mask('000000000000');
$('.fr_imput_montante').mask('000.000.000.000.000,00', { reverse: true });
$('.fr_imput_proposta').mask('00000');
$('.fr_imput_agencia').mask('000');
$('.fr_imput_data').mask('00-00-0000');

// Regras para formulário: Adicionar Utilizador

$('#janelaAddUser #recipient-email').validate({
    rules: {
        field: {
            required: true,
            email: true
        }
    }
});

//$('#janelaAddUser #recipient-nome').mask('0000 0000 0000 0000');


$(function() {
    $("#abrir-janela").click(function() {
        $("#janela-modal").modal();
    });
});