(function() {
 angular.module('users')
 .directive("experiment", directiveFunction);
})();

var thermistor_stage, poweron_btn_var, poweroff_btn_var;

var voltage_float, temperature_float, beta_value, alpha_value, R0_value, current_ma;

var temperature_difference, temp_beeta_value, resistance_value, max_voltage;

var bubble_count, line_flag, poweron_flag, line, wire_numbers, temp_disp;

var tick, temp_timer, bubble_timer; /** Tick timer for stage updation */

var voltage_increase = false;

var thermistor_array = dataplot_array = help_array  = []; /** Plots graph */

/** Specific maximum values of sliders temperature and voltage of each thermistor */
var temp_slider_max = {
	Thermistor1: 100,
	Thermistor2: 150,
	Thermistor3: 100,
	Thermistor4: 100
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
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);			
			queue.on("complete", handleComplete, this);			
			queue.loadManifest([{ /** Preloading the images */
				id: "background",
				src: "././images/background.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "other_objects",
				src: "././images/other_objects.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "beaker_top",
				src: "././images/beaker_top.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "water_rise",
				src: "././images/water_rise.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "battery_to_testtube",
				src: "././images/battery_to_testtube.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "thermo_to_testtube",
				src: "././images/thermo_to_testtube.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "voltmeter_to_battery_back",
				src: "././images/voltmeter_to_battery_back.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "voltmeter_to_battery",
				src: "././images/voltmeter_to_battery_front.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "voltmeter_to_testtube",
				src: "././images/voltmeter_to_testtube.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "switch_on",
				src: "././images/switch_on.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "switch_off",
				src: "././images/switch_off.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "light_on",
				src: "././images/light_on.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "light_off",
				src: "././images/light_off.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "battery_arrow",
				src: "././images/battery_arrow.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "circuit_diagram",
				src: "././images/circuit_diagram_zoom.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "bubble1",
				src: "././images/bubble1.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "bubble2",
				src: "././images/bubble2.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "bubble3",
				src: "././images/bubble3.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "bubble4",
				src: "././images/bubble4.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "bubble5",
				src: "././images/bubble5.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "flame1",
				src: "././images/flame1.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "flame2",
				src: "././images/flame2.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "flame3",
				src: "././images/flame3.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "flame4",
				src: "././images/flame4.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "flame5",
				src: "././images/flame5.svg",
				type: createjs.LoadQueue.IMAGE
			}]);
			thermistor_stage = new createjs.Stage("demoCanvas");
			thermistor_stage.enableDOMEvents(true);
			thermistor_stage.enableMouseOver();
			createjs.Touch.enable(thermistor_stage);

			tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
			line = new createjs.Shape(); /** Line is created for connect the wires */

			function handleComplete() {
				loadImages(queue.getResult("background"), "background", -15, -10, "", 0);
				loadImages(queue.getResult("voltmeter_to_battery_back"), "voltmeter_to_battery_back", 38, 332, "", 0);
				loadImages(queue.getResult("other_objects"), "other_objects", -10, 50, "", 0);
				loadImages(queue.getResult("water_rise"), "water_rise", 299, 315, "", 0);
				loadImages(queue.getResult("battery_to_testtube"), "battery_to_testtube", 73, 183, "", 0);
				loadImages(queue.getResult("thermo_to_testtube"), "thermo_to_testtube", 352, 50, "", 0);
				loadImages(queue.getResult("voltmeter_to_battery"),"voltmeter_to_battery", 34, 341, "",0);
				loadImages(queue.getResult("voltmeter_to_testtube"), "voltmeter_to_testtube", 343, 189, "", 0);
				loadImages(queue.getResult("switch_on"), "switch_on", 109, 386, "pointer", 0);
				loadImages(queue.getResult("switch_off"), "switch_off", 109, 386, "pointer", 0);
				loadImages(queue.getResult("light_on"), "light_on", 145, 385, "", 0);
				loadImages(queue.getResult("light_off"), "light_off", 145, 385, "", 0);
				loadImages(queue.getResult("battery_arrow"), "battery_downarrow", 138, 377, "pointer", 0);
				loadImages(queue.getResult("battery_arrow"), "battery_uparrow", 162, 378, "pointer", 90);				
				loadImages(queue.getResult("bubble1"), "bubble1", 300, 335, "", 0);
				loadImages(queue.getResult("bubble2"), "bubble2", 300, 335, "", 0);
				loadImages(queue.getResult("bubble3"), "bubble3", 300, 335, "", 0);
				loadImages(queue.getResult("bubble4"), "bubble4", 300, 335, "", 0);
				loadImages(queue.getResult("bubble5"), "bubble5", 300, 335, "", 0);
				loadImages(queue.getResult("beaker_top"), "beaker_top", 291, 300, "", 0);
				loadImages(queue.getResult("flame1"), "flame1", 341, 419, "", 0);
				loadImages(queue.getResult("flame2"), "flame2", 341, 419, "", 0);
				loadImages(queue.getResult("flame3"), "flame3", 341, 419, "", 0);
				loadImages(queue.getResult("flame4"), "flame4", 341, 419, "", 0);
				loadImages(queue.getResult("flame5"), "flame5", 341, 419, "", 0);
				/** Text box loading */
				setText("voltmeterTxt", 571, 350, "0.0", "black", 1.4);
				setText("batteryTxt", 72, 372, "0.10", "black", 1.1);
				setText("batterySymbol", 116, 372, "V", "black", 0.8);
				setText("thermistorTxt", 468, 430, "150℃", "black", 1.1);
				loadImages(queue.getResult("circuit_diagram"), "circuit_diagram", -30, -20, "", 0);
				initialisationOfVariables(); /** Initializing the variables */
				initialisationOfImages(); /** Function call for images used in the apparatus visibility */
				translationLabels(); /** Translation of strings using gettext */
				dataplot_array.push({x: (0),y: (0)});
				makeGraph(); /** Graph plotting function */						
				thermistor_stage.getChildByName("battery_downarrow").on("click", function() { /** Battery down arrow click event */
					voltage_increase = false;					
					voltageChange(scope); /** Decreasing the voltage while clicking down arrow */
				});
				thermistor_stage.getChildByName("battery_uparrow").on("click", function() { /** Battery up arrow click event */
					voltage_increase = true;
					voltageChange(scope); /** Increasing the voltage while clicking up arrow */
				});
				thermistor_stage.getChildByName("switch_off").on("click", function() { /** Battery switch on */
					startExperiment(scope); /** Start experiment function */
					scope.$apply();
				});
				thermistor_stage.getChildByName("switch_on").on("click", function() { /** Battery switch off */
					startExperiment(scope); /** Start experiment function */
					scope.$apply();
				});
			}

			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */
			function translationLabels() {
				/** This help array shows the hints for this experiment */
				help_array  = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("Next"), _("Close")];
				scope.heading = _("Characteristics of Thermistor");
				scope.variables = _("Variables");
				scope.choose_thermistor = _("Choose Thermistor:");
				scope.temperature_label = _("Temperature");
				scope.voltage_label = _("Voltage");
				scope.show_circuit_dia = _("Show Circuit Diagram");
				scope.show_graph = _("Show Graph");
				poweron_btn_var = _("Power On");
				poweroff_btn_var = _("Power Off");
				scope.power_on = poweron_btn_var;
				scope.reset = _("Reset");
				scope.alpha_label = _("alpha, α = ");
				scope.Thermistor = "Thermistor1";
				scope.result = _("Result");
				scope.copyright = _("copyright");
				scope.thermistor1 = _("Thermistor 1");
				/** The thermistor array contains the values and type of the dropdown */
				scope.thermistor_array = [{
					thermistor: _('Thermistor 1'),
					type: 'Thermistor1'
				}, {
					thermistor: _('Thermistor 2'),
					type: 'Thermistor2'
				}, {
					thermistor: _('Thermistor 3'),
					type: 'Thermistor3'
				}, {
					thermistor: _('Thermistor 4'),
					type: 'Thermistor4'
				}];
				createCircleForConnection(scope); /** Ready for wire connection */
				scope.$apply();
			}
		}
	}
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
	thermistor_stage.update();
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
	thermistor_stage.addChild(text); /** Adding text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot) {
	var _bitmap = new createjs.Bitmap(image).set({});
	_bitmap.x = xPos;
	_bitmap.y = yPos;
	_bitmap.name = name;
	_bitmap.alpha = 1;
	_bitmap.rotation = rot;
	_bitmap.cursor = cursor;
	thermistor_stage.addChild(_bitmap); /** Adding bitmap to the stage */
}

