(function(){
     angular
    .module('users',['FBAngular','ui.bootstrap','dialogs.main','pascalprecht.translate'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate', '$translate','dialogs',
        UserController
    ])
   .config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){
		dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(false);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');
        $translateProvider.translations(language,{DIALOGS_ERROR:(_("Error")),DIALOGS_ERROR_MSG:(_("Voltage of both heaters must be same.")),DIALOGS_CLOSE:(_("Okay"))}),$translateProvider.preferredLanguage(language);
	}]);
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate, $translate, dialogs) {
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
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(help_array[1])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple()
            .content(help_array[2])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(help_array[3])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast4 = $mdToast.simple()
            .content(help_array[4])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            

            var toast5 = $mdToast.simple()
            .content(help_array[5])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast6 = $mdToast.simple()
            .content(help_array[6])
            .action(help_array[8])
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
        
        $scope.control_disable=false; /** It disables the controls drop down box, reverse current, radius of coil, adjust rheostat, check box, reset */        
        $scope.result_disable=true; /** Show result checkbox disabled */
        $scope.hide_show_result=false; /** It hides the show result check box */        
        $scope.diameter=5; /** Initial diameter slider value */
        $scope.thickness=1; /** Initial compass box position slider value */
        $scope.temperature=-20; /** Initial magnetic field result value */
        $scope.emissivity_value=0;
		
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
        /** Change event function of Diameter slider */
        $scope.diameterSlider = function() {
            diameterSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of Thickness slider */
        $scope.thicknessSlider = function() {
            thicknessSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of Chamber temperature slider */
        $scope.temperatureSlider = function() {
            temperatureSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of the check box Show result */
        $scope.showResult = function() {
            showResultFN($scope); /** Function defined in experiment.js file */
        }
        /** Click event function of the power on/power off button */
        $scope.powerOnBtn = function() {
            powerOn($scope,dialogs); /** Function defined in experiment.js file */
        }
        /** Click event function of reset button */
        $scope.resetBtn = function() {
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
