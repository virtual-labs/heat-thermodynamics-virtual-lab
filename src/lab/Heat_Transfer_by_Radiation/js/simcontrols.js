/** js file for define the functions.
 *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
 *VALUE (Virtual Amrita Laboratories Universalizing Education)
 *Amrita University, India
 *http://www.amrita.edu/create
 *author:Anitha;
 *Date of modified: 20-06-2015
 */
/** Variable declaration */
var radiation_stage, exp_canvas, stage_width, stage_height, tp_angle_float, ammeter_reading_int, voltmeter_reading_int;

var tp_voltage_int, bp_voltage_int, bp_angle_float, diameter_val_float, thickness_val_float, temperature_val;

var stefan_boltzmann_constant, emissivity_float, current_float, frequency, radius_float, thickness_float, area_float;

var voltage_int, tp_current_float, indicator_rotation_count, indicator_text_count, tp_rotation_count, bp_rotation_count;

var power_on_flag, indicator_timer_count, max_sec, temperature_minimum, indicator_temp_1, indicator_temp_2, indicator_temp_3;

var total_emissivity, temperature_one, temperature_two, champer_temp, tick, timer_check, power_btn_var, reset_btn_var;

var gt; /** Object for Gettext.js */

var diameterLabel, thicknesslabel, chamberLabel, selectedMaterial;

var progressText = new createjs.Text("", "2em Tahoma, Geneva, sans-serif", "#000000");

var materialArray = materialItemArray=[];

/** Emissivity of each material is taken */
var emissivity = {
	aluminium: 0.77,
    brass: 0.68,
    iron: 0.61,    
    steel: 0.85,
	copper: 0.78
}; 

/** Variable declaration ends */

