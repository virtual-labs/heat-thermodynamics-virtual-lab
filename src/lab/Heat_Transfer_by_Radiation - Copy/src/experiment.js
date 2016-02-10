(function(){
  angular
       .module('users')
       .directive("experiment",directiveFunction)
})();

var radiation_stage,tp_angle_float,bp_angle_float,diameter_val_float,thickness_val_float,temperature_val;

var stefan_boltzmann_constant,emissivity_float,radius_float,thickness_float,area_float;

var volt_needle_rotate_tp,ammeter_needle_rotate_tp,volt_needle_rotate_bp,ammeter_needle_rotate_bp;

var indicator_rotation_count,indicator_text_count,power_on_flag;

var timer_check,power_btn_var,power_off_btn_var,reset_btn_var,selected_material,type;

var tick, timer_interval; /** Stage update timer */

var material_array = material_item_array = help_array = [];

var tp_power_int,tp_voltage_int,tp_current_int,bp_power_int,bp_voltage_int,bp_current_int;

var resultant_temp,initial_temp1,initial_temp2;

var tp_count,bp_count,emissivity_blackbody,t4_chamber_temp,t1_to_t3_blackbody_temp,t5_to_t7_testplate_temp;

var vneedle_distance_interval_tp,aneedle_distance_interval_tp,vneedle_distance_interval_bp,aneedle_distance_interval_bp;

var power_array=[20,34,48,62,76,90,104,118,132,146,160,174,188,202,216,230,244,258,272,286,300];

var voltage_array=[100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300];

var current_array=[0.2,0.309091,0.4,0.476923,0.542857,0.6,0.65,0.694118,0.73333,0.768421,0.8,0.828571,0.854545,0.878261,0.9,0.92,0.938462,0.955556,0.971429,0.986207,1];

var help_array = [];

