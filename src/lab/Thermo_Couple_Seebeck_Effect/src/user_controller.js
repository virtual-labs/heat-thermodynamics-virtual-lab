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
		}
		var self = this;
		self.selected = null;
		self.users = [];
		self.toggleList = toggleUsersList;

		$scope.showValue = false; /** It hides the 'Result' tab */
		$scope.showVariables = false; /** I hides the 'Variables' tab */
		$scope.isActive = true;
		$scope.isActive1 = true;
		$scope.combo_disable = false;

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
		/** Function for changing the drop down list */
		$scope.setThermoCoupleType = function() {
			thermo_type = $scope.thermo_type /** Index value of the drop down box array */
			getName("type_text").text = _("Thermocouple : ") + thermocouple_array[thermo_type];
			setThermoCoupleType($scope); /** Function defined in experiment.js file */
		}
		$scope.setReferenceTemperature = function() {
			setReferenceTemperature($scope);
		}
		$scope.hotTemperatureSlider = function() {
			setHotTemperature($scope);
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