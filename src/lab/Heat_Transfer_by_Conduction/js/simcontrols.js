/** js file for define the functions.
 *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
 *VALUE (Virtual Amrita Laboratories Universalizing Education)
 *Amrita University, India
 *http://www.amrita.edu/create
 *author:Anitha;
 *Date of modified: 24-07-2015
 */
/** Variable declaration */

var conduction_stage, exp_canvas, stage_width, stage_height, mh_angle_float, gh_angle_float, ammeter_reading_int, voltmeter_reading_int;

var mh_voltage_int, gh_voltage_int, diameter_val_float, thickness_val_float, temperature_val, random_number, thermal_conductivity;

var indicator_rotation_count, indicator_text_count, power_on_flag, indicator_timer_count, max_sec, temperature_minimum;

var indicator_temp_1, indicator_temp_2, indicator_temp_3, indicator_temp_4, indicator_temp_5;

var indicator_temp_6, indicator_temp_7, indicator_temp_8, tick, timer_check, power_btn_var, reset_btn_var, delta_temperature;

var diameter_label, thickness_label, temperature_label, temperature_value_1, temperature_value_2, temperature_value_3;

var temperature_value_4, temperature_value_5, temperature_value_6, temperature_value_7, temperature_value_8, current_new;

var anim_frame, anim_width, anim_object_top, anim_object_bottom, selectedMaterial; /** Variables for animation */

var gt; /** Object for Gettext.js */

var progressText = new createjs.Text("", "2em Tahoma, Geneva, sans-serif", "#000000");

var materialArray = current_array_1 = current_array_2 = current_new_array = materialArrayTranslate = [];

var mask_rect_anim = new createjs.Shape(); /** Add rectangle shape for water animation masking */

/**thermal conductivity of given materials are declared*/
var thermalConductivity = {
	Cardboard: 0.21,
	Glass: 1.1,
	Mica: 0.71,
	Asbestoscementboard: 0.744,
	Ebonitesolid: 0.17
};

/** Variable declaration ends */

/** Start controls for Heat transfer by conduction */
$(document).ready(function() {
	gt = new Gettext({
		'domain': 'messages'
	});
	materialArray = [_("Cardboard"), _("Glass"), _("Mica"), _("Asbestos-cement board"), _("Ebonite solid")]; /** Items for the drop down */
	materialArrayTranslate = ["Cardboard", "Glass", "Mica", "Asbestoscementboard", "Ebonitesolid"]; /**items are added to the array for geeting translated value */
	$("#expName").html(_("Heat Transfer by Conduction")); /** Experiment name */
	exp_canvas = document.getElementById("experimentCanvas");
	exp_canvas.width = $("#canvasBox").width();
	exp_canvas.height = $("#canvasBox").width();
	stage_width = exp_canvas.width; /** Set stage width and height as canvas width and height */
	stage_height = exp_canvas.height;
	conduction_stage = new createjs.Stage(exp_canvas); /** Initialize createjs stage */
	createjs.Touch.enable(conduction_stage);
	conduction_stage.enableMouseOver(10); /** Enabled mouse over / out events */
	conduction_stage.mouseMoveOutside = true; /** Keep tracking the mouse even when it leaves the canvas */
	progressText.x = stage_width / 2.4 - progressText.getMeasuredWidth() / 2; /** Adding the Loading percentage text */
	progressText.y = stage_width / 2.4;
	conduction_stage.addChild(progressText); /** Add text to progress bar */
	queue = new createjs.LoadQueue(true); /** Initialize the queue */
	queue.on("progress", handleProgress); /** Loading progress bar */
	queue.on("complete", handleComplete, this);
	queue.loadManifest([{ /** Images into the queue */
		id: "backGround",
		src: simPath + "/images/exp_background.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "stopWatch",
		src: simPath + "/images/stopwatch.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "redButton",
		src: simPath + "/images/redbutton.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "greenButton",
		src: simPath + "/images/greenbutton.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "indicatorSelectorSwitch",
		src: simPath + "/images/indicator_switch.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "indicatorSelectorSwitchBase",
		src: simPath + "/images/indicator_switch_base.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "lightOn",
		src: simPath + "/images/light_on.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "needle",
		src: simPath + "/images/needles.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "GH_switch",
		src: simPath + "/images/GH_switch.svg",
		type: createjs.LoadQueue.IMAGE,
		cursor: "hand"
	}, {
		id: "MH_switch",
		src: simPath + "/images/MH_switch.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "off_button",
		src: simPath + "/images/off_button.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "on_button",
		src: simPath + "/images/on_button.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "rotate_bar",
		src: simPath + "/images/rotate_bar.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "rotate_arrow",
		src: simPath + "/images/rotate_arrow.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "indicatorArrow",
		src: simPath + "/images/indicator_arrow.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "cross_section",
		src: simPath + "/images/crosssection.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "wateranim",
		src: simPath + "/images/wateranimation.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "glasseffect",
		src: simPath + "/images/glass_effect.svg",
		type: createjs.LoadQueue.IMAGE
	}]);
	tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
});

