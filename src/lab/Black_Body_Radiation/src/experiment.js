(function(){
  angular.module('users')
       .directive("experiment",directiveFunction)
})();
var tick;

var black_body_stage,anim_frame,anim_width,anim_object;

var current_radius_of_disc_in_cm,current_water_temperature,current_surrounding_temperature,current_mass_of_disc;

var stefan_boltzman_constant,current_specific_heat_of_disc,current_area_of_dics,final_output,text_run_interval;

var radio_flag,count_incrmnt,initial_click_flag,timer_check,timer_interval,power_on_flag;

var help_array = [];

function directiveFunction(){
    return {
        restrict: "A",
        link: function(scope,element,attrs) {               
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
                id: "crossSectional",
                src: "././images/cross_sectional_view.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "knobDown",
                src: "././images/knob_down.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "knobUp",
                src: "././images/knob_up.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "light_on",
                src: "././images/light_on.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "wateranim",
                src: "././images/water_animation.svg",
                type: createjs.LoadQueue.IMAGE
            }]);
            black_body_stage = new createjs.Stage("demoCanvas");
            black_body_stage.enableDOMEvents(true);
            black_body_stage.enableMouseOver();
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
                           
            function handleComplete() {              
                loadImages(queue.getResult("background"),"background",-60,-30,"",0);
                loadImages(queue.getResult("crossSectional"),"crossSectional",-60,-30,"",0);
                loadImages(queue.getResult("knobDown"),"knobDown",419,503,"",0);
                loadImages(queue.getResult("knobUp"),"knobUp",420,503,"",0);   
                loadImages(queue.getResult("light_on"),"light_on",324,209,'',0); 
                loadImages(queue.getResult("wateranim"),"waterAnimation",-7,210,"",0);
                /** Text loading */
                setText("indicatorText",452,229,"","#FFFFFF",0.9);
                initialisationOfVariables(); /** Initializing the variables */
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */  
                /** Function for finding the area of the disc */
                findAreaOfDics=function() {                    
                    current_area_of_dics=(2*3.14)*(Math.pow(current_radius_of_disc_in_cm, 2))*(Math.pow(10,-4)); /**Area of disc A =2*3.14*R2 */
                }
                findAreaOfDics(); /** Finding the area of the disc on initial */
                /** Function for calculating  black body radiation */
                calculation = function() {
                    var water_temperature_power=Math.pow(current_water_temperature,4);
                    var surrounding_temperature_power=Math.pow(current_surrounding_temperature,4);
                    final_output=stefan_boltzman_constant*current_area_of_dics*(water_temperature_power-surrounding_temperature_power)/(current_mass_of_disc*current_specific_heat_of_disc/1000);
                }
                calculation(); /** Finding the black body radiation on initial */
                createStopwatch (black_body_stage, 95,405,timer_interval); /** Function for setting stopwatch */
                poweron_circle = new createjs.Shape(); /** Add circle shape for power on/off */
                poweron_circle.name="powerOnCircle";
                poweron_circle.graphics.beginFill("#660000").drawCircle(0, 0, 3);
                poweron_circle.x = 472;
                poweron_circle.y = 253;    
                black_body_stage.addChild(poweron_circle);
            }

            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */   
            function translationLabels(){
                /** This help array shows the hints for this experiment */
                help_array=[_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("help6"),_("help7"),_("Next"),_("Close")];
                scope.heading=_("Black Body Radiation");
                scope.variables=_("Variables");                
                scope.water_temperature=_("Water Temperature: ");
                scope.surr_temperature=_("Surrounding Temperature: ");
                scope.disc_mass=_("Mass of Disc: ");                
                scope.disc_radius=_("Radius of Disc: ");                
                power_btn_var=_("Power On");
                reset_btn_var=_("Reset");
                scope.power_on=power_btn_var;
                scope.fit_disc=_("Fit the Disc");
                scope.cross_view=_("Cross-sectional View");                            
                scope.measurement=_("Measurements");              
                scope.copyright=_("copyright");
                gram_label=_("g");
                cm_label=_("cm");
                scope.mass=5+gram_label; /** Initial disc mass of slider value */
                scope.radius=1+cm_label; /** Initial disc radius of slider value */                
                scope.$apply();             
            }            
        }
    }
}
/** Createjs stage updation happens in every interval */
function updateTimer() {
    black_body_stage.update();
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
    black_body_stage.addChild(_text); /** Adding text to the stage */
}
/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot){
    var _bitmap = new createjs.Bitmap(image).set({});     
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX=_bitmap.scaleY=0.88;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor;    
    black_body_stage.addChild(_bitmap); /** Adding bitmap to the stage */ 
}
/** All variables initializing in this function */
function initialisationOfVariables() {
    anim_frame = 0; /** Frame used for animation */
    anim_width = 736.59; /** Animation width */
    timer_interval=0.05; /** Interval of the timer and clock to be execute */
    anim_object = black_body_stage.getChildByName("waterAnimation"); /** Animation frames take as an object */
    current_water_temperature=35; /** Initializing the current water temperature */
    current_surrounding_temperature=30; /** Initializing the current surrounding temperature */
    current_mass_of_disc=5; /** Initializing the current mass of the disc */
    current_radius_of_disc_in_cm=1; /** Initializing the current radius of the disc in centimeter */
    stefan_boltzman_constant=5.6703*Math.pow(10,-8); /** Stefan Boltzman constant */
    current_specific_heat_of_disc=0.385; /** Initializing the specific heat of disc */
    current_area_of_dics=0.000628; /** Initializing the area of the disc */
    final_output=0.01277548; /** Initializing black body radiation */
    radio_flag=false; /** Initializing radio_flag- for toggling the radio button value */
    initial_click_flag=true; /** initial_click_flag is used to show the current surrounding temperature value on the radio button section */
    power_on_flag=false;
}
/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    /** Resetting the images to its initial status */
    black_body_stage.getChildByName("crossSectional").visible = false; /** Hiding the cross sectional view */
    black_body_stage.getChildByName("knobUp").visible = false; /** Hiding the bottom Knob */
    black_body_stage.getChildByName("light_on").visible = false; /** Hiding the power on light */
    black_body_stage.getChildByName("waterAnimation").visible = false; /** Hiding the water animation frame */
}
/** Function for cross sectional view */  
function systemCrossView(scope) {
    var cross_view_Value = scope.crossView; /** Getting the value of check box */
    if ( cross_view_Value ) { /** If the value is true, will show the  cross sectional view */
        showCrossView(); 
    } else {
        hideCrossView(); /** If the value is false, will hide the  cross sectional view */
    }
}
 /** Power On function */   
