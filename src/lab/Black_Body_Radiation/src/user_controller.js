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
    function UserController( $mdSidenav,$mdBottomSheet,$log,$q,$scope,$element,Fullscreen,$mdToast, $animate) {
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
            .content(helpArray[0])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(helpArray[1])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple()
            .content(helpArray[2])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(helpArray[3])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast4 = $mdToast.simple()
            .content(helpArray[4])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            

            var toast5 = $mdToast.simple()
            .content(helpArray[5])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast6 = $mdToast.simple()
            .content(helpArray[6])
            .action(helpArray[8])
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
    
        $scope.showValue = false; /** It hides the 'Result' tab */
        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = true;
        $scope.isActive1 = true;
        $scope.slider_disable=false; /** It disables the sliders */        
        $scope.fit_disc_disable = true;
        $scope.water_temp=35+" (℃)"; /** Initial water temperature slider value */        
        $scope.surr_temp=30+" (℃)"; /** Initial surrounding temperature slider value */        
        $scope.temperature_value=35+" (℃)";
        $scope.water_temperature_min=0;
        $scope.water_temperature_max=100;
        $scope.surr_temperature_min=-5;
        $scope.surr_temperature_max=95;
        $scope.waterTemp=35;
        $scope.surrTemp=30;
        $scope.temperature="T1 :";
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

        /** Initial radio button active */
        $scope.temp = {
            data : 'T1'
        }
        
        /** Function for Water temperature slider */
        $scope.waterTempSlider = function(){            
            waterTempSliderFN($scope); /** Function defined in experiment.js file */
        }        
        /** Change event function of Surround temperature slider */
        $scope.surroundTempSlider = function() {
            surroundTempSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of Mass disc slider */
        $scope.massDiscSlider = function() {
            massDiscSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of Radius disc slider */
        $scope.radiusDiscSlider = function() {
            radiusDiscSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Click event function of the power/reset button */
        fit_the_disc_flag=true
        $scope.powerOnBtn = function() {
            if(fit_the_disc_flag){
                powerOn($scope); /** Function defined in experiment.js file */
            }
            if(!fit_the_disc_flag){
                console.log('test');
                reset($scope);
            }
            fit_the_disc_flag=false;
        }
        /** Click event function of the Fit the disc button */
        $scope.fitDiscBtn = function() {
            fitTheDisc($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of the cross sectional view */
        $scope.system_crossView = function() {
            systemCrossView($scope); /** Function defined in experiment.js file */
        }
        /**Check the result*/
        $scope.result_Check = function() {
            resultCheck($scope); /** Function defined in experiment.js file */
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
