/** js file for define the functions.
 *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
 *VALUE (Virtual Amrita Laboratories Universalizing Education)
 *Amrita University, India
 *http://www.amrita.edu/create
 *author:Saranya S;
 *Date of modified: 20-06-2015
 */
var covection_canvas, click_flag_boolean, thermal_conductivity, combo_val, heat_transfer_coeficient;

var indicator_temp_one, indicator_temp_two, indicator_temp_three;

var indicator_temp_four, indicator_temp_five, indicator_temp_six;

var timer_count, max_sec, temperature_first_min, temperature_first_max, temperature_six_min, temperature_six_max;

var thermalconductivity_air, needle_count, current, voltage, wooden_boxside_float, wooden_boxheight_float;

var cylinder_diameter, cylinder_length, cylinder_thick, indicator_text_count, indicator_rotation_count;

var _voltage_int, count_int, ammeter_count, tubearea_float, avg_tube_temperature, heat_coefficient_value;

var total_heattransfer, averageTemp, angle_int, delta_temperature, average_temperature_int, nusselt_num_float;

var total_heattransfer, tick, temp_first, temp_second, temp_third, temp_four, temp_five, temp_six;

var scaling_material, box_to_scale, temperature_count, gt, sec;

var slidersideLabel, sliderheightLabel, sliderdiameterLabel, sliderlengthLabel, sliderthicknessLabel, selectedMaterial;

var materialArray = materialItemArray = [];

var progressText = new createjs.Text("", "2em Tahoma", "#000000");
/**thermal conductivity of given materials */
var thermalConductivity = {
    aluminium: 237,
    copper: 401,
    iron: 80.4,
    silver: 429,
    steel: 20
};

/**for finding the average temperature of the materials*/
var avgTemperature = {
 	aluminium: [4,2],
    copper: [5,3],
    iron: [6,4],
    silver: [8,6],
    steel: [10,8]
};