/** Emissivity of each material is taken */
var emissivity = {
    0: 0.77,
    1: 0.68,
    2: 0.61,    
    3: 0.85,
    4: 0.78
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
                id: "commonDisc",
                src: "././images/commondisc.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "copper",
                src: "././images/copperdisc.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "steel",
                src: "././images/steeldisc.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "iron",
                src: "././images/irondisc.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "brass",
                src: "././images/brassdisc.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "aluminium",
                src: "././images/aluminiumdisc.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "discShadow",
                src: "././images/discshadow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "wires",
                src: "././images/wires.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicatorSelectorSwitch",
                src: "././images/selectorswitch.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicatorSelectorSwitchBase",
                src: "././images/selectorswitchbase.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "lightOn",
                src: "././images/lighton.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "needle",
                src: "././images/needle.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "off",
                src: "././images/lightswitchoff.svg",
                type: createjs.LoadQueue.IMAGE,
                cursor: "hand"
            }, {
                id: "on",
                src: "././images/lightswitchon.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "switchOff",
                src: "././images/switchoff.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "switchOn",
                src: "././images/switchon.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "tuner",
                src: "././images/rotatebar.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow",
                src: "././images/arrow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicatorArrow",
                src: "././images/indicatorArrow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "glasseffect",
                src: "././images/glasseffect.svg",
                type: createjs.LoadQueue.IMAGE
            }]);
            radiation_stage = new createjs.Stage("demoCanvas");
            radiation_stage.enableDOMEvents(true);
            radiation_stage.enableMouseOver();
            tick = setInterval(updateTimer, 5); /** Stage update function in a timer */

            function handleComplete(){              
                loadImages(queue.getResult("background"),"background",-90,-80,"",0);    
                loadImages(queue.getResult("discShadow"),"discShadowCommon",148,565,"",0);
                loadImages(queue.getResult("commonDisc"),"commonDiscInner",128,540,"",0);
                loadImages(queue.getResult("commonDisc"),"commonDisc",128,540,"",0);
                loadImages(queue.getResult("discShadow"),"discShadow",420,565,"",0);    
                loadImages(queue.getResult("copper"),"copperInner",400,540,"",0);   
                loadImages(queue.getResult("copper"),"copper",400,540,"",0);
                loadImages(queue.getResult("steel"),"steelInner",400,540,"",0);
                loadImages(queue.getResult("steel"),"steel",400,540,"",0);
                loadImages(queue.getResult("iron"),"ironInner",400,540,"",0);
                loadImages(queue.getResult("iron"),"iron",400,540,"",0);
                loadImages(queue.getResult("brass"),"brassInner",400,540,"",0);
                loadImages(queue.getResult("brass"),"brass",400,540,"",0);
                loadImages(queue.getResult("aluminium"),"aluminiumInner",400,540,"",0);
                loadImages(queue.getResult("aluminium"),"aluminium",400,540,"",0);  
                loadImages(queue.getResult("wires"),"wireOne",95,495,"",0);
                loadImages(queue.getResult("needle"),"aNeedle",293,252,"",0);
                loadImages(queue.getResult("needle"),"vNeedle",163,253,"",0);                
                loadImages(queue.getResult("indicatorSelectorSwitchBase"),"indicatorSelectorSwitchBase",394,240,"",0);                
                loadImages(queue.getResult("indicatorSelectorSwitch"),"indicatorSelectorSwitch",382,228,"",0);
                loadImages(queue.getResult("lightOn"),"mlightOn",532,282,"",0); 
                loadImages(queue.getResult("switchOff"),"switchOff",542,188,'pointer',0);
                loadImages(queue.getResult("switchOn"),"switchOn",542,204,'pointer',0); 
                loadImages(queue.getResult("tuner"),"tpTuner",485,216,"",0);
                loadImages(queue.getResult("tuner"),"bpTuner",614,216,"",0);
                loadImages(queue.getResult("arrow"),"bpUpArrow",620,185,'pointer',0);
                loadImages(queue.getResult("arrow"),"bpDownArrow",608,186,'pointer',90);
                loadImages(queue.getResult("arrow"),"tpUpArrow",490,185,'pointer',0);   
                loadImages(queue.getResult("arrow"),"tpDownArrow",477,187,'pointer',90);
                loadImages(queue.getResult("on"),"motorOn",544,305,'pointer',0);
                loadImages(queue.getResult("off"),"motorOff",544,305,'pointer',0);
                loadImages(queue.getResult("indicatorArrow"),"indicatorFwdArrow",420,229,'pointer',0);
                loadImages(queue.getResult("indicatorArrow"),"indicatorBkdArrow",365,252,'pointer',180);
                loadImages(queue.getResult("glasseffect"),"glassEffect",18,160,"",0);
                /** Textbox loading */
                setText("indicatorTimer",350,205,"","white",1.2); 
                setText("voltmeterReading",120,303,"0","black",1.4);
                setText("ammeterReading",250,303,"0","black",1.4);
                setText("indicatorReading",380,303,"","black",1.4);
				initialisationOfVariables(); /** Initializing the variables */
				 
                createStopwatch(radiation_stage, 50,302,timer_interval);                  
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */
                getDiscName(); /** Initial visibility of all the disc except aluminium set as false */

                material_item_array=["aluminium","brass","iron","steel","copper","aluminiumInner","brassInner","ironInner","steelInner","copperInner"]; /** Array stores the collectionb of materials used for visibility */                                
            
                radiation_stage.getChildByName("motorOff").on("click", function() { /** Motor switch on functionality */
                    scope.powerOnBtn(); /** Start the experiment with respect to the power on button */
                    scope.$apply();
                });
                radiation_stage.getChildByName("motorOn").on("click", function() { /** Motor switch off functionality */
                    powerOff(scope); /** Just pause the experiment */
                    scope.$apply();
                });
                radiation_stage.getChildByName("switchOff").on("click", function() { /** Toggle switch turn to TP */                
                    radiation_stage.getChildByName("switchOn").visible = true;
                    radiation_stage.getChildByName("switchOff").visible = false;
                    toggle_flag = true; /** The flag set true when toggle switch to TP */
                    if ( tp_voltage_int == 0 ) { /** Rotation of ammeter and voltmeter needle on switch to TP */           
                        volt_needle_rotate_tp=tp_voltage_int/6.67;
                        ammeter_needle_rotate_tp=tp_voltage_int/10;  
                    }
                    rotateNeedlesTP(volt_needle_rotate_tp,ammeter_needle_rotate_tp); /** Rotation of needles */
                });
                radiation_stage.getChildByName("switchOn").on("click", function() { /** Toggle switch turn to BP */                
                    radiation_stage.getChildByName("switchOff").visible = true;
                    radiation_stage.getChildByName("switchOn").visible = false;
                    toggle_flag = false; /** The flag set false when toggle switch to BP */
                    if ( bp_voltage_int == 0 ) { /** Rotation of ammeter and voltmeter needle on switch to BP */
                        volt_needle_rotate_bp=bp_voltage_int/6.67;
                        ammeter_needle_rotate_bp=bp_voltage_int/10;  
                    }           
                    rotateNeedlesBP(volt_needle_rotate_bp,ammeter_needle_rotate_bp); /** Rotation of needles */
                });
                radiation_stage.getChildByName("indicatorFwdArrow").on("click", function() { /** Indicator forward rotation */
                    if ((indicator_text_count < 7)) { /** Rotate the temperature indicator till the count reaches 7 */
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

                /** TP and BP tuners can rotate when only the power button is off */
                if (power_on_flag == false) {
                    /** TP tuner rotation. There is a tuner named TP, we can rotate the tuner. 
                    It will increase/decrease the TP voltage */
                    tpRotation();
                    /** BP tuner rotation. There is a tuner named BP, we can rotate the tuner. 
                    It will increase/decrease the BP voltage */
                    bpRotation();                    
                }
            }
            
            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */   
            function translationLabels(){
                /** This help array shows the hints for this experiment */
                help_array=[_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("help6"),_("help7"),_("Next"),_("Close")];
                scope.heading=_("Heat Transfer by Radiation");
                scope.variables=_("Variables");                             
                scope.choose_material=_("Choose Material:");
                scope.aluminium=_("Aluminium");
                scope.diameter_of_plates=_("Diameter of the plates (cm):");                
                scope.thickness_of_plates=_("Thickness of the plates (cm):");                
                scope.chamber_temperature=_("Chamber temperature (℃):");
                scope.show_result=_("Show Result");
                power_btn_var=_("Power On");
                power_off_btn_var=_("Power Off");
                scope.reset_btn_var=_("Reset");
                scope.power_on=power_btn_var;
                scope.measurement=_("Measurements");                
                scope.emissivity=_("Emissivity of the test plate:");
                scope.copyright=_("copyright"); 
                /** The material_array contains the values and indexes of the dropdown */
                scope.material_array = [{material:_('Aluminium'),type:0},{material:_('Brass'),type:1},{material:_('Iron'),type:2},{material:_('Steel'),type:3},{material:_('Copper'),type:4}];                
                scope.$apply();             
            }            
        }
    }
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
    radiation_stage.update();
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
    radiation_stage.addChild(_text); /** Adding text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot){
    var _bitmap = new createjs.Bitmap(image).set({});     
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX=_bitmap.scaleY=0.88;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    if (name == "tpTuner" || name == "bpTuner" || name == "aNeedle" || name == "vNeedle") {
        _bitmap.regX = _bitmap.image.width;
        _bitmap.regY = _bitmap.image.height;
    } else if (name == "indicatorSelectorSwitchBase") {
        _bitmap.regX = _bitmap.image.width / 2;
        _bitmap.regY = _bitmap.image.height / 2;
    }
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor;    
    radiation_stage.addChild(_bitmap); /** Adding bitmap to the stage */ 
}

