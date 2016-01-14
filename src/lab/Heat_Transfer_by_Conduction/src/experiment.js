(function(){
    angular
       .module('users')
       .directive("experiment",directiveFunction)
})();

var conduction_stage,gh_angle_float,mh_angle_float,diameter_val_float,thickness_val_float,temperature_val;

var stefan_boltzmann_constant,conductivity_float,radius_float,thickness_float,area_float;

var volt_needle_rotate_gh,ammeter_needle_rotate_gh,volt_needle_rotate_mh,ammeter_needle_rotate_mh;

var indicator_rotation_count,indicator_text_count,power_on_flag;

var timer_check,power_btn_var,reset_btn_var,selected_material,type;

var tick,timer_interval; /** Stage update timer */

var anim_frame,anim_width,anim_object_top,anim_object_bottom; /** Variables for animation */

var gh_power_int,gh_voltage_int,gh_current_int,mh_power_int,mh_voltage_int,mh_current_int;

var resultant_temp,initial_temp1,initial_temp2;

var gh_count,mh_count,conductivity_blackbody,t4_chamber_temp,t1_to_t3_blackbody_temp,t5_to_t7_testplate_temp;

var vneedle_distance_interval_gh,aneedle_distance_interval_gh,vneedle_distance_interval_mh,aneedle_distance_interval_mh;

var material_array = help_array = [];

var power_array=[10,17,24,31,38,45,52,59,66,73,80,87,94,101,108,115,122,129,136,143,150];

var voltage_array=[100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300];

var current_array=[0.2,0.309091,0.4,0.476923,0.542857,0.6,0.65,0.694118,0.73333,0.768421,0.8,0.828571,0.854545,0.878261,0.9,0.92,0.938462,0.955556,0.971429,0.986207,1];

var mask_rect_anim = new createjs.Shape(); /** Add rectangle shape for water animation masking */

/** Emissivity of each material is taken */
var conductivity = {
    0: 0.21,
    1: 1.1,
    2: 0.71,    
    3: 0.744,
    4: 0.17
}; 