$(document).ready(function () {
    gt = new Gettext({
        'domain': 'messages'
    });
    materialArray = [ _("Aluminium"), _("Copper"), _("Iron"), _("Silver"), _("Steel") ];/** Items for the drop down */
    materialItemArray = ["aluminium", "copper", "iron", "silver", "steel", "aluminium_inner", "copper_inner", "iron_inner", "silver_inner", "steel_inner" ];/**array stores the collectionb of materials used for visibility*/
    $("#expName").html(_("Heat Transfer by Natural Convection"));/** Experiment name */
    addintoDropDown($('#dropdown'), materialArray);/** Adding material names to drop down list */
    covection_canvas = document.getElementById("experimentCanvas");
    ctxCon = covection_canvas.getContext('2d');
    covection_canvas.width = $("#canvasBox").width();
    covection_canvas.height = $("#canvasBox").width();
    convection_stage = new createjs.Stage(covection_canvas);
    createjs.Touch.enable(convection_stage);
    stage_width = covection_canvas.width;
    stage_height = covection_canvas.height;
    convection_stage.enableMouseOver(10);/** Enabled mouse over / out events */
    convection_stage.mouseMoveOutside = true;/** Keep tracking the mouse event when it leaves the canvas */
    progressText.x = stage_width / 2.4 - progressText.getMeasuredWidth() / 2;/** Adding the Loading percentage text */
    progressText.y = stage_width / 2.4;
    convection_stage.addChild(progressText);/** Add text to progress bar */
    queue = new createjs.LoadQueue(true);/** Initialize the queue */
    queue.on("progress", handleProgress);/** Loading progress bar */
    queue.on("complete", handleComplete, this);

    /** Images in the queue */
    queue.loadManifest([
        {
            id: "background",
            src: simPath + "images/BG-01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "bg_glass",
            src: simPath + "/images/glass_effect_cover_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "wooden_box",
            src: simPath + "/images/boxFull.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "box_cross_section",
            src: simPath + "/images/box_cross_section.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "Glass_on_box",
            src: simPath + "/images/Glasson_box.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "black_holder",
            src: simPath + "/images/black_holder.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "rod_shadow",
            src: simPath + "/images/rod_shadow.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "stopwatch",
            src: simPath + "/images/stopwatch.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "aluminium",
            src: simPath + "/images/aluminium.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "aluminium_inner",
            src: simPath + "/images/aluminium_cross_section.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "copper",
            src: simPath + "/images/copper.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "copper_inner",
            src: simPath + "/images/copper_cross_section.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "iron",
            src: simPath + "/images/iron.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "iron_inner",
            src: simPath + "/images/iron_cross_section.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "silver",
            src: simPath + "/images/silver.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "silver_inner",
            src: simPath + "/images/silver_cross_section.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "steel",
            src: simPath + "/images/steel.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "steel_inner",
            src: simPath + "/images/steel_cross_section.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "wire",
            src: simPath + "/images/aluminium_wire.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "indicator",
            src: simPath + "/images/indicator_turner_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "indicator_rotation",
            src: simPath + "/images/indicator_to_rotate_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "rotatemc",
            src: simPath + "/images/rotator_line_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "arrow",
            src: simPath + "/images/arrow.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "arrow_indicator",
            src: simPath + "/images/arrow_in_indicator_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "lightOff",
            src: simPath + "/images/switch_off_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "lighton",
            src: simPath + "/images/switch_on_01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "needle",
            src: simPath + "/images/needle-01.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "coil",
            src: simPath + "/images/coil.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "tmpLabel",
            src: simPath + "/images/t1t6label.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "redbutton",
            src: simPath + "/images/redbutton.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "greenbutton",
            src: simPath + "/images/greenbutton.svg",
            type: createjs.LoadQueue.IMAGE
        }, {
            id: "arrow_for_anim",
            src: simPath + "/images/arrow_for_anim.svg",
            type: createjs.LoadQueue.IMAGE
        }
    ]);
    tick = setInterval(updateTimer, 100);/** Stage update function in a timer */
});
/** Update stage frequently */
function updateTimer() {
    convection_stage.update();
}
/** Function for display the loading percentage */
function handleProgress(event) {
    progressText.text = (queue.progress * 100 | 0) + " % Loaded";
}
/** Handle complete function */
function handleComplete(event) {
    loadImagesTexts();/** Images loading in the canvas from load_images_texts.js */
    getmaterialName();/** Giving names to each material which are visible while selecting each option */
    initialisationOfVariables();/** Initial values of all variables */
    controlsHandle();/** Handle all the controls */
    changeOption();/** Drop down list change function for selecting material */

    convection_stage.getChildByName("arrow_right").on("click", function () {/** Clicking right arrow to increase voltmeter & ammeter reading */
        knobForward();/** Increasing voltage and current and also rotating ammeter and voltmeter needle and regulator knob forward */
        if (click_flag_boolean) {/** Checks whether Power on button is clicked or not */
            if (voltage > 0) {
                animation();
            }
        }

    });

    convection_stage.getChildByName("arrow_left").on("click", function () {/** clicking left arrow to decrease voltmeter & ammeter reading */
        knobBackward();/** Rotating ammeter and voltmeter needle and regulator knob backward */
    });
    convection_stage.getChildByName("arrow_indicate_right").on("click", function () {/** Clicking left arrow to increase temperature */
        if ((indicator_text_count < 6)) {/** Rotate the temperature indicator till the count reaches 7 */
            rotateTempIndicator(1, 35);/** Counter increment by 1 and angle rotate by 32 */
            indicatorReadingFn();/** The reading value display function */
        }
    });

    convection_stage.getChildByName("arrow_indicate_left").on("click", function () {/** Clicking left arrow to decrease temperature */
        indicatorReadingFn();/** The indicator reading value display function */
        if ((indicator_text_count > 1)) {
            rotateTempIndicator(-1, -35);/** Counter increment by 1 and angle rotate by 32 */
            indicatorReadingFn();/** The reading value display function */
        }
    });
}
/** Adding items to the drop down list */
function addintoDropDown(getId, valueSet) {
    var _selected = getId;
    $.each(valueSet, function (val, text) {
        _selected.append($('<option></option>').val(val).html(text));
        console.log(val);
    });

}
/** Animation function */
function animation() {
    convection_stage.getChildByName("arrow_for_anim").visible = true;
    convection_stage.getChildByName("arrow_for_anim_right").visible = true;
    convection_stage.getChildByName("arrow_for_anim_middle").visible = true;
    createjs.Ticker.setInterval(5);/** Animating heat flow arrows when voltage greater than 0 */
    createjs.Ticker.addEventListener("tick", arrowAnimation);
}
/** Initialize get text function. translate the string can be done by adding _ before the text */
var _ = function (a) {
    return gt.gettext(a);
};
/** Image loading function */
function loadImages(image, name, xPos, yPos, sFactor, flipFactor, angle, regx, regy, cursor) {
    var _bitmap = new createjs.Bitmap(image).set({});
    getBoundFn(_bitmap, sFactor);
    _bitmap.scaleX = _bitmap.scaleX * flipFactor;
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = angle;
    _bitmap.cursor = cursor;
    if (regx != "") {
        _bitmap.regX = _bitmap.image.width / regx;
    }
    if (regy != "") {
        _bitmap.regY = _bitmap.image.height / regy;
    }
    convection_stage.addChild(_bitmap);
}
/** Add text field function */
function setText(name, textX, textY, value, color) {
    var _text = new createjs.Text();
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.font = "bold " + covection_canvas.width / 452 + "em Tahoma";
    _text.text = value;
    _text.color = color;
    convection_stage.addChild(_text);
}
/** Image scaling function */
function getBoundFn(bitmap, sFactor) {
    var _bounds = bitmap.getBounds();
    scaleFactor = Math.min(covection_canvas.width / _bounds.width, covection_canvas.height / _bounds.height);
    bitmap.scaleX = bitmap.scaleY = sFactor * scaleFactor;
}
/** Setting initial values */
function initialisationOfVariables() {
    heat_transfer_coeficient = 5;/** Heat transfer coefficient of air = 5W/m²°C */
    indicator_temp_one = indicator_temp_two = indicator_temp_three = indicator_temp_four = indicator_temp_five = indicator_temp_six = temperature_first_min = temperature_six_min = 27;
    timer_count = 25;
    indicator_text_count = 1;
    ammeter_count = 2;
    max_sec = 20;
    voltage = 0;
    thermal_conductivity = 237;
    temperature_count = 16;
    temperature_first_max = 30;
    temperature_six_max = 36;
    thermalconductivity_air = 0.024;
    needle_count = 12;
    count_int = sec = combo_val = indicator_rotation_count = nusselt_num_float = 0;
    click_flag_boolean = false;
    convection_stage.getChildByName("box_cross_section").visible = false;
    document.getElementById("resultChkBox").disabled = true;
    convection_stage.getChildByName("start").text = _("START");
    convection_stage.getChildByName("lighton").visible = false;
    convection_stage.getChildByName("lightOff").visible = true;

    convection_stage.getChildByName("arrow_for_anim").visible = false;
    convection_stage.getChildByName("arrow_for_anim_middle").visible = false;
    convection_stage.getChildByName("arrow_for_anim_right").visible = false;
    convection_stage.getChildByName("black_holder").visible = true;
    convection_stage.getChildByName("tmpLabel").visible = true;
    convection_stage.getChildByName("Glass_on_box").visible = true;
    convection_stage.getChildByName("voltmeter_text").visible = false;
    convection_stage.getChildByName("ammeter_text").visible = false;
    convection_stage.getChildByName("indicatorTxt").visible = false;
    convection_stage.getChildByName("coil").visible = false;
    convection_stage.getChildByName("wire").visible = false;
    /** Setting aluminium rod as the material selected and setting its thermal conductivity on load */

    wooden_boxside_float = $("#boxSide").val() / 100;
    wooden_boxheight_float = $("#boxHeight").val() / 100;
    cylinder_diameter = $("#cylinderDiameter").val() / 100;
    cylinder_length = $("#cylinderLength").val() / 100;
    cylinder_thick = $("#cylinderthickness").val() / 100;
    slidersideLabel = _("Side of wooden box (cm):");
    sliderheightLabel = (_("Height of wooden box(cm):"));
    sliderdiameterLabel = (_("Diameter of cylinder(cm):"));
    sliderlengthLabel = (_("Length of cylinder (cm):"));
    sliderthicknessLabel = (_("Thickness of the cylinder (cm):"));
    $("#sideOfBox").html(slidersideLabel + " " + 5);/** set initial value of slider as 5 */
    $("#heightOfBox").html(sliderheightLabel + " " + 70);
    $("#diameterOfCylinder").html(sliderdiameterLabel + " " + 4);
    $("#lengthOfCylinder").html(sliderlengthLabel + "  " + 50);
    $("#thicknessOfCylinder").html(sliderthicknessLabel + "  " + 0.1);
    convection_stage.getChildByName("greenbutton").alpha = 0.5;
    convection_stage.getChildByName("redbutton").alpha = 0.5;
}

