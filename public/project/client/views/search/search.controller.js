/**
 * Created by ceres on 4/18/16.
 */
var app = angular.module("PriceMatchApp");
app.controller("SearchController", searchController);


function searchController($scope, $rootScope, RestaurantService) {

    var vm = this;

    $scope.search = search;

    function init() {
    }
    init();

    function search(restaurant) {
        RestaurantService
            .search(restaurant)
            .then(
                function(response){
                    if(response){
                        $scope.restaurants = response.data;
                        console.log(response.data);
                    }
                },
                function(err) {
                    $scope.message = err;
                });
    }
}