/** All variables initialising in this function */
function initialisationOfVariables() {
	voltage_float = 0.1;
	temperature_float = temp_disp = 25;
	alpha_value = -0.032994; /** Initial alpha for the termistor 1 */
	beta_value = 2930; /** Initial beta for the termistor 1 */
	R0_value = resistance_value = 100; /** Initial resistance for the termistor 1 */
	temperature_difference = bubble_count = wire_numbers = temp_beeta_value = 0;
	max_voltage = 0.4;
	current_ma = 1;
	voltage_float = 0.1;
	line_flag = false; /** Draw line flag for connect wires */
	poweron_flag = false;
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
	thermistor_stage.getChildByName("battery_to_testtube").visible = false;
	thermistor_stage.getChildByName("thermo_to_testtube").visible = false;
	thermistor_stage.getChildByName("voltmeter_to_battery_back").visible = false;
	thermistor_stage.getChildByName("voltmeter_to_battery").visible = false;
	thermistor_stage.getChildByName("voltmeter_to_testtube").visible = false;
	thermistor_stage.getChildByName("circuit_diagram").visible = false;
	for ( var i = 1; i <= 5; i++ ) { /** Initially animation frames are not displayed */
		thermistor_stage.getChildByName("bubble" + i).visible = false;
		thermistor_stage.getChildByName("flame" + i).visible = false;
	}
	circleDeclaration(); /** Circle declaration for connect the wires is created in this function */
}