/** All controls are handle by this function */
function controlsHandle() {
    /** Translate the stings used in the experiment by adding '_' before it */
    $("#material").html(_("Choose material:"));
    $("#showResultTxt").html(_("Show result"));
    $("#showResultTxtcross").html(_("Show crosssection"));
    $("#nusseltNum").html(_("Nusselt number(N):"));
    $("#heatCoefficient").html(_("Heat transfer coefficient(h):"));
    $("#poweronBtn").val(_("Power On"));
    $("#variables").html(_("Variables"));
    $("#reultTxt").html(_("Result"));
    $("#poweronBtn").bind("click", function () {/** Power on the switch */
        if ($("#poweronBtn").val() == _("Power On")) {

            startExperiment();/** Experiment starting function */
        } else {/** Power off the switch */

            resetExperiment();/** Resetting the experiment */

        }
    });

    /** Check box for showing cross section of the material */
    $("#crossSectionChkBox").change(function () {
        changeOption();
    });

    /** Drop down list */
    $("#dropdown").change(function () {
        combo_val = this.selectedIndex;/** Assigning the index selected combo box value*/
        resetSliders();/** Resetting slider values on drop down list change event */
        changeOption();/** Changing the metal rod selected and setting its thermal conductivity value */
    });

    /** Check box for showing result after the completion of timer event */
    $("#resultChkBox").change(function () {
        if (this.checked) {
            $("#heat_value").html(heat_coefficient_value.toFixed(2)+"Wm<sup>-2</sup>K<sup>-1</sup>");
            $("#nusslet_number").html(nusselt_num_float.toFixed(2));
        } else {
            $("#heat_value").html("");
            $("#nusslet_number").html("");
        }
    });

    /** Changing box width on slider change */
    $("#boxSide").change(function () {
        /** Set initial value of slider as 5 */
        $("#sideOfBox").html(slidersideLabel + " " + $("#boxSide").val());
        wooden_boxside_float = $("#boxSide").val() / 100;
        getBoundFn(box_to_scale, 0.62);
        getBoundFn(convection_stage.getChildByName("Glass_on_box"), 0.55);
        /** Scaling wooden box */
        box_to_scale.scaleX = box_to_scale.scaleX + (wooden_boxside_float - 0.05) / 2;
        /** Scaling(x) glass image along with wooden box */
        if (!($('#crossSectionChkBox').is(':checked'))) {
            convection_stage.getChildByName("Glass_on_box").scaleX = convection_stage.getChildByName("Glass_on_box").scaleX + (wooden_boxside_float - 0.05) / 2
        }
    });

    $("#boxHeight").change(function () {/** Changing box height on slider change */
        $("#heightOfBox").html(sliderheightLabel + " " + $("#boxHeight").val());/** Set initial value of slider as 70 */
        wooden_boxheight_float = $("#boxHeight").val() / 100;
        getBoundFn(box_to_scale, 0.62);
        getBoundFn(convection_stage.getChildByName("Glass_on_box"), 0.55);
        /** Scaling wooden box */
        box_to_scale.scaleY = box_to_scale.scaleY + (wooden_boxheight_float - 0.7) / 2;
        if (!($('#crossSectionChkBox').is(':checked'))) {/** Scaling(y) glass image along with wooden box */
            convection_stage.getChildByName("Glass_on_box").scaleY = convection_stage.getChildByName("Glass_on_box").scaleY + (wooden_boxheight_float - 0.7) / 2;
        }
    });

    $("#cylinderDiameter").change(function () {/** Changing cylinder diameter on slider change */
        $("#diameterOfCylinder").html(sliderdiameterLabel + " " + $("#cylinderDiameter").val());/** Set initial value of slider as 4 */
        cylinder_diameter = $("#cylinderDiameter").val() / 100;
        getBoundFn(scaling_material, 0.5);
        scaling_material.scaleX = scaling_material.scaleX + cylinder_diameter - .04;/** Scaling metal rods in x axis */
    });

    $("#cylinderLength").change(function () {/** Changing cylinder length on slider change */
        $("#lengthOfCylinder").html(sliderlengthLabel + " " + $("#cylinderLength").val());
        /** Set initial value of slider as 50 */
        cylinder_length = $("#cylinderLength").val() / 100;
        getBoundFn(scaling_material, 0.5);
        /** Scaling metal rods in y axis */
        scaling_material.scaleY = scaling_material.scaleY + (cylinder_length - .5) / 3.3;

    });

    $("#cylinderthickness").change(function () {/** Changing cylinder thickness on slider change */
        $("#thicknessOfCylinder").html(sliderthicknessLabel + " " + $("#cylinderthickness").val());/** Set initial value of slider as 0.01 */
        cylinder_thick = $("#cylinderthickness").val() / 100;
    });
}

