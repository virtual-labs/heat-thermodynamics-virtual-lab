(function() {
	angular.module('users')
		.directive("experiment", directiveFunction)
})();

var phase_change_stage, exp_canvas, poweron_flag, maskRectangle;

var temperature_float, timer, material, tick;/** Tick timer for stage updation */

var specific_heat_capacity, density, latent_heat, melting_point, mass_testtube, specific_heat_glass;

var heat_transfer_coeff_glass, thermal_conduct_glas, thickness_tube, substance_mass, surround_temp;

var substanceArray = dataplotArray = helpArray = [];

var time_sec, sec_in_min, soln_alpha, one_sec_min, wax_alpha, seconds, minute, hour, ice_alpha;

var  subst_height, area, k_const, max_temp, trans_temp, transition_time;

var sec_for_graph,steadytime,min_for_graph, trans_time_sec, transition_delay;

/** Specific maximum and minimum values of slider temperature of each substance */
var temp_slider_min = {
	naphthalene: 0,
	ice: -10,
	wax: 0,
};
var temp_slider_max = {
	naphthalene: 100,
	ice: 90,
	wax: 90,
};

function directiveFunction() {
	return {
		restrict: "A",
		link: function(scope, element, attrs) {
			/** Variable that decides if something should be drawn on mouse move */
			var experiment = true;
			if (element[0].width > element[0].height) {
				element[0].width = element[0].height;
				element[0].height = element[0].height;
			} else {
				element[0].width = element[0].width;
				element[0].height = element[0].width;
			}
			if (element[0].offsetWidth > element[0].offsetHeight) {
				element[0].offsetWidth = element[0].offsetHeight;
			} else {
				element[0].offsetWidth = element[0].offsetWidth;
				element[0].offsetHeight = element[0].offsetWidth;
			}
			/**preloading the images in a queue*/
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			queue.on("complete", handleComplete, this);
			queue.loadManifest([{
				id: "background",
				src: "././images/background.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "other_objects",
				src: "././images/other_objects.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "solution",
				src: "././images/solution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "solution_line",
				src: "././images/solution_line.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "stand",
				src: "././images/stand.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "greenbutton",
				src: "././images/greenbutton.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "redbutton",
				src: "././images/redbutton.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "wax",
				src: "././images/waxsolution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "ice",
				src: "././images/icecubes.svg",
				type: createjs.LoadQueue.IMAGE
			}]);
			/**stage initialization*/
			phase_change_stage = new createjs.Stage("demoCanvas");
			phase_change_stage.enableDOMEvents(true);
			phase_change_stage.enableMouseOver();
			tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
			
			function handleComplete() {
				maskRectangle = new createjs.Shape();
				/**loading all images in the queue to the satage*/
				loadImages(queue.getResult("background"), "background", -10, -5, "", 0);
				loadImages(queue.getResult("other_objects"), "other_objects", 150, 20, "", 0);
				loadImages(queue.getResult("solution"), "solution", 200, 155, "", 0);
				loadImages(queue.getResult("wax"), "wax", 205, 163, "", 0);
				loadImages(queue.getResult("ice"), "ice", 205, 168, "", 0);
				loadImages(queue.getResult("solution_line"), "solution_line", 205, 360, "", 0);
				loadImages(queue.getResult("stand"), "stand", 36, 34, "", 0);
				loadImages(queue.getResult("greenbutton"), "greenbutton", 644, 553, "", 0);
				loadImages(queue.getResult("redbutton"), "redbutton", 625, 553, "", 0);				
				
				/** Add rect for masking the images*/
				maskRectangle.name = "mask_rectangle";
				maskRectangle.graphics.beginFill("red").drawRect(195, 362, 60, 200);
				maskRectangle.alpha = 0;				
				/** Text box loading */
				setText("stopWatchValHr", 542, 535, "00", "black", 1.3);
				setText("stopWatchValMin", 583, 535, "00", "black", 1.3);
				setText("stopWatchValSec", 623, 535, "00", "black", 1.3);
				setText("watchStartStop", 555, 566, "", "black", 1);
				setText("thermomterTxt", 371, 450, "218.0℃", "black", 1.3);
				initialisationOfVariables(); /** Initializing the variables */
				initialisationOfImages(); /** Function call for images used in the apparatus visibility */
				translationLabels(); /** Translation of strings using gettext */
				makeGraph(); /** Graph plotting function */
			}
			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */
			function translationLabels() {/**labels used in the experiment initialize here*/
				/** This help array shows the hints for this experiment */
				helpArray = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("Next"), _("Close")];
				scope.heading = _("phase change");
				scope.variables = _("Variables");
				scope.select_substance = _("Select substance");
				scope.mass_label = _("Mass of Substance");
				scope.mass_unit = _("g");
				scope.temp_label = _("Surrounding Temperature");
				scope.start_exp = _("Start Experiment");
				scope.show_result = _("Show Result");
				scope.transition_time = _("Transition time");
				scope.Substance = "naphthalene";
				scope.result = _("Result");
				scope.copyright = _("copyright");
				scope.naphthalene = _("Naphthalene");
				scope.melting_pt = _("Melting Point");
				/** The substance array contains the materials which is used for the experiment */
				scope.substanceArray = [{
					substance: _('Naphthalene'),
					type: 'naphthalene'
				}, {
					substance: _('Ice'),
					type: 'ice'
				}, {
					substance: _('Wax'),
					type: 'wax'
				}];
				scope.$apply();
			}
		}
	}
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
	phase_change_stage.update();
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize) {
	var text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
	text.x = textX;
	text.y = textY;
	text.textBaseline = "alphabetic";
	text.name = name;
	text.text = value;
	text.color = color;
	phase_change_stage.addChild(text); /** Adding text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot) {
	var bitmap = new createjs.Bitmap(image).set({});
	bitmap.x = xPos;
	bitmap.y = yPos;
	bitmap.name = name;
	bitmap.alpha = 1;
	bitmap.rotation = rot;
	bitmap.cursor = cursor;
	if (name == "solution" || name == "wax" || name == "ice") {
		/**mask the solution image inside the testtube*/
		bitmap.mask = maskRectangle;
		phase_change_stage.addChild(maskRectangle);
	}
	phase_change_stage.addChild(bitmap); /** Adding bitmap to the stage */
}