/** Initialize gettext function. Translate the string can be done by adding _ before the text */
var _ = function(msgid) {
	return gt.gettext(msgid);
};

/** Createjs stage updation happens in every interval */
function updateTimer() {
	conduction_stage.update();
}

/** Function for display the progress of loading */
function handleProgress(event) {
	progressText.text = (queue.progress * 100 | 0) + " % Loaded";
}

/** All variables initialising in this function */
function initialisationOfVariables() {
	mh_voltage_flag = gh_voltage_flag = 0; /** MH and GH voltage flag */
	mh_angle_float = gh_angle_float = 0; /** For MH and GH rotation */
	ammeter_reading_int = 0; /** Ammeter and voltmeter reading */
	voltmeter_reading_int = 12;
	mh_voltage_int = gh_voltage_int = 0; /** MH and GH voltages */
	diameter_val_float = 0.1; /** Initial diameter,thickness and temperature */
	thickness_val_float = 0.005;
	temperature_val = 0;
	indicator_rotation_count = -20;
	indicator_text_count = 1;
	indicator_timer_count = 25; /** Indicator timer count for calculating the indicator timer value frequently */
	max_sec = 23.5; /** Maximum second for calculating the indicator timer value frequently */
	temperature_minimum = 27; /** Initial minimum temperature */
	indicator_temp_1 = indicator_temp_2 = indicator_temp_3 = 27; /** Set initial indicator temperature as 27 */
	indicator_temp_4 = indicator_temp_5 = indicator_temp_6 = indicator_temp_7 = indicator_temp_8 = 27;
	temperature_value_1 = temperature_value_2 = temperature_value_3 = temperature_value_4 = temperature_value_5 = temperature_value_6 = temperature_value_7 = temperature_value_8 = 0
	delta_temperature = current_new = 0;
	anim_frame = 0; /** Frame used for animation */
	power_on_flag = toggle_flag = false; /** Initialize toggle and power on flag */
	power_btn_var = _("Power on");
	reset_btn_var = _("Reset")
	/** Label of the power button '_' will translate the string using gettext */
	$("#poweronBtn").val(power_btn_var);
	/** Initialize the value for the slider text shown in the menu */
	$("#slider1").val(10);
	$("#diameter").html(diameter_label + 10 + _(" cm"));
	$("#slider2").val(0.5);
	$("#thickness").html(thickness_label + 0.5 + _(" cm"));
	$("#slider3").val(0);
	$("#temperature").html(temperature_label + 0 + " ℃");
	$("#result").css("display", "none");
	random_number = (Math.floor(Math.random() * (10))) / 100;
	current_array_1 = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7];
	current_array_2 = [0.28, 0.34, 0.38, 0.44, 0.48, 0.52, 0.58, 0.62, 0.66, 0.7, 0.74, 0.78, 0.82, 0.86, 0.92, 1];
}