/** Circle declarations for connect the wires is created in this function */
function circleDeclaration() {
	battery_circle1 = new createjs.Shape();
	battery_circle2 = new createjs.Shape();
	testtube_circle1 = new createjs.Shape();
	testtube_circle2 = new createjs.Shape();
	testtube_screwdriver_circle = new createjs.Shape();
	thermistor_circle = new createjs.Shape();
	voltmeter_circle1 = new createjs.Shape();
	voltmeter_circle2 = new createjs.Shape();
}

/** Create circle functions */
function createCircleForConnection(scope) {
	drawShapeArc(battery_circle1, "battery_circle1", 65, 398, "red", 25, scope);
	drawShapeArc(battery_circle2, "battery_circle2", 85, 398, "red", 25, scope);
	drawShapeArc(testtube_circle1, "testtube_circle1", 342, 208, "red", 25, scope);
	drawShapeArc(testtube_circle2, "testtube_circle2", 350, 208, "black", 25, scope);
	drawShapeArc(testtube_screwdriver_circle, "testtube_screwdriver_circle", 355, 70, "#6560A8", 25, scope);
	drawShapeArc(thermistor_circle, "thermistor_circle", 472, 360, "#6560A8", 25, scope);
	drawShapeArc(voltmeter_circle1, "voltmeter_circle1", 575, 375, "black", 25, scope);
	drawShapeArc(voltmeter_circle2, "voltmeter_circle2", 640, 375, "red", 25, scope);
}