/** Function for the rotation of temperature indicator */
function rotateTempIndicator(incr, rotVal) {/** knob of the indicator */
    indicator_text_count = indicator_text_count + incr;
    indicator_rotation_count += rotVal;/** indicator count */
    convection_stage.getChildByName("indicator_rotation").rotation = indicator_rotation_count;
}

/** The reading value display function */
function indicatorReadingFn() {
    /** Indicator count text box value */
    convection_stage.getChildByName("indicator_text").text = "T" + indicator_text_count;
}

/** Changing metal rod based on the drop down value */
function changeOption() {
    if (!($('#crossSectionChkBox').is(':checked'))) {
        /** Checking whether show cross section check box is checked or not */
        convection_stage.getChildByName("box_cross_section").visible = false;
        convection_stage.getChildByName("wooden_box").visible = true;
        convection_stage.getChildByName("black_holder").visible = true;
        convection_stage.getChildByName("Glass_on_box").visible = true;
        convection_stage.getChildByName("tmpLabel").visible = true;
        convection_stage.getChildByName("wire").visible = false;
        convection_stage.getChildByName("coil").visible = false;
        box_to_scale = convection_stage.getChildByName("wooden_box");

        for (var i = 0; i < 5; i++) {
            if ($('#dropdown').val() == i) {
                convection_stage.getChildByName(materialItemArray[i]).visible = true;
                convection_stage.getChildByName(materialItemArray[i + 5]).visible = false;
                scaling_material = convection_stage.getChildByName(materialItemArray[i]);
            } else {
                convection_stage.getChildByName(materialItemArray[i]).visible = false;
                convection_stage.getChildByName(materialItemArray[i + 5]).visible = false;
            }
        }

    } else {/** 'show cross section' option selected */
        convection_stage.getChildByName("wire").visible = true;
        convection_stage.getChildByName("coil").visible = true;
        convection_stage.getChildByName("box_cross_section").visible = true;
        convection_stage.getChildByName("wooden_box").visible = false;
        convection_stage.getChildByName("black_holder").visible = false;
        convection_stage.getChildByName("tmpLabel").visible = false;
        convection_stage.getChildByName("Glass_on_box").visible = false;
        box_to_scale = convection_stage.getChildByName("box_cross_section");
        for (var j = 0; j < 5; j++) {
            if ($('#dropdown').val() == j) {
                convection_stage.getChildByName(materialItemArray[j + 5]).visible = true;
                convection_stage.getChildByName(materialItemArray[j]).visible = false;
                scaling_material = convection_stage.getChildByName(materialItemArray[j + 5]);
            } else {
                convection_stage.getChildByName(materialItemArray[j]).visible = false;
                convection_stage.getChildByName(materialItemArray[j + 5]).visible = false;
            }
        }
    }
    findTemperature();
}