/** Start controls for Heat transfer by radiation */
$(document).ready(function() {
	gt = new Gettext({
		'domain': 'messages'
	});
	materialArray = [_("Aluminium"), _("Brass"), _("Iron"), _("Steel"), _("Copper")]; /** Items for the drop down */
	materialItemArray=["aluminium","brass","iron","steel","copper","aluminiumInner","brassInner","ironInner","steelInner","copperInner"];/**array stores the collectionb of materials used for visibility*/
	$("#expName").html(_("Heat Transfer by Radiation")); /** Experiment name */
	exp_canvas = document.getElementById("experimentCanvas");
	exp_canvas.width = $("#canvasBox").width();
	exp_canvas.height = $("#canvasBox").width();
	stage_width = exp_canvas.width; /** Set stage width and height as canvas width and height */
	stage_height = exp_canvas.height;
	radiation_stage = new createjs.Stage(exp_canvas); /** Initialize createjs stage */
	createjs.Touch.enable(radiation_stage);
	radiation_stage.enableMouseOver(10); /** Enabled mouse over / out events */
	radiation_stage.mouseMoveOutside = true; /** Keep tracking the mouse even when it leaves the canvas */
	progressText.x = stage_width / 2.4 - progressText.getMeasuredWidth() / 2; /** Adding the Loading percentage text */
	progressText.y = stage_width / 2.4;
	radiation_stage.addChild(progressText); /** Add text to progress bar */
	queue = new createjs.LoadQueue(true); /** Initialize the queue */
	queue.on("progress", handleProgress); /** Loading progress bar */
	queue.on("complete", handleComplete, this);
	queue.loadManifest([{ /** Images into the queue */
		id: "backGround",
		src: simPath + "/images/background.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "commonDisc",
		src: simPath + "/images/commondisc.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "copper",
		src: simPath + "/images/copperdisc.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "steel",
		src: simPath + "/images/steeldisc.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "iron",
		src: simPath + "/images/irondisc.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "brass",
		src: simPath + "/images/brassdisc.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "aluminium",
		src: simPath + "/images/aluminiumdisc.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "discShadow",
		src: simPath + "/images/discshadow.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "wires",
		src: simPath + "/images/wires.svg",
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
		src: simPath + "/images/selectorswitch.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "indicatorSelectorSwitchBase",
		src: simPath + "/images/selectorswitchbase.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "lightOn",
		src: simPath + "/images/lighton.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "needle",
		src: simPath + "/images/needle.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "off",
		src: simPath + "/images/lightswitchoff.svg",
		type: createjs.LoadQueue.IMAGE,
		cursor: "hand"
	}, {
		id: "on",
		src: simPath + "/images/lightswitchon.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "switchOff",
		src: simPath + "/images/switchoff.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "switchOn",
		src: simPath + "/images/switchon.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "tuner",
		src: simPath + "/images/rotatebar.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "arrow",
		src: simPath + "/images/arrow.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "indicatorArrow",
		src: simPath + "/images/indicatorArrow.svg",
		type: createjs.LoadQueue.IMAGE
	}, {
		id: "glasseffect",
		src: simPath + "/images/glasseffect.svg",
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
	radiation_stage.update();
}

/** Function for display the progress of loading */
function handleProgress(event) {
	progressText.text = (queue.progress * 100 | 0) + " % Loaded";
}

/** All variables initialising in this function */
function initialisationOfVariables() {
	tp_voltage_flag = bp_voltage_flag = 0; /** TP and BP voltage flag */
	tp_angle_float = bp_angle_float = 0; /** For TP and BP rotation */
	ammeter_reading_int = 0; /** Ammeter and voltmeter reading */
	voltmeter_reading_int = 12;
	tp_voltage_int = bp_voltage_int = 0; /** TP and BP voltages */
	diameter_val_float = 0.05; /** Initial diameter,thickness and temperature */
	thickness_val_float = 0.01;
	temperature_val = 253.15;
	stefan_boltzmann_constant = 0.0000000567; /** Stefan Boltzmann constant */
	emissivity_float = 0.77; /** Emissivity of initial drop down disc aluminium */
	current_float = frequency = radius_float = thickness_float = area_float = 0;
	voltage_int = tp_current_float = indicator_rotation_count = 0; /** Initialize current,voltage,frequency,radius,thickness,area,TP current*/
	indicator_text_count = 1;
	indicator_timer_count = 25; /** Indicator timer count for calculating the indicator timer value frequently */
	max_sec = 48.5; /** Maximum second for calculating the indicator timer value frequently */
	temperature_minimum = 20; /** Initial minimum temperature */
	indicator_temp_1 = indicator_temp_2 = indicator_temp_3 = 27; /** Set initial indicator temperature as 27 */
	/** Set Total emissivity variable, and temporary temperature to 0 */
	total_emissivity = temperature_one = temperature_two = 0;
	champer_temp = 0; /** T4 chamber temperature */
	power_on_flag = toggle_flag = false; /** Initialize toggle and power on flag */
	power_btn_var = _("Power on");
	reset_btn_var = _("Reset")
	/** Label of the power button '_' will translate the string using gettext */
	$("#poweronBtn").val(power_btn_var);
	/** Initialize the value for the slider text shown in the menu */
	$("#slider1").val(5);
	$("#diameter").html(diameterLabel+" : "+5);/**set initial value of slider as 5*/
	$("#slider2").val(1);
	$("#thickness").html(thicknesslabel+" "+1);/**reset slider value*/
	$("#slider3").val(-20);
	$("#temperature").html(chamberLabel+" "+-20);/**reset chamber temperature to -20*/
}

/** Loading the images and initialize the html control events */
function handleComplete(event) {
	loadImagesTexts(); /** Images loading in the canvas from load_images_texts.js */
	initialisationOfVariables(); /** Initialize each variable with the initial value */
	addintoDropDown($('#dropdown'), materialArray);/** Adding elements in dropdown */
	getDiscName(); /** Get the names of the disc material in variables from load_images_texts.js */
	controlsHandle(); /** All controls are handle by this function */
	initializeImages(); /** Function call for images used in the apparatus visibility */
	changeOption(); /** Drop down list change function for selecting material */ 
	/** TP and BP tuners can rotate when only the power button is off */
	if (power_on_flag == false) {
		/** TP tuner rotation. There is a tuner named TP, we can rotate the tuner. 
	It will increase/decrease the TP voltage */
		tpRotation();
		/** BP tuner rotation. There is a tuner named BP, we can rotate the tuner. 
		It will increase/decrease the BP voltage */
		bpRotation();
	}
	radiation_stage.getChildByName("motorOff").on("click", function() { /** Motor switch on functionality */
		startExperiment(); /** Start the experiment */
	});
	radiation_stage.getChildByName("motorOn").on("click", function() { /** Motor switch off functionality */
		resetExperiment(); /** Reset the experiment */
	});

	radiation_stage.getChildByName("switchOff").on("click", function() { /** Toggle switch turn to TP */
		resetExperiment(); /** Reset the experiment */
		radiation_stage.getChildByName("switchOn").visible = true;
		radiation_stage.getChildByName("switchOff").visible = false;
		toggle_flag = true; /** The flag set true when toggle switch to TP */
	});
	radiation_stage.getChildByName("switchOn").on("click", function() { /** Toggle switch turn to BP */
		resetExperiment(); /** Reset the experiment */
		radiation_stage.getChildByName("switchOff").visible = true;
		radiation_stage.getChildByName("switchOn").visible = false;
		toggle_flag = false; /** The flag set false when toggle switch to BP */
	});
	radiation_stage.getChildByName("indicatorFwdArrow").on("click", function() { /** Indicator forward rotation */
		if ((indicator_text_count <= 7)) { /** Rotate the temperature indicator till the count reaches 7 */
			rotateTempIndicator(1, 32); /** Counter increment by 1 and angle rotate by 32 */
			indicatorReadingFn(); /** The reading value display function */
		}
	});
	radiation_stage.getChildByName("indicatorBkdArrow").on("click", function() { /** Indicator backward rotation */
		indicatorReadingFn(); /** The indicator reading value display function */
		if ((indicator_text_count > 1)) {
			rotateTempIndicator(-1, -32); /** Counter increment by 1 and angle rotate by 32 */
			indicatorReadingFn(); /** The reading value display function */
		}
	});
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initializeImages() {
	/** Resetting the images to its initial status */
	radiation_stage.getChildByName("indicatorTimer").visible = false;
	radiation_stage.getChildByName("mlightOn").visible = false;
	radiation_stage.getChildByName("motorOn").visible = false;
	radiation_stage.getChildByName("voltmeterReading").visible = false;
	radiation_stage.getChildByName("ammeterReading").visible = false;
	radiation_stage.getChildByName("indicatorReading").visible = false;
	radiation_stage.getChildByName("switchOn").visible = false;
	/** Alpha 1 of green means stop watch is running.Initial opacity as 0.5, 
	Alpha 1 of red means stopwatch not started .Initial opacity of red button set as 1*/
	radiation_stage.getChildByName("greenButton").alpha = 0.5;
	radiation_stage.getChildByName("redButton").alpha = 1;
	radiation_stage.getChildByName("watchStartStop").text = _("START");
}

/** All controls are handle by this function */
function controlsHandle() {
	/** Translate the stings used in the experiment by adding '_' before it.
	 This is done for language translation. */
	$("#variables").html(_("Variables"));
	$("#measurements").html(_("Measurements"));
	$("#material").html(_("Choose material:")); /** All texts in control part for language translation */
	diameterLabel=_("Diameter of the plates (cm):");
	thicknesslabel=_("Thickness of the plates (cm):");
	chamberLabel=_("Chamber temperature :")+" (℃): ";
	$("#diameter").html(diameterLabel+" "+5);/**set initial diameter value of slider as 5*/
	$("#thickness").html(thicknesslabel+" "+1);/**set initial thickness value of slider as 1*/	
	$("#temperature").html(chamberLabel+" "+-20);/**set initial chamber temperature value of slider as -20*/
	
	$("#showResultTxt").html(_("Show result"));
	$("#warningTxt").html(_("Voltage of both heaters must be same."));
	$("#poweronBtn").bind("click", function() { /** Power on the switch */
		if ($("#poweronBtn").val() == power_btn_var) {
			startExperiment(); /** Experiment starting function */
		} else { /** Power off the switch */
			resetExperiment(); /** Resetting the experiment */
		}
	});
	$('#graphchek').click(function() { /** Check box functionality for displaying the calculated value */
		if ($('#graphchek').attr('checked')) {
			if (bp_voltage_int == tp_voltage_int) { 
			/**check whether Tp voltage and Bp voltage are same*/
				$("#result").css("display", "block");
			}
			else{
				$("#result").css("display", "none");
				}
	
			 /** Result of the experiment shown */
		} else {
			$("#result").css("display", "none");
		}
	});
	$("#slider1").change(function() { /** Diameter slider change */
		diameterSliderFN(); /** Diameter change function */
	});
	$("#slider2").change(function() { /** Thickness slider change */
		thicknessSliderFN(); /** Thickness change function */
	});
	$("#slider3").change(function() { /** Temperature slider change */
		chamberTemperatureFN(); /** Chamber change function */
	});
	$("#dropdown").change(function() { /** Drop down change */
	changeOption();		
	});
}
/**change the disc depends on the selectiobn from the dropdown box*/
function changeOption(){	
	for(var i=0;i<5;i++){
		/**check each disc whether it match with the dropdown selection*/
			if($('#dropdown').val()==i){
			radiation_stage.getChildByName(materialItemArray[i]).visible=true;
			radiation_stage.getChildByName(materialItemArray[i+5]).visible=true;
			}
			else{
				/**visible set as false rest of the disc and its inner disc*/
				radiation_stage.getChildByName(materialItemArray[i]).visible=false;
				radiation_stage.getChildByName(materialItemArray[i+5]).visible=false;
			}
		}
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
	if (name == "tpTuner" || name == "bpTuner" || name == "aNeedle" || name == "vNeedle") {
		bitmap.regX = bitmap.image.width;
		bitmap.regY = bitmap.image.height;
	} else if (name == "indicatorSelectorSwitchBase") {
		bitmap.regX = bitmap.image.width / 2;
		bitmap.regY = bitmap.image.height / 2;
	}
	bitmap.rotation = rotationX;
	bitmap.cursor = cursor;
	radiation_stage.addChild(bitmap);
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
	radiation_stage.addChild(text);
}

/** Image scaling function. Scale the bitmap depend upon the scaling factor. */
function getBoundFn(bitmap, sFactor) {
	var bounds = bitmap.getBounds();
	scaleFactor = Math.min(exp_canvas.width / bounds.width, exp_canvas.height / bounds.height);
	bitmap.scaleX = bitmap.scaleY = sFactor * scaleFactor;
}

/** TP rotation function */
function tpRotation() {
	/** Click on the TP up arrow. It will increase the TP voltage. */
	radiation_stage.getChildByName("tpUpArrow").on("click", function() {
		/** Tp Tuner rotation, we can rotate the tuner till it turns 360 degree */
		if (tp_angle_float < 360) {
			tp_angle_float = tp_angle_float + 17.5; /** Increment the tuner rotation. 17.5  for adjusting the tuner. */	
			radiation_stage.getChildByName("tpTuner").rotation = tp_angle_float;
		}
		if (toggle_flag) { /** Toggle the switch to TP from Bp */
			AmmeterVoltmeterForward(); /** Rotate ammeter and voltmeter from 0 to 90 */
		}
		if (tp_voltage_flag == 0) {
			/** Check whether the Tp tuner is rotating, if not set the Tp voltage as 100.(initila Tp voltage)*/
			tp_voltage_int = 100; /** Initial voltage set as 100 */
		} else if (tp_voltage_int < 300) {
			/** Increase the Tp voltage by 10 till it reaches 300 V */
			tp_voltage_int = tp_voltage_int + 10;
		}
		/** Display voltage in voltmeter as text*/
		radiation_stage.getChildByName("voltmeterReading").text = tp_voltage_int; 
		if (tp_voltage_int == 0) { /** Ammeter reading displayed in the text box */
			tp_current_float = 0;
		} else {
			/** Ammeter reading text box value calculation */
			tp_current_float = 0.2 + (tp_voltage_int - 100) * 0.01;
		}
		radiation_stage.getChildByName("ammeterReading").text = tp_current_float.toFixed(2);
		tp_voltage_flag++;
	});
	/** Click on the TP down arrow. It will decrease the TP voltage. */
	radiation_stage.getChildByName("tpDownArrow").on("click", function() {
		if (tp_angle_float > 0) { /** TP Tuner backward rotation */
			tp_angle_float = tp_angle_float - 17.5;
			radiation_stage.getChildByName("tpTuner").rotation = tp_angle_float;
		}
		if (toggle_flag) { /** If switch toggle turn to TP */
			AmmeterVoltmeterReverse(); /** Ammeter and voltmeter reverse rotation */
		}
		if (tp_voltage_int >= 100) { /** Prevent backward movement of the tuner with voltage is less than 100 */
			tp_voltage_int = tp_voltage_int - 10;
			if (tp_voltage_int == 90) {
				tp_voltage_int = 0;
			}
		} else if (tp_voltage_int < 100) { /** Voltmeter reading decreasing */
			tp_voltage_int = 0; /** Reset voltage to 0 when voltage less than 100 */
			tp_voltage_flag = 0;
		}
		radiation_stage.getChildByName("voltmeterReading").text = tp_voltage_int;
		if (tp_voltage_int == 0) { /** Ammeter reading displayed in the text box */
			tp_current_float = 0;
		} else { /** Ammeter reading text box value calculation */
			tp_current_float = 0.2 + (tp_voltage_int - 100) * 0.01;
		}
		radiation_stage.getChildByName("ammeterReading").text = tp_current_float.toFixed(2);
	});
}

/** BP rotation function */
function bpRotation() {
	/** Click on the BP up arrow. It will increase the BP voltage. */
	radiation_stage.getChildByName("bpUpArrow").on("click", function() {
		if (bp_angle_float < 360) { /** BP Tuner forward rotation */
			bp_angle_float = bp_angle_float + 17.5; /** Rotating tuner in clock wise angle */
			radiation_stage.getChildByName("bpTuner").rotation = bp_angle_float;
		}
		if (!toggle_flag) { /** If switch toggle turn to BP */
			AmmeterVoltmeterForward(); /** Ammeter and voltmeter forward rotation */
		}
		if (bp_voltage_flag == 0) {
			bp_voltage_int = 100; /** Initial voltage set as 100 */
		} else if (bp_voltage_int < 300) { /** Voltmeter reading increasing */
			bp_voltage_int = bp_voltage_int + 10;
		}
		bp_voltage_flag++;
	});

	/** Click on the BP down arrow. It will decrease the BP voltage. */
	radiation_stage.getChildByName("bpDownArrow").on("click", function() {
		if (bp_angle_float > 0) { /** BP Tuner backward rotation */
			bp_angle_float = bp_angle_float - 17.5; /** Rotating tuner in anti clock wise angle */
			radiation_stage.getChildByName("bpTuner").rotation = bp_angle_float;
		}
		if (!toggle_flag) { /** If switch toggle turn to BP */
			AmmeterVoltmeterReverse(); /** Ammeter and voltmeter backward rotation */
		}
		if (bp_voltage_int >= 100) { /** Prevent backward movement of the tuner with voltage is less than 100 */
			bp_voltage_int = bp_voltage_int - 10;
			if (bp_voltage_int == 90) {
				bp_voltage_int = 0;
			}
		} else if (bp_voltage_int < 100) { /** Voltmeter reading decreasing */
			bp_voltage_int = 0; /** Reset voltage to 0 when voltage less than 100 */
			bp_voltage_flag = 0;
		}
	});
}

/** Power on function, starting the experiment */
function startExperiment() {
	power_on_flag = true;
    $("#dropdown").prop("disabled", true); /** Drop down disabled */
    $("#slider1,#slider2,#slider3").attr('disabled', 'disabled').css({
        "opacity": 0.5,
        "cursor": "default"
    });
	/** Check the BP and TP voltage, show warning if their value not equal */
	if (bp_voltage_int != tp_voltage_int) { 
		$("#warning").css("display", "block");
		$("#result").css("display", "none");
	} else { /** If BP and TP voltage are same */
		$("#warning").css("display", "none");
		$("#poweronBtn").val(reset_btn_var);

		/** Visible the images for starting the experiment */
		radiation_stage.getChildByName("indicatorTimer").visible = true;
		radiation_stage.getChildByName("mlightOn").visible = true;
		radiation_stage.getChildByName("motorOn").visible = true;
		radiation_stage.getChildByName("voltmeterReading").visible = true;
		radiation_stage.getChildByName("ammeterReading").visible = true;
		radiation_stage.getChildByName("indicatorReading").visible = true;

		/** Disable images and events */
		radiation_stage.getChildByName("motorOff").visible = false;
		radiation_stage.getChildByName("tpUpArrow").mouseEnabled = false;
		radiation_stage.getChildByName("tpDownArrow").mouseEnabled = false;
		radiation_stage.getChildByName("bpUpArrow").mouseEnabled = false;
		radiation_stage.getChildByName("bpDownArrow").mouseEnabled = false;

		radiation_stage.getChildByName("watchStartStop").text = _("STOP");
		radiation_stage.getChildByName("greenButton").alpha = 1;
		radiation_stage.getChildByName("redButton").alpha = 0.5;
		indicatorReadingFn(); /** The reading value display function */
		stopWatchValHr = radiation_stage.getChildByName("stopWatchValHr"); /** Initializing the text box */
		stopWatchValMin = radiation_stage.getChildByName("stopWatchValMin");
		stopWatchValSec = radiation_stage.getChildByName("stopWatchValSec");
		startWatch(stopWatchValHr, stopWatchValMin, stopWatchValSec); /** Start the stop watch */
		timer_check = setInterval(checkTime, 10); /** Check time equal to 20 minutes */
		totalEmissivityCalculation(); /** Total emissivity calculation */
	}
}

/** Reset function */
function resetExperiment() {
	resetStopWatch(); /** Resetting stopwatch here */
	initialisationOfVariables(); /** Variables resetting here */
	/** Function call for images used in the apparatus visibility. Resetting the images to its initial status. */	
	initializeImages(); 
	radiation_stage.getChildByName("indicatorTimer").text = "";

	radiation_stage.getChildByName("motorOff").visible = true;
	radiation_stage.getChildByName("switchOff").visible = true;
	radiation_stage.getChildByName("tpUpArrow").mouseEnabled = true;
	radiation_stage.getChildByName("tpDownArrow").mouseEnabled = true;
	radiation_stage.getChildByName("bpUpArrow").mouseEnabled = true;
	radiation_stage.getChildByName("bpDownArrow").mouseEnabled = true;

	/** Remove and add the events by enabling and disabling the 'mouseEnabled' */
	radiation_stage.getChildByName("voltmeterReading").text = radiation_stage.getChildByName("ammeterReading").text ="0";
	/** Reinitialize the values and text of stop watch */
	radiation_stage.getChildByName("watchStartStop").text = _("START");
	radiation_stage.getChildByName("stopWatchValHr").text = "00";
	radiation_stage.getChildByName("stopWatchValMin").text ="00";
	 radiation_stage.getChildByName("stopWatchValSec").text = "00";
	$("#result").html(""); /** Clear the text box for displaying the result */
	/** Resetting all rotations and the stopwatch texts */
	radiation_stage.getChildByName("aNeedle").rotation = 0; 
	radiation_stage.getChildByName("vNeedle").rotation = 0;
	radiation_stage.getChildByName("tpTuner").rotation = 0;
	radiation_stage.getChildByName("bpTuner").rotation = 0;
	radiation_stage.getChildByName("indicatorSelectorSwitchBase").rotation = 0;
	$("#warning,#result").css("display", "none"); /** Warning image and text visibility changed */
	$("#poweronBtn").val(power_btn_var); /** Power on label changed to initial */
	$("#graphchek").prop("checked", false); /** Check box reset */
    $("#dropdown").prop("disabled", false); /** Drop down enabled */
    $('#dropdown').find('option:first').attr('selected', 'selected'); /** Resetting drop down value to 'Aluminium' */
    $("#slider1,#slider2,#slider3").removeAttr('disabled').css({
        "opacity": 1,
        "cursor": "default"
    });
}

/** Function for the rotation of temperature indicator */
function rotateTempIndicator(incr, rotVal) { /** knob of the indicator */
	indicator_text_count = indicator_text_count + incr;
	indicator_rotation_count += rotVal; /** indicator count */
	radiation_stage.getChildByName("indicatorSelectorSwitchBase").rotation = indicator_rotation_count;
}

/** The reading value display function */
function indicatorReadingFn() {
	/** Indicator count text box value */
	radiation_stage.getChildByName("indicatorReading").text = "T" + indicator_text_count; 
}

/** Ammeter and voltmeter reverse rotation function */
function AmmeterVoltmeterReverse() {
	if ((voltmeter_reading_int > 1)) {
		/** Voltmeter needle rotation during Tp and Bp anticlock wise turn */
		rotateVoltmeter(-4.29); 
	}
	/** Ammeter needle rotation during Tp and Bp anticlock wise turn */
	if ((ammeter_reading_int > 0) && (voltmeter_reading_int <= 38.61)) rotateAmmeter(-10); 
}

/** Ammeter and voltmeter rotation 0 to 90 */
function AmmeterVoltmeterForward() {
	if (voltmeter_reading_int < 85) {
		/** Voltmeter needle rotation during Tp and Bp clock wise turn, rotate the tuner till it turns 85 degree */
		rotateVoltmeter(4.29); 
	}
	if (ammeter_reading_int < 90) {
		/** Ammeter needle rotation during Tp and Bp clock wise turn */
		rotateAmmeter(10); 
	}
}

/** Voltmeter needle rotation function */
function rotateVoltmeter(incr1) {
	voltmeter_reading_int += incr1;
	radiation_stage.getChildByName("vNeedle").rotation = voltmeter_reading_int;
}

/** Ammeter needle rotation function */
function rotateAmmeter(incr1) {
	ammeter_reading_int += incr1;
	radiation_stage.getChildByName("aNeedle").rotation = ammeter_reading_int;
}

/** Diameter slider change function */
function diameterSliderFN() {
	/** Increasing / Decreasing the diameter of all discs depend upon the slider value */
	$("#diameter").html(diameterLabel+" "+$("#slider1").val());/**set initial value of slider as 5*/
	diameter_val_float = ($("#slider1").val()) / 100;
	var _diameter_change_val = (stage_width / 824) + (diameter_val_float * 0.2);	
	radiation_stage.getChildByName("commonDisc").scaleX = radiation_stage.getChildByName("aluminium").scaleX = radiation_stage.getChildByName("brass").scaleX = radiation_stage.getChildByName("iron").scaleX = radiation_stage.getChildByName("steel").scaleX = radiation_stage.getChildByName("copper").scaleX = _diameter_change_val;
}

/** Thickness slider change function */
function thicknessSliderFN() {
	/** Increasing / Decreasing the thickness of all discs depend upon the slider value */
	$("#thickness").html(thicknesslabel+" "+$("#slider2").val());/**change slider value on change*/
	thickness_val_float = ($("#slider2").val()) / 100;	
	/** Changing the disc thickness by ajusting the Y value of the discs */
	radiation_stage.getChildByName("commonDisc").y = radiation_stage.getChildByName("aluminium").y = radiation_stage.getChildByName("brass").y = radiation_stage.getChildByName("iron").y = radiation_stage.getChildByName("steel").y = radiation_stage.getChildByName("copper").y = (stage_height / 1.37) - ($("#slider2").val());
}

/** Chamber temperature slider change function */
function chamberTemperatureFN() {
	$("#temperature").html(chamberLabel+" "+$("#slider3").val());/**change chamber temperature on slider change*/
	temperature_val = parseInt($("#slider3").val()) + 273.15;//273.15 is the kelvin value 0 degree= 273.15 K
}

/** This function execute during the stop watch runs */
function checkTime() {
	if (minute >= 20) {
		pauseTimer(); /** Pause the timer when minutes reaches 20 */
		clearInterval(timer_check);
	} else {
		displayIndicatorTimer(); /** Shows indicator timer */
	}
}

/** Calculation part */
/** Calculation of emissivity */
function totalEmissivityCalculation() {
	selectedMaterial = (materialItemArray[($("#dropdown").find("option:selected").index())]);
	emissivity_float=emissivity[selectedMaterial];/**select the emisitivity from the array given*/	
	$("#result").html("");
	if (!toggle_flag) { /** Toggle switch turn to TP */
		voltage_int = tp_voltage_int; /** Finding the voltage V */
	} else {
		voltage_int = bp_voltage_int;
	}
	if (voltage_int == 100) { /** Finding the current I */
		current_float = 0;
	} else {
		current_float = 0.2 + (voltage_int - 100) * 0.01;
	}
	/** Finding the frequency W= V*I */
	frequency = voltage_int * current_float; 
	/** Finding the radius of the disc r */
	radius_float = diameter_val_float / 2; 
	thickness_float = thickness_val_float; /** Finding the thickness of the disc t */

	/**Finding the area A =2πrt+πr² */
	area_float = (2 * Math.PI * radius_float * thickness_float) + (Math.PI * Math.pow(radius_float, 2));

	/** Tb= W* εb*σ*A,where εb = 1 */
	var _calculation_part = Math.pow(parseFloat((parseFloat(frequency) / parseFloat(1 * parseFloat(stefan_boltzmann_constant) * area_float)) + Math.pow(temperature_val, 4)), parseFloat(1 / 4));

	/** Formula for plate temperature Tb= W* εp*σ*A */
	var _blackplate_temp = Math.pow(parseFloat(Math.pow(_calculation_part, 4)), 1 / 4);
	var _temperature_of_plate = Math.pow(((parseFloat(frequency / (emissivity_float * stefan_boltzmann_constant * area_float))) + Math.pow(temperature_val, 4)), parseFloat(1 / 4)).toFixed(2);

	/** TP calculate */
	var _temperature_power = Math.pow(parseFloat(temperature_val), 4);

	/** Emissivity calculation */
	total_emissivity = (1 * ((Math.pow(_blackplate_temp, 4) - _temperature_power) / (Math.pow(_temperature_of_plate, 4) - _temperature_power))).toFixed(2);

	if ( isNaN(total_emissivity) ) {
		total_emissivity = 0;
	}
    if ( voltage_int==0 ) {
        $("#result").html(_("Emissivity of the test plate:") + " " +total_emissivity);
    } else {
        $("#result").html(_("Emissivity of the test plate:") + " " + emissivity_float);
    }
	temperature_one = (_blackplate_temp - 273.15);/** 0 degree= 273.15 K */
	temperature_two = (_temperature_of_plate - 273.15);
	if ( frequency == 0 ) { /** If frequency W= V*I is 0, the temperatures initial value is 27 */
		temperature_one = 27;
		temperature_two = 27;
	}
	champer_temp = (temperature_val - 273.15); /** Champer temparature in kelvin,0 degree= 273.15 K */
}

/** Indicator timer function */
function displayIndicatorTimer() {
	if (tp_voltage_int == 0) {
		radiation_stage.getChildByName("indicatorTimer").text = 27; /** Set initial temperature as 27 degree */
	} else { /** Calculation of indicator timer for each temperature */
		/** Indicator time for T1,T2,T3 */
		indicator_temp_1 += (temperature_one - temperature_minimum) / (indicator_timer_count * max_sec);
		/** Indicator time for T4 */
		indicator_temp_2 += (champer_temp - temperature_minimum) / (indicator_timer_count * max_sec); 
		/** Indicator time for T5,T6,T7 */
		indicator_temp_3 += (temperature_two - temperature_minimum) / (indicator_timer_count * max_sec); 
	}
	/** Indicator timer with respect to the indicator rotation count, Same indicator temperature for T1,T2,T3. 
	And same for T5,T6,T7. Different temperature for T4 */
	if (indicator_text_count == 1 || indicator_text_count == 2 || indicator_text_count == 3) { 
		radiation_stage.getChildByName("indicatorTimer").text = indicator_temp_1.toFixed(2);
	} else if (indicator_text_count == 4) {
		radiation_stage.getChildByName("indicatorTimer").text = indicator_temp_2.toFixed(2);
	} else if (indicator_text_count == 5 || indicator_text_count == 6 || indicator_text_count == 7) {
		radiation_stage.getChildByName("indicatorTimer").text = indicator_temp_3.toFixed(2);
	}
}
/** Calculation ends */