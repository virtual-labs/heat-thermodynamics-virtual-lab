/** js file for define the functions.
    *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
    *VALUE (Virtual Amrita Laboratories Universalizing Education)
    *Amrita University, India
    *http://www.amrita.edu/create
    *author:Anitha;
    *Date of modified: 2-07-2015
*/
/** Variables declaration */
var black_body_stage, exp_canvas, stage_width, stage_height;

var power_on_flag, stopwatch_flag, radius_float, mass_float, water_temp_float, surround_temp;

var sigma_constant, area_disc, time_constant, heat_of_disc_int, viscosity_float, degree_to_kelvin_float;

var kelvin, steady_temp, time_interval_float, vertexh_constant, constant_float;

var disc_fit_flag, sec_timer, milli_sec, minuteTimer, power_btn_var, reset_btn_var, vertexk_constant;

var anim_frame, anim_width, anim_object, radioVal;

var gt; /** Object for Gettext.js */

var progressText = new createjs.Text("", "2em Tahoma, Geneva, sans-serif", "#000000");
/** Variable declaration ends */

/** Start controls for Black Body Radiation: Stefan-Boltzmann Radiation Law */
$(document).ready(function() {
    gt = new Gettext({
        'domain': 'messages'
    });
    $("#expName").html(_("Black Body Radiation: Stefan-Boltzmann Radiation Law")); /** Experiment name */
    exp_canvas = document.getElementById("experimentCanvas");
    exp_canvas.width = $("#canvasBox").width();
    exp_canvas.height = $("#canvasBox").height();
    stage_width = exp_canvas.width; /** Set stage width and height as canvas width and height */
    stage_height = exp_canvas.height;
    black_body_stage = new createjs.Stage(exp_canvas); /** Initialize createjs stage */
    createjs.Touch.enable(black_body_stage);
    /** Createjs cannot trigger mouse evnt automatically. Enabled mouse over / out events */
    black_body_stage.enableMouseOver(10);
    black_body_stage.mouseMoveOutside = true; /** Keep tracking the mouse even when it leaves the canvas */
    progressText.x = stage_width / 2.4 - progressText.getMeasuredWidth() / 2; /** Adding the Loading percentage text */
    progressText.y = stage_width / 2.4;
    black_body_stage.addChild(progressText); /** Add text to progress bar */
    queue = new createjs.LoadQueue(true); /** Initialize the queue */
    queue.on("progress", handleProgress); /** Loading progress bar */
    queue.on("complete", handleComplete, this);
    queue.loadManifest([{
	/** adding images into the queue */
        id: "background",
        src: simPath + "/images/background.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "crossSectional",
        src: simPath + "/images/crossSectionalView.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "knobDown",
        src: simPath + "/images/knobDown.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "knobUp",
        src: simPath + "/images/konbUp.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "stopwatch",
        src: simPath + "/images/stopwatch.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "startBtn",
        src: simPath + "/images/start_stop_btn.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "stopBtn",
        src: simPath + "/images/start_stop_btn.svg",
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
        id: "wateranim",
        src: simPath + "/images/water_animation.svg",
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
    black_body_stage.update();
}

/** Function for display the progress of loading */
function handleProgress(event) {
    progressText.text = (queue.progress * 100 | 0) + " % Loaded";
}

/** All variables initialising in this function */
function initialisationOfVariables() {
	/** Initialise power on, stopwatch and disc fit flag */
    power_on_flag = stopwatch_flag = disc_fit_flag = false; 
    water_temp_float = 35; /** Initial value of slider water temperature */
    surround_temp = 20; /** Initial value of slider surround temperature */
    mass_float = .005; /** Initial value of slider mass of disc */
    radius_float = .03; /** Initial value of slider radius of disc */
    sigma_constant = 0.0000000567; /** stefan-boltzmann constant sigma */
    area_disc = 0; /** Area of disc */
    heat_of_disc_int = 381; /** Specific heat of disc */
    viscosity_float = 0; /** Viscosity of disc */
    steady_temp = 0; /** Steady state temperature */
    milli_sec = 0; /** Initial value of milliseconds */
   /** These following variables and constant variables are for converting degree to kelvin. 0 degree=273.15K*/
    kelvin = 273.15; 
    degree_to_kelvin_float = 0;
    time_constant = 2520;
    time_interval_float = 0;
    vertexh_constant = 2520;//constant for finding steady temperature
    vertexk_constant = 0; //constant for finding steady temperature
    constant_float = 0;
    anim_frame = 0; /** Frame used for animation */
	/** The value of 'Power on' and 'Reset' buttons are take in a variable for language translation */
    power_btn_var = _("Power on"); 
    reset_btn_var = _("Reset");	
	radioVal="T1";
    $("#poweronBtn").val(power_btn_var); /** Label of the power button '_' will translate the string using gettext */
    $("#fitDiscBtn").attr('disabled', 'disabled').css({
        "opacity": 0.5,
        "cursor": "default"
    }); /** Disable the fit disc button */
    $("#checkBox").prop("checked", false); /** Resetting the check box */
    $("#t1Rdo").prop("checked", true); /** Resetting the radio button */
	 $("#waterTemp").html(waterLabel+" "+35+" (℃)"); 
	$("#surroundTemp").html(surroundLabel+" "+20+" (℃)");
	$("#discMass").html(discMassLabel+" "+5+_("g"));
    $("#discRadius").html(radiusLabel+" "+3+_("cm"));
    $("#tempValue").html(radioVal+" : "+surround_temp + " ℃");
}

/** Loading the images and initialize the html control events */
function handleComplete(event) {
    /** Images loading in the canvas from load_images_texts.js */
	loadImagesTexts(); 
	initialisationOfVariables(); /** Initialize each variable with the initial value */
    /** This function is used for calculate steady state temperature */
	steadyTemperatureCalculation(); 
	/** Calculation of time interval and conversion of degree to kelvin. 0 degree=273.15 kelvin. 2.5 and 5 are for adjusting the time interval.*/	
    time_interval_float = ((steady_temp - kelvin) + 2.5); 
    displayTemperature(); /** Temperature display function */
    controlsHandle(); /** All controls are handle by this function */
    initializeImages(); /** Function call for images used in the apparatus visibility */
    anim_object = black_body_stage.getChildByName("waterAnimation"); /** Animation frames take as an object */
    poweron_circle = new createjs.Shape(); /** Add circle shape for power on/off */
    poweron_circle.name="powerOnCircle";
    poweron_circle.graphics.beginFill("#660000").drawCircle(0, 0, 3);
    poweron_circle.x = stage_width/1.484;
    poweron_circle.y = stage_height/2.534;    
    black_body_stage.addChild(poweron_circle);
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initializeImages() {
    black_body_stage.getChildByName("crossSectional").visible = false;
    black_body_stage.getChildByName("knobUp").visible = false;
    black_body_stage.getChildByName("stopBtn").visible = false;
    black_body_stage.getChildByName("startBtn").visible = true;
	/** Alpha 1 of green means stop watch is running.Initial opacity as 0.5.Alpha 1 of red means stopwatch not started .Initial opacity of red button set as 1 */
    black_body_stage.getChildByName("greenButton").alpha = 0.5;
    black_body_stage.getChildByName("redButton").alpha = 1; 
    black_body_stage.getChildByName("waterAnimation").visible = false; 
    black_body_stage.getChildByName("stopWatchValHr").text = black_body_stage.getChildByName("stopWatchValMin").text = black_body_stage.getChildByName("stopWatchValSec").text = "00";
    black_body_stage.getChildByName("indicatorText").text = "";
    black_body_stage.getChildByName("stopwatchLabel").text = _("START");
}

var waterLabel, surroundLabel, discMassLabel,radiusLabel;
/** All controls are handle by this function */
function controlsHandle() {
    /** Translate the stings used in the experiment by adding '_' before it. This is done for language translation. */
    $("#variables").html(_("Variables"));
    $("#measurements").html(_("Measurements"));
	waterLabel=_("Water Temperature ");
	surroundLabel=_("Surrounding Temperature ");
	radiusLabel=_("Radius of Disc ");
	 $("#waterTemp").html(waterLabel+" "+35+" ℃"); 
    $("#surroundTemp").html(surroundLabel+" "+20+" ℃");
	discMassLabel=_("Mass of Disc ")
    $("#discMass").html(discMassLabel+" "+5+_("g"));
    $("#discRadius").html(radiusLabel+" "+3+_("cm"));
    $("#crossView").html(_("cross-sectional view"));
    $("#selectTemp").html(_("Select temperature probe"));
    $("#fitDiscBtn").val(_("Fit the disc"));
	/** Animation width */
    anim_width = stage_width / 0.9731725860758121; 
	/** Power on the switch */
    $("#poweronBtn").bind("click", function() { 
        power_on_flag = true; 
        if ($("#poweronBtn").val() == power_btn_var) {
			black_body_stage.getChildByName("startBtn").mouseEnabled=true;
            black_body_stage.getChildByName("startBtn").on("click", function() {
                startTimer(); /** Start the stop watch while clicking on the start label on the stop watch */
            });
            black_body_stage.getChildByName("stopBtn").on("click", function() {
                stopTimer(); /** Stop the stop watch while clicking the stop label on the stop watch */
            });
            $("#fitDiscBtn").removeAttr('disabled').css({
                "opacity": 1,
                "cursor": "default"
            }); /** Enables the fit disc button */
            startExperiment(); /** Starting the experiment while clicking Fit the disc button */
            $("#fitDiscBtn").click(function() {
                disc_fit_flag = true; /** Disc fit flag set as true */
                steadyTempCalculationPerSec(); /** This function is used for calculate steady state temperature per second */
                black_body_stage.getChildByName("knobDown").visible = false; /** Disc fit knob functionality */
                black_body_stage.getChildByName("knobUp").visible = true;
                if (!stopwatch_flag) {
                    startTimer(); /** Start the stop watch if stop watch is not running */
                }
                $("#fitDiscBtn").attr('disabled', 'disabled').css({
                    "opacity": 0.5,
                    "cursor": "default"
                });
            });
        } else { /** Power off the switch */
            resetExperiment(); /** Resetting the experiment while clicking on Reset button */
        }
    });
    $("#checkBox").click(function() { /** Checkbox functionality for displaying the animation */
        /** Checking whether the check box is selected either to show or hide the 
		cross sectional view */
        if ($("#checkBox").attr('checked')) {
            black_body_stage.getChildByName("crossSectional").visible = true; /** Display cross sectional view */
            black_body_stage.getChildByName("waterAnimation").visible = true; /** Display the water animation */
            createjs.Ticker.setInterval(100);
            createjs.Ticker.addEventListener("tick", startAnimation); /** Start animation event */
        } else { /** If checked showing the normal view */
            black_body_stage.getChildByName("crossSectional").visible = false; /** Cross sectional view visibility false */
            black_body_stage.getChildByName("waterAnimation").visible = false; /** Water animation visibility false */
            createjs.Ticker.removeEventListener("tick", startAnimation); /** Remove the animation event */
        }
    });
    $("#waterSlider").change(function() { /** Water temperature slider change */
        waterTempSliderFN(); /** Water temperature slider change function */
    });
    $("#surroundSlider").change(function() { /** Surrounding temperature slider change */
        surroundTempSliderFN(); /** Surrounding temperature slider change function */
    });
    $("#massSlider").change(function() { /** Mass temperature slider change */
        massTempSliderFN(); /** Mass temperature slider change function */
    });
    $("#radiusSlider").change(function() { /** Radius temperature slider change */
        radiusTempSliderFN(); /** Radius temperature slider change function */
    });
    $(".radioGroup").bind("click", function() { /** Group of radio buttons click event */
		radioVal=$(this).val();//Get the radio button value into a variable
		if(!power_on_flag){
			/** if power off set all the temperature (from T1 to T4) as 20 (surround temperature) ℃*/
			$("#tempValue").html(radioVal+" : "+surround_temp + " ℃");
		}
		else{
			/** if power on, check whether T4 is selected or not.If T4 then set temperature as surround slider value.
			 If not T4 then set temperature as water slider value.*/
			if(!$("#t4Rdo").prop("checked")){
				$("#tempValue").html(radioVal+" : "+$("#waterSlider").val() + " ℃");
                black_body_stage.getChildByName("indicatorText").text = $("#waterSlider").val();
			}
			else{
				$("#tempValue").html(radioVal+" : "+$("#surroundSlider").val() + " ℃");//temperature dispaly
                black_body_stage.getChildByName("indicatorText").text = $("#surroundSlider").val();
			}
		}		
    });
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, sFactor, cursor, rotationX) {
    var bitmap = new createjs.Bitmap(image).set({});
    getBoundFn(name, bitmap, sFactor);
    bitmap.x = xPos;
    bitmap.y = yPos;
    bitmap.name = name;
    bitmap.alpha = 1;
    bitmap.rotation = rotationX;
    bitmap.cursor = cursor;
    black_body_stage.addChild(bitmap);
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
    black_body_stage.addChild(text);
}

/** Image scaling function. Scale the bitmap depend upon the scaling factor. */
function getBoundFn(name, bitmap, sFactor) {
    var bounds = bitmap.getBounds();
    scaleFactor = Math.min(stage_width / bounds.width, stage_height / bounds.height);
    bitmap.scaleX = bitmap.scaleY = sFactor * scaleFactor;
}

/** Animation of cross sectional view starting function */
function startAnimation() {
    anim_frame++; /** Frame increment */
    if (anim_frame <= 7) {
        anim_object.x = anim_object.x - anim_width; /** Changing of animation object x position */
    } else {
        anim_frame = 0; /** Resetting the animation frame */
		/** Resetting the position of water animation object */
        black_body_stage.getChildByName("waterAnimation").x = stage_width / 152.8; 
    }
}

/** Stop watch starting function definition */
function startTimer() {
    resetStopWatch(); /** Resetting stopwatch here */
    sec_timer = setInterval(steadyTempCalculationPerSec, 10); /** steadyTempCalculationPerSec in a timer */
    black_body_stage.getChildByName("startBtn").visible = false;
    black_body_stage.getChildByName("stopBtn").visible = true; /** Stop watch label set as STOP */
    black_body_stage.getChildByName("stopwatchLabel").text = _("STOP");
    stopWatchValHr = black_body_stage.getChildByName("stopWatchValHr"); /** Initializing the text box */
    stopWatchValMin = black_body_stage.getChildByName("stopWatchValMin");
    stopWatchValSec = black_body_stage.getChildByName("stopWatchValSec");
    startWatch(stopWatchValHr, stopWatchValMin, stopWatchValSec); /** Start the stop watch */
    black_body_stage.getChildByName("greenButton").alpha = 1;
    black_body_stage.getChildByName("redButton").alpha = 0.5;
    stopwatch_flag = true;
}

/** Stop watch stop function */
function stopTimer() {
    pauseTimer(); /** Pause the timer */
    clearInterval(sec_timer);
    black_body_stage.getChildByName("startBtn").visible = true;
    black_body_stage.getChildByName("stopBtn").visible = false;
    black_body_stage.getChildByName("stopwatchLabel").text = _("START");
    black_body_stage.getChildByName("greenButton").alpha = 0.5;
    black_body_stage.getChildByName("redButton").alpha = 1;
    stopwatch_flag = false;
}

/** Power on function, starting the experiment */
function startExperiment() {
    power_on_flag = true;
    black_body_stage.getChildByName("powerOnCircle").visible=false;
    $("#poweronBtn").val(reset_btn_var);
    steadyTempCalculationPerSec();
    $("#fitDiscBtn").attr('disabled', 'disabled').css({
        "opacity": 0.5,
        "cursor": "default"
    });
    $("#waterSlider,#surroundSlider,#massSlider,#radiusSlider").attr('disabled', 'disabled').css({
        "opacity": 0.5,
        "cursor": "default"
    });
    if( $("#waterSlider").val() == 35 ) { 
        minuteTimer = setInterval(displayTemperature, 10);
    } else {
        minuteTimer = setInterval(displayTemperature, 500);
    }
}

/** Resetting the experiment */
function resetExperiment() {
    resetStopWatch(); /** Resetting stopwatch here */
    initialisationOfVariables(); /** Variables resetting here */
    initializeImages(); /** Function call for images used in the apparatus visibility. Resetting the images to its initial status */
    power_on_flag = false;
    $("#poweronBtn").val(power_btn_var);
    createjs.Ticker.removeEventListener("tick", startAnimation); /** Remove the animation here */
    clearInterval(sec_timer);
	black_body_stage.getChildByName("startBtn").mouseEnabled=false;
    black_body_stage.getChildByName("powerOnCircle").visible=true;
    $("#waterSlider,#surroundSlider,#massSlider,#radiusSlider").removeAttr('disabled').css({
        "opacity": 1,
        "cursor": "default"
    });
}

/** Water temperature slider changing function */
function waterTempSliderFN() {
    water_temp_float = $("#waterSlider").val();
    steadyTemperatureCalculation(); /** Calculation of steady temperature with the water slider value */
	/** Calculation of time interval and conversion of degree to kelvin. 0 degree=273.15 kelvin. 2.5 and 5 are for adjusting the time interval */
    time_interval_float = ((steady_temp - kelvin) + 2.5) / 5; 
	/** If the water slider value is greater than surround slider value, Set the water slider value 
	and the water input value as surround slider value*/
    if ($("#waterSlider").val() <= $("#surroundSlider").val()) {
        $("#waterSlider").val($("#surroundSlider").val()); 
		$("#waterTemp").html(waterLabel+" "+$("#surroundSlider").val()+" ℃");
    } else if ($("#waterSlider").val() >= $("#surroundSlider").val()) {
		/** Else set the water input value as water slider value */
        $("#waterTemp").html(waterLabel+" "+$("#surroundSlider").val()+" ℃"); 
    }
	/** Steady temperature calculation with the water slider value */
    steadyTempCalculationPerSec();
	 $("#waterTemp").html(waterLabel+" "+$("#surroundSlider").val()+" ℃"); 
}

/** Surround temperature slider changing function */
function surroundTempSliderFN() {
    surround_temp = $("#surroundSlider").val();
    steadyTemperatureCalculation(); /** Calculation of steady temperature with the surround slider value */
    time_interval_float = Math.abs((steady_temp - kelvin) + 2.5);
	
	/** Check whether the surround slider value is greater than water slider value,
	Set the surround input value and surround slider as water slider value */
    if ($("#surroundSlider").val() >= $("#waterSlider").val()) { 
	  $("#surroundTemp").html(surroundLabel+" "+$("#waterSlider").val()+" ℃");
        $("#surroundSlider").val($("#waterSlider").val());  
		  } 
	/** Else set the surround input value as surround slider value */
	else if ($("#surroundSlider").val() <= $("#waterSlider").val()) {
		$("#surroundTemp").html(surroundLabel+" "+$("#surroundSlider").val()+" ℃");
    }
	 /** Steady temperature calculation with the surround slider value */
    steadyTempCalculationPerSec();
	/** Display temperature calculation with surround slider value */
    displayTemperature(); 
}

/** Mass temperature slider changing function */
function massTempSliderFN() {
    massTempVal = $("#massSlider").val();
	$("#discMass").html(discMassLabel+" "+massTempVal+_("g"));
}

/** Radius temperature slider changing function */
function radiusTempSliderFN() {
    radius_float = $("#radiusSlider").val();
    steadyTemperatureCalculation(); /** Steady temperature calculation with the radius slider value */
	$("#discRadius").html(radiusLabel+" "+radius_float+_("cm"));
}

/**calculations starts*/

/** This function is used for calculate steady state temperature */
function steadyTemperatureCalculation() {
    /** Calculation of area, a=πr² */
    area_disc = (Math.PI) * Math.pow(radius_float, 2); 
    /** Calculating the viscosity x=σ*A*Th3*t/m*Cp */
    viscosity_float = parseFloat((sigma_constant * area_disc * (Math.pow((Number(water_temp_float) + kelvin), 3)) * time_constant) / parseFloat(mass_float * heat_of_disc_int)); 
	/** Calculating the steady temperature Td = (((x*Th)/(1+x))*Th)+(Ti/(1+x)), where x is the viscosity, Th is the water temperature, Ti is the surrounding temperature*/
    steady_temp = parseFloat(((viscosity_float * (Number(water_temp_float) + kelvin)) / parseFloat(1 + viscosity_float)) + (surround_temp + kelvin) / (1 + viscosity_float)); 
    vertexk_constant = steady_temp;
    return steady_temp;
}

/** Steady temperature calculation per second function */
function steadyTempCalculationPerSec() {
    constant_float = (Math.pow((0 - vertexh_constant), 2)) / (4 * ((Number(surround_temp) + kelvin) - steady_temp));
    if (degree_to_kelvin_float == undefined || isNaN(degree_to_kelvin_float) || (degree_to_kelvin_float.toFixed(2) < steady_temp.toFixed(2))) {
		/** Degree to kelvin calculation */
        degree_to_kelvin_float = (((Math.pow((milli_sec - vertexh_constant), 2) / (4 * constant_float)) + vertexk_constant)); 
    }
    if ($("#t4Rdo").prop("checked")) { /** If T4 radio button is selected. T4 at different intervals of time till it reaches steady state. */
        if (power_on_flag) { /** If power on */
            if (disc_fit_flag == true) { /** Disc fit functionality */
                /** Temperature T4 value calculation and display */
                $("#tempValue").html(radioVal+" : "+(degree_to_kelvin_float - kelvin).toFixed(2) + " ℃"); 
				/** Indicator value display */
                black_body_stage.getChildByName("indicatorText").text = (degree_to_kelvin_float - kelvin).toFixed(2); 
            } else {
                $("#tempValue").html(radioVal+" : "+$("#surroundSlider").val() + " ℃");
                black_body_stage.getChildByName("indicatorText").text = $("#surroundSlider").val();
            }
        }
    }
    milli_sec++;
}

/** Calculating the temperature (T1 to T4) that should display on the menu based on the 
selection from the radio button */
function displayTemperature() {
    if (power_on_flag) { /** If power on */
        /** Disc fit button disabled */ 
     	/** Check whether the time calculated should less than or equal to water 
		 temperature value taken from the slider */
        if (time_interval_float < water_temp_float) { 
		/** Display the time interval frequently as T4 value and indicator value */
            $("#tempValue").html(radioVal+" : "+time_interval_float.toFixed(2) + " ℃"); 
            black_body_stage.getChildByName("indicatorText").text = time_interval_float.toFixed(2);
            time_interval_float += Math.abs(((steady_temp - kelvin) + 2.5) / 5);
        } else {
			/** Display the water slider value as T4 value and indicator value */
            $("#tempValue").html(radioVal+" : "+water_temp_float + " ℃") 
            black_body_stage.getChildByName("indicatorText").text = water_temp_float;
            if (disc_fit_flag) { /** Disc fit button functionality */
                $("#fitDiscBtn").attr('disabled', 'disabled').css({
                    "opacity": 0.5,
                    "cursor": "default"
                });
            } else {
                $("#fitDiscBtn").removeAttr('disabled').css({
                    "opacity": 1,
                    "cursor": "default"
                });
            }
			/** Clear the temperature timer interval showing in the control */
            clearInterval(minuteTimer); 
        }
        if ($("#t4Rdo").prop("checked")) {
			/** If T4 radio button is selected. T4 at different intervals of 
			time till it reaches steady state. */
            steadyTempCalculationPerSec(); 
        }
    } else {
        if ($("#surroundSlider").val() >= $("#waterSlider").val()) {
            surround_temp = $("#waterSlider").val();
        }
		/** If power on flag is true the temperature value set as surround slider default value */
        $("#tempValue").html(radioVal+" : "+surround_temp + " ℃"); 
    }
}

/**calculation ends*/