/** Loading the images and initialize the html control events */
function handleComplete(event) {
	loadImagesTexts(); /** Images loading in the canvas from load_images_texts.js */
	initialisationOfVariables(); /** Initialize each variable with the initial value */
	addintoDropDown($('#dropdown'), materialArray); /** Adding elements in dropdown */
	controlsHandle(); /** All controls are handle by this function */
	initializeImages(); /** Function call for images used in the apparatus visibility */
	anim_object_top = conduction_stage.getChildByName("waterAnimationTop"); /** Top animation frames take as an object */
	anim_object_bottom = conduction_stage.getChildByName("waterAnimationBottom"); /** Bottom animation frames take as an object */
	/** MH and GH tuners can rotate when only the power button is off */
	if (power_on_flag == false) {
		/** MH tuner rotation. There is a tuner named MH, we can rotate the tuner. 
	    It will increase/decrease the MH voltage */
		mhRotation();
		/** GH tuner rotation. There is a tuner named GH, we can rotate the tuner. 
		It will increase/decrease the GH voltage */
		ghRotation();
	}
	conduction_stage.getChildByName("off_button").on("click", function() { /** Motor switch on functionality */
		startExperiment(); /** Start the experiment */
	});
	conduction_stage.getChildByName("on_button").on("click", function() { /** Motor switch off functionality */
		resetExperiment(); /** Reset the experiment */
	});

	conduction_stage.getChildByName("MH_switch").on("click", function() { /** Toggle switch turn to GH */
		resetExperiment(); /** Reset the experiment */
		conduction_stage.getChildByName("GH_switch").visible = true;
		conduction_stage.getChildByName("MH_switch").visible = false;
		toggle_flag = false; /** The flag set true when toggle switch to GH */
	});
	conduction_stage.getChildByName("GH_switch").on("click", function() { /** Toggle switch turn to MH */
		resetExperiment(); /** Reset the experiment */
		conduction_stage.getChildByName("MH_switch").visible = true;
		conduction_stage.getChildByName("GH_switch").visible = false;
		toggle_flag = true; /** The flag set false when toggle switch to MH */
	});
	conduction_stage.getChildByName("indicatorFwdArrow").on("click", function() { /** Indicator forward rotation */
		if ((indicator_text_count <= 7)) { /** Rotate the temperature indicator till the count reaches 7 */
			rotateTempIndicator(1, 32); /** Counter increment by 1 and angle rotate by 32 */
			indicatorReadingFn(); /** The reading value display function */
		}
	});
	conduction_stage.getChildByName("indicatorBkdArrow").on("click", function() { /** Indicator backward rotation */
		indicatorReadingFn(); /** The indicator reading value display function */
		if ((indicator_text_count > 1)) {
			rotateTempIndicator(-1, -32); /** Counter increment by 1 and angle rotate by 32 */
			indicatorReadingFn(); /** The reading value display function */
		}
	});
	/** Create a rectangle for masking the water animation */
	mask_rect_anim.graphics.beginStroke("").drawRect(stage_width / 1.53, stage_height / 1.68, stage_width / 3.96, stage_height / 5.04);
	conduction_stage.addChild(mask_rect_anim); /** Adding that rectangle to the stage */
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initializeImages() {
	/** Resetting the images to its initial status */
	conduction_stage.getChildByName("indicatorTimer").visible = false;
	conduction_stage.getChildByName("lightOn").visible = false;
	conduction_stage.getChildByName("MH_switch").visible = false;
	conduction_stage.getChildByName("voltmeterReading").visible = false;
	conduction_stage.getChildByName("ammeterReading").visible = false;
	conduction_stage.getChildByName("indicatorReading").visible = false;
	conduction_stage.getChildByName("on_button").visible = false;
	conduction_stage.getChildByName("cross_section").visible = false;
	conduction_stage.getChildByName("waterAnimationTop").visible = false;
	conduction_stage.getChildByName("waterAnimationBottom").visible = false;
	/** Alpha 1 of green means stop watch is running.Initial opacity as 0.5, 
	Alpha 1 of red means stopwatch not started .Initial opacity of red button set as 1 */
	conduction_stage.getChildByName("greenButton").alpha = 0.5;
	conduction_stage.getChildByName("redButton").alpha = 1;
	conduction_stage.getChildByName("watchStartStop").text = _("START");
	conduction_stage.getChildByName("indicatorSelectorSwitchBase").rotation = -20; /** Indicator base initial rotation */
}

/** All controls are handle by this function */
function controlsHandle() {
	/** Translate the stings used in the experiment by adding '_' before it.
	This is done for language translation. */
	$("#variables").html(_("Variables"));
	$("#measurements").html(_("Result"));
	$("#material").html(_("Choose material:")); /** All texts in control part for language translation */
	diameter_label = _("Diameter of material: ");
	thickness_label = _("Thickness of material: ");
	temperature_label = _("Cold water temperature: ");;
	$("#diameter").html(diameter_label + " " + 10 + _(" cm")); /** Set initial diameter value of slider as 10 */
	$("#thickness").html(thickness_label + " " + 0.5 + _(" cm")); /** Set initial thickness value of slider as 0.5 */
	$("#temperature").html(temperature_label + " " + 0 + " ℃"); /** Set initial cold water temperature value of slider as 0 */
	$("#showCrossSection").html(_("Show cross section"));
	$("#showResultTxt").html(_("Show result"));
	$("#warning").html(_("Voltage of both heaters must be same."));
	/** Animation width */
	anim_width = stage_width / 10.62;
	$("#poweronBtn").bind("click", function() { /** Power on the switch */
		if ($("#poweronBtn").val() == power_btn_var) {
			startExperiment(); /** Experiment starting function */
		} else { /** Power off the switch */
			resetExperiment(); /** Resetting the experiment */
		}
	});
	$('#resultCheckbox').click(function() { /** Check box functionality for displaying the calculated value */
		if ($('#resultCheckbox').attr('checked')) {
			if (gh_voltage_int == mh_voltage_int) { /** Check whether MH voltage and GH voltage are same */
				$("#result").css("display", "block"); /** Result of the experiment shown */
			} else {
				$("#result").css("display", "none");
			}
		} else {
			$("#result").css("display", "none");
		}
	});
	$("#crossSectionCheckbox").click(function() { /** Check box functionality for displaying the animation */
		/** Checking whether the check box is selected either to show or hide the cross sectional view */
		if ($("#crossSectionCheckbox").attr('checked')) {
			conduction_stage.getChildByName("cross_section").visible = true; /** Display cross sectional view */
			conduction_stage.getChildByName("waterAnimationTop").visible = true; /** Display the top water animation */
			conduction_stage.getChildByName("waterAnimationBottom").visible = true; /** Display the bottom water animation */
			createjs.Ticker.setInterval(100);
			createjs.Ticker.addEventListener("tick", startAnimation); /** Start animation event */
		} else { /** If checked showing the normal view */
			conduction_stage.getChildByName("cross_section").visible = false; /** Cross sectional view visibility false */
			conduction_stage.getChildByName("waterAnimationTop").visible = false; /** Top water animation visibility false */
			conduction_stage.getChildByName("waterAnimationBottom").visible = false; /** Bottom water animation visibility false */
			createjs.Ticker.removeEventListener("tick", startAnimation); /** Remove the animation event */
		}
	});
	$("#slider1").change(function() { /** Diameter slider change */
		diameterSliderFN(); /** Diameter slider change function */
	});
	$("#slider2").change(function() { /** Thickness slider change */
		thicknessSliderFN(); /** Thickness slider change function */
	});
	$("#slider3").change(function() { /** Temperature slider change */
		coldWaterTemperatureFN(); /** Cold water slider change function */
	});
}

/** Adding items to the drop down box */
function addintoDropDown(getId, valueSet) {
	var selected = getId;
	$.each(valueSet, function(val, text) {
		selected.append(
		$('<option></option>').val(val).html(text));
	});
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, sFactor, cursor, rotationX) {
	var bitmap = new createjs.Bitmap(image).set({
		x: 0,
		y: 0
	});
	getBoundFn(bitmap, sFactor);
	bitmap.x = xPos;
	bitmap.y = yPos;
	bitmap.name = name;
	bitmap.alpha = 1;
	if (name == "mhTuner" || name == "ghTuner" || name == "aNeedle" || name == "vNeedle") {
		bitmap.regX = bitmap.image.width;
		bitmap.regY = bitmap.image.height;
	} else if (name == "indicatorSelectorSwitchBase") {
		bitmap.regX = bitmap.image.width / 2;
		bitmap.regY = bitmap.image.height / 2;
	}
	if (name == "waterAnimationTop" || name == "waterAnimationBottom") { /** Masking of water animation */
		bitmap.mask = mask_rect_anim;
	}
	bitmap.rotation = rotationX;
	bitmap.cursor = cursor;
	conduction_stage.addChild(bitmap);
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
	conduction_stage.addChild(text);
}

/** Image scaling function. Scale the bitmap depend upon the scaling factor. */
function getBoundFn(bitmap, sFactor) {
	var bounds = bitmap.getBounds();
	scaleFactor = Math.min(exp_canvas.width / bounds.width, exp_canvas.height / bounds.height);
	bitmap.scaleX = bitmap.scaleY = sFactor * scaleFactor;
}

/** Animation of cross sectional view starting function */
function startAnimation() {
	anim_frame++; /** Frame increment */
	if (anim_frame <= 8) {
		anim_object_top.x = anim_object_top.x - anim_width; /** Changing of top animation object x position */
		anim_object_bottom.x = anim_object_bottom.x - anim_width; /** Changing of bottom animation object x position */
	} else {
		anim_frame = 0; /** Resetting the animation frame */
		/** Resetting the position of top and bottom water animation object */
		conduction_stage.getChildByName("waterAnimationTop").x = stage_width / 1.5;
		conduction_stage.getChildByName("waterAnimationBottom").x = stage_width / 1.5;
	}
}

/** MH rotation function */
function mhRotation() {
	/** Click on the MH up arrow. It will increase the MH voltage. */
	conduction_stage.getChildByName("mhUpArrow").on("click", function() {
		/** MH Tuner rotation, we can rotate the tuner till it turns 360 degree */
		if (mh_angle_float < 360) {
			mh_angle_float = mh_angle_float + 17.5; /** Increment the tuner rotation. 17.5  for adjusting the tuner. */
			conduction_stage.getChildByName("mhTuner").rotation = mh_angle_float;
		}
		if (!toggle_flag) { /** Toggle the switch to MH */
			AmmeterVoltmeterForward(); /** Rotate ammeter and voltmeter from 0 to 90 */
		}
		if (mh_voltage_flag == 0) {
			/** Check whether the MH tuner is rotating, if not set the MH voltage as 100.(initial MH voltage)*/
			mh_voltage_int = 100; /** Initial voltage set as 100 */
		} else if (mh_voltage_int < 300) {
			/** Increase the MH voltage by 10 till it reaches 300 V */
			mh_voltage_int = mh_voltage_int + 10;
		}
		/** Display voltage in voltmeter as text*/
		conduction_stage.getChildByName("voltmeterReading").text = mh_voltage_int;
		mh_voltage_flag++;
	});
	/** Click on the MH down arrow. It will decrease the MH voltage. */
	conduction_stage.getChildByName("mhDownArrow").on("click", function() {
		if (mh_angle_float > 0) { /** MH Tuner backward rotation */
			mh_angle_float = mh_angle_float - 17.5;
			conduction_stage.getChildByName("mhTuner").rotation = mh_angle_float;
		}
		if (!toggle_flag) { /** If switch toggle turn to MH */
			AmmeterVoltmeterReverse(); /** Ammeter and voltmeter reverse rotation */
		}
		if (mh_voltage_int >= 100) { /** Prevent backward movement of the tuner with voltage is less than 100 */
			mh_voltage_int = mh_voltage_int - 10;
			if (mh_voltage_int == 90) {
				mh_voltage_int = 0;
			}
		} else if (mh_voltage_int < 100) { /** Voltmeter reading decreasing */
			mh_voltage_int = 0; /** Reset voltage to 0 when voltage less than 100 */
			mh_voltage_flag = 0;
		}
		conduction_stage.getChildByName("voltmeterReading").text = mh_voltage_int;
	});
}

/** GH rotation function */
function ghRotation() {
	/** Click on the GH up arrow. It will increase the GH voltage. */
	conduction_stage.getChildByName("ghUpArrow").on("click", function() {
		if (gh_angle_float < 360) { /** GH Tuner forward rotation */
			gh_angle_float = gh_angle_float + 17.5; /** Rotating tuner in clock wise angle */
			conduction_stage.getChildByName("ghTuner").rotation = gh_angle_float;
		}
		if (toggle_flag) { /** If switch toggle turn to GH */
			AmmeterVoltmeterForward(); /** Ammeter and voltmeter forward rotation */
		}
		if (gh_voltage_flag == 0) {
			gh_voltage_int = 100; /** Initial voltage set as 100 */
		} else if (gh_voltage_int < 300) { /** Voltmeter reading increasing */
			gh_voltage_int = gh_voltage_int + 10;
		}
		conduction_stage.getChildByName("ammeterReading").text = findCurrent(gh_voltage_int);
		gh_voltage_flag++;
	});

	/** Click on the GH down arrow. It will decrease the GH voltage. */
	conduction_stage.getChildByName("ghDownArrow").on("click", function() {
		if (gh_angle_float > 0) { /** GH Tuner backward rotation */
			gh_angle_float = gh_angle_float - 17.5; /** Rotating tuner in anti clock wise angle */
			conduction_stage.getChildByName("ghTuner").rotation = gh_angle_float;
		}
		if (toggle_flag) { /** If switch toggle turn to GH */
			AmmeterVoltmeterReverse(); /** Ammeter and voltmeter backward rotation */
		}
		if (gh_voltage_int >= 100) { /** Prevent backward movement of the tuner with voltage is less than 100 */
			gh_voltage_int = gh_voltage_int - 10;
			if (gh_voltage_int == 90) {
				gh_voltage_int = 0;
			}
		} else if (gh_voltage_int < 100) { /** Voltmeter reading decreasing */
			gh_voltage_int = 0; /** Reset voltage to 0 when voltage less than 100 */
			gh_voltage_flag = 0;
		}
		conduction_stage.getChildByName("ammeterReading").text = findCurrent(gh_voltage_int);
	});
}

/** Power on function, starting the experiment */
function startExperiment() {
	power_on_flag = true;
	/**get the thermal conductivity, of the selected material and liquid from pre-defined array*/
	selectedMaterial = removeTextSpace(materialArrayTranslate[($("#dropdown").find("option:selected").index())]);
	thermal_conductivity = thermalConductivity[selectedMaterial];
	$("#dropdown").prop("disabled", true); /** Drop down disabled */
	/** Check the GH and MH voltage, show warning if their value not equal */
	if (gh_voltage_int != mh_voltage_int) {
		$("#warning,#warningImg").css("display", "block");
		$("#result").css("display", "none");
	} else { /** If GH and MH voltage are same */
		$("#warning,#warningImg").css("display", "none");
		$("#poweronBtn").val(reset_btn_var);

		/** Visible the images for starting the experiment */
		conduction_stage.getChildByName("indicatorTimer").visible = true;
		conduction_stage.getChildByName("lightOn").visible = true;
		conduction_stage.getChildByName("on_button").visible = true;
		conduction_stage.getChildByName("voltmeterReading").visible = true;
		conduction_stage.getChildByName("ammeterReading").visible = true;
		conduction_stage.getChildByName("indicatorReading").visible = true;

		/** Disable images and events */
		conduction_stage.getChildByName("off_button").visible = false;
		conduction_stage.getChildByName("mhUpArrow").mouseEnabled = false;
		conduction_stage.getChildByName("mhDownArrow").mouseEnabled = false;
		conduction_stage.getChildByName("ghUpArrow").mouseEnabled = false;
		conduction_stage.getChildByName("ghDownArrow").mouseEnabled = false;

		conduction_stage.getChildByName("watchStartStop").text = _("STOP");
		conduction_stage.getChildByName("greenButton").alpha = 1;
		conduction_stage.getChildByName("redButton").alpha = 0.5;
		indicatorReadingFn(); /** The reading value display function */
		stopWatchValHr = conduction_stage.getChildByName("stopWatchValHr"); /** Initializing the text box */
		stopWatchValMin = conduction_stage.getChildByName("stopWatchValMin");
		stopWatchValSec = conduction_stage.getChildByName("stopWatchValSec");
		startWatch(stopWatchValHr, stopWatchValMin, stopWatchValSec); /** Start the stop watch */
		timer_check = setInterval(checkTime, 10); /** Check time equal to 20 minutes */
		conductivityCalculation(); /** Function for calculating the thermal conductivity */
	}
}

/**get the value of the dropdown box, remove all the white spaces between the texts*/
function removeTextSpace(elmnt) {
	return elmnt.replace(/\s/g, "");
}

/** Reset function */
function resetExperiment() {
	resetStopWatch(); /** Resetting stopwatch here */
	initialisationOfVariables(); /** Variables resetting here */
	/** Function call for images used in the apparatus visibility. Resetting the images to its initial status. */
	initializeImages();
	conduction_stage.getChildByName("indicatorTimer").text = "";
	conduction_stage.getChildByName("GH_switch").visible = true;
	conduction_stage.getChildByName("off_button").visible = true;
	conduction_stage.getChildByName("mhUpArrow").mouseEnabled = true;
	conduction_stage.getChildByName("mhDownArrow").mouseEnabled = true;
	conduction_stage.getChildByName("ghUpArrow").mouseEnabled = true;
	conduction_stage.getChildByName("ghDownArrow").mouseEnabled = true;

	/** Remove and add the events by enabling and disabling the 'mouseEnabled' */
	conduction_stage.getChildByName("voltmeterReading").text = conduction_stage.getChildByName("ammeterReading").text = "0";
	/** Reinitialize the values and text of stop watch */
	conduction_stage.getChildByName("watchStartStop").text = _("START");
	conduction_stage.getChildByName("stopWatchValHr").text = "00";
	conduction_stage.getChildByName("stopWatchValMin").text = "00";
	conduction_stage.getChildByName("stopWatchValSec").text = "00";
	/** Resetting all rotations and the stopwatch texts */
	conduction_stage.getChildByName("aNeedle").rotation = 0;
	conduction_stage.getChildByName("vNeedle").rotation = 0;
	conduction_stage.getChildByName("mhTuner").rotation = 0;
	conduction_stage.getChildByName("ghTuner").rotation = 0;
	createjs.Ticker.removeEventListener("tick", startAnimation); /** Remove the animation here */
	$("#result").html(""); /** Clear the text box for displaying the result */
	$("#warning,#warningImg,#result").css("display", "none"); /** Warning image and text visibility changed */
	$("#poweronBtn").val(power_btn_var); /** Power on label changed to initial */
	$("#resultCheckbox").prop("checked", false); /** Check box reset */
	$("#crossSectionCheckbox").prop("checked", false); /** Check box reset */
	$("#dropdown").prop("disabled", false); /** Drop down enabled */
	$('#dropdown').find('option:first').attr('selected', 'selected'); /** Resetting drop down value to 'Cardboard' */
}

/** Function for the rotation of temperature indicator */
function rotateTempIndicator(incr, rotVal) { /** knob of the indicator */
	indicator_text_count = parseFloat(indicator_text_count + incr);
	indicator_rotation_count += rotVal; /** indicator count */
	conduction_stage.getChildByName("indicatorSelectorSwitchBase").rotation = indicator_rotation_count;
}

/** The reading value display function */
function indicatorReadingFn() {
	/** Indicator count text box value */
	conduction_stage.getChildByName("indicatorReading").text = "T" + indicator_text_count; 
}

/** Ammeter and voltmeter reverse rotation function */
function AmmeterVoltmeterReverse() {
	if ((voltmeter_reading_int > 4)) {
		/** Voltmeter needle rotation during MH and GH anti clock wise turn */
		rotateVoltmeter(-5);
	}
	/** Ammeter needle rotation during MH and GH anti clock wise turn */
	if ((ammeter_reading_int > 0) && (voltmeter_reading_int <= 58)){
		 rotateAmmeter(-6);
	}
}

/** Ammeter and voltmeter rotation 0 to 90 */
function AmmeterVoltmeterForward() {
	if (voltmeter_reading_int < 87) {
		/** Voltmeter needle rotation during MH and GH clock wise turn, rotate the tuner till it turns 85 degree */
		rotateVoltmeter(5);
	}
	if (ammeter_reading_int < 90) {
		/** Ammeter needle rotation during MH and GH clock wise turn */
		rotateAmmeter(6);
	}
}

/** Voltmeter needle rotation function */
function rotateVoltmeter(incr1) {
	voltmeter_reading_int += incr1;
	conduction_stage.getChildByName("vNeedle").rotation = voltmeter_reading_int;
}

/** Ammeter needle rotation function */
function rotateAmmeter(incr1) {
	ammeter_reading_int += incr1;
	conduction_stage.getChildByName("aNeedle").rotation = ammeter_reading_int;
}

/** Diameter slider change function */
function diameterSliderFN() {
	/** Set initial value of slider as 5 */
	$("#diameter").html(diameter_label + " " + $("#slider1").val() + _(" cm")); 
	/** Increasing / Decreasing the diameter of all discs depend upon the slider value */
	$("#input1").html($("#slider1").val() + _(" cm"));
	diameter_val_float = ($("#slider1").val()) / 100;
}

/** Thickness slider change function */
function thicknessSliderFN() {
	/** Increasing / Decreasing the thickness of all discs depend upon the slider value */
	$("#thickness").html(thickness_label + " " + $("#slider2").val() + _(" cm")); 
	/** Changing the disc thickness by adjusting the Y value of the discs */
	thickness_val_float = ($("#slider2").val()) / 100;
}

/** Cold water temperature slider change function */
function coldWaterTemperatureFN() {
	$("#temperature").html(temperature_label + " " + $("#slider3").val() + " ℃");
	temperature_val = $("#slider3").val();
	if (temperature_val == 0) {
		temperature_value_5 = 27;
		temperature_value_6 = 27;
	} else {
		temperature_value_5 = $("#slider3").val();
		temperature_value_6 = $("#slider3").val();
	}
}

/** This function execute during the stop watch runs */
function checkTime() {
	if (minute >= 20) {
		/** Pause the timer when minutes reaches 20 */
		pauseTimer();
		clearInterval(timer_check);
	} else {
		/** Shows indicator timer */
		displayIndicatorTimer();
	}
}

/** Calculation part */

/** Calculation of current using voltage */
function findCurrent(voltage) {
	if (voltage == 0) {
		current = 0;
	} else {
		/** voltage = voltage in voltmeter ,current = current in ammeter */
		current = (0.2 + (voltage - 100) * 0.01);
		current = current.toFixed(1);
	}
	for (var i = 0; i <= current_array_1.length; i++) {
		current_new_array[current_array_1[i]] = current_array_2[i];
		current_new = current_new_array[current];
	}
	current = current + 0.1;
	return current_new;
}

/** Calculation of thermal conductivity */
function conductivityCalculation() {
	/** Finding the area of material, Area=πr² */
	meteral_area = parseFloat(Math.PI * diameter_val_float * diameter_val_float) / 4; 
	if (!toggle_flag) { /** If toggle switch to MH */
		voltage = mh_voltage_int;
	} else if (toggle_flag) { /** If toggle switch to GH */
		voltage = gh_voltage_int;
	}
	current = findCurrent(voltage); /** Calculating current using voltage */
	if (voltage == 0) {
		temperature_value_1 = temperature_value_2 = temperature_value_3 = temperature_value_4 = 27;
		temperature_value_5 = temperature_value_6 = temperature_value_7 = temperature_value_8 = 27;
	}
	power = parseFloat(voltage * current) / 2; /** Calculating the power Q = VI / 2 */
	delta_temperature = (parseFloat(power * thickness_val_float) / parseFloat(thermal_conductivity * meteral_area)) + temperature_val;
	if (voltage != 0) {
		temperature_value_1 = temperature_value_3 = temperature_value_7 = parseFloat(delta_temperature + random_number);
		temperature_value_2 = temperature_value_4 = temperature_value_8 = parseFloat(delta_temperature - random_number);
		temperature_value_5 = temperature_value_6 = temperature_val;
	}
	$("#result").html(_("Thermal conductivity:") + " " + thermal_conductivity + " Wm¯¹K¯¹"); /** Displaying the result */
}

/** Indicator timer function */
function displayIndicatorTimer() {
	if (mh_voltage_int == 0) {
		conduction_stage.getChildByName("indicatorTimer").text = 27; /** Set initial temperature as 27 degree */
	} else { /** Calculation of indicator timer for each temperature */
		/** Indicator time for temperature_value_1,temperature_value_2,temperature_value_3, temperature_value_4,temperature_value_5,temperature_value_6,temperature_value_7,temperature_value_8 */
		indicator_temp_1 += (temperature_value_1 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_2 += (temperature_value_2 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_3 += (temperature_value_3 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_4 += (temperature_value_4 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_5 += (temperature_value_5 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_6 += (temperature_value_6 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_7 += (temperature_value_7 - temperature_minimum) / (indicator_timer_count * max_sec);
		indicator_temp_8 += (temperature_value_8 - temperature_minimum) / (indicator_timer_count * max_sec);
	}
	/** Indicator timer with respect to the indicator rotation count, Same indicator temperature for temperature_value_1,temperature_value_2,temperature_value_3,temperature_value_4,temperature_value_5,temperature_value_6,temperature_value_7 */
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_1.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_2.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_3.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_4.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_5.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_6.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_7.toFixed(2);
	conduction_stage.getChildByName("indicatorTimer").text = indicator_temp_8.toFixed(2);
}

/** Calculation ends */