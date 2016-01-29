(function() {
    angular
    .module('users')
    .directive("experiment", directiveFunction)
})();
    
var natural_convection_stage, tick;

var needle_v_reading, needle_a_reading, voltage, current, indcator_rotate, resultant_temp;

var pi, conductivity_const, power, scopes, current_temp, coefficient, nusselt_number, thermal_conductivity_air, selected_material;

var area_of_cylinder, area_of_woodenbox, avg_temperature, temperature, clr_air_flow, timer_interval, timer_check;

var material_x = 570;

var material_y = 282;

var material_array = material_item_array = help_array = cross_section_array = cylinder_wire_array = current_array = [];

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
            tick = setInterval(updateTimer, 100);
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "box_full",
                src: "././images/box_full.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "aluminium",
                src: "././images/aluminium.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "copper",
                src: "././images/copper.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "iron",
                src: "././images/iron.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "silver",
                src: "././images/silver.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "steel",
                src: "././images/steel.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "aluminium_cross_section",
                src: "././images/aluminium_cross_section.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "aluminium_wire",
                src: "././images/aluminium_wire.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "black_holder",
                src: "././images/black_holder.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "coil",
                src: "././images/coil.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "rod_shadow",
                src: "././images/rod_shadow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "glasson_box",
                src: "././images/glasson_box.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "glass_effect_cover",
                src: "././images/glass_effect_cover.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "switch_off",
                src: "././images/switch_off.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "switch_on",
                src: "././images/switch_on.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow",
                src: "././images/arrow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "rotator_line",
                src: "././images/rotator_line.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "needle",
                src: "././images/needle.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicator_to_rotate",
                src: "././images/indicator_to_rotate.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "indicator_turner",
                src: "././images/indicator_turner.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow_in_indicator",
                src: "././images/arrow_in_indicator.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "box_cross_section",
                src: "././images/box_cross_section.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "copper_cross_section",
                src: "././images/copper_cross_section.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "iron_cross_section",
                src: "././images/iron_cross_section.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "silver_cross_section",
                src: "././images/silver_cross_section.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "steel_cross_section",
                src: "././images/steel_cross_section.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "copper_wire",
                src: "././images/copper_wire.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "iron_wire",
                src: "././images/iron_wire.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "silver_wire",
                src: "././images/silver_wire.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "steel_wire",
                src: "././images/steel_wire.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow_anim",
                src: "././images/arrow_for_anim.svg",
                type: createjs.LoadQueue.IMAGE
            }]);
            /** Declaration of main canvas */
            natural_convection_stage = new createjs.Stage("demoCanvas");
            natural_convection_stage.enableDOMEvents(true);
            natural_convection_stage.enableMouseOver();
            container = new createjs.Container(); /** Creating main container */
            container.name = "main_container";
            natural_convection_stage.addChild(container); /** Append it in the natural_convection_stage */

            function handleComplete() {
                loadImages(queue.getResult("background"), "background", -131, -90, "", 0, container, 0.89);
                loadImages(queue.getResult("box_full"), "box_full", 580, 267, "", 0, container, 0.89);
                loadImages(queue.getResult("box_cross_section"), "box_cross_section", 486, 20, "", 0, container, 0.89); /** Changing image of box to show crossection */
                loadImages(queue.getResult("arrow_anim"), "arrow_anim_cntr", 572, 630, "", 0, container, 0.89);
                loadImages(queue.getResult("arrow_anim"), "arrow_anim_lft", 480, 550, "", 90, container, 0.89);
                loadImages(queue.getResult("arrow_anim"), "arrow_anim_rgt", 662, 550, "", -90, container, 0.89);
                loadImages(queue.getResult("arrow_anim"), "arrow_anim_cntr_1", 572, 630, "", 0, container, 0.89);
                loadImages(queue.getResult("arrow_anim"), "arrow_anim_lft_1", 480, 550, "", 90, container, 0.89);
                loadImages(queue.getResult("arrow_anim"), "arrow_anim_rgt_1", 662, 550, "", -90, container, 0.89);
                loadImages(queue.getResult("rod_shadow"), "rod_shadow", 572, 285, "", 0, container, 0.89);
                loadImages(queue.getResult("steel"), "steel", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("silver"), "silver", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("iron"), "iron", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("copper"), "copper", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("aluminium"), "aluminium", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("steel_cross_section"), "steel_cross_section", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("silver_cross_section"), "silver_cross_section", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("iron_cross_section"), "iron_cross_section", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("copper_cross_section"), "copper_cross_section", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("aluminium_cross_section"), "aluminium_cross_section", material_x, material_y, "", 0, container, 0.89);
                loadImages(queue.getResult("coil"), "coil", 568, 245, "", 0, container, 0.89);
                loadImages(queue.getResult("black_holder"), "black_holder", 549, 152, "", 0, container, 0.89);
                loadImages(queue.getResult("steel_wire"), "steel_wire", 560, 84, "", 0, container, 0.89);
                loadImages(queue.getResult("silver_wire"), "silver_wire", 560, 84, "", 0, container, 0.89);
                loadImages(queue.getResult("iron_wire"), "iron_wire", 560, 84, "", 0, container, 0.89);
                loadImages(queue.getResult("copper_wire"), "copper_wire", 560, 84, "", 0, container, 0.89);
                loadImages(queue.getResult("aluminium_wire"), "aluminium_wire", 560, 84, "", 0, container, 0.89);
                loadImages(queue.getResult("glasson_box"), "glasson_box", 576, 278, "", 0, container, 0.89);
                loadImages(queue.getResult("needle"), "needle_V", 177, 227, "", 0, container, 0.89);
                loadImages(queue.getResult("needle"), "needle_A", 332, 228, "", 0, container, 0.89);
                loadImages(queue.getResult("indicator_to_rotate"), "indicator_to_rotate", 147, 387, "", 26, container, 0.89);
                loadImages(queue.getResult("indicator_turner"), "indicator_turner", 135, 375, "", 0, container, 0.89);
                loadImages(queue.getResult("arrow_in_indicator"), "arrow_rht", 180, 367, "pointer", 0, container, 0.89);
                loadImages(queue.getResult("arrow_in_indicator"), "arrow_lft", 107, 384, "pointer", 180, container, 0.89);
                loadImages(queue.getResult("switch_on"), "switch_on", 420, 303, "", 0, container, 0.89);
                loadImages(queue.getResult("switch_off"), "switch_off", 420, 303, "", 0, container, 0.89);

                setText("voltage", 125, 270, "000", "black", 1.3, container);
                setText("current", 285, 270, "00", "black", 1.3, container);
                setText("TemperaturePoint", 132, 440, "T1", "black", 1.3, container);
                setText("temperature", 140, 350, "27.00", "white", 1.3, container);
                getChild("temperature").textAlign = 'center';
                loadImages(queue.getResult("glass_effect_cover"), "glass_effect_cover", 76, 130, "", 0, container, 0.89);
                loadImages(queue.getResult("arrow"), "arrow_right", 446, 176, "pointer", 0, container, 0.89);
                loadImages(queue.getResult("arrow"), "arrow_left", 423, 177, "pointer", 90, container, 0.89);
                loadImages(queue.getResult("rotator_line"), "rotator_line", 435, 210, "", 0, container, 0.89);
                initialisationOfControls(scope) /** Initializing control side variables */
                initialisationOfVariables(); /** Initializing the variables */
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */
                createStopwatch(natural_convection_stage, 200, 370, timer_interval);

                material_item_array = ["aluminium", "copper", "iron", "silver", "steel"]; /** Initially display of vibration magnetometer */
                cross_section_array = ["aluminium_cross_section", "copper_cross_section", "iron_cross_section", "silver_cross_section", "steel_cross_section"];
                cylinder_wire_array = ["aluminium_wire", "copper_wire", "iron_wire", "silver_wire", "steel_wire"]; /** For changing the wire based on type of material selected */

                getChild("arrow_right").on("mousedown", function(evt) { /** Function to increment voltage and current(right arrow) */
                    if (needle_v_reading == 0) { /** While needle reading reaches zero, both voltage and current are set to initial state */
                        needle_v_reading = 14.4;
                        voltage = 90; /** Initial value of voltage */
                        current = current_array[0]; /** Initial value of current */
                    }
                    getChild("arrow_right").x = getChild("arrow_right").x + 2; /** Arrow image move 2px to right */
                    getChild("arrow_right").y = getChild("arrow_right").y + 2; /** Arrow image move 2px to bottom */
                    if (voltage < 300) { /** Voltage is less than upper limit */
                        needle_v_reading = needle_v_reading + 3.6; /** Needle of voltage rotate by 3.6 degree */
                        getChild("needle_V").rotation = needle_v_reading;
                        voltage = voltage + 10; /** Voltage value increment by 10 */
                        current = current_array[(voltage - 100) / 10]; /** Current value increment */
                        getChild("voltage").text = voltage; /** Updating voltage text */
                        getChild("current").text = current.toFixed(2); /** Updating current text */
                        getChild("rotator_line").rotation = needle_v_reading * 4; /** Rotating line over rotation switch */
                        power = voltage * current.toFixed(2);
                        showCurrentTemperature();
                    }
                    if (needle_a_reading < 90) { /** Checking whether the needle of current, reaches the maxium limit  */
                        needle_a_reading = (current_array[(voltage - 100) / 10] * 100) - 10; /** Value of current increment for each arrow click */
                        getChild("needle_A").rotation = needle_a_reading; /** Rotating needle of voltage */
                    }
                });
                getChild("arrow_right").on("pressup", function(evt) {
                    getChild("arrow_right").x = 446; /** Arrow images reposition to its initial state */
                    getChild("arrow_right").y = 176; /** Arrow images reposition to its initial state */
                });
                getChild("arrow_left").on("mousedown", function(evt) {
                    getChild("arrow_left").x = getChild("arrow_left").x - 2; /** Arrow image move 2px to left */
                    getChild("arrow_left").y = getChild("arrow_left").y + 2; /** Arrow image move 2px to bottom */
                    if (needle_v_reading <= 18) { /** Check whether the voltage reaches the lower limit */
                        needle_v_reading = 0; /** Set rotation value of voltage needle  to zero  */
                        voltage = 0; /** Set voltage vlue to zero */
                        current = 0; /** Set value of current to zero */
                    } else {
                        needle_v_reading = needle_v_reading - 3.6; /** Decrease roatation angle  of voltage needle by 3.6 */
                        voltage = voltage - 10; /** Decrease voltage by 10 */
                        current = current_array[(voltage - 100) / 10] /** Decrease value of current by 0.1 */
                    }
                    if (needle_v_reading >= 0) { /** Check wehter rotation angle of needle of voltage is not lessthan zero */
                        getChild("needle_V").rotation = needle_v_reading; /** Rotation of needle of voltage */
                        getChild("rotator_line").rotation = needle_v_reading * 4; /** Rotation of line over rotation switch */
                        getChild("voltage").text = voltage != 0 ? voltage : "000"; /** Reading of voltage */
                        getChild("current").text = current != 0 ? current.toFixed(2) : "00"; /** Reading of current */
                        power = voltage * current.toFixed(2);
                        showCurrentTemperature();
                    }
                    if (needle_a_reading > 0) {
                        needle_a_reading = (current_array[(voltage - 100) / 10] * 100) - 10; /** Rotation value of current decrease by 10 */
                        if (isNaN(needle_a_reading)) { /** Needle reading set to zero while voltage and current become zero */
                            needle_a_reading = 0;
                        }
                        getChild("needle_A").rotation = needle_a_reading; /** Rotation of needle of current */
                    }
                });
                getChild("arrow_left").on("pressup", function(evt) {
                    getChild("arrow_left").x = 423; /** Arrow images reposition to its initial state */
                    getChild("arrow_left").y = 177; /** Arrow images reposition to its initial state */
                });
                getChild("arrow_rht").on("mousedown", function(evt) { /** Arrow images in temperature indicator */
                    getChild("arrow_rht").x = 182; /** Arrow images move to right, to make an idication to click */
                    if (indcator_rotate <= 130) {
                        indcator_rotate = indcator_rotate + 26; /** The angle to rotate the selector switch */
                        getChild("indicator_to_rotate").rotation = indcator_rotate; /** Rotation of knob in temperature indicator */
                        getChild("TemperaturePoint").text = "T" + Math.ceil(indcator_rotate / 26); /** Text to show T1,T2,T3,T4,T5,T6 */
                        showCurrentTemperature();
                    }
                });
                getChild("arrow_rht").on("pressup", function(evt) {
                    getChild("arrow_rht").x = 180; /** Reposition arrow image to its original position */
                });
                getChild("arrow_lft").on("mousedown", function(evt) {
                    getChild("arrow_lft").x = 105; /** Arrow images move to right, to make an idication to click */
                    if (indcator_rotate >= 26) {
                        indcator_rotate = indcator_rotate - 26; /** The angle to rotate the selector switch */
                        getChild("indicator_to_rotate").rotation = indcator_rotate; /** Rotation of knob in temperature indicator */
                        getChild("TemperaturePoint").text = "T" + Math.ceil(indcator_rotate / 26); /** Text to show T1,T2,T3,T4,T5,T6 */
                        showCurrentTemperature();
                    }
                });
                getChild("arrow_lft").on("pressup", function(evt) {
                    getChild("arrow_lft").x = 107; /** Reposition arrow image to its original position */
                });
            }
            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("help8"), _("help9"), _("help10"), _("Next"), _("Close")];
                scope.heading = _("Heat Transfer by Natural Convection");
                scope.variables = _("Variables");
                scope.result = _("Result");
                scope.copyright = _("copyright");
                scope.material_type_lbl = _("Choose Material:");
                scope.cm = _("cm");
                scope.aluminium = _("Aluminium");
                scope.wooden_box_lbl = _("Width of wooden box:");
                scope.wooden_box_height_lbl = _("Height of wooden box:");
                scope.cylinder_diameter_lbl = _("Diameter of Cylinder:");
                scope.cylinder_length_lbl = _("Length of the Cylinder:");
                scope.cylinder_thickness_lbl = _("Thickness of Cylinder:");
                scope.power_on_off_txt = _("Power On");
                scope.reset = _("Reset");
                scope.cross_section_txt = _("Show cross section");
                scope.nusselt = _("Nusselt number(N):");
                scope.coefficient = _("Heat transfer coefficient(h):");
                scope.material_array = [{
                    material: _('Aluminium'),
                    type: 0
                }, {
                    material: _('Copper'),
                    type: 1
                }, {
                    material: _('Iron'),
                    type: 2
                }, {
                    material: _('Silver'),
                    type: 3
                }, {
                    material: _('Steel'),
                    type: 4
                }];
                scope.$apply();
            }
        }
    }
}
/** All the texts loading and added to the natural_convection_stage */
function setText(name, textX, textY, value, color, fontSize, container) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    container.addChild(_text); /** Adding text to the container */
}
/** All the images loading and added to the natural_convection_stage */
function loadImages(image, name, xPos, yPos, cursor, rot, container, scale) {
    var _bitmap = new createjs.Bitmap(image).set({});
    if (name == "arrow_anim_cntr_1" || name == "arrow_anim_lft_1" || name == "arrow_anim_rgt_1" || name == "arrow_anim_cntr" || name == "arrow_anim_lft" || name == "arrow_anim_rgt" || name == "cylinder_wire" || name == "rod_shadow" || name == "indicator_to_rotate" || name == "arrow_lft" || name == "box_full" || name == "glasson_box" || name == "aluminium" || name == "copper" || name == "iron" || name == "silver" || name == "steel" || name == "aluminium_cross_section" || name == "copper_cross_section" || name == "iron_cross_section" || name == "silver_cross_section" || name == "steel_cross_section" ) {
        _bitmap.regX = _bitmap.image.width / 2;
        _bitmap.regY = _bitmap.image.height / 2;
    }
    if (name == "needle_V" || name == "needle_A") {
        _bitmap.regX = _bitmap.image.width;
        _bitmap.regY = _bitmap.image.height / 2;
    } else if (name == "rotator_line") {
        _bitmap.regX = _bitmap.image.width / 2;
        _bitmap.regY = _bitmap.image.height;
    }
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX = _bitmap.scaleY = scale;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = rot;
    _bitmap.cursor = cursor;
    container.addChild(_bitmap); /** Adding bitmap to the container */
}