/** Create circle shape here */
function drawShapeArc(shapeName, name, xPos, yPos, color, radius, scope) {
	thermistor_stage.addChild(shapeName);
	shapeName.name = name;
	shapeName.cursor = "pointer";
	shapeName.alpha = 0.01;
	initialX = xPos;
	initialY = yPos;
	shapeName.graphics.setStrokeStyle(2);
	shapeName.graphics.beginFill(color).drawCircle(0, 0, 15);
	shapeName.x = xPos;
	shapeName.y = yPos;
	shapeName.on("mousedown", function(evt) {
		this.parent.addChild(this);
		this.offset = {
			x: this.x - evt.stageX / thermistor_stage.scaleX,
			y: this.y - evt.stageY / thermistor_stage.scaleY
		};
	});
	shapeName.on("pressmove", function(evt) {
		this.x = (evt.stageX / thermistor_stage.scaleX) + this.offset.x;
		this.y = (evt.stageY / thermistor_stage.scaleY) + this.offset.y;
		shapeName.x = this.x;
		shapeName.y = this.y;
		line.graphics.clear();
		if (line_flag == false) {
			line.graphics.moveTo(xPos, yPos).setStrokeStyle(3).beginStroke(color).lineTo(this.x, this.y);
			thermistor_stage.addChild(line);
		}
		shapeName.on("pressup", function(evt) {
			line.graphics.clear();
			shapeName.x = xPos;
			shapeName.y = yPos;
			line.graphics.clear();
			if (line_flag) wire_numbers++;
			checkConnectionComplete(scope); /** Check the connection complete or not */
			line_flag = false; /** Set line flag as false */
		});
		shapeName.on("mouseup", function(evt) {
			shapeName.alpha = 0.5;
			shapeName.x = xPos;
			shapeName.y = yPos;
			line.graphics.clear();
			line_flag = false;
			line.graphics.clear();
		});
		checkHitLead(name,shapeName.x,shapeName.y); /** Check hit occur in lead with wires */
	});
}

/** Lead hit with wires */
function checkHitLead(name,xPos, yPos) {
	switch ( name ) { /** Hit check with one spot to other */
		case "voltmeter_circle2":
			checkHit(thermistor_stage.getChildByName("battery_circle1"), "voltmeter_to_battery", name, xPos, yPos);
			break;
		case "battery_circle1":
			checkHit(thermistor_stage.getChildByName("voltmeter_circle2"), "voltmeter_to_battery", name, xPos, yPos);
			break;
		case "battery_circle2":
			checkHit(thermistor_stage.getChildByName("testtube_circle1"), "battery_to_testtube", name, xPos, yPos);
			break;
		case "testtube_circle1":
			checkHit(thermistor_stage.getChildByName("battery_circle2"), "battery_to_testtube", name, xPos, yPos);
			break;
		case "voltmeter_circle1":
			checkHit(thermistor_stage.getChildByName("testtube_circle2"), "voltmeter_to_testtube", name, xPos, yPos);
			break;
		case "testtube_circle2":
			checkHit(thermistor_stage.getChildByName("voltmeter_circle1"), "voltmeter_to_testtube", name, xPos, yPos);
			break;
		case "thermistor_circle":
			checkHit(thermistor_stage.getChildByName("testtube_screwdriver_circle"), "thermo_to_testtube", name, xPos, yPos);
			break;
		case "testtube_screwdriver_circle":
			checkHit(thermistor_stage.getChildByName("thermistor_circle"), "thermo_to_testtube", name, xPos, yPos);
			break;
	}
}

/** Hit check function */
function checkHit(spot, wire, name, xPos, yPos) {
	spot.alpha = 0.8; /** Shows the destination point */
	var ptL = spot.globalToLocal(xPos, yPos);
	if ( spot.hitTest(ptL.x, ptL.y) ) {
		line_flag = true;
		line.graphics.clear();
		thermistor_stage.removeChild(line);
		thermistor_stage.getChildByName(wire).visible = true;
		spot.alpha = 0.01;
		spot.mouseEnabled = false;
		if ( wire == "voltmeter_to_battery" ) { /** Battery to voltmeter wire have two parts, if front part is displayed */
			thermistor_stage.getChildByName("voltmeter_to_battery_back").visible = true;
		}
		thermistor_stage.getChildByName(name).mouseEnabled = false;
	} else {
		releaseHit(spot, name); /** Spot invisible after sucessfull connection */
	}
}