/** Calculation of temperature with each drop down value */
function dropDownValueCalculation() {
	/**for average temperature take min temp and max temp of the material */
	var materialTemp = (materialItemArray[($("#dropdown").find("option:selected").index())]);
  	var maxTemp = avgTemperature[materialTemp][0];
    var minTemp = avgTemperature[materialTemp][1];  
    temperature_first_max = 30;
    temperature_six_max = 36;
    avgTempOfAir = (temperature_first_max + temperature_six_max) / 2;
    avg_tube_temperature = Number(Number(delta_temperature) + Number(avgTempOfAir));/** Average temperature of air */
    temp_first = temperature_first_max;
    temp_six = temperature_six_max;
    temp_second = avg_tube_temperature - maxTemp;
    temp_third = avg_tube_temperature + minTemp;
    temp_four = avg_tube_temperature + maxTemp;
    temp_five = avg_tube_temperature - minTemp;
}

/** Calculating temperature value by calculating current,area of the metal cylinder,area of wooden box,total heat transfer and change in temperature */
function heatTransferCoeffCalculation() {
    selectedMaterial = (materialItemArray[($("#dropdown").find("option:selected").index())]);
    thermal_conductivity = thermalConductivity[selectedMaterial];	
    /** Current in the ammeter */
    current = findCurrent(voltage);
    /** Calculating area of metal cylinder */
    tubearea_float = Math.PI.toFixed(2) * cylinder_diameter * cylinder_length;
    /** Area of wooden box */
    woodenbox_area = 2 * (wooden_boxside_float + wooden_boxside_float) * wooden_boxheight_float;
    /** Calculating heat flow through the wooden box */
    total_heattransfer = 1 / (Number(1 / Number(heat_transfer_coeficient * woodenbox_area) + Number(cylinder_thick / thermal_conductivity * tubearea_float)) * tubearea_float);
    /** Calculating average temperature */
    delta_temperature = (voltage * current) / (total_heattransfer * tubearea_float);
	 dropDownValueCalculation();/**find out the average temperature of material selected*/  
    /** Mathematical equation for finding Nusselt number is N=hL/K where k is the thermal conductivity of air */
    nusselt_num_float = total_heattransfer * cylinder_length / thermalconductivity_air;
    /** Calculating Heat coefficient 'h' */
    heat_coefficient_value = Number(voltage * current) / Number(tubearea_float * delta_temperature);
}