function directiveFunction(){
    return {
        restrict: "A",
        link: function(scope,element,attrs,dialogs){               
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if ( element[0].width > element[0].height ) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }  
            if ( element[0].offsetWidth > element[0].offsetHeight ) {
                element[0].offsetWidth = element[0].offsetHeight;           
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }  
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
            queue.on("complete", handleComplete, this);
            queue.loadManifest([
            {
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicatorSelectorSwitch",
                src: "././images/indicator_switch.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicatorSelectorSwitchBase",
                src: "././images/indicator_switch_base.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "lightOn",
                src: "././images/light_on.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "GH_switch",
                src: "././images/GH_switch.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "MH_switch",
                src: "././images/MH_switch.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "needle",
                src: "././images/needles.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "tuner",
                src: "././images/rotate_bar.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow",
                src: "././images/rotate_arrow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicatorArrow",
                src: "././images/indicator_arrow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "switch_on",
                src: "././images/on_button.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "switch_off",
                src: "././images/off_button.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "cross_section",
                src: "././images/crosssection.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "wateranim",
                src: "././images/wateranimation.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "glasseffect",
                src: "././images/glass_effect.svg",
                type: createjs.LoadQueue.IMAGE
            }]);
            conduction_stage = new createjs.Stage("demoCanvas");
            conduction_stage.enableDOMEvents(true);
            conduction_stage.enableMouseOver();
            tick = setInterval(updateTimer, 5); /** Stage update function in a timer */

            function handleComplete(){              
                loadImages(queue.getResult("background"),"background",-45,-60,"",0);                   
                loadImages(queue.getResult("needle"),"aNeedle",300,271,"",0);
                loadImages(queue.getResult("needle"),"vNeedle",175,271,"",0);                
                loadImages(queue.getResult("indicatorSelectorSwitchBase"),"indicatorSelectorSwitchBase",150,405,"",0);                
                loadImages(queue.getResult("indicatorSelectorSwitch"),"indicatorSelectorSwitch",137,393,"",0);
                loadImages(queue.getResult("lightOn"),"mlightOn",375,220,"",0); 
                loadImages(queue.getResult("tuner"),"ghTuner",485,250,"",0);
                loadImages(queue.getResult("tuner"),"mhTuner",573,250,"",0);
                loadImages(queue.getResult("arrow"),"ghUpArrow",488,222,'pointer',0);   
                loadImages(queue.getResult("arrow"),"ghDownArrow",470,222,'pointer',90);
                loadImages(queue.getResult("arrow"),"mhUpArrow",578,222,'pointer',0);
                loadImages(queue.getResult("arrow"),"mhDownArrow",558,222,'pointer',90);                
                loadImages(queue.getResult("MH_switch"),"MH_switch",272,370,'pointer',0);
                loadImages(queue.getResult("GH_switch"),"GH_switch",272,388,'pointer',0);
                loadImages(queue.getResult("switch_on"),"switch_on",385,240,'pointer',0);
                loadImages(queue.getResult("switch_off"),"switch_off",385,240,'pointer',0);
                loadImages(queue.getResult("indicatorArrow"),"indicatorFwdArrow",175,390,'pointer',0);
                loadImages(queue.getResult("indicatorArrow"),"indicatorBkdArrow",125,420,'pointer',180);
                loadImages(queue.getResult("cross_section"),"cross_section",438,405,'',0);
                loadImages(queue.getResult("wateranim"),"waterAnimationTop",438,415,'',0);
                loadImages(queue.getResult("wateranim"),"waterAnimationBottom",438,525,'',0);                
                loadImages(queue.getResult("glasseffect"),"glassEffect",95,193,"",0);
                /** Textbox loading */
                setText("indicatorTimer",112,377,"","white",1.2);  
                setText("voltmeterReading",130,312,"0","black",1.4);
                setText("ammeterReading",257,312,"0","black",1.4);
                setText("indicatorReading",136,466,"","black",1.4);
                setText("gh",472,280,"GH","black",1.2);
                setText("mh",560,280,"MH","black",1.2);  
                rand_a=Math.random(); /** Random value */
                rand_b=Math.random();
                initialisationOfVariables(); /** Initializing the variables */

                createStopwatch(conduction_stage,180,420,timer_interval); 
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */                           
            
                anim_object_top = conduction_stage.getChildByName("waterAnimationTop"); /** Top animation frames take as an object */
                anim_object_bottom = conduction_stage.getChildByName("waterAnimationBottom"); /** Bottom animation frames take as an object */

                conduction_stage.getChildByName("switch_off").on("click", function() { /** Motor switch on functionality */
                    scope.powerOnBtn(); /** Start the experiment with respect to the power on button */
                    scope.$apply();
                });
                conduction_stage.getChildByName("switch_on").on("click", function() { /** Motor switch off functionality */
                    resetExperiment(); /** Reset the experiment */
                    scope.$apply();
                });
                conduction_stage.getChildByName("MH_switch").on("click", function() { /** Toggle switch turn to GH */                
                    conduction_stage.getChildByName("GH_switch").visible = true;
                    conduction_stage.getChildByName("MH_switch").visible = false; 
                    toggle_flag = true; /** The flag set true when toggle switch to GH */
                    if ( gh_voltage_int == 0 ) { /** Rotation of ammeter and voltmeter needle on switch to GH */           
                        volt_needle_rotate_gh=gh_voltage_int/6.67;
                        ammeter_needle_rotate_gh=gh_voltage_int/10;  
                    }
                    rotateNeedlesGH(volt_needle_rotate_gh,ammeter_needle_rotate_gh); /** Rotation of needles */                    
                });
                conduction_stage.getChildByName("GH_switch").on("click", function() { /** Toggle switch turn to GH */                
                    conduction_stage.getChildByName("MH_switch").visible = true;
                    conduction_stage.getChildByName("GH_switch").visible = false;
                    toggle_flag = false; /** The flag set false when toggle switch to MH */
                    if ( mh_voltage_int == 0 ) { /** Rotation of ammeter and voltmeter needle on switch to MH */
                        volt_needle_rotate_mh=mh_voltage_int/6.67;
                        ammeter_needle_rotate_mh=mh_voltage_int/10;  
                    }           
                    rotateNeedlesMH(volt_needle_rotate_mh,ammeter_needle_rotate_mh); /** Rotation of needles */                                     
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

                /** GH and MH tuners can rotate when only the power button is off */
                if (power_on_flag == false) {
                    /** GH tuner rotation. There is a tuner named GH, we can rotate the tuner. 
                    It will increase/decrease the GH voltage */
                    ghRotation();
                    /** MH tuner rotation. There is a tuner named MH, we can rotate the tuner. 
                    It will increase/decrease the MH voltage */
                    mhRotation();                    
                }
                mask_rect_anim.graphics.beginStroke("").drawRect(457, 385, 180, 150);
                conduction_stage.addChild(mask_rect_anim); /** Adding that rectangle to the stage */
            }
            
            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */   
            function translationLabels(){
                /** This help array shows the hints for this experiment */
                help_array=[_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("help6"),_("help7"),_("help8"),_("Next"),_("Close")];
                scope.heading=_("Heat Transfer by Conduction");
                scope.variables=_("Variables");                             
                scope.choose_material=_("Choose Material:");
                scope.cardboard=_("Cardboard");
                scope.diameter_of_material=_("Diameter of material (cm):");                
                scope.thickness_of_material=_("Thickness of material (cm):");                
                scope.cold_water_temperature=_("Cold water temperature");
                scope.show_cross_section=_("Show cross section")
                scope.show_result=_("Show Result");
                power_btn_var=_("Power On");
                reset_btn_var=_("Reset");
                scope.power_on=power_btn_var;
                scope.measurement=_("Measurements");                
                scope.conductivity=_("Thermal conductivity:");
                scope.copyright=_("copyright"); 
                /** The material_array contains the values and indexes of the dropdown */
                scope.material_array = [{material:_('Cardboard'),type:0},{material:_('Glass'),type:1},{material:_('Mica'),type:2},{material:_('Asbestos-cement board'),type:3},{material:_('Ebonite solid'),type:4}];                
                scope.$apply();             
            }            
        }
    }
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
    conduction_stage.update();
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize){
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    conduction_stage.addChild(_text); /** Adding text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot){
    var _bitmap = new createjs.Bitmap(image).set({});     
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX=_bitmap.scaleY=0.88;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    if (name == "ghTuner" || name == "mhTuner" || name == "aNeedle" || name == "vNeedle") {
        _bitmap.regX = _bitmap.image.width;
        _bitmap.regY = _bitmap.image.height;
    } else if (name == "indicatorSelectorSwitchBase") {
        _bitmap.regX = _bitmap.image.width / 2;
        _bitmap.regY = _bitmap.image.height / 2;
    }
    if (name == "waterAnimationTop" || name == "waterAnimationBottom") { /** Masking of water animation */
        _bitmap.mask = mask_rect_anim;
    }
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor;    
    conduction_stage.addChild(_bitmap); /** Adding bitmap to the stage */ 
}