/** Function for releasing the drag for hit */
function releaseHit(spot, name) {
	thermistor_stage.getChildByName(name).on("pressup", function(evt) {
		spot.alpha = 0.01; /** Invisible the shape on release hit */
	});
}

/** Check the connection complete or not */
function checkConnectionComplete(scope) {
	if ( wire_numbers == 4 ) {
		scope.controls_disable_powerOn=false; /** Enables all controls */
		scope.$apply();
	}
}

/** Drop down list change function */
function thermistorSelection(scope) {
	scope.maxTemp = temp_slider_max[scope.Thermistor]; /** Temperature slider maximum value getting from an array variable */	
	currentCalculation(); /** Current calculation function */
}

/** Change the voltage on the knob press on the battery */
function voltageChange(scope) {
	if ( poweron_flag ) {
		if ( wire_numbers == 4 ) {
			if ( voltage_increase ) {
				if ( voltage_float < max_voltage ) {
					voltage_float = voltage_float + 0.1;
				}
			} else {
				if ( voltage_float > 0.2 ) {
					voltage_float = voltage_float - 0.1;
				}
			}
			thermistor_stage.getChildByName("batteryTxt").text = voltage_float.toFixed(2);
			scope.Voltage = scope.voltage = voltage_float.toFixed(2);
			scope.$apply();
			clearInterval(temp_timer);
			temp_timer = setInterval(setTemperature, 50);
		}
	}
}

/** Temperature slider function */
function temperatureSliderFN(scope) {
	dataplot_array.length = 0
	temp_disp = 25;
	clearInterval(temp_timer);
	temperature_float = scope.Temperature;
	scope.temperature = scope.Temperature + " (℃)";
	temp_timer = setInterval(setTemperature, 50); /** Change the temperature in the thermometer on an interval */
}

/** Plotting the graph with 1/T-1/T0 in the x axis and β (1/T-1/T0) in the Y axis */
function plotGraph() {
	dataplot_array.push({
		x: (temperature_difference), /** x axis (1/T-1/T0) */
		y: (temp_beeta_value) /** y axis β (1/T-1/T0) */
	});
	chart.render(); /** Rendering the canvasjs chart */
}

/** Change the temperature in the thermometer */
function setTemperature() {
	currentCalculation(); /** Calculating the current depend upon the change in temperature and voltage */
	if ( temp_disp < temperature_float ) {
		temp_disp++;
	} else if ( temp_disp > temperature_float ) {
		temp_disp--;
	} else if ( temp_disp == temperature_float ) {
		clearInterval(temp_timer);
	}
	plotGraph();
}

/** Function for blow bubble and flame */
function blowBubble() {
	if ( bubble_count < 5 ) {
		bubble_count++;
	} else {
		bubble_count = 1;
	}
	for ( var i = 1; i <= 5; i = i + 1 ) {	
		if ( i == bubble_count ) {
			if ( temperature_float >= 40 ) { /** Bubble appear when temperature increase to 40 degree */
				thermistor_stage.getChildByName("bubble" + i).visible = true;
			}
			thermistor_stage.getChildByName("flame" + i).visible = true;
		} else {
			thermistor_stage.getChildByName("bubble" + i).visible = false;
			thermistor_stage.getChildByName("flame" + i).visible = false;
		}
	}
}

/** Voltage slider change event */
function voltageSliderFN(scope) {	
	clearInterval(temp_timer);
	voltage_float = scope.Voltage; /** Voltage will display on the battery and current can br calculated by I = V/R */
	scope.voltage = voltage_float + " V";
	var current = (voltage_float / resistance_value);
	current_ma = (current * 1000);
	thermistor_stage.getChildByName("batteryTxt").text = voltage_float.toFixed(2);
	temp_timer = setInterval(setTemperature, 50);
}