/** Calculating temperature in the indicator */
function findTemperature() {
    averageTemp = heatTransferCoeffCalculation();
    if (convection_stage.getChildByName("stopWatchMint").text <= 19) {/** Changing temperature timer in the indicator when stop watch value <=19 */
        displayTempLabel();/** Function for calculating temperature values */
    } else {/** Otherwise displaying final temperature values */
        temperatureFinalValues();
    }
}

/** Assigning temperature values in the indicator based on the heat flow */
function temperatureFinalValues() {
    if (indicator_text_count == 1) {
        display_temp_int = temp_first;
    } else if (indicator_text_count == 2) {
        display_temp_int = temp_second;
    } else if (indicator_text_count == 3) {
        display_temp_int = temp_third;
    } else if (indicator_text_count == 4) {
        display_temp_int = temp_four;
    } else if (indicator_text_count == 5) {
        display_temp_int = temp_five;
    } else if (indicator_text_count == 6) {
        display_temp_int = temp_six;
    }
    convection_stage.getChildByName("indicator_text").text = "T" + indicator_text_count;
    convection_stage.getChildByName("indicatorTxt").text = display_temp_int.toFixed(2);
    return display_temp_int;
}

/** Calculating temperature values in the indicator */
function displayTempLabel() {
    if (voltage == 0) {
        convection_stage.getChildByName("indicatorTxt").text = 27;
    } else {
        indicator_temp_one += (temperature_first_max - temperature_first_min) / (timer_count * max_sec);
        /** Temperature for T1 */
        indicator_temp_two += (temp_second - temperature_first_min) / (timer_count * max_sec);
        /** Temperature for T2 */
        indicator_temp_three += (temp_third - temperature_first_min) / (timer_count * max_sec);
        /** Temperature for T3 */
        indicator_temp_four += (temp_four - temperature_first_min) / (timer_count * max_sec);
        /** Temperature for T4 */
        indicator_temp_five += (temp_five - temperature_first_min) / (timer_count * max_sec);
        /** Temperature for T5 */
        indicator_temp_six += (temperature_six_max - temperature_six_min) / (timer_count * max_sec);
        /** Temperature for T6 */
        if (indicator_text_count == 1) {/** Displaying temperature in the indicator */
            convection_stage.getChildByName("indicatorTxt").text = indicator_temp_one.toFixed(2);
        } else if (indicator_text_count == 2) {
            convection_stage.getChildByName("indicatorTxt").text = indicator_temp_two.toFixed(2);
        } else if (indicator_text_count == 3) {
            convection_stage.getChildByName("indicatorTxt").text = indicator_temp_three.toFixed(2);
        } else if (indicator_text_count == 4) {
            convection_stage.getChildByName("indicatorTxt").text = indicator_temp_four.toFixed(2);
        } else if (indicator_text_count == 5) {
            convection_stage.getChildByName("indicatorTxt").text = indicator_temp_five.toFixed(2);
        } else if (indicator_text_count == 6) {
            convection_stage.getChildByName("indicatorTxt").text = indicator_temp_six.toFixed(2);
        }
    }
    convection_stage.getChildByName("indicator_text").text = "T" + indicator_text_count;
}

/** Starting the working of apparatus */
function startExperiment() {
    click_flag_boolean = true;/** Checking 'Power On' button is clicked or not */
    /**calling stop watch*/
    startWatch(convection_stage.getChildByName("stopWatchHr"), convection_stage.getChildByName("stopWatchMint"), convection_stage.getChildByName("stopWatchSec"));
    timer_check = setInterval(checkTime, 10);/** Check time equal to 20 minutes */
    convection_stage.getChildByName("voltmeter_text").visible = true;
    convection_stage.getChildByName("ammeter_text").visible = true;
    convection_stage.getChildByName("lighton").visible = true;
    convection_stage.getChildByName("lightOff").visible = false;
    document.getElementById("dropdown").disabled = true;
    resetSliders();
    convection_stage.getChildByName("start").text = _("STOP");
    $("#poweronBtn").val(_("Reset"));
    if (voltage > 0) {
        animation();
    }
    convection_stage.getChildByName("indicatorTxt").visible = true;
    convection_stage.getChildByName("greenbutton").alpha = 1;
    convection_stage.getChildByName("redbutton").alpha = 0.5;
}

