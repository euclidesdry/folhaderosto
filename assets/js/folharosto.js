var limpar_formulario = $('#limpar_formulario'),
    botao_imprimir = $('#imprimir_pagina'),
    botao_autenticar = $('#autenticar_usuario'),
    formulario_auth = $('#form_auth'),
    formulario_folha = $('.fr_folha'),

    email_formulario = $('.email-form'),
    password_formulario = $('.password-form');

let list_group_item = $('.lista_folha_rosto .list-group-item');

limpar_formulario.on("click", function() {
    $('body input').val('');
});

botao_imprimir.on("click", function() {
    window.print();
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

function autenticacao(usuario, senha) {

    let url = 'http://localhost:3000/login';

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
            alert("Request failed: " + textStatus);
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

$('.fr_imput_cartao').mask('0000 0000 0000 0000');
$('.fr_imput_conta').mask('000000000000');
$('.fr_imput_montante').mask('000.000.000.000.000,00', { reverse: true });
$('.fr_imput_proposta').mask('00000');
$('.fr_imput_agencia').mask('000');
$('.fr_imput_data').mask('00-00-0000');