/** All variables initialising in this function */
function initialisationOfVariables() {
    gh_angle_float = mh_angle_float = 0; /** For GH and MH rotation */
    gh_voltage_int = mh_voltage_int = 0; /** GH and MH voltages */
    gh_power_int=mh_power_int=0; /** GH and MH powers */
    gh_current_int=mh_current_int=0; /** GH and MH currents */
    diameter_val_float = 0.1; /** Initial diameter,thickness and temperature */
    thickness_val_float = 0.005;
    temperature_val = 0;
    stefan_boltzmann_constant = 0.0000000567; /** Stefan Boltzmann constant */
    conductivity_float = 0.21; /** Emissivity of initial drop down disc aluminium */
    radius_float = thickness_float = area_float = 0; /** Initialize radius,thickness,area*/
    indicator_rotation_count = 0; 
    indicator_text_count = 1;
    volt_needle_rotate_gh=ammeter_needle_rotate_gh=volt_needle_rotate_mh=ammeter_needle_rotate_mh=0;
    type=0;
    anim_frame = 0; /** Frame used for animation */
    anim_width = 80;
    selected_material=0;
    timer_interval=0.01; /** Interval of the timer and clock to be execute */
    power_on_flag = toggle_flag = false; /** Initialize toggle and power on flag */    
    gh_count=mh_count=0;
    conductivity_blackbody=1;
    resultant_temp=0;
    initial_temp1=initial_temp2=27;
    createCircle("gh_down_hit",459,232); /** Circle created for GH down hit */
    createCircle("gh_up_hit",500,232); /** Circle created for GH up hit */
    createCircle("mh_down_hit",546,232); /** Circle created for MH down hit */
    createCircle("mh_up_hit",590,232); /** Circle created for MH up hit */
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    /** Resetting the images to its initial status */
    conduction_stage.getChildByName("indicatorTimer").visible = false;
    conduction_stage.getChildByName("mlightOn").visible = false;
    conduction_stage.getChildByName("indicatorReading").visible = false;
    conduction_stage.getChildByName("GH_switch").visible = false;
    conduction_stage.getChildByName("switch_on").visible = false;
    conduction_stage.getChildByName("cross_section").visible = false;
    conduction_stage.getChildByName("waterAnimationTop").visible = false;
    conduction_stage.getChildByName("waterAnimationBottom").visible = false;
}