/** Resetting all values to its initial value */
function resetExperiment() {
    resetStopWatch();/** Resetting stopwatch here */
    resetSliders();/** Resetting slider values on drop down list change event */
    changeOption();/** Changing the metal rod selected and setting its thermal conductivity value */
    initialisationOfVariables();/** Setting initial values of all the parameters */
    getmaterialName();
    resetValue();/** resetting all values */
    $("#poweronBtn").val(_("Power On"));/**re-initialize the start button*/
}
/** This function execute during the stop watch runs, stopwatch will stop when it reach 20 mins*/
function checkTime() {
    if (minute >= 20) {
        pauseTimer();/** Pause the timer when minutes reaches 20 */
        clearInterval(timer_check);
        document.getElementById("resultChkBox").disabled = false;/** Enabling checkbox2 to show the result */
    }
    findTemperature();
}
/** Calculating current in the ammeter */
function findCurrent(_voltage_int) {
    if (_voltage_int == 0) {
        current = 0;/** Assigning current to zero when voltmeter reading zero */
    } else {
        /** Calculating current using voltmeter reading value. */
        current = Number(0.2 + Number(Number(_voltage_int - 100) * 0.01));
    }
    return current;
}
/** Increasing voltage and current and also rotating ammeter, voltmeter needle and regulator knob forward */
function knobForward() {
    if (click_flag_boolean) {/** Power on button clicked */
        convection_stage.getChildByName("voltmeter_text").visible = true;
        convection_stage.getChildByName("ammeter_text").visible = true;
    }
    if ((count_int >= 0 && count_int < 367.5)) {
        needle_count += 3.5;/** Increasing voltmeter rotation */
        count_int += 17.5;/** Incrementing knob rotation by 17.5 degree */
        convection_stage.getChildByName("rotatemc").rotation = count_int;/** Assigning rotation for the knob */
        /** Setting volage to 100 when the volage is zero or not a number */
        if (voltage == 0 || isNaN(voltage) == true) {
            voltage = 100;
        } else {
            voltage += 10;/** Increasing voltage by 10 on each rotation */
        }
        convection_stage.getChildByName("needle").rotation = needle_count;
        if (ammeter_count < 90 || (convection_stage.getChildByName("ammeter_needle").rotation < 90)) {
            ammeter_count += 10;/** Increasing ammeter needle rotation by 10 */
            convection_stage.getChildByName("ammeter_needle").rotation = ammeter_count;
        }
        convection_stage.getChildByName("voltmeter_text").text = voltage;
        convection_stage.getChildByName("ammeter_text").text = findCurrent(voltage).toFixed(1);
    }
    findTemperature();
}
/** Decreasing voltage and current and also rotating voltmeter, ammeter needle and regulator knob backward */
function knobBackward() {
    if ((count_int >= 17.5 && count_int <= 367.5)) {
        if (count_int == 17.5) {/** Needle is at initial position */
            convection_stage.getChildByName("rotatemc").rotation = 0;/** Setting knob rotation to zero */
            convection_stage.getChildByName("needle").rotation = 0;/** Setting voltmeter needle rotation to zero */
            convection_stage.getChildByName("ammeter_needle").rotation = 0;/** Setting ammeter needle rotation to zero */
            convection_stage.getChildByName("ammeter_text").text = "0";/** Setting ammeter and voltmeter value to zero and setting its rotation value to zero */
            convection_stage.getChildByName("voltmeter_text").text = "0";
            needle_count = 12;
            ammeter_count = 2;
            count_int = 0;
            voltage = 0;
        } else {
            count_int -= 17.5;/** Decreasing voltmeter knob rotation by 17.5 degree */
            convection_stage.getChildByName("rotatemc").rotation = count_int;
            needle_count -= 3.5;/** Desreasing voltmeter needle rotation by 3.7 */
            convection_stage.getChildByName("needle").rotation = needle_count;
            voltage -= 10;
            if (needle_count <= 45 && needle_count > 14) {
                ammeter_count -= 10;/** Decreasing ammeter rotation by 10 degree */
                convection_stage.getChildByName("ammeter_needle").rotation = ammeter_count;
            }
            findTemperature();
            convection_stage.getChildByName("voltmeter_text").text = voltage;/** Text in the voltmeter */
            convection_stage.getChildByName("ammeter_text").text = findCurrent(voltage).toFixed(1);/** Text in the ammeter */
        }
    }
}
/** Function for resetting all values while clicking reset button */
function resetValue() {
    convection_stage.getChildByName("wooden_box").visible = true;
    document.getElementById("dropdown").disabled = false;
    convection_stage.getChildByName("start").text = _("START");
    /** Resetting the initial position of animation arrows */
    convection_stage.getChildByName("arrow_for_anim").y = stage_height / 1.2;
    convection_stage.getChildByName("arrow_for_anim_right").y = stage_height / 1.2;
    convection_stage.getChildByName("arrow_for_anim_middle").y = stage_height / 1.2;
    /** Setting text in the ammeter,voltmeter,stop watch & and indicator to its initial value */
    convection_stage.getChildByName("ammeter_text").text = convection_stage.getChildByName("voltmeter_text").text = "00";
    convection_stage.getChildByName("indicator_text").text = convection_stage.getChildByName("indicatorTxt").text = "";
    convection_stage.getChildByName("stopWatchHr").text = convection_stage.getChildByName("stopWatchMint").text = convection_stage.getChildByName("stopWatchSec").text = "00";
    $("#heat_value,#nusslet_number").html("");/** Resetting result values */
    createjs.Ticker.removeEventListener("tick", arrowAnimation);/** Removing arrow animations */
    convection_stage.getChildByName("needle").rotation = 0;
    convection_stage.getChildByName("ammeter_needle").rotation = 0;
    convection_stage.getChildByName("rotatemc").rotation = 0;
    convection_stage.getChildByName("indicator_rotation").rotation = 16;
    $("#crossSectionChkBox,#resultChkBox").prop("checked", false);
    $('#dropdown').find('option:first').attr('selected', 'selected');/** Resetting drop down value to 'Aluminium' */
    resetSliders();
}