/** Click event of power on button, experiment starts here */
function startExperiment(scope) {
	if ( wire_numbers == 4 ) { /** If the wire number reaches 4. connections complete. */
		if ( !poweron_flag ) {
			scope.power_on = poweroff_btn_var;
			scope.controls_disable_temp=false;
			scope.thermistor_disable = true; /** Disable choose thermistor dropdown after power on the switch */
			scope.result_disable = false;
			scope.control_disable = false;			
			thermistor_stage.getChildByName("batteryTxt").text = voltage_float.toFixed(2);
			thermistor_stage.getChildByName("switch_off").visible = false;
			thermistor_stage.getChildByName("light_off").visible = false;
			poweron_flag = true;	
			bubble_timer = setInterval(blowBubble, 100); /** Bubble animation function in a timer */
		} else {
			clearInterval(bubble_timer);
			for ( var i = 1; i <= 5; i++ ) {
				thermistor_stage.getChildByName("bubble" + i).visible = false;
				thermistor_stage.getChildByName("flame" + i).visible = false;
			}
			scope.power_on = poweron_btn_var;
			scope.controls_disable_temp=true;
			scope.thermistor_disable = false; /** Enable choose thermistor dropdown after power off the switch */
			thermistor_stage.getChildByName("thermistorTxt").text = "25℃";
			thermistor_stage.getChildByName("voltmeterTxt").text = "0.0";
			thermistor_stage.getChildByName("batteryTxt").text = "0.10";
			thermistor_stage.getChildByName("switch_off").visible = true;
			thermistor_stage.getChildByName("light_off").visible = true;
			poweron_flag = false;
		}
		currentCalculation(); /** Current calculation function */
	}
}

/** Draws a chart in canvas js for making graph plotting */
function makeGraph() {
	chart = new CanvasJS.Chart("graphDiv", {
		axisX: {
			title: ("1/T - 1/T\u2080"), /** x axis label */
			titleFontSize: 18, /** Chart font size */
			labelFontSize: 18,
			minimum: -0.0007,
			maximum: 0,
			interval: 0.0001
		},
		axisY: {
			title: ("logR-logR\u2080"),
			titleFontSize: 18,
			labelFontSize: 18,
			minimum: -4,
			maximum: 0,
			interval: 0.2
		},
		showInLegend: false,
		data: [{
			color: "red",
			type: "line",
			lineThickness: 3,
			markerType: "none",
			dataPoints: dataplot_array /** Datapoints to be plot stored in the array */
		}]
	});	
}

/** Resetting the experiment */
function reset() {
	window.location.reload();
}

/** Calculations starts here.. Finding current, from temperature and voltage */
function currentCalculation() {
	/** Convert temperature to kelvin 1 ℃ =273 K */
	var temperature_kelvin = temp_disp + 273;
	/** Finding the square of temperature */
	var temperature_sqr = Math.pow(temperature_kelvin, 2);
	/** Finding 1/T-1/T0 for X axis of the graph, where 
	'T' is the selected temperature and 'T0' is the initial temperature */
	temperature_difference = (1 / temperature_kelvin - 1 / 298); /** (1/T-1/T0) */
	/** β=-αT^2, where α is the alpha value of the selected thermistor, T^2 is the square of the temperature */
	var beeta = (-1) * alpha_value * temperature_sqr; /** β=-αT2 */
	/** β (1/T-1/T0), for Y axis of the graph, where β is the beta coefficient */
	temp_beeta_value = (beeta * temperature_difference); /** β (1/T-1/T0) */
	/** resistance R=R0exp(β(1/T-1/T0)), where R0 is a constant for each thertmistor and exponantial of β(1/T-1/T0) */
	resistance_value = R0_value * Math.exp(temp_beeta_value); /** R=R0exp(β(1/T-1/T0)) */
	/** Calculate the current I= V/R */
	var current = (voltage_float / resistance_value);
	/** Convert the current into milli Ampere */
	current_ma = (current * 1000);
	if (poweron_flag) { /** Ammeter reading change when power on. */
		thermistor_stage.getChildByName("voltmeterTxt").text = current_ma.toFixed(1);
	}
	thermistor_stage.getChildByName("thermistorTxt").text = temp_disp+"℃";
}
/** Calculation ends here */