/** Function for creating circles for easy click of GH MH up and down arrows */
function createCircle(name,x_val,y_val) {
    circle = new createjs.Shape();
    circle.name=name;
    circle.alpha=0.01;
    circle.cursor="pointer";
    circle.graphics.beginFill("red").drawCircle(x_val, y_val, 12);    
    conduction_stage.addChild(circle);
}

/** Change the disc depends on the selection from the dropdown box */
function changeOption(scope) {
    selected_material = scope.Material;
}

/** Diameter of the plates slider function */
function diameterSliderFN(scope) {
    scope.diameter=scope.Diameter; /** Change slider value on change */
    diameter_val_float = scope.diameter / 100;  
}

/** Thickness of the plates slider function */
function thicknessSliderFN(scope){
    scope.thickness=scope.Thickness; /** Change slider value on change */
    thickness_val_float = scope.thickness / 100;
}

/** Chamber temperature slider function */
function temperatureSliderFN(scope) {
    scope.temperature=scope.Temperature; /** Change chamber temperature on slider change */
    temperature_val = scope.temperature;
}

function showCrossSectionFN(scope) {
    if ( scope.crossSectionValue == true ) {
        conduction_stage.getChildByName("cross_section").visible = true; /** Display cross sectional view */
        conduction_stage.getChildByName("waterAnimationTop").visible = true; /** Display the top water animation */
        conduction_stage.getChildByName("waterAnimationBottom").visible = true; /** Display the bottom water animation */
        createjs.Ticker.setInterval(100);
        createjs.Ticker.addEventListener("tick", startAnimation); /** Start animation event */
    } else {
        conduction_stage.getChildByName("cross_section").visible = false; /** Cross sectional view visibility false */
        conduction_stage.getChildByName("waterAnimationTop").visible = false; /** Top water animation visibility false */
        conduction_stage.getChildByName("waterAnimationBottom").visible = false; /** Bottom water animation visibility false */
        createjs.Ticker.removeEventListener("tick", startAnimation); /** Remove the animation event */
    }
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
        conduction_stage.getChildByName("waterAnimationTop").x = 438;
        conduction_stage.getChildByName("waterAnimationBottom").x = 438;
    }
}

/** Show result check box function */
function showResultFN(scope) {    
    if ( scope.resultValue == true ) { 
        scope.hide_show_result=true;
    } else {
        scope.hide_show_result=false;
    }       
}

/** Power On / Reset button event function */
function powerOn(scope,dialogs) {
    if (scope.power_on == power_btn_var) {    
        startExperiment(scope,dialogs); /** Experiment starting function */
    } else { /** Power off the switch */
        resetExperiment(); /** Reset the experiment */
    }
}

/** Power on function, starting the experiment */
function startExperiment(scope,dialogs) {
    /** Check the MH and GH voltage, show warning if their value not equal */
    if (mh_voltage_int != gh_voltage_int) {
        dialogs.error();
    } else { /** If MH and GH voltage are same */
        scope.control_disable=true;
        power_on_flag = true;  
        resetWatch();
        rotateNeedlesGH(volt_needle_rotate_gh,ammeter_needle_rotate_gh);
        rotateNeedlesMH(volt_needle_rotate_mh,ammeter_needle_rotate_mh);
        scope.power_on = reset_btn_var;
        scope.show_result_disable=false;
        scope.control_disable=true;
        /** Visible the images for starting the experiment */
        conduction_stage.getChildByName("indicatorTimer").visible = true;
        conduction_stage.getChildByName("mlightOn").visible = true;
        conduction_stage.getChildByName("indicatorReading").visible = true;
        conduction_stage.getChildByName("switch_on").visible=true;
        conduction_stage.getChildByName("switch_off").visible=false;
        conduction_stage.getChildByName("gh_up_hit").mouseEnabled = false;
        conduction_stage.getChildByName("gh_down_hit").mouseEnabled = false;
        conduction_stage.getChildByName("mh_up_hit").mouseEnabled = false;
        conduction_stage.getChildByName("mh_down_hit").mouseEnabled = false;
        conduction_stage.getChildByName("indicatorFwdArrow").mouseEnabled = false;
        conduction_stage.getChildByName("indicatorBkdArrow").mouseEnabled = false;
        indicatorReadingFn(); /** The reading value display function */
        pause_flag = false;
        timer_check = setInterval(expWatch,timer_interval); /** Check time equal to 20 minutes */  
        scope.conductivity_value=conductivity[selected_material]+ " Wm¯¹K¯¹";
    }
}

