var botao_imprimir = document.querySelector('#imprimir_pagina'),
    botao_autenticar = document.querySelector('#autenticar_usuario'),
    formulario_auth = document.querySelector('#form_auth'),

    email_formulario = document.querySelector('.email-form'),
    password_formulario = document.querySelector('.password-form');

botao_imprimir.addEventListener("click", function() {
    window.print();
});

botao_autenticar.addEventListener("click", function() {
    login(email_formulario.value, password_formulario.value);
});

formulario_auth.addEventListener("submit", function(e) {
    return false;
});

function login(user, password) {
    let url = location.origin + '/assets/js/userdb.json';
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status = 200) {
                dadosUsuario = JSON.parse(xhr.responseText);
                console.log(dadosUsuario);

            } else {
                console.log({ "erro": '001' });
            }
        }
    }
    xhr.send();
}