/** Resetting sliders to its initial value on drop down change */
function resetSliders() {
    document.getElementById("boxSide").disabled = false;
    document.getElementById("boxHeight").disabled = false;
    document.getElementById("cylinderDiameter").disabled = false;
    document.getElementById("cylinderLength").disabled = false;
    document.getElementById("cylinderthickness").disabled = false;
    $("#boxSide").val(5);
    $("#boxHeight").val(70);
    $("#cylinderDiameter").val(4);
    $("#cylinderLength").val(50);
    $("#cylinderthickness").val(0.1);
}

/** Function for animating  vertical arrow on increasing current */
function arrowAnimation() {
    if (convection_stage.getChildByName("arrow_for_anim").y > stage_height / 13.46) {
        /** limit the upward movement of arrow when it reaches the top*/
        convection_stage.getChildByName("arrow_for_anim").y -= stage_height / stage_height;
        convection_stage.getChildByName("arrow_for_anim_right").y -= stage_height / stage_height;
        convection_stage.getChildByName("arrow_for_anim_middle").y -= stage_height / stage_height;
        if (convection_stage.getChildByName("arrow_for_anim").y <= stage_height / 13.46) {
            /**adjusting the x position when arrow reaches the top*/
            convection_stage.getChildByName("arrow_for_anim").x = stage_width / 1.35;
            convection_stage.getChildByName("arrow_for_anim_right").x = stage_width / 1.1
        }
    } else {
        /**after reaches the top rotate the left and right arrow to 90 degree and middle remains same.*/
        convection_stage.getChildByName("arrow_for_anim").rotation = -90;
        convection_stage.getChildByName("arrow_for_anim_right").rotation = 90;
        convection_stage.getChildByName("arrow_for_anim_right").y = stage_height / 21.375;
        /**move the arrow to left and right*/
        convection_stage.getChildByName("arrow_for_anim").x -= stage_height / stage_height;
        convection_stage.getChildByName("arrow_for_anim_right").x += stage_height / stage_height;
        convection_stage.getChildByName("arrow_for_anim_middle").y -= stage_height / stage_height;
        if (convection_stage.getChildByName("arrow_for_anim").x < stage_height / 2) {
            /**limit the movement till the arrow moves to some distance,
            then restart the arrow from the beginning*/
            convection_stage.getChildByName("arrow_for_anim").y = stage_height / 1.2;
            convection_stage.getChildByName("arrow_for_anim_right").y = stage_height / 1.2;
            convection_stage.getChildByName("arrow_for_anim_middle").y = stage_height / 1.2;
            convection_stage.getChildByName("arrow_for_anim").x = stage_height / 1.3;
            convection_stage.getChildByName("arrow_for_anim_right").x = stage_height / 1.19;
            convection_stage.getChildByName("arrow_for_anim").rotation = 0;
            convection_stage.getChildByName("arrow_for_anim_right").rotation = 0;
        }
    }
}