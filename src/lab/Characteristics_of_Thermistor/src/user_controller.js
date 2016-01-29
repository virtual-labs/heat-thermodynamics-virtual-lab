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
				.content(help_array [0])
				.action(help_array [7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast1 = $mdToast.simple()
				.content(help_array [1])
				.action(help_array [7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast2 = $mdToast.simple()
				.content(help_array [2])
				.action(help_array [7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast3 = $mdToast.simple()
				.content(help_array [3])
				.action(help_array [7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast4 = $mdToast.simple()
				.content(help_array [4])
				.action(help_array [7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());


			var toast5 = $mdToast.simple()
				.content(help_array [5])
				.action(help_array [7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast6 = $mdToast.simple()
				.content(help_array [6])
				.action(help_array [8])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			$mdToast.show(toast).then(function() {
				$mdToast.show(toast1).then(function() {
					$mdToast.show(toast2).then(function() {
						$mdToast.show(toast3).then(function() {
							$mdToast.show(toast4).then(function() {
								$mdToast.show(toast5).then(function() {
									$mdToast.show(toast6).then(function() {});
								});
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
		$scope.controls_disable_temp=true;/** It disables the all the controls */
		$scope.controls_disable_powerOn= true;
		$scope.thermistor_disable = false; /** It disables the Choose thermistor dropdown */
		$scope.result_disable = true; /** It disables the show result checkbox */
		$scope.graph_show = true; /** It disables the voltage slider */
		$scope.hide_show_result = false; /** It hides the show result check box */
		$scope.graphValue = false;
		$scope.show_voltage = true;
		$scope.show_voltage_t4 = false;
		$scope.circuitValue =false;
		
		$scope.temperature = 25 + "(℃)"; /** Initial radius slider value */
		$scope.voltage = 0.1 + " V"; /** Initial radius slider value */
		$scope.maxTemp = 100;
		$scope.minVoltage = 0.1;
		$scope.maxVoltage = 0.4;
		$scope.alpha_value = -0.032994; /** Initial magnetic field result value */
		$scope.Voltage = 0.1;

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
		};

		$scope.toggle1 = function() {
			$scope.showVariables = !$scope.showVariables;
			$scope.isActive1 = !$scope.isActive1;
		};
		/** Function for choosing the drop down list */
		$scope.chooseThermistor = function() {
			switch ($scope.Thermistor) {
				case "Thermistor1":
					$scope.minVoltage = 0.1;
					$scope.maxVoltage = 0.4;
					alpha_value = -0.032994;
					beta_value = 2930;
					R0_value = 100;
					$scope.show_voltage_t4 = false;
					$scope.show_voltage = true;
					$scope.Voltage = $scope.minVoltage;
					max_voltage = $scope.maxVoltage;

					break;
				case "Thermistor2":
					$scope.minVoltage = 0.1;
					$scope.maxVoltage = 2.7;
					alpha_value = -0.038512;
					beta_value = 3420;
					R0_value = 1000;
					$scope.show_voltage_t4 = false;
					$scope.show_voltage = true;
					$scope.Voltage = $scope.minVoltage;
					max_voltage = $scope.maxVoltage;
					break;
				case "Thermistor3":
					$scope.minVoltage = 0.1;
					$scope.maxVoltage = 0.3;
					alpha_value = -0.036744;
					beta_value = 3263;
					R0_value = 100;
					$scope.show_voltage_t4 = false;
					$scope.show_voltage = true;
					$scope.Voltage = $scope.minVoltage;
					max_voltage = $scope.maxVoltage;
					break;
				case "Thermistor4":
					$scope.minVoltageT4 = 3;
					$scope.maxVoltageT4 = 5;
					alpha_value = -0.043804;
					beta_value = 3890;
					R0_value = 3000;
					$scope.show_voltage_t4 = true;
					$scope.show_voltage = false;
					$scope.Voltage = $scope.minVoltageT4;
					max_voltage = $scope.maxVoltageT4;
					break;
			}//set label values and initial values of alpha & beta values for each termistor
			$scope.voltage = $scope.minVoltage + " V";
			$scope.voltage_T4 = $scope.minVoltageT4 + " V";
			voltage_float = $scope.Voltage;
			resistance_value = R0_value;
			$scope.alpha_value = alpha_value;
			thermistorSelection($scope);
		}
		/** Change event function of Temperature slider */
		$scope.tempSlider = function() {
			temperatureSliderFN($scope); /** Function defined in experiment.js file */
		}
		/** Change event function of Voltage slider */
		$scope.voltageSlider = function() {
			$scope.voltage_T4 = $scope.Voltage + " V";
			voltageSliderFN($scope); /** Function defined in experiment.js file */
		}
		/** Change event function of checkbox Show circuit */
		$scope.showCircuit = function() {
			if ($scope.circuitValue == true) {
				thermistor_stage.getChildByName("circuit_diagram").visible = true;
			} else {
				thermistor_stage.getChildByName("circuit_diagram").visible = false;
			}
		}
		/** Click event function of power on button */
		$scope.powerOn = function() {
			startExperiment($scope); /** Function defined in experiment.js file */
		}
		/** Change event function of the checkbox Show graph */
		$scope.showGraph = function() {
			if ($scope.graphValue == true) {
				$scope.graph_show = false;				
				plotGraph();
			} else {
				$scope.graph_show = true;
			}
		}
		/** Change event function of the check box Show result */
		$scope.showResult = function() {
			showresultFN($scope); /** Function defined in experiment.js file */
		}
		/** Click event function of the Reset button */
		$scope.resetBtn = function() {
			reset($scope); /** Function defined in experiment.js file */
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