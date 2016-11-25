var appModule = angular.module('app-module', []);

var urlWebService = "http://104.198.254.136/";
var urlWebSocket = "ws://104.198.254.136/";


function TratarErro(erro, matarSessao) {
    var retorno = erro.data;

    if (!retorno || !retorno.TipoErro) {
        var erroSerializado = JSON.stringify(erro);
        alert("Ocorreu um erro inesperado: " + erroSerializado);
    } else {
        switch (retorno.TipoErro) {
            case Enums.TipoErro.SessaoExpirada:
                if (typeof(matarSessao) == "function") {
                    matarSessao();
                }
                break;
            case Enums.TipoErro.NaoTratado:
                alert("Ocorreu um erro inesperado");
                break;

            case Enums.TipoErro.ErroTratado:
                alert(retorno.Error);
                break;

        }
    }
}

var Enums = {
    TipoErro: {
        SessaoExpirada: 1,
        NaoTratado: 2,
        ErroTratado: 3
    }
}