/** Initial visibility of all the disc except aluminium set as false */
function getDiscName(){
    radiation_stage.getChildByName("aluminium").visible=true;
    radiation_stage.getChildByName("brass").visible=false;
    radiation_stage.getChildByName("iron").visible=false;
    radiation_stage.getChildByName("steel").visible=false;
    radiation_stage.getChildByName("copper").visible=false;
    radiation_stage.getChildByName("aluminiumInner").visible=true;
    radiation_stage.getChildByName("brassInner").visible=false;
    radiation_stage.getChildByName("ironInner").visible=false;
    radiation_stage.getChildByName("steelInner").visible=false;
    radiation_stage.getChildByName("copperInner").visible=false;
}              

/** All variables initialising in this function */
function initialisationOfVariables() {
    tp_angle_float = bp_angle_float = 0; /** For TP and BP rotation */
    tp_voltage_int = bp_voltage_int = 0; /** TP and BP voltages */
    tp_power_int=bp_power_int=0; /** TP and BP powers */
    tp_current_int=bp_current_int=0; /** TP and BP currents */
    diameter_val_float = 0.05; /** Initial diameter,thickness and temperature */
    thickness_val_float = 0.01;
    temperature_val = 253.15;
    stefan_boltzmann_constant = 0.0000000567; /** Stefan Boltzmann constant */
    emissivity_float = 0.77; /** Emissivity of initial drop down disc aluminium */
    radius_float = thickness_float = area_float = 0; /** Initialize radius,thickness,area*/
    indicator_rotation_count = 0; 
    indicator_text_count = 1;
    volt_needle_rotate_tp=ammeter_needle_rotate_tp=volt_needle_rotate_bp=ammeter_needle_rotate_bp=0;
    type=0;
    selected_material=0;
    power_on_flag = toggle_flag = false; /** Initialize toggle and power on flag */    
    tp_count=bp_count=0;
    emissivity_blackbody=1;
    resultant_temp=0;
	timer_interval=0.05; /** Interval of the timer and clock to be execute */
	time_array=[-1]
    initial_temp1=initial_temp2=27;
    createCircle("tp_down_hit",468,194); /** Circle created for TP down hit */
    createCircle("tp_up_hit",500,194); /** Circle created for TP up hit */
    createCircle("bp_down_hit",600,194); /** Circle created for BP down hit */
    createCircle("bp_up_hit",632,194); /** Circle created for BP up hit */
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    /** Resetting the images to its initial status */
    radiation_stage.getChildByName("indicatorTimer").visible = false;
    radiation_stage.getChildByName("mlightOn").visible = false;
    radiation_stage.getChildByName("motorOn").visible = false;
    radiation_stage.getChildByName("indicatorReading").visible = false;
    radiation_stage.getChildByName("switchOn").visible = false;
}

