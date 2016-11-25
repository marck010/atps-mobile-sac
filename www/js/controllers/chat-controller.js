appModule.controller("ChatController", function($http, $scope, $webSocket, $cache, $rootScope, $ionicHistory) {

    try {

        var cliente = $cache.GetItem("Cliente");
        var chaveAcesso = cliente.ChaveAcesso;
        var socket = $webSocket(chaveAcesso);

        $scope.Chat = {
            Atendente: {},
            Atendimento: null,
            Cliente: cliente,
            Desconectar: function() {
                socket.Desconectar();
            },
            Enviar: function() {
                if (!$scope.Chat.Atendimento) {
                    alert("Favor aguardar atendimento.");
                    return;
                }
                if ($scope.Chat.Mensagem) {
                    var id = $scope.Chat.Atendimento.Conversa.Id;
                    socket.Enviar($scope.Chat.Atendimento.Conversa.Login, $scope.Chat.Mensagem, id);

                    $scope.Chat.Atendimento.Conversa.Mensagens.push({ Texto: $scope.Chat.Mensagem, Remetente: $scope.Chat.Cliente });
                    $scope.Chat.Mensagem = '';
                }
            }
        }

    } catch (error) {
        JSON.stringify(error)
        alert(JSON.stringify(error))
    }

    $rootScope.$ionicGoBack = function() {
        socket.Desconectar();
        $scope.Chat.Atendente = {}
        $scope.Atendimento = null;
        $ionicHistory.goBack();
    };

    socket.OnMessage(function(mensagem) {
        var retorno = JSON.parse(mensagem.data);
        if (retorno.Error) {
            if (retorno.Error) {
                var erro = { data: retorno };
                TratarErro(erro)
                $scope.$apply();
                return;
            }
            return;
        }
        if (!$scope.Chat.Atendimento) {
            $scope.Chat.Atendimento = retorno;
        } else {
            $scope.Chat.Atendimento.Conversa = retorno.Conversa;
        }
        var primeiraMensagemAtendente = linq($scope.Chat.Atendimento.Conversa.Mensagens)
            .firstOrDefault(function(mensagem) {
                return mensagem.Remetente.ChaveAcesso != $scope.Chat.Cliente.ChaveAcesso;
            });
        $scope.Chat.Atendente = primeiraMensagemAtendente.Remetente

        $scope.$apply();
    });



})