function powerOn(scope) {
    scope.fit_disc_disable = false; /** Enabling the fit disc button */
    power_on_flag=true;
    scope.power_on=reset_btn_var; /** Changing the text of "power on" button */
    if ( radio_flag ) {
        black_body_stage.getChildByName("indicatorText").text=scope.surrTemp; /** Showing the current surrounding temperature on the indicator display */
    } else {
        black_body_stage.getChildByName("indicatorText").text=scope.waterTemp; /** Showing the current water temperature on the indicator display */
    }    
    black_body_stage.getChildByName("powerOnCircle").visible=false; /** Power on light */
    black_body_stage.getChildByName("light_on").visible = true; /** Show the power on light */    
}
/** Function to fit the disc in the correct position */
function fitTheDisc(scope) {
    black_body_stage.getChildByName("knobUp").visible = true; /** Show the "knobUp" object */
    black_body_stage.getChildByName("knobDown").visible = false; /** Hiding the "knobDown" object */
    increaseTemperature(scope); /** Calling the increaseTemperature function after the knob fit in the position */
    scope.slider_disable=true; /** Disabling the sliders */
    scope.fit_disc_disable=true; /** Disabling the fit disc button */
    initial_click_flag=false; /** Setting initial_click_flag "false" - then only we can able to show the changing surrounding temperature on the text box */
    pause_flag = false;
    timer_check = setInterval(expWatch,timer_interval); /** Stopwatch in a timer */   
}
/** Function for running the stopwatch in a timer */
function expWatch() {
    if ( !pause_flag ) {
        showWatch(black_body_stage);
    }
}
/** Function for increasing the surrounding temperature according to the calculation and time */
function increaseTemperature(scope){
    var _count=0; /** Setting the counter value "0" for increase the temperature according to it */
    text_run_interval=setInterval(function() { /** This interval is used to show the temperature increment value according to the timer */
        _count++;
        count_incrmnt=_count*final_output.toPrecision(4); /** Increasing the temperature according to the time */
        if ( radio_flag ) { /** If radio_flag is true then it will show the changing temperature on the device screen and radio button text */
            black_body_stage.getChildByName("indicatorText").text=(current_surrounding_temperature+count_incrmnt).toPrecision(4); /** Passing the value of temperature to the indicator */
            scope.temperature_value=(current_surrounding_temperature+count_incrmnt).toPrecision(4)+" (℃)"; /** Passing the value of temperature to the radio button text */
            scope.$apply(); /** Applying the change to the control section according to the interval */
            black_body_stage.update(); /** Updating the control section according to the interval */
        } else { /** If the radio_flag is false then the indicator text and radio button text will show the current water temperature */
            black_body_stage.getChildByName("indicatorText").text=scope.waterTemp;
            scope.temperature_value=scope.waterTemp+" (℃)"; 
        }
        /** Once the surrounding temperature is greater than or equal to the 3.5 degree less than water temperature, the interval will stop */
        if ( (current_surrounding_temperature+count_incrmnt).toPrecision(4) >= (current_water_temperature-3.5) ){
            clearInterval(text_run_interval)
        }
    },500)     
}
/** Slider change - Water temperature */
function waterTempSliderFN(scope) {
    current_water_temperature= scope.waterTemp; /** Getting the value of the Water temperature slider */
    scope.water_temp=current_water_temperature+" (℃)"; /** Appending the Water temperature value into the label */
    if ( scope.waterTemp <= (scope.surrTemp+5) ) {    
        scope.waterTemp=(scope.surrTemp+5);
        scope.water_temp=(scope.surrTemp+5)+" (℃)";
        scope.temperature_value=scope.waterTemp+" (℃)";
    } else if ( scope.waterTemp >= (scope.surrTemp+5) ) { /** Limiting the slider value according to the surrounding temperature */
        scope.water_temp=(scope.waterTemp)+" (℃)";
        scope.temperature_value=current_water_temperature+" (℃)";
        calculation();
    }
}   
/** Slider change - Surrounding temperature */
function surroundTempSliderFN(scope) {
    current_surrounding_temperature= scope.surrTemp; /** Getting the value of the Surrounding temperature slider */
    scope.surr_temp=current_surrounding_temperature+" (℃)"; /** Appending the Surrounding temperature value into the label */
    if ( scope.surrTemp >= (scope.waterTemp-5) ) { 
        scope.surr_temp=(scope.waterTemp-5)+" (℃)"
        scope.surrTemp=current_surrounding_temperature= (scope.waterTemp-5);
        calculation();
    } else if ( scope.surrTemp <= (scope.waterTemp-5) ) { /** Else set the surround input value as surround slider value */
        scope.surr_temp=(scope.surrTemp)+" (℃)";
        calculation();
    }
}
/** Slider change - Mass of the Disc */
function massDiscSliderFN(scope) {
    current_mass_of_disc=scope.discMass; /** Getting the value of the Mass of the Disc slider */
    scope.mass=current_mass_of_disc+gram_label; /** Appending the Mass of the Disc value into the label */
    calculation();
}
/** Slider change - Radius of the Disc */
function radiusDiscSliderFN(scope) {
    current_radius_of_disc_in_cm=scope.discRadius; /** Getting the value of the Radius of the Disc slider */
    scope.radius=current_radius_of_disc_in_cm+cm_label; /** Appending the Radius of the Disc value into the label */
    findAreaOfDics(); /** Finding the value of disc */
    calculation(); /** Calculating the result while changing the radius of the disc */
}
/** Function for checking the result using radio buttons */
function resultCheck(scope) {
    var _radio_value=scope.temp.data;
    if ( _radio_value=="T4" ) { /** Checking the corresponding result using radio buttons */
        scope.temperature="T4:"; /** If _radio_value is "T4" it will show the changing surrounding temperature */
        scope.temperature_value=(current_surrounding_temperature+count_incrmnt).toPrecision(4)+" (℃)"; 
        black_body_stage.getChildByName("indicatorText").text=(current_surrounding_temperature+count_incrmnt).toPrecision(4);
        radio_flag=true; /** Setting the radio_flag true to show the changing surrounding temperature */
        if ( initial_click_flag ) { /** If initial_click_flag is true then it will show the static surrounding temperature */
            scope.temperature_value=current_surrounding_temperature+" (℃)"; 
            black_body_stage.getChildByName("indicatorText").text=current_surrounding_temperature;
        }
    } else {
        scope.temperature=_radio_value+":"; /** Passing the value to the result */
        scope.temperature_value=scope.waterTemp+" (℃)";
        black_body_stage.getChildByName("indicatorText").text=scope.waterTemp;
        radio_flag=false; /** Setting the radio_flag false to show the current surrounding temperature */
    }
}
/** Function for showing cross sectional view */
function showCrossView() {
    black_body_stage.getChildByName("crossSectional").visible = true; /** Display cross sectional view */
    black_body_stage.getChildByName("waterAnimation").visible = true; /** Display the water animation */
    createjs.Ticker.setInterval(100);
    createjs.Ticker.addEventListener("tick", startAnimation); /** Start animation event */
}
/** Function for hiding the cross sectional view */
function hideCrossView() {
    black_body_stage.getChildByName("crossSectional").visible = false; /** Cross sectional view visibility false */
    black_body_stage.getChildByName("waterAnimation").visible = false; /** Water animation visibility false */
    createjs.Ticker.removeEventListener("tick", startAnimation); /** Remove the animation event */
}
/** Water movement animation function */
function startAnimation() {
    anim_frame++; /** Frame increment */
    if (anim_frame <= 7) {
        anim_object.x = anim_object.x - anim_width; /** Changing of animation object x position */
    } else {
        anim_frame = 0; /** Resetting the animation frame */        
        black_body_stage.getChildByName("waterAnimation").x =-6.5; /** Resetting the position of water animation object */
    }
}
/** Resetting the experiment */
function reset(scope) {
    window.location.reload();
}