/** Function for creating circles for easy click of TP BP up and down arrows */
function createCircle(name,x_val,y_val) {
    circle = new createjs.Shape();
    circle.name=name;
    circle.alpha=0.01;
    circle.cursor="pointer";
    circle.graphics.beginFill("red").drawCircle(x_val, y_val, 12);    
    radiation_stage.addChild(circle);
}

/** Change the disc depends on the selection from the dropdown box */
function changeOption(scope) {
    selected_material = scope.Material;
    for ( var i=0; i<5; i++ ) {
        /** Check each disc whether it match with the dropdown selection */
        if ( scope.Material == i ) {
            radiation_stage.getChildByName(material_item_array[i]).visible=true;
            radiation_stage.getChildByName(material_item_array[i+5]).visible=true;
        } else {
            /** Visible set as false rest of the disc and its inner disc */
            radiation_stage.getChildByName(material_item_array[i]).visible=false;
            radiation_stage.getChildByName(material_item_array[i+5]).visible=false;
        }
    }
}

/** Diameter of the plates slider function */
function diameterSliderFN(scope) {
    scope.diameter=scope.Diameter; /** Change slider value on change */
    diameter_val_float = scope.diameter / 100;
    /** Increasing / Decreasing the diameter of all discs depend upon the slider value */
    var _diameter_change_val = 0.87 + (diameter_val_float * 0.4);   
    radiation_stage.getChildByName("commonDisc").scaleX = radiation_stage.getChildByName("aluminium").scaleX = radiation_stage.getChildByName("brass").scaleX = radiation_stage.getChildByName("iron").scaleX = radiation_stage.getChildByName("steel").scaleX = radiation_stage.getChildByName("copper").scaleX = _diameter_change_val;
}