/** All variables initialising in this function */
function initialisationOfVariables() {
	/**default value is set as initial, initial material is considered ad Naphthalene*/
	specific_heat_capacity = 1.72;
	density = 1140;
	latent_heat = 151;
	melting_point = 80.26;
	mass_testtube = 0.0228137;
	specific_heat_glass = 670;
	heat_transfer_coeff_glass = 45;
	thermal_conduct_glas = 0.045;
	thickness_tube = 0.001;
	substance_mass = 10;
	surround_temp = 0;
	temperature_float = 0;
	time_sec = 0;
 	sec_in_min = 0;
 	soln_alpha = 0.1;
	ice_alpha = 0;
 	one_sec_min = 0.016667;
 	wax_alpha = 0;
 	seconds = 0;
	minute = 0;
 	hour = 0;
	subst_height = 0;
	area = 0;
 	k_const = 0;
 	max_temp = 218;
 	trans_temp = 218;
	transition_time = 0.109645704;
 	trans_time_sec = 6.57874224;
 	transition_delay = 0;
 	sec_for_graph = 0;
 	steadytime = 0;
 	min_for_graph = 0;
	poweron_flag = false;
	material = "naphthalene";
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
	phase_change_stage.getChildByName("wax").alpha = 0;
	phase_change_stage.getChildByName("ice").alpha = 0;
	phase_change_stage.getChildByName("solution").alpha = 0.1;/**initial solution*/
	phase_change_stage.getChildByName("watchStartStop").text = _("START");
	phase_change_stage.getChildByName("greenbutton").alpha = 0.5;
}

/** mass slider function */
function massSliderFN(scope) {
	substance_mass = scope.Mass;
	/** Adjusting the y value of masking rectangle and the solution top line for making a feel of increase in solution in the test tube*/
	var _rect_y_move = 10 - (substance_mass * 2); 
	var _sol_line_y_move = 370 - (substance_mass * 2); 
	maskRectangle.y = _rect_y_move;
	phase_change_stage.getChildByName("solution_line").y = _sol_line_y_move;
}

/** Select the surrounding temperature*/
function temperatureSliderFN(scope) {
	surround_temp = temperature_float;
	scope.temperature = temperature_float + "℃";
}

/** Click event of power on button, experiment starts here */
function startExperiment(scope) {
	if (!poweron_flag) {
		/**disable rest of the controls used in the experiment*/
		scope.start_exp = _("Reset");
		scope.result_disable = false;
		poweron_flag = true;
		scope.controls_disable = true; 
		phase_change_stage.getChildByName("greenbutton").alpha = 1;
		phase_change_stage.getChildByName("redbutton").alpha = 0.5;
		phase_change_stage.getChildByName("watchStartStop").text = _("STOP");
		/**the reaction will starts in the timer*/
		timer = setInterval(function() {
			startReaction(scope);
		}, 200);		
	} else {
		/**reset the experiment*/
		window.location.reload();
	}
}

/** check box function for show or hide the result */
function showresultFN(scope) {
	if (scope.resultValue == true) {
		scope.hide_show_result = false;
	} else {
		scope.hide_show_result = true;
	}
}

/** Draws a chart in canvas js for making graph plotting */
function makeGraph() {
	chart = new CanvasJS.Chart("graphDiv", {
		axisX: {
			title: _("time (in min)"),
			titleFontSize: 15,
		},
		axisY: {
			title: _("temperature"),
			titleFontSize: 15,
			minimum: -50,
			maximum: 250,
			interval: 50
		},
		data: [{
			color: "red",
			type: "line",
			markerType: "none",
			lineThickness: 5,
			dataPoints: dataplotArray   /**array contains the data*/
		}]
	});
	chart.render();  /**rendering the graph*/
}

