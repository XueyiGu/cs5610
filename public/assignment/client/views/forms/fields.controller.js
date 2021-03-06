/**
 * Created by ceres on 2/17/16.
 */
(function(){
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("FieldController", fieldController);

    function fieldController($scope, $rootScope, $routeParams, FieldService, FormService, UserService) {

        //constant variables
        var formId = $routeParams.formId;
        var formTitle = $routeParams.formTitle;
        var selectedFieldIndex = -1;
        console.log(formTitle);
        $scope.title = formTitle;
        //find all the fields for form
        console.log('I am in field controller');
        function init(){
            FieldService
                .getFieldsForForm(formId)
                .then(function(response){
                    if(response.data.length > 0){
                        $scope.fields = response.data[0].fields;
                    }
                });
            var userId = null;
            UserService
                .getCurrentUser()
                .then(function(user){
                    if(user.data){
                        console.log(user.data);
                        $rootScope.currentUser = user.data;
                        userId =  $rootScope.currentUser._id;
                        //find all the forms for user
                        FormService
                            .findAllFormsForUser($scope.currentUser._id)
                            .then(function(response){
                                for(var u in response.data){
                                    console.log(response.data[u]._id);
                                }
                                $scope.forms = response.data;
                            })
                    }else{
                        $location.url("/login");
                    }
                });


        }
        init();

        var typeMap =[
            {key: "Single Line Text Field", value: "TEXT"},
            {key: "Multi Line Text Field", value: "TEXTAREA"},
            {key: "Date Field", value: "DATE"},
            {key: "Dropdown Field", value: "OPTIONS"},
            {key: "Checkboxes Field", value: "CHECKBOXES"},
            {key: "Radio Buttons Field", value: "RADIOS"}
        ];

        function getFieldType(fieldType) {
            if(fieldType == null){
                return "DATE";
            }
            for (var k in typeMap) {
                console.log(typeMap[k].key + " " + typeMap[k].value);
                if (typeMap[k].key == fieldType){
                    return typeMap[k].value;
                }
            }
        }

        $scope.addField = function(fieldType){
            console.log('add field for form ' + formId);
            var type = getFieldType(fieldType);
            var field = {"label":"New Field", "type": type, "placeholder": "","options" : null, "optionText":null};
            var isOption = !(type === 'TEXT' || type === 'TEXTAREA' || type == 'DATE' || type == 'EMAIL');
            if(isOption){
                field.options = [
                    {"label": "Option 1", "value": "OPTION_1"},
                    {"label": "Option 2", "value": "OPTION_2"},
                    {"label": "Option 3", "value": "OPTION_3"}
                ];
            }
            FieldService
                .createFieldForForm(formId, field)
                .then(init);
        }

        $scope.editField=function(index, field){
            selectedFieldIndex = index;
            console.log(field.type + ' '+field.label);
            $scope.efield = {
                _id: field._id,
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                options: field.options,
                optionText: field.optionText
            };
            var isOption = !(field.type === 'TEXT' || field.type === 'TEXTAREA' || field.type == 'DATE' || field.type == 'EMAIL');

            if (isOption) {
                var optionList = [];
                var ol = field.options;
                for (var o in ol) {
                    optionList.push(ol[o].label + ":" + ol[o].value)
                }
                $scope.efield.optionText = optionList.join("\n");
                console.log($scope.efield.optionText);
            }
        }

        $scope.commitEdit = function (field){

            console.log('commit edit ' + field.type);
            var isOption = !(field.type == 'TEXT' || field.type == 'TEXTAREA' || field.type == 'DATE');

            var optionArray = [];
            if (isOption) {
                var text = field.optionText;
                if(text != null){
                    var textArray = text.split("\n");
                    for(var a in textArray){
                        var option = textArray[a].split(":");
                        optionArray.push({
                            label: option[0],
                            value: option[1]
                        });
                    }
                }
                field.options = optionArray;
            }

            FieldService
                .updateField(formId, field._id, field)
                .then(init);
        }

        $scope.cloneField = function(field){
            console.log('clone field ' + field.label);
            FieldService
                .createFieldForForm(formId, field)
                .then(init);
        }
        $scope.deleteField = function(field){
            console.log('delete field ' + field._id + ' of form ' + formId);
            FieldService
                .deleteFieldForForm(formId, field._id)
                .then(init);
        }

        $scope.orderField = function(){
            var form = $scope.form.fields;
            FormService
                .updateFormById(formId, form)
                .then(init);
        }

    }
})();