/** Thickness of the plates slider function */
function thicknessSliderFN(scope){
    scope.thickness=scope.Thickness; /** Change slider value on change */
    /** Increasing / Decreasing the thickness of all discs depend upon the slider value */
    thickness_val_float = scope.thickness / 100;    
    /** Changing the disc thickness by adjusting the Y value of the discs */
    radiation_stage.getChildByName("commonDisc").y = radiation_stage.getChildByName("aluminium").y = radiation_stage.getChildByName("brass").y = radiation_stage.getChildByName("iron").y = radiation_stage.getChildByName("steel").y = radiation_stage.getChildByName("copper").y = 541 - scope.thickness;
}

/** Chamber temperature slider function */
function temperatureSliderFN(scope) {
    scope.temperature=scope.Temperature; /** Change chamber temperature on slider change */
    temperature_val = parseInt(scope.temperature) + 273; /** 273 is the kelvin value 0 degree= 273.15 K */
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
        powerOff(scope); /** Just pause the experiment */
    }
}

/** Power on function, starting the experiment */
function startExperiment(scope,dialogs) {        
    /** Check the BP and TP voltage, show warning if their value not equal */
    if (bp_voltage_int != tp_voltage_int) { 
        dialogs.error();
    } else { /** If BP and TP voltage are same */
        resetWatch();
        scope.result_disable=false;
        scope.control_disable=true;
        power_on_flag = true;
        rotateNeedlesTP(volt_needle_rotate_tp,ammeter_needle_rotate_tp);
        rotateNeedlesBP(volt_needle_rotate_bp,ammeter_needle_rotate_bp);
        scope.power_on = power_off_btn_var;
        /** Visible the images for starting the experiment */
        radiation_stage.getChildByName("indicatorTimer").visible = true;
        radiation_stage.getChildByName("mlightOn").visible = true;        
        radiation_stage.getChildByName("voltmeterReading").visible = true;
        radiation_stage.getChildByName("ammeterReading").visible = true;
        radiation_stage.getChildByName("indicatorReading").visible = true;
        radiation_stage.getChildByName("motorOn").visible = true;
        /** Disable images and events */        
        radiation_stage.getChildByName("motorOff").visible = false;
        radiation_stage.getChildByName("tp_up_hit").mouseEnabled = false;
        radiation_stage.getChildByName("tp_down_hit").mouseEnabled = false;
        radiation_stage.getChildByName("bp_up_hit").mouseEnabled = false;
        radiation_stage.getChildByName("bp_down_hit").mouseEnabled = false;
        radiation_stage.getChildByName("indicatorFwdArrow").mouseEnabled = false;
        radiation_stage.getChildByName("indicatorBkdArrow").mouseEnabled = false;
        indicatorReadingFn(); /** The reading value display function */
        pause_flag = false;
		timer_check = setInterval(expWatch,timer_interval); /** Check time equal to 20 minutes */  
        scope.emissivity_value=emissivity[selected_material];              
    }
}

/** Start stopwatch and related calculations */
function expWatch() {
    if ( !pause_flag ) {
        showWatch(radiation_stage);
    }
    checkTime();
}
		
/** Function for just pause the experiment */
function powerOff(scope) {
    clearInterval(timer_check);
    radiation_stage.getChildByName("motorOff").visible = true;
    radiation_stage.getChildByName("mlightOn").visible = false;
    scope.hide_show_result=false; /** Result text visibility changed */
    scope.power_on = power_btn_var; /** Power on label changed to initial */
    radiation_stage.getChildByName("indicatorReading").visible = false;
    radiation_stage.getChildByName("indicatorTimer").visible = false;
    getRotation("vNeedle",0);
    getRotation("aNeedle",0);
    radiation_stage.getChildByName("voltmeterReading").text = 0;
    radiation_stage.getChildByName("ammeterReading").text = 0;
    scope.result_disable=true;
    scope.resultValue=[];
    pauseWatch();
}

/** Reset function */
function resetExperiment() {
    window.location.reload();
}

