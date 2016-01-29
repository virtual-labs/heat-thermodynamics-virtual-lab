(function(){
    angular
    .module('users',['FBAngular'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        UserController
    ]);
	   
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate) {
	    $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {        
            var toast = $mdToast.simple()
            .content(help_array[0])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(help_array[1])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple()
            .content(help_array[2])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(help_array[3])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast4 = $mdToast.simple()
            .content(help_array[4])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast5 = $mdToast.simple()
            .content(help_array[5])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast6 = $mdToast.simple()
            .content(help_array[6])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast7 = $mdToast.simple()
            .content(help_array[7])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast8 = $mdToast.simple()
            .content(help_array[8])
            .action(help_array[10])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast9 = $mdToast.simple()
            .content(help_array[9])
            .action(help_array[11])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            $mdToast.show(toast).then(function() {
                $mdToast.show(toast1).then(function() {
                    $mdToast.show(toast2).then(function() {
                        $mdToast.show(toast3).then(function() {
                            $mdToast.show(toast4).then(function() {
                                $mdToast.show(toast5).then(function() {
                                    $mdToast.show(toast6).then(function() {
                                        $mdToast.show(toast7).then(function() {
                                            $mdToast.show(toast8).then(function() {
                                                $mdToast.show(toast9).then(function() {
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });		
        };
  
        var self = this;
        self.selected     = null;
        self.users        = [ ];
        self.toggleList   = toggleUsersList;

        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = true;
        $scope.isActive1 = true; 

        $scope.showValue = false; /** It hides the 'Result' tab */
        $scope.hide_show_result=true; /** It hides the show result */   
        $scope.coefficient_value=0; 
        $scope.nusselt_value=0;
        $scope.control_disable=false;
		
        $scope.goFullscreen = function () {
            /** Full screen */
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
        
        $scope.toggle = function () {
            $scope.showValue=!$scope.showValue;
            $scope.isActive = !$scope.isActive;
        };	
        $scope.toggle1 = function () {
            $scope.showVariables=!$scope.showVariables;
            $scope.isActive1 = !$scope.isActive1;
        };

        /** Function for changing the drop down list */
        $scope.changeMaterial = function(){
            type=$scope.Material;
            selected_material= $scope.Material;
            changeOption($scope); /** Function defined in experiment.js file */
        }
        /** Function to set width of wooden box*/
        $scope.setWoodenWidth = function(){
            setWoodenWidth($scope); /** Function defined in experiment.js file */
        }
        /** Function to set height of wooden box*/
        $scope.setWoodenHeight = function(){
            setWoodenHeight($scope); /** Function defined in experiment.js file */
        }
        /** Function to set diameter of cylinder */
        $scope.setCylinderDiameter = function(){
            setCylinderDiameter($scope); /** Function defined in experiment.js file */
        }
        /** Function to set length of cylinder */
        $scope.setCylinderLength = function(){
            setCylinderLength($scope); /** Function defined in experiment.js file */
        }
        /** Function to view the cross section of cylinder */
        $scope.crossSection = function(){
            crossSection($scope); /** Function defined in experiment.js file */
        }
        /** Function to set the thickness of cylinder */
        $scope.setCylinderThickness = function(){
            setCylinderThickness($scope); /** Function defined in experiment.js file */
        }
        /** Function to power ON/OFF button */
        $scope.powerOnOff = function(){
            powerOnOff($scope);
            calculateTemperature($scope); /** Function defined in experiment.js file */
        }
        /** Function for resetting the experiment */
        $scope.resetExp = function() {
            resetExperiment(); /** Function defined in experiment.js file */
        }
        /**
        * First hide the bottom sheet IF visible, then
        * hide or Show the 'left' sideNav area
        */
        function toggleUsersList() {
            $mdSidenav('right').toggle();
        }
    }
})();