/**Start stopwatch and related calculations*/
function expWatch() {    
    if ( !pause_flag ) {
        showWatch(conduction_stage);
    }
    checkTime();
}

/** Reset function */
function resetExperiment() {
    window.location.reload();
}

/** This function execute during the stop watch runs */
function checkTime() { 
    /** 1200 is seconds, i.e,  20 minutes */
   if ( total_time <= 1200 ) {  
        thermalConductivityCalc();
        displayIndicatorTimer();   
    } else {
        pauseWatch();
        clearInterval(timer_check);
    }
}

/** All rotations in this function */
function getRotation(name,value) {
    conduction_stage.getChildByName(name).rotation = value;
}

/** Power, voltage and current values of GH taken from the corresponding array */
function ghPowerVoltCurrentValues(gh_count) {
    gh_power_int=power_array[gh_count-1];   
    gh_voltage_int=voltage_array[gh_count-1];
    gh_current_int=current_array[gh_count-1];
}

/** Power, voltage and current values of MH taken from the corresponding array */
function mhPowerVoltCurrentValues(mh_count) {
    mh_power_int=power_array[mh_count-1];   
    mh_voltage_int=voltage_array[mh_count-1];
    mh_current_int=current_array[mh_count-1];
}

/** GH rotation function */
function ghRotation() {
    /** Click on the GH up arrow. It will increase the GH voltage. */
    conduction_stage.getChildByName("gh_up_hit").on("click", function() {   
        if ( gh_count < 21 ) {
            conduction_stage.getChildByName("gh_up_hit").mouseEnabled = true;
            conduction_stage.getChildByName("gh_down_hit").mouseEnabled = true;
            if ( gh_angle_float < 360 ) {
                gh_angle_float = gh_angle_float + 17.5; /** Increment the tuner rotation. 17.5  for adjusting the tuner. */
                getRotation("ghTuner",gh_angle_float);
            }
            gh_count++;
            ghPowerVoltCurrentValues(gh_count); /** Power, voltage and current values of GH taken from the corresponding array */
            distanceIntervalCalcGH(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
            rotateNeedlesGH(volt_needle_rotate_gh,ammeter_needle_rotate_gh); /** Ammeter and voltmeter needle rotation */
        } else {        
            conduction_stage.getChildByName("gh_up_hit").mouseEnabled = false;
            conduction_stage.getChildByName("gh_down_hit").mouseEnabled = true;
        }
    });
    /** Click on the MH down arrow. It will decrease the MH voltage. */
    conduction_stage.getChildByName("gh_down_hit").on("click", function() {
        if ( gh_angle_float >0 ) { /** GH Tuner backward rotation */
            gh_angle_float = gh_angle_float - 17.5;
            getRotation("ghTuner",gh_angle_float);
        }
        if ( gh_count > 0 ) {
            conduction_stage.getChildByName("gh_down_hit").mouseEnabled = true;
            conduction_stage.getChildByName("gh_up_hit").mouseEnabled = true;    
            gh_count--;  
            if ( gh_count == 0 ) {
                gh_power_int=0; 
                gh_voltage_int=0;
                gh_current_int=0;
                getRotation("vNeedle",0);
                getRotation("aNeedle",0);
            } else {
                ghPowerVoltCurrentValues(gh_count); /** Power, voltage and current values of GH taken from the corresponding array */
                distanceIntervalCalcGH(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
                rotateNeedlesGH(volt_needle_rotate_gh,ammeter_needle_rotate_gh); /** Ammeter and voltmeter needle rotation */
            }               
        } else {
            getRotation("vNeedle",0);
            conduction_stage.getChildByName("gh_down_hit").mouseEnabled = false;
            conduction_stage.getChildByName("gh_up_hit").mouseEnabled = true;
        }
    });    
}

/** MH rotation function */
function mhRotation() {
	/** Click on the MH up arrow. It will increase the MH voltage. */
	conduction_stage.getChildByName("mh_up_hit").on("click", function() {   
		if ( mh_count < 21 ) {
			conduction_stage.getChildByName("mh_up_hit").mouseEnabled = true;
			conduction_stage.getChildByName("mh_down_hit").mouseEnabled = true;
			if ( mh_angle_float < 360 ) {
				mh_angle_float = mh_angle_float + 17.5; /** Increment the tuner rotation. 17.5  for adjusting the tuner. */
				getRotation("mhTuner",mh_angle_float);
			}
			mh_count++;
			mhPowerVoltCurrentValues(mh_count); /** Power, voltage and current values of MH taken from the corresponding array */
	        distanceIntervalCalcMH(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
            rotateNeedlesMH(volt_needle_rotate_mh,ammeter_needle_rotate_mh); /** Ammeter and voltmeter needle rotation */
		} else {		
			conduction_stage.getChildByName("mh_up_hit").mouseEnabled = false;
			conduction_stage.getChildByName("mh_down_hit").mouseEnabled = true;
		}
	});
	/** Click on the MH down arrow. It will decrease the MH voltage. */
	conduction_stage.getChildByName("mh_down_hit").on("click", function() {
        if ( mh_angle_float >0 ) { /** MH Tuner backward rotation */
            mh_angle_float = mh_angle_float - 17.5;
            getRotation("mhTuner",mh_angle_float);
        }
	    if ( mh_count > 0 ) {
	        conduction_stage.getChildByName("mh_down_hit").mouseEnabled = true;
	        conduction_stage.getChildByName("mh_up_hit").mouseEnabled = true;	
            mh_count--;	 
            if ( mh_count == 0 ) {
                mh_power_int=0;	
                mh_voltage_int=0;
                mh_current_int=0;
                getRotation("vNeedle",0);
                getRotation("aNeedle",0);
            } else {
                mhPowerVoltCurrentValues(mh_count); /** Power, voltage and current values of MH taken from the corresponding array */
                distanceIntervalCalcMH(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
                rotateNeedlesMH(volt_needle_rotate_mh,ammeter_needle_rotate_mh); /** Ammeter and voltmeter needle rotation */
            }           	
        } else {
            getRotation("vNeedle",0);
            conduction_stage.getChildByName("mh_down_hit").mouseEnabled = false;
            conduction_stage.getChildByName("mh_up_hit").mouseEnabled = true;
        }
    });	
}

/** Finding the GH interval value of the ammeter and voltmeter needle rotation */ 
function distanceIntervalCalcGH() {
    vneedle_distance_interval_gh=(gh_voltage_int/10)-5;    
    volt_needle_rotate_gh=3.5*vneedle_distance_interval_gh;     
    aneedle_distance_interval_gh=(gh_current_int.toFixed(2)*100)-10;
    ammeter_needle_rotate_gh=aneedle_distance_interval_gh;
}

/** Finding the MH interval value of the ammeter and voltmeter needle rotation */ 
function distanceIntervalCalcMH() {
    vneedle_distance_interval_mh=(mh_voltage_int/10)-5;    
	volt_needle_rotate_mh=3.5*vneedle_distance_interval_mh;		
    aneedle_distance_interval_mh=(mh_current_int.toFixed(2)*100)-10;
	ammeter_needle_rotate_mh=aneedle_distance_interval_mh;
}

/** Voltmeter needle rotation function */
function rotateNeedlesGH(val1,val2) {
    if ( toggle_flag ) {
        getRotation("vNeedle",val1);
        getRotation("aNeedle",val2);
        conduction_stage.getChildByName("voltmeterReading").text = gh_voltage_int;
        conduction_stage.getChildByName("ammeterReading").text = gh_current_int.toFixed(2);
    }    
}

/** Voltmeter needle rotation function */
function rotateNeedlesMH(val1,val2) { 
    if ( !toggle_flag ) {
        getRotation("vNeedle",val1);
		getRotation("aNeedle",val2);
        conduction_stage.getChildByName("voltmeterReading").text = mh_voltage_int;
        conduction_stage.getChildByName("ammeterReading").text = mh_current_int.toFixed(2);
    }
}

/** Function for the rotation of temperature indicator */
function rotateTempIndicator(incr, rotVal) { 
    indicator_text_count = indicator_text_count + incr; /** Knob of the indicator */
    indicator_rotation_count += rotVal; /** Indicator count */
    getRotation("indicatorSelectorSwitchBase",indicator_rotation_count);
    if ( minute >= 20 ) {
        thermalConductivityCalc(); /** Calculation of conductivity */        
        conduction_stage.getChildByName("indicatorTimer").text=resultant_temp.toFixed(2);
    }
}

/** The reading value display function */
function indicatorReadingFn() {    
    conduction_stage.getChildByName("indicatorReading").text = "T" + indicator_text_count; /** Indicator count text box value */
}

/** Calculation part */

/** Calculation of conductivity */
function thermalConductivityCalc() {
    conductivity_float=conductivity[selected_material]; /** Select the emisitivity from the array given */  
    thickness_float = thickness_val_float;
    /** area = 2*3.14*rx+3.14r2 */
    area_float = ((Math.PI * diameter_val_float * diameter_val_float)/4).toFixed(5);    

    /** Ta=(q*dx*10^-2)/(k*A)+T6 */
    temperature_a = ((((gh_power_int/2)*thickness_float)/(conductivity_float*area_float))+temperature_val).toFixed(3);

    /** Tb=(q*dx*10^-2)/(k*A)+T6 */
    temperature_b = ((((gh_power_int/2)*thickness_float)/(conductivity_float*area_float))+temperature_val).toFixed(3);
    
    t1_temperature = parseFloat(temperature_a-rand_a); /** T1 temperature value */
    t2_temperature = parseFloat(temperature_a+rand_a) /** T2 temperature value */

    t3_and_t7_temperature = parseFloat(temperature_b-rand_b); /** T3 and T7 temperature value */
    t4_and_t8_temperature = parseFloat(temperature_b+rand_b); /** T4 and T8 temperature value */
    /** Indicator timer with respect to the indicator rotation count, Same indicator temperature for T1,T2,T3. 
    And same for T5,T6,T7. Different temperature for T4 */     
    if ( indicator_text_count == 1 ) { /** The resultant value if indicator_text_count is in between 1 and 3 */
        resultant_temp=t1_temperature;
    } else if ( indicator_text_count == 2 ) {
        resultant_temp=t2_temperature;      
    } else if ( indicator_text_count == 3 || indicator_text_count == 7 ) { /** The resultant value if indicator_text_count is in between 5 and 7 */
        resultant_temp=t3_and_t7_temperature
    } else if ( indicator_text_count == 4 || indicator_text_count == 8 ) {
        resultant_temp=t4_and_t8_temperature;
    } else {
        resultant_temp=temperature_val;
    }
}

/** Indicator timer function */
function displayIndicatorTimer() { 
    if ( power_on_flag ) {
        if ( gh_count == 0 ) {
            conduction_stage.getChildByName("indicatorTimer").text = initial_temp1.toFixed(2); /** Set initial temperature as 27 degree */
            conduction_stage.getChildByName("ammeterReading").text=0; /** Set the ammeter and voltmeter rotation as 0 */
            conduction_stage.getChildByName("voltmeterReading").text=0;
        } else {
            var _temp_differnce=resultant_temp-initial_temp1;
            var _incr_factor=_temp_differnce/1200;
            /** Find the indicator timer increment factor with respect to the seconds */
            if ( total_time != time_array[time_array.length-1] ) {
                /** Check the timer interval render more than once */
                initial_temp2=parseFloat(initial_temp2+_incr_factor);  
            }
            conduction_stage.getChildByName("indicatorTimer").text=initial_temp2.toFixed(2);
        }
    } 
    /** Total_time is calculated in seconds and taken from the stopwatch function,
    1200 is 20 minutes in terms of seconds */
    if ( total_time >= 1200 ) {
        conduction_stage.getChildByName("indicatorTimer").text=resultant_temp.toFixed(2);
        conduction_stage.getChildByName("indicatorFwdArrow").mouseEnabled = true;
        conduction_stage.getChildByName("indicatorBkdArrow").mouseEnabled = true;
    }
}

/** Calculation ends */