/** This function execute during the stop watch runs */
function checkTime() { 
	/** 1200 is seconds, i.e, 20 minutes */
    if ( (total_time <= 1200) & (radiation_stage.getChildByName("indicatorTimer").text <= resultant_temp) ) {    
		if(total_time >= 1190){//enable the indicator rotation just before 20 minutes
			radiation_stage.getChildByName("indicatorFwdArrow").mouseEnabled = true;
			radiation_stage.getChildByName("indicatorBkdArrow").mouseEnabled = true;
		}
		totalEmissivityCalculation(); 
        displayIndicatorTimer();   
	} else {	  
        pauseWatch();
        clearInterval(timer_check);
    }
}

/** All rotations in this function */
function getRotation(name,value) {
    radiation_stage.getChildByName(name).rotation = value;
}

/** Power, voltage and current values of TP taken from the corresponding array */
function tpPowerVoltCurrentValues(tp_count) {
    tp_power_int=power_array[tp_count-1];   
    tp_voltage_int=voltage_array[tp_count-1];
    tp_current_int=current_array[tp_count-1];
}

/** Power, voltage and current values of BP taken from the corresponding array */
function bpPowerVoltCurrentValues(bp_count) {
    bp_power_int=power_array[bp_count-1];   
    bp_voltage_int=voltage_array[bp_count-1];
    bp_current_int=current_array[bp_count-1];
}

