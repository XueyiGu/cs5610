/**
 * Created by ceres on 2/18/16.
 */
(function()
{
    "use strict";
    angular
        .module("PriceMatchApp")
        .factory("RestaurantService", RestaurantService);

    function RestaurantService($http, $rootScope, $q)
    {
        var api = {
            search: search,
            restaurantDetail: restaurantDetail,
            createRestaurant: createRestaurant
        };

        return api;

        function search(restaurant){
            var deferred = $q.defer();
            $http
                .post('/api/project/restaurant/search', restaurant)
                .then(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function restaurantDetail(restaurantId){
            var deferred = $q.defer();
            $http
                .get('/api/project/restaurant/detail/' + restaurantId)
                .then(function(response){
                    deferred.resolve(response)
                },
                function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function createRestaurant(restaurant){
            var deferred = $q.defer();
            $http
                .put('/api/project/restaurant/createRestaurant', restaurant)
                .then(function(response){
                        deferred.resolve(response)
                    },
                    function(err){
                        deferred.reject(err);
                    });
            return deferred.promise;
        }
    }
})();