/**reaction starts depend up on the selected material*/
function startReaction(scope) {
	calculation(scope);//calculation of T(t).
	setSecond();//timer interval
	switch (material) {
		case "naphthalene":
			soldifyNaphtalene();//if selected material is naphthalene
			break;
		case "ice":
			soldifyIce();// material is ice 
			break;
		case "wax":
			soldifyWax();// material is wax 
			break;
	}
}

/** Soldify naphtalene when material naphtalene is selected, alpha of the material increase in an interval */
function soldifyNaphtalene() {
	soln_alpha = soln_alpha + (time_sec * 0.00007)
	phase_change_stage.getChildByName("solution").alpha = soln_alpha;
}

/** Soldify wax when material wax is selected */
function soldifyWax() {
	wax_alpha = wax_alpha + (time_sec * 0.00007);
	phase_change_stage.getChildByName("wax").alpha = wax_alpha;
}

/** Soldify ice when material ice is selected */
function soldifyIce() {
	if(trans_temp<=5){
	ice_alpha = ice_alpha + (time_sec * 0.00003);
	phase_change_stage.getChildByName("ice").alpha = ice_alpha;
	}
}
/** function to calculate and display seconds in the timer*/
function setSecond() { 
	if (seconds < 59) {
		seconds++;
	} else {
		seconds = 0;
		setMinute();// find minutes
	}
	phase_change_stage.getChildByName("stopWatchValSec").text = seconds < 10 ? '0' + seconds : seconds;
}

/** function to calculate and display minutes in the timer*/
function setMinute() { 
	if (minute < 59) {
		minute++;
	} else {
		minute = 0;
		setHour();// find hour
	}
	phase_change_stage.getChildByName("stopWatchValMin").text = minute < 10 ? '0' + minute : minute;
}

/** function to calculate and display hours in the timer*/
function setHour() { 
	hour++;
	phase_change_stage.getChildByName("stopWatchValHr").text = minute < 10 ? '0' + hour : hour;
}

/**calculation starts here*/
function calculation(scope) {
	sec_for_graph++;//seconds
	/**1 sec= 1 *0.016667 minutes*/
	min_for_graph = sec_for_graph * one_sec_min;
	/**h=(m2/ρ-4.0885*10^-6)*2038.2165, where m2 is the substance mass, ρ - density*/
	subst_height = (substance_mass / density - 4.0885 * Math.pow(10, -6)) * 2038.2165;
	/**A=9.8125*10^-4+0.0785*h, where A is the area, h is the substance height*/
	area = 9.8125 * Math.pow(10, -4) + 0.0785 * subst_height;
	/**k=45*A/(15.2853+m2C2), where k is the constant, A is the area, m2 is the mass and C2 is the specific heat capacity of the material*/
	k_const = 45 * area / (15.2853 + (substance_mass * substance_mass * specific_heat_capacity));	
	/**transition time=(m2*L*∆x)/(K*A*(Ta-Th)), Where m2 - mass, L - latent heat, ∆x -Thickness of tube, K-thermal conductyvity of glass, Ta is the surrounding temperature and Th is the maximum temperature of the material*/
	transition_time = (substance_mass * latent_heat * thickness_tube) / (thermal_conduct_glas * area * (Math.abs(surround_temp - max_temp)));
	scope.transValue = transition_time.toFixed(4) + " min";
	scope.meltVal = melting_point + " ℃";//result diaplay
	/*change the transition time in terms of seconds*/
	trans_time_sec = transition_time * 60
	/**transition temperature will find for wach second, new transition temperature will find till it reaches the melting point of the material. Plot the graph using the sec and the transition temperature*/
	if (trans_temp >= melting_point) {
		time_sec++;
		sec_in_min = time_sec * one_sec_min;
		trans_temp = surround_temp + (max_temp - surround_temp) * Math.exp(-1 * k_const * sec_in_min);
		plotGraph(sec_in_min,trans_temp);//graph plot for first curve
	} else {
		/**when it reaches the melting point stop calculation the transition temperature and it will move steady till the transiton time*/
		transition_delay++;
		if (transition_delay <= trans_time_sec) {
			steadytime = sec_in_min + (transition_delay / 60);
			plotGraph(steadytime,trans_temp);	//graph plot for steady temperature		
		} else {
			transition_delay=max_temp;
			/**after passing the transition time again temperature will decreases and graph will plot*/
			time_sec++;
			sec_in_min = (time_sec * one_sec_min);
			trans_temp = surround_temp + (max_temp - surround_temp) * Math.exp(-1 * k_const * sec_in_min);
			if(trans_temp.toFixed(1)==surround_temp.toFixed(1)){
				/**transition time reaches the surrounding temperature*/
				clearInterval(timer);
				}else{
			plotGraph(min_for_graph,trans_temp);//graph plot for second curve			
			}
		}
	}
	phase_change_stage.getChildByName("thermomterTxt").text = trans_temp.toFixed(1) + "℃";
	
}

/**graph drawing*/
function plotGraph(xAxis,yAxis) {
	dataplotArray.push({
		x: (xAxis), //x time in minute
		y: (yAxis) // y transition temperatue in degree
	});
	chart.render(); //rendering the canvasjs chart
}
/**calculation ends here*/