/** TP rotation function */
function tpRotation() {
    /** Click on the TP up arrow. It will increase the TP voltage. */
    radiation_stage.getChildByName("tp_up_hit").on("click", function() {   
        if ( tp_count < 21 ) {
            radiation_stage.getChildByName("tp_up_hit").mouseEnabled = true;
            radiation_stage.getChildByName("tp_down_hit").mouseEnabled = true;
            if ( tp_angle_float < 360 ) {
                tp_angle_float = tp_angle_float + 17.5; /** Increment the tuner rotation. 17.5  for adjusting the tuner. */
                getRotation("tpTuner",tp_angle_float);
            }
            tp_count++;
            tpPowerVoltCurrentValues(tp_count); /** Power, voltage and current values of TP taken from the corresponding array */
            distanceIntervalCalcTP(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
            rotateNeedlesTP(volt_needle_rotate_tp,ammeter_needle_rotate_tp); /** Ammeter and voltmeter needle rotation */
        } else {        
            radiation_stage.getChildByName("tp_up_hit").mouseEnabled = false;
            radiation_stage.getChildByName("tp_down_hit").mouseEnabled = true;
        }
    });
    /** Click on the BP down arrow. It will decrease the BP voltage. */
    radiation_stage.getChildByName("tp_down_hit").on("click", function() {
        if ( tp_angle_float >0 ) { /** BP Tuner backward rotation */
            tp_angle_float = tp_angle_float - 17.5;
            getRotation("tpTuner",tp_angle_float);
        }
        if ( tp_count > 0 ) {
            radiation_stage.getChildByName("tp_down_hit").mouseEnabled = true;
            radiation_stage.getChildByName("tp_up_hit").mouseEnabled = true;    
            tp_count--;  
            if ( tp_count == 0 ) {
                tp_power_int=0; 
                tp_voltage_int=0;
                tp_current_int=0;
                getRotation("vNeedle",0);
                getRotation("aNeedle",0);
            } else {
                tpPowerVoltCurrentValues(tp_count); /** Power, voltage and current values of TP taken from the corresponding array */
                distanceIntervalCalcTP(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
                rotateNeedlesTP(volt_needle_rotate_tp,ammeter_needle_rotate_tp); /** Ammeter and voltmeter needle rotation */
            }               
        } else {
            getRotation("vNeedle",0);
            radiation_stage.getChildByName("tp_down_hit").mouseEnabled = false;
            radiation_stage.getChildByName("tp_up_hit").mouseEnabled = true;
        }
    });    
}

/** BP rotation function */
function bpRotation() {
	/** Click on the BP up arrow. It will increase the BP voltage. */
	radiation_stage.getChildByName("bp_up_hit").on("click", function() {   
		if ( bp_count < 21 ) {
			radiation_stage.getChildByName("bp_up_hit").mouseEnabled = true;
			radiation_stage.getChildByName("bp_down_hit").mouseEnabled = true;
			if ( bp_angle_float < 360 ) {
				bp_angle_float = bp_angle_float + 17.5; /** Increment the tuner rotation. 17.5  for adjusting the tuner. */
				getRotation("bpTuner",bp_angle_float);
			}
			bp_count++;
			bpPowerVoltCurrentValues(bp_count); /** Power, voltage and current values of BP taken from the corresponding array */
	        distanceIntervalCalcBP(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
            rotateNeedlesBP(volt_needle_rotate_bp,ammeter_needle_rotate_bp); /** Ammeter and voltmeter needle rotation */
		} else {		
			radiation_stage.getChildByName("bp_up_hit").mouseEnabled = false;
			radiation_stage.getChildByName("bp_down_hit").mouseEnabled = true;
		}
	});
	/** Click on the BP down arrow. It will decrease the BP voltage. */
	radiation_stage.getChildByName("bp_down_hit").on("click", function() {
        if ( bp_angle_float >0 ) { /** BP Tuner backward rotation */
            bp_angle_float = bp_angle_float - 17.5;
            getRotation("bpTuner",bp_angle_float);
        }
	    if ( bp_count > 0 ) {
	        radiation_stage.getChildByName("bp_down_hit").mouseEnabled = true;
	        radiation_stage.getChildByName("bp_up_hit").mouseEnabled = true;	
            bp_count--;	 
            if ( bp_count == 0 ) {
                bp_power_int=0;	
                bp_voltage_int=0;
                bp_current_int=0;
                getRotation("vNeedle",0);
                getRotation("aNeedle",0);
            } else {
                bpPowerVoltCurrentValues(bp_count); /** Power, voltage and current values of BP taken from the corresponding array */
                distanceIntervalCalcBP(); /** Finding the interval value of the ammeter and voltmeter needle rotation */
                rotateNeedlesBP(volt_needle_rotate_bp,ammeter_needle_rotate_bp); /** Ammeter and voltmeter needle rotation */
            }           	
        } else {
            getRotation("vNeedle",0);
            radiation_stage.getChildByName("bp_down_hit").mouseEnabled = false;
            radiation_stage.getChildByName("bp_up_hit").mouseEnabled = true;
        }
    });	
}

/** Finding the TP interval value of the ammeter and voltmeter needle rotation */ 
function distanceIntervalCalcTP() {
    vneedle_distance_interval_tp=(tp_voltage_int/10)-5;    
    volt_needle_rotate_tp=3.5*vneedle_distance_interval_tp;     
    aneedle_distance_interval_tp=(tp_current_int.toFixed(2)*100)-10;
    ammeter_needle_rotate_tp=aneedle_distance_interval_tp;
}

/** Finding the BP interval value of the ammeter and voltmeter needle rotation */ 
function distanceIntervalCalcBP() {
    vneedle_distance_interval_bp=(bp_voltage_int/10)-5;    
	volt_needle_rotate_bp=3.5*vneedle_distance_interval_bp;		
    aneedle_distance_interval_bp=(bp_current_int.toFixed(2)*100)-10;
	ammeter_needle_rotate_bp=aneedle_distance_interval_bp;   
}

/** Voltmeter needle rotation function */
function rotateNeedlesTP(val1,val2) {
    if ( toggle_flag ) {
        getRotation("vNeedle",val1);
        getRotation("aNeedle",val2);
        radiation_stage.getChildByName("voltmeterReading").text = tp_voltage_int;
        radiation_stage.getChildByName("ammeterReading").text = tp_current_int.toFixed(1);
    }    
}

/** Voltmeter needle rotation function */
function rotateNeedlesBP(val1,val2) { 
    if ( !toggle_flag ) {
        getRotation("vNeedle",val1);
		getRotation("aNeedle",val2);
        radiation_stage.getChildByName("voltmeterReading").text = bp_voltage_int;
        radiation_stage.getChildByName("ammeterReading").text = bp_current_int.toFixed(1);
    }    
}

/** Function for the rotation of temperature indicator */
function rotateTempIndicator(incr, rotVal) { 
    indicator_text_count = indicator_text_count + incr; /** Knob of the indicator */
    indicator_rotation_count += rotVal; /** Indicator count */
    getRotation("indicatorSelectorSwitchBase",indicator_rotation_count);    
    if ( minute >= 20 ) {
        totalEmissivityCalculation(); /** Calculation of emissivity */
        radiation_stage.getChildByName("indicatorTimer").text=resultant_temp.toFixed(2);
    }
}

/** The reading value display function */
function indicatorReadingFn() {    
    radiation_stage.getChildByName("indicatorReading").text = "T" + indicator_text_count; /** Indicator count text box value */
}

/** Calculation part */

/** Calculation of emissivity */
function totalEmissivityCalculation() {
    emissivity_float=emissivity[selected_material]; /** Select the emisitivity from the array given */  
    radius_float = diameter_val_float / 2; /** Finding the radius from diameter */
    thickness_float = thickness_val_float;
    /** area = 2*3.14*rx+3.14r2 */
    area_float = (2 * Math.PI * radius_float * thickness_float) + (Math.PI * Math.pow(radius_float, 2));
    /** (Tb4 - Tc4) K */
    var _blackplate_temp=bp_power_int/(emissivity_blackbody*stefan_boltzmann_constant*area_float);
    t4_chamber_temp=temperature_val*temperature_val*temperature_val*temperature_val;
    var _blackbody_temp=_blackplate_temp+t4_chamber_temp;    
    t1_to_t3_blackbody_temp=Math.pow(_blackbody_temp,1/4);

    /**  Tp4 - Tc4 K */
    var _temperature_of_plate=bp_power_int/(emissivity_float*stefan_boltzmann_constant*area_float);
    var _testplate_temp=_temperature_of_plate+t4_chamber_temp;
    t5_to_t7_testplate_temp=Math.pow(_testplate_temp,1/4);

    /** Indicator timer with respect to the indicator rotation count, Same indicator temperature for T1,T2,T3. 
    And same for T5,T6,T7. Different temperature for T4 */ 
    if ( indicator_text_count == 1 || indicator_text_count == 2 || indicator_text_count == 3 ) { /** The resultant value if indicator_text_count is in between 1 and 3 */
        resultant_temp=t1_to_t3_blackbody_temp;
    } else if ( indicator_text_count == 5 || indicator_text_count == 6 || indicator_text_count == 7 ) { /** The resultant value if indicator_text_count is in between 5 and 7 */
        resultant_temp=t5_to_t7_testplate_temp
    } else {
        resultant_temp=temperature_val;
    }
}

/** Indicator timer function */
function displayIndicatorTimer() {
    if ( power_on_flag ) {
        if ( tp_count == 0 ) {
            radiation_stage.getChildByName("indicatorTimer").text = initial_temp1.toFixed(2); /** Set initial temperature as 27 degree */
            radiation_stage.getChildByName("ammeterReading").text=0; /** Set the ammeter and voltmeter rotation as 0 */
            radiation_stage.getChildByName("voltmeterReading").text=0;
        } else {
            var _temp_differnce=resultant_temp-initial_temp1;
            var _incr_factor=_temp_differnce/1200; 
			/** Find the indicator timer increment factor with respect to the seconds */
	        if ( total_time != time_array[time_array.length-1] ) {
	            /** Check the timer interval render more than once */
                initial_temp2=parseFloat(initial_temp2+_incr_factor);  
			}
            radiation_stage.getChildByName("indicatorTimer").text=initial_temp2.toFixed(2);
        }
    }
	/** Total_time is calculated in seconds and taken from the stopwatch function,
	1200 is 20 minutes in terms of seconds */
    if ( total_time >= 1200 ) {
		radiation_stage.getChildByName("indicatorTimer").text=resultant_temp.toFixed(2);
        radiation_stage.getChildByName("indicatorFwdArrow").mouseEnabled = true;
        radiation_stage.getChildByName("indicatorBkdArrow").mouseEnabled = true;
    }
}
/** Calculation ends */
