/**
 * Created by ceres on 4/19/16.
 */
var q = require("q");

module.exports = function(mongoose, db) {

    var RestaurantSchema = require('./restaurant.schema.server.js')(mongoose);
    var restaurantModel = mongoose.model("projectRestaurantModel", RestaurantSchema);

    var api = {
        findRestaurantById: findRestaurantById,
        createRestaurant: createRestaurant,
        updateComment: updateComment,
        updateMenu: updateMenu
    };
    return api;

    function findRestaurantById(restaurantId)
    {
        var deferred = q.defer();
        restaurantModel.find({id: restaurantId},function(err, restaurant){
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(restaurant);
            }
        });
        return deferred.promise;
    }

    function createRestaurant(restaurant){
        var deferred = q.defer();
        restaurantModel.create(restaurant, function(err, restaurant){
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(restaurant);
            }
        });
        return deferred.promise;
    }

    function updateComment(restaurantId, userId, comment){
        var deferred = q.defer();

        return deferred.promise;
    }

    function updateMenu(restaurantId, userId, menu){
        var deferred = q.defer();

        return deferred.promise;
    }
};