/** function to return child element of container */
function getChild(child_name) {
    return container.getChildByName(child_name);
}
/** Initialisation of all controls */
function initialisationOfControls(scope) {
    scope.wooden_box_width = 7.5; /** Initial width of wooden box */
    scope.wooden_box_height = 75 /** Initial height of wooden box */
    scope.cylinder_diameter = 7; /** Initial diameter of cylinder */
    scope.cylinder_length = 55 /** Initial Length  of cylinder */
    scope.cylinder_thickness = 0.2 /** Initial thickness of cylinder */
    scope.powerOn = true; /** Initial value of 'power on' button */
    scopes = scope;
}
/** All variables initialising in this function */
function initialisationOfVariables() {
    needle_v_reading = 14.4; /** Initial value of needle of voltage */
    needle_a_reading = 0; /** Initial value of needle of current */
    voltage = 90; /** Initial value of voltage*/
    current = 0.1; /** Initial valie of current */
    power = 0; /** power = voltage * current */
    indcator_rotate = 25; /** Initial rotaion of rotator indicator */
    pi = 3.14; /** Value of pi */
    conductivity_const = [237, 401, 80.4, 429, 20]; /** Thermo conductivity constant value for each material */
    temperature = []; /** Initialization of temperature array */
    temperature[0] = 30; /** Value of T1 temperature and it is a constant value */
    temperature[5] = 36; /** Value of T1 temperature and it is a constant value */
    timer_interval = 0.02; /** Interval of the timer and clock to be execute */
    current_temp = 27;
    coefficient = 0;
    nusselt_number = 0;
    type = 0;
    selected_material = 0;
    thermal_conductivity_air = 0.024;
    current_array = [0.2, 0.309091, 0.4, 0.476923, 0.542857, 0.6, 0.65, 0.694118, 0.73333, 0.768421, 0.8, 0.828571, 0.854545, 0.878261, 0.9, 0.92, 0.938462, 0.955556, 0.971429, 0.986207, 1];
}
/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    getChild("voltage").visible = false; /** To hide voltage text */
    getChild("current").visible = false; /** To hide current text */
    getChild("TemperaturePoint").visible = false; /** To hide temperatur mode(T1,T2,...T6) */
    getChild("temperature").visible = false; /** To hide temperaure value in temperature indicator */
    getChild("arrow_anim_cntr").visible = false; /** To hide air flow animation arrows */
    getChild("arrow_anim_lft").visible = false; /** To hide air flow animation arrows */
    getChild("arrow_anim_rgt").visible = false; /** To hide air flow animation arrows */
    getChild("arrow_anim_cntr_1").visible = false; /** To hide air flow animation arrows */
    getChild("arrow_anim_lft_1").visible = false; /** To hide air flow animation arrows */
    getChild("arrow_anim_rgt_1").visible = false; /** To hide air flow animation arrows */
    getChild("copper").visible = false; /** Hide all materials except aluminium */
    getChild("iron").visible = false;
    getChild("silver").visible = false;
    getChild("steel").visible = false;
    getChild("aluminium_cross_section").visible = false; /** Hide all cross sectional images of materials */
    getChild("copper_cross_section").visible = false;
    getChild("iron_cross_section").visible = false;
    getChild("silver_cross_section").visible = false;
    getChild("steel_cross_section").visible = false;
    getChild("copper_wire").visible = false; /** Hide all wire images of materials */
    getChild("iron_wire").visible = false;
    getChild("silver_wire").visible = false;
    getChild("steel_wire").visible = false;
    getChild("coil").visible = false; /** Hide coil */
    getChild("box_cross_section").visible = false; /** Hide cross sectional box */
}
/** Change the disc depends on the selection from the dropdown box */
function changeOption(scope) {
    selected_material = scope.Material;
    for (var i = 0; i < 5; i++) {
        if (selected_material == i) { /** Check each disc, cross sectional disc and wires whether it match with the dropdown selection */
            getChild(material_item_array[i]).visible = true;
            if (scope.iscross_section) {
                getChild(cross_section_array[i]).visible = true;
            }
            getChild(cylinder_wire_array[i]).visible = true;
        } else { /** Visible set as false rest of the discs, cross sectional discs and wires */
            getChild(material_item_array[i]).visible = false;
            if (scope.iscross_section) {
                getChild(cross_section_array[i]).visible = false;
            }
            getChild(cylinder_wire_array[i]).visible = false;
        }
    }
}
/** Function to set width of wooden block */
function setWoodenWidth(scope) {
    getChild("box_full").scaleX = 0.89 + (scope.wooden_box_width - 7.5) / 50; /** Adjust the width of box image */
    getChild("glasson_box").scaleX = 0.89 + (scope.wooden_box_width - 7.5) / 50; /** Adjust the width of glass */
}
/** Function to set width of wooden block */
function setWoodenHeight(scope) {
    getChild("box_full").scaleY = 0.89 + (scope.wooden_box_height - 75) / 200; /** Adjust the height of the box */
    getChild("box_full").y = 267 - (scope.wooden_box_height - 75) * 1.375;
    getChild("glasson_box").scaleY = 0.89 + (scope.wooden_box_height - 75) / 200; /** Adjust the height of the glass */
    getChild("glasson_box").y = 278 - (scope.wooden_box_height - 75) * 1.375;
}
/** Function to set diameter of cylinder */
function setCylinderDiameter(scope) {
    for (var i = 0; i < 5; i++) {
        getChild(material_item_array[i]).scaleX = 0.89 + (scope.cylinder_diameter - 7) / 70; /** Adjust the diameter of the cylinder by scaling */
        getChild(cross_section_array[i]).scaleX = 0.89 + (scope.cylinder_diameter - 7) / 70; /** Adjust the diameter of the cross sectional cylinder by scaling */
    }
    getChild("rod_shadow").scaleX = 0.89 + (scope.cylinder_diameter - 7) / 70; /** Adjust the width of shadow by scaling */
}
/** Functio to set the length of cylinder */
function setCylinderLength(scope) {
    for (var i = 0; i < 5; i++) {
        getChild(material_item_array[i]).scaleY = 0.89 + (scope.cylinder_length - 55) / 70; /** Adjust the length of the cylinder by scaling */
        getChild(cross_section_array[i]).scaleY = 0.89 + (scope.cylinder_length - 55) / 70; /** Adjust the length of the cross sectional cylinder by scaling */
    }
    getChild("rod_shadow").scaleY = 0.89 + (scope.cylinder_length - 55) / 70; /** Adjust the length of the shadow by scaling */
}
/** Function to set thickness of cylinder */
function setCylinderThickness(scope) {
    if (scope.iscross_section) {
        for (var i = 0; i < 5; i++) {
            getChild(cross_section_array[i]).scaleX = 0.89 + (scope.cylinder_thickness - 0.2) / 3; /** Adjust the thickness of cylinder by scaling of image */
        }
    }
}
/** Function to show crossectional view of box */
function crossSection(scope) {
    if (scope.iscross_section) {
        getChild("glasson_box").alpha = 0; /** Hide glass on box */
        getChild("coil").visible = true;
        getChild(cross_section_array[selected_material]).visible = true;
        getChild(material_item_array[selected_material]).visible = false;
        getChild("box_cross_section").visible = true;
        getChild("box_full").visible = false;
        airFlowOff();
        getChild("arrow_anim_cntr").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_lft").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_rgt").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_cntr_1").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_lft_1").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_rgt_1").visible = false; /** Hide air flow arrow image */
        if (!scope.powerOn) {
            airFlow("arrow_anim_lft", "arrow_anim_cntr", "arrow_anim_rgt"); /** Animation of air flow arrow image */
            clr_air_flow = setTimeout(function() {
                airFlow("arrow_anim_lft_1", "arrow_anim_cntr_1", "arrow_anim_rgt_1")
            }, 2000); /** Animation of air flow arrow image */
        }
    } else {
        getChild("glasson_box").alpha = 1; /** To show glass box */
        getChild("coil").visible = false;
        getChild("box_cross_section").visible = false;
        getChild("box_full").visible = true;
        getChild(cross_section_array[selected_material]).visible = false;
        getChild(material_item_array[selected_material]).visible = true;
        airFlowOff();
        getChild("arrow_anim_cntr").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_lft").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_rgt").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_cntr_1").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_lft_1").visible = false; /** Hide air flow arrow image */
        getChild("arrow_anim_rgt_1").visible = false; /** Hide air flow arrow image */
        if (!scope.powerOn) {
            airFlow("arrow_anim_lft", "arrow_anim_cntr", "arrow_anim_rgt"); /** Animation of air flow arrow image */
            clr_air_flow = setTimeout(function() {
                airFlow("arrow_anim_lft_1", "arrow_anim_cntr_1", "arrow_anim_rgt_1")
            }, 2000); /** Animation of air flow arrow image */
        }
    }
}
/** Function to power on /off button */
function powerOnOff(scope) {
    if (scope.powerOn) { /** Statements to execute while switch on */
        scope.powerOn = false; /** Variable to decide, whether switch in on or off  */
        scope.control_disable = true; /** Disable the dropdown and sliders while power on */
        scope.power_on_off_txt = _("POWER OFF"); /** Changing the text of button */
        getChild("switch_off").visible = false;
        getChild("voltage").visible = true; /** To display value of voltage */
        getChild("current").visible = true; /** To display value of current */
        getChild("TemperaturePoint").visible = true;
        getChild("temperature").visible = true; /** To display value of temperature */
        if (voltage > 90) {
            getChild("needle_V").rotation = needle_v_reading; /** Rotation of needle of voltage */
            getChild("needle_A").rotation = needle_a_reading; /** Rotation of needle of ammeter */
            getChild("rotator_line").rotation = needle_v_reading * 4; /** Rotation of line over rotation switch */
        }
        airFlow("arrow_anim_lft", "arrow_anim_cntr", "arrow_anim_rgt");
        clr_air_flow = setTimeout(function() {
            airFlow("arrow_anim_lft_1", "arrow_anim_cntr_1", "arrow_anim_rgt_1")
        }, 2000);
        pause_flag = false;
        timer_check = setInterval(expWatch, timer_interval); /** Check time equal to 20 minutes */
    } else {        
        scope.powerOn = true;
        scope.power_on_off_txt = _("POWER ON"); /** Changing the text of button */
        getChild("switch_off").visible = true;
        getChild("voltage").visible = false; /** To hide value of voltage */
        getChild("current").visible = false; /** To hide value of current */
        getChild("TemperaturePoint").visible = false;
        getChild("temperature").visible = false; /** To hide value of temperature */
        airFlowOff();
        getChild("needle_V").rotation = 0; /** Rotation of needle of voltage */
        getChild("needle_A").rotation = 0; /** Rotation of needle of ammeter */
        getChild("rotator_line").rotation = 0; /** Rotation of line over rotation switch */
        getName("play").visible = true;
        getName("pause").visible = false;
        pauseWatch();
        clearInterval(timer_check);
    }
}
/** Function for resetting the experiment */
function resetExperiment() {
    window.location.reload();
}
/** Function for the animation flow */
function airFlow(lft, cntr, rgt) {
    getChild(lft).visible = getChild(cntr).visible = getChild(rgt).visible = true;
    createjs.Tween.get(getChild(cntr), {
    loop: true
    }).to({
        y: 610
    }, 250, createjs.Ease.getPowInOut(1)).to({
        y: 530
    }, 350, createjs.Ease.getPowInOut(1)).to({
        y: 30
    }, 2200, createjs.Ease.getPowInOut(1)).to({
        y: 10
    }, 450, createjs.Ease.getPowInOut(1)).to({
        y: -40
    }, 450, createjs.Ease.getPowInOut(1));;
    createjs.Tween.get(getChild(lft), {
    loop: true
    }).to({
        x: 502
    }, 250, createjs.Ease.getPowInOut(1)).to({
        x: 542,
        rotation: 0,
        y: 530
    }, 350, createjs.Ease.getPowInOut(1)).to({
        y: 30
    }, 2200, createjs.Ease.getPowInOut(1)).to({
        rotation: -90,
        x: 502,
        y: 10
    }, 450, createjs.Ease.getPowInOut(1)).to({
        x: 452,
        y: 10
    }, 450, createjs.Ease.getPowInOut(1));;
    createjs.Tween.get(getChild(rgt), {
    loop: true
    }).to({
        x: 642
    }, 250, createjs.Ease.getPowInOut(1)).to({
        x: 602,
        rotation: 0,
        y: 530
    }, 350, createjs.Ease.getPowInOut(1)).to({
        y: 30
    }, 2200, createjs.Ease.getPowInOut(1)).to({
        rotation: 90,
        x: 642,
        y: 10
    }, 450, createjs.Ease.getPowInOut(1)).to({
        x: 692,
        y: 10
    }, 450, createjs.Ease.getPowInOut(1));;
}
/** Function to stop and reset animation air flow arrows */
function airFlowOff() {
    createjs.Tween.removeAllTweens();
    clearTimeout(clr_air_flow);
    getChild("arrow_anim_cntr").y = 660;
    getChild("arrow_anim_lft").x = 450;
    getChild("arrow_anim_lft").y = 550;
    getChild("arrow_anim_lft").rotation = 90;
    getChild("arrow_anim_rgt").x = 692;
    getChild("arrow_anim_rgt").y = 550;
    getChild("arrow_anim_rgt").rotation = -90;
    getChild("arrow_anim_cntr_1").y = 660;
    getChild("arrow_anim_lft_1").x = 450;
    getChild("arrow_anim_lft_1").y = 550;
    getChild("arrow_anim_lft_1").rotation = 90;
    getChild("arrow_anim_rgt_1").x = 692;
    getChild("arrow_anim_rgt_1").y = 550;
    getChild("arrow_anim_rgt_1").rotation = -90;
    getChild("arrow_anim_cntr").visible = false;
    getChild("arrow_anim_lft").visible = false;
    getChild("arrow_anim_rgt").visible = false;
    getChild("arrow_anim_cntr_1").visible = false;
    getChild("arrow_anim_lft_1").visible = false;
    getChild("arrow_anim_rgt_1").visible = false;
}
/** Function to display current temperature value */
function showCurrentTemperature() {
    calculateTemperature(scopes);
    getChild("temperature").text = voltage > 90 ? temperature[Math.ceil(indcator_rotate / 26) - 1].toFixed(2) : "27.00";
}
/** Function to start sopwatch and temperature increment */
function expWatch() {
    if ( !pause_flag ) {
        showWatch(natural_convection_stage);
    }
    checkTime();
}
/** Stage updation function */
function updateTimer() {
    natural_convection_stage.update();
}
/** Resetting the experiment */
function reset(scope) {
    window.location.reload();
}
/** Calculation starts here */
/** Function to calculate all temperature values */
function calculateTemperature(scope) {
    var _h1 = 5; /**  Heat transfer coeffient of air */
    area_of_cylinder = (2 * pi * (scope.cylinder_diameter - scope.cylinder_thickness) * scope.cylinder_length) / 10000;
    area_of_woodenbox = 2 * (Math.pow(scope.wooden_box_width, 2) + 2 * scope.wooden_box_width * scope.wooden_box_height) / 10000;
    avg_temperature = power * ((2 / (_h1 * area_of_woodenbox)) + ((scope.cylinder_thickness / 100) / (conductivity_const[selected_material] * area_of_cylinder)));
    temperature[1] = power == 0 ? 27 : avg_temperature - 4;
    temperature[2] = power == 0 ? 27 : avg_temperature - 2;
    temperature[3] = power == 0 ? 27 : avg_temperature + 2;
    temperature[4] = power == 0 ? 27 : avg_temperature + 4;
    resultant_temp = temperature[Math.ceil(indcator_rotate / 26) - 1];
    coefficient = 1 / ((2 / (_h1 * area_of_woodenbox) + scope.cylinder_thickness / (conductivity_const[selected_material] * area_of_cylinder)) * area_of_cylinder);
    scope.coefficient_value = coefficient.toFixed(5) + " Wm¯¹K¯¹";
    nusselt_number = coefficient * scope.wooden_box_height * Math.pow(10, -2) / thermal_conductivity_air;
    scope.nusselt_value = nusselt_number.toFixed(5);
}
/** Function to check time period and temperature */
function checkTime() {
    if (total_time <= 1200) { /** 1200 is seconds, i.e, 20 minutes */
        showCurrentTemperature();
        var _temperature_difference = resultant_temp - 27; /** Temperature difference between current temperature and initial temperature(27) */
        var _temperature_interval = _temperature_difference / 1200; /** To calculate temperature interval in one second */
        current_temp = 27 + (total_time * _temperature_interval); /** Total time is the current time */
        getChild("temperature").text = voltage != 90 ? current_temp.toFixed(2) : "27.00";
    } else {
        getChild("temperature").text = resultant_temp.toFixed(2);
        pauseWatch();
        clearInterval(timer_check);
    }
}
/** Calculation ends here */