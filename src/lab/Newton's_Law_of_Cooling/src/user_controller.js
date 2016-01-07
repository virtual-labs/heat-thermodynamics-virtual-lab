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
          .content(helpArray[0])
          .action(helpArray[3])
		   .hideDelay(15000)
          .highlightAction(false)
          .position($scope.getToastPosition());
		  
	 var toast1 = $mdToast.simple()
          .content(helpArray[1])
          .action(helpArray[3])
		   .hideDelay(15000)
          .highlightAction(false)
          .position($scope.getToastPosition());
		  
  var toast2 = $mdToast.simple()
          .content(helpArray[2])
          .action(helpArray[4])
		   .hideDelay(15000)
          .highlightAction(false)
		    .position($scope.getToastPosition());
	 
   	 
		  $mdToast.show(toast).then(function() {
			   $mdToast.show(toast1).then(function() {
				   $mdToast.show(toast2).then(function() {					   
			  		});
			  	});
			 });	
	
  };
  
    var self = this;
    self.selected     = null;
    self.users        = [ ];
    self.toggleList   = toggleUsersList;
	$scope.showValue = false;
	$scope.showVariables = false;
	$scope.isActive = true;
	$scope.isActive1 = true;
	$scope.showzoom=true;
	$scope.control_disable=true;
	$scope.initialBtn=false;
	$scope.showgph=false;
	$scope.showgraphDiv=false;
	$scope.divshow=true;
	$scope.temp_value=25+"℃";
		
 	$scope.changeMaterial = function(){
		selected_material= $scope.Material;
	}
  
	$scope.goFullscreen = function () {
		// Fullscreen
		if (Fullscreen.isEnabled())
		Fullscreen.cancel();
		else
		Fullscreen.all();
		// Set Fullscreen to a specific element (bad practice)
		// Fullscreen.enable( document.getElementById('img') )
	};
	
	$scope.isFullScreen = false;
		$scope.goFullScreenViaWatcher = function() {
		$scope.isFullScreen = !$scope.isFullScreen;
	};
	
	/**'start experiment' button function*/
	$scope.startExperiment = function () {
		$scope.showzoom=false;
		$scope.control_disable=false;
		$scope.initialBtn=true;	
		start($scope);	
	};
	
	/**'start heating' button function*/
	$scope.startHeating = function () {
		startFlag++;
		startHeatingFn($scope);	
	};
	
	/**selecting the liquid drop down function*/
	$scope.changeLiquid = function () {
		selected_liquid=$scope.Liquid;
	};
	
	$scope.toggle = function () {
		$scope.showValue=!$scope.showValue;
		$scope.isActive = !$scope.isActive;
	};
	
	$scope.toggle1 = function () {
		$scope.showVariables=!$scope.showVariables;
		$scope.isActive1 = !$scope.isActive1;
	};
	
	/**'Reset' button function*/
	$scope.resetExperiment= function(){
		startFlag=0;
		$scope.showzoom=true;
		$scope.control_disable=true;		
		$scope.initialBtn=false;		
		resetExperiment();
	};
	// *********************************
	// Internal methods
	// *********************************
	
	/**
	* First hide the bottomsheet IF visible, then
	* hide or Show the 'left' sideNav area
	*/
	function toggleUsersList() {
	$mdSidenav('right').toggle();
	}
	}
})();