(function() {
	angular.module('users', ['FBAngular'])
		.controller('UserController', [
		'$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$element', 'Fullscreen', '$mdToast', '$animate',
	UserController]);

	/**
	 * Main Controller for the Angular Material Starter App
	 * @param $scope
	 * @param $mdSidenav
	 * @param avatarsService
	 * @constructor
	 */
	function UserController($mdSidenav, $mdBottomSheet, $log, $q, $scope, $element, Fullscreen, $mdToast, $animate) {
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
				.filter(function(pos) {
				return $scope.toastPosition[pos];
			})
				.join(' ');
		};
		$scope.showActionToast = function() {
			var toast = $mdToast.simple()
				.content(help_array[0])
				.action(help_array[5])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast1 = $mdToast.simple()
				.content(help_array[1])
				.action(help_array[5])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast2 = $mdToast.simple()
				.content(help_array[2])
				.action(help_array[5])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast3 = $mdToast.simple()
				.content(help_array[3])
				.action(help_array[5])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast4 = $mdToast.simple()
				.content(help_array[4])
				.action(help_array[6])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());
		

			$mdToast.show(toast).then(function() {
				$mdToast.show(toast1).then(function() {
					$mdToast.show(toast2).then(function() {
						$mdToast.show(toast3).then(function() {
							$mdToast.show(toast4).then(function() {
								
							});
						});
					});
				});
			});
		};

		var self = this;
		self.selected = null;
		self.users = [];
		self.toggleList = toggleUsersList;
		$scope.showValue = false; /** It hides the 'Result' tab */
		$scope.showVariables = false; /** I hides the 'Variables' tab */
		$scope.isActive = true;
		$scope.isActive1 = true;

		$scope.substance_disable = false; /** It disables the Select substance dropdown */
		$scope.result_disable = true; /** It disables the show result checkbox */
		$scope.temperature_one = true;
		$scope.temperature_two = false;
		$scope.temperature_three = false;
		$scope.hide_show_result = true;
		$scope.controls_disable = false;

		$scope.mass = 10; /** Initial mass slider value */
		$scope.temperature = 0 + "℃"; /** Initial temperature slider value */
		$scope.minTemperature = 0;
		$scope.maxTemperature = 100;

		$scope.goFullscreen = function() {
			/** Full screen */
			if (Fullscreen.isEnabled()) Fullscreen.cancel();
			else Fullscreen.all();
			/** Set Full screen to a specific element (bad practice) */
			/** Full screen.enable( document.getElementById('img') ) */
		};

		$scope.toggle = function() {
			$scope.showValue = !$scope.showValue;
			$scope.isActive = !$scope.isActive;
			if ($scope.resultValue == true) $scope.hide_show_result = !$scope.hide_show_result;
		};

		$scope.toggle1 = function() {
			$scope.showVariables = !$scope.showVariables;
			$scope.isActive1 = !$scope.isActive1;
		};
		/** Function for choosing the drop down list */
		$scope.selectSubstance = function() {
			console.log($scope.Substance);
			material = $scope.Substance;

			switch ($scope.Substance) {
				case "naphthalene":
					$scope.temperature_one = true;
					$scope.temperature_two = false;
					$scope.temperature_three = false;
					specific_heat_capacity = 1.72;
					density = 1140;
					latent_heat = 151;
					melting_point = 80.26;
					max_temp = 218;
					surround_temp=0;
					break;
				case "ice":
					$scope.temperature_one = false;
					$scope.temperature_two = true;
					$scope.temperature_three = false;
					specific_heat_capacity = 2.03;
					density = 916.7;
					latent_heat = 334;
					melting_point = 0;
					max_temp = 100;
					surround_temp=-10;
					break;
				case "wax":
					$scope.temperature_one = false;
					$scope.temperature_two = false;
					$scope.temperature_three = true;
					specific_heat_capacity = 3.43;
					density = 900;
					latent_heat = 200;
					melting_point = 45;
					max_temp = 218;
					surround_temp=0;
					break;
			}
			phase_change_stage.getChildByName("thermomterTxt").text = max_temp + "℃";
			$scope.temperature = temp_slider_min[$scope.Substance] + "℃";
		}
		/** Change event function of Mass slider */
		$scope.massSlider = function() {
			$scope.mass = $scope.Mass;
			massSliderFN($scope); /** Function defined in experiment.js file */
		}
		/** Change event function of Temperature slider */
		$scope.tempSlider = function() {
			if ($scope.Substance == "naphthalene") {
				temperature_float = $scope.Temperature_one;
			} else if ($scope.Substance == "ice") {
				temperature_float = $scope.Temperature_two;
			} else {
				temperature_float = $scope.Temperature_three;
			}
			temperatureSliderFN($scope); /** Function defined in experiment.js file */
		}
		/** Click event function of start experiment button */
		$scope.startExp = function() {
			startExperiment($scope); /** Function defined in experiment.js file */
		}
		/** Change event function of the check box Show result */
		$scope.showResult = function() {
			showresultFN($scope); /** Function defined in experiment.js file */
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