appModule.controller("AcessoController", function($http, $scope, $cache, $state) {

    $scope.Cliente = {}

    $scope.Cliente.Acessar = function() {

        if ($scope.Cliente.Nome && $scope.Cliente.Email) {

            try {
                var parametros = {
                    Nome: $scope.Cliente.Nome,
                    Email: $scope.Cliente.Email,
                    Telefone: $scope.Cliente.Telefone,
                };

                $http({
                        url: urlWebService + "Chat/CadastroCliente",
                        method: "POST",
                        data: JSON.stringify(parametros),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function(retorno) {
                        var data = retorno.data

                        $scope.Cliente.ChaveAcesso = data.ChaveAcesso;
                        $cache.SetItem("Cliente", $scope.Cliente);

                        $state.go("chat", {})
                    })
                    .catch(function(data) {
                        TratarErro(data);
                    });
            } catch (error) {
                alert(error);
            }

        } else {
            alert("Preencha o campo nome e email.");
        }
    }
})