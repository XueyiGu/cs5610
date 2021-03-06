/**
 * Created by ceres on 2/17/16.
 */
(function(){
    "use strict";
    angular
        .module("PriceMatchApp")
        .controller("RegisterController", registerController);

    function registerController($location, $scope, UserService, $rootScope) {
        $scope.message = null;
        $scope.register = register;

        function register(user) {
            $scope.message = null;
            if (user == null) {
                $scope.message = "Please fill in the required fields";
                return;
            }
            if (!user.username) {
                $scope.message = "Please provide a username";
                return;
            }

            if (!user.password || !user.password2) {
                $scope.message = "Please provide a password";
                return;
            }
            if (user.password != user.password2) {
                $scope.message = "Passwords must match";
                return;
            }
            var emails = [];
            emails.push(user.email);
            user.emails = emails;

            UserService
                .createUser(user)
                .then(
                    function(response){
                        if(response.data) {
                            console.log(response.data);
                            $rootScope.currentUser = response.data;
                            $location.url("/profile");
                        }
                        else{
                            $scope.message = "User already exists";
                        }
                    },
                    function(err) {
                        $scope.message = err;
                    })
        }
    }
})();