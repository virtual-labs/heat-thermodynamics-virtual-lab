(function() {
 angular.module('users')
  .directive("experiment", directiveFunction)
})();

var deflection_stage,control_labels,chart,prev_count,xml_doc,xml_obj,xml_http,water_alpha,ice_alpha;

var timer,count,hot_temp,colf_emf,type,hot_emf,thermo_type,img_file_names;

var thermocouple_array = dataplot_array = help_array = [];

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
            queue.loadManifest([{
                    id: "BG",
                    src: "././images/bg.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "ripple",
                    src: "././images/ripple.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "beaker_top",
                    src: "././images/beaker_top.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_E_back",
                    src: "././images/type_E_back.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_E_front",
                    src: "././images/type_E_front.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_J_back",
                    src: "././images/type_J_back.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_J_front",
                    src: "././images/type_J_front.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_K_back",
                    src: "././images/type_K_back.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_K_front",
                    src: "././images/type_K_front.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_R_back",
                    src: "././images/type_R_back.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_R_front",
                    src: "././images/type_R_front.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_T_back",
                    src: "././images/type_T_back.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "type_T_front",
                    src: "././images/type_T_front.svg",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "ice_cube",
                    src: "././images/crushed_ice.png",
                    type: createjs.LoadQueue.IMAGE
                }, {
                    id: "water",
                    src: "././images/water.svg",
                    type: createjs.LoadQueue.IMAGE
                }
            ]);

            stage = new createjs.Stage("demoCanvas");
            stage.enableDOMEvents(true);
            stage.enableMouseOver();

            container = new createjs.Container(); /** Creating the primary container */
            container.name = "container";
            stage.addChild(container);

            wire_container = new createjs.Container(); /** Creating container for wires */
            wire_container.name = "wire_container";
            stage.addChild(wire_container);

            /** Append it in the stage */
            function handleComplete() {
                img_file_names = ["type_R_", "type_K_", "type_E_", "type_J_", "type_T_"]; /** Array to store the file name of images of different themocouple */
                loadImages(queue.getResult("BG"), "BG", -25, 0, "", container);
                for (var i = 0; i < img_file_names.length; i++) {
                    loadImages(queue.getResult(img_file_names[i] + "back"), img_file_names[i] + "back", 142, 137, "", wire_container);
                    wire_container.getChildByName(img_file_names[i] + "back").visible = false;
                }
                loadImages(queue.getResult("water"), "water", 507, 198, "", container);
                loadImages(queue.getResult("ice_cube"), "ice_cube", 513, 200, "", container);
                loadImages(queue.getResult("beaker_top"), "left_beaker_top", 66, 146, "", container);
                loadImages(queue.getResult("beaker_top"), "beaker_top", 500, 146, "", container);
                for (var j = 0; j < img_file_names.length; j++) {
                    loadImages(queue.getResult(img_file_names[j] + "front"), img_file_names[j] + "front", 149, 155, "", wire_container);
                    wire_container.getChildByName(img_file_names[j] + "front").visible = false;
                }
                loadImages(queue.getResult("ripple"), "ripple", 137, 200, "", wire_container);
                /** Text box loading */
                setText("refer_temperature_txt", 525, 356, "0", "white", 1.4, container);
                setText("hot_temperature_txt", 75, 356, "0", "white", 1.4, container);
                setText("emf_txt", 302, 124, "0.000", "black", 1.9, container);
                setText("type_text", 422, 24, "", "black", 1, container);
                initialisationOfControls(scope);
                initialisationOfVariables(); /** Initializing the variables */
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */
                makeGraph();
            }

            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("Next"), _("Close")];
                control_labels = [_("Choose Thermocouple Type:"), _("Hot Temperature:"), _("Reference Temperature:")]
                scope.heading = _("Thermo Couple-Seebeck Effect");
                scope.variables = _("Variables");
                scope.result = _("Result");
                scope.copyright = _("copyright");
                scope.refernce_emf_label = _("Reference Emf");
                scope.hot_emf_label = _("Hot Emf");
                scope.thermo_couple_type_lbl = control_labels[0];
                scope.thermo_couple_label = [{
                    type: _("Type R"),
                    indexVal: 0,
                    thermoCoupleType: "R"
                }, {
                    type: _("Type K"),
                    indexVal: 1,
                    thermoCoupleType: "K"
                }, {
                    type: _("Type E"),
                    indexVal: 2,
                    thermoCoupleType: "E"
                }, {
                    type: _("Type J"),
                    indexVal: 3,
                    thermoCoupleType: "J"
                }, {
                    type: _("Type T"),
                    indexVal: 4,
                    thermoCoupleType: "T"
                }];
                scope.hot_temp_lbl = control_labels[1];
                scope.refer_temp_lbl = control_labels[2];
                scope.refernce_emf = scope.hot_emf = hot_emf_disp = 0 + " V";
                scope.$apply();
            }
            if ( window.XMLHttpRequest ) { /** Code for IE7+, Firefox, Chrome, Opera, Safari */
                xml_http = new XMLHttpRequest();
            } else { /** code for IE6, IE5 **/
                xml_http = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xml_http.open("GET", "src/thermo_couple_values.xml", false);
            xml_http.send();
            xml_doc = xml_http.responseXML;
            xml_obj = xml_doc.documentElement;
        }
    }
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    container.addChild(_text); /** Adding text to the container */
    stage.update();
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, container) {
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX = _bitmap.scaleY = 1;
    _bitmap.name = name;
    _bitmap.cursor = cursor;
    container.addChild(_bitmap); /** Adding bitmap to the container */
    stage.update();
}

/** function to return chiled element of container */
function getName(chldName) {
    return container.getChildByName(chldName);
}

function initialisationOfControls(scope) {
    scope.thermo_type = 0; /** Initial value of thermo type couple(dropdown box) */
    scope.hot_temperature = 0; /** Initial value of hot temperature slider */
    scope.refer_temperature = 0; /** Initial value of reference temperature slider */
    scope.hotMax = 1768; /** Max value of hot temperature slider */
    scope.referMax = 50; /** Max value of reference temperature slider */
    scope.referMin = -50; /** Minimum value of reference temperature slider */
}
/** All variables initialising in this function */
function initialisationOfVariables() {
    thermocouple_array = [_("Platinum-Rhodium"), _("Chromel-Alumel"), _("Chromel-Constantan"), _("Iron-Constantan"), _("Copper-Constantan")]
    hotMaxValues = [1768, 1372, 1000, 1200, 400]; /** Maximum values of hot temperature slider for different thermo couples */
    referMaxValude = [50, 270, 270, 210, 270] /** Maximum values of reference temperature slider for different thermo couples */
    voltageMax = [25, 55, 77, 77, 21]; /** Maximum voltages(emg) for each themo couple */
    dataplot_array = []; /** To store x and y position of graph */
    count = 0;
    hot_temp = 0;
    colf_emf = 0;
    type = "R";
    thermo_type = 0;
    water_alpha = 0;
    ice_alpha = 1;
    prev_count = 0;
    getName("hot_temperature_txt").text=0;
    getName("emf_txt").text=0;
    getName("refer_temperature_txt").text=0;
    stage.update();
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    getName("water").alpha = 0;
    getName("ice_cube").alpha = 1;
    wire_container.getChildByName(img_file_names[0] + "front").visible = true;
    wire_container.getChildByName(img_file_names[0] + "back").visible = true;
}
/** Draws a chart in canvas js for making graph plotting */
function makeGraph() {
    chart = new CanvasJS.Chart("graphDiv1", {
        axisX: {
            title: _("temperature"),
            titleFontSize: 22,
            minimum: 0,
            maximum: hotMaxValues[thermo_type]
        },
        axisY: {
            title: _("emf (v)"),
            titleFontSize: 22,
            minimum: 0,
            maximum: voltageMax[thermo_type],
            interval: 5
        },
        showInLegend: false,
            data: [{
            color: "blue",
            type: "line",
            lineThickness: 3,
            markerType: "none",
            dataPoints: dataplot_array /** Datapoints to be plot stored in the array */
        }]
    });
    chart.render(); /** Rendering the graph */
}

/** Function to set different thermo couple, and it will onchange of dropdown box */
function setThermoCoupleType(scope) {
    scope.hotMax = hotMaxValues[thermo_type]; /** To change the max value of hot temperature slider based of thermo couples */
    scope.referMax = referMaxValude[thermo_type]; /** To change the max value of reference tmeperature slider based on thermocouple selected */
    scope.referMin = scope.referMax * -1 /** To set the minimum value of reference temperature slider */
    scope.refer_temperature = 0;
    scope.hot_emf = 0 + " V";
    scope.refernce_emf = 0;
    scope.hot_temperature = 0; /** Initial value of hot temperature slider */
    scope.refer_temperature = 0; /** Initial value of reference temperature slider */  
    scope.refer_temperature = 0; /** Initial value of reference temperature slider */ 
    for (var k = 0; k < img_file_names.length; k++) {
        if (k == thermo_type) {
            wire_container.getChildByName(img_file_names[k] + "front").visible = true;
            wire_container.getChildByName(img_file_names[k] + "back").visible = true;
        } else {
            wire_container.getChildByName(img_file_names[k] + "front").visible = false;
            wire_container.getChildByName(img_file_names[k] + "back").visible = false;
        }
    }
    count = 0;
    initialisationOfVariables();
	initialisationOfImages();
    dataplot_array.length = 0;
    makeGraph();
    stage.update();
}

/** Select the reference temperature from the slider */
function setReferenceTemperature(scope) {
    var refer_temp = scope.refer_temperature;
    getName("refer_temperature_txt").text = refer_temp;    
    calculateEmf(refer_temp, scope);
    water_alpha = refer_temp / 10
    container.getChildByName("water").alpha = water_alpha;
    container.getChildByName("ice_cube").alpha = 1 - water_alpha;
    stage.update();
}

/** Resetting the experiment */
function reset(scope) {
    window.location.reload();
}

/** Set the hot temperature */
function setHotTemperature(scope) {
    clearInterval(timer);
    scope.combo_disable = true;
    hot_temp = scope.hot_temperature;
    prev_count = scope.hot_temperature; /** Get the previous temperature */
    if (count < prev_count) {
        timer = setInterval(function() {
            getEmf(scope)
        }, 1); /** Calculating the emf for each temperature */
    } else {
        timer = setInterval(function() {
            getPrevEmf(scope)
        }, 1);
    }
}

/** Get the emf value from xml using ajax */
function getEmf(scope) {
    count++;
    if ( count > hot_temp ) {
        scope.combo_disable = false;
        clearInterval(timer);
    } else {
        scope.combo_disable = true;
        if ( xml_http.readyState == 4 && xml_http.status == 200 ) {
            myFunction(count, scope);
        }
    }
    prev_count = count;
    scope.$apply();
}

function getPrevEmf(scope) {
    if ( count <= prev_count ) {
        scope.combo_disable = false;
        clearInterval(timer);
    } else {
        scope.combo_disable = true;
        if ( xml_http.readyState == 4 && xml_http.status == 200 ) {
            count--;
            dataplot_array.pop(); /** Pop the datapoints based on the hot temperature */
            chart.render();
            var _x1 = getValues(count, scope);
        }
    }
    scope.$apply();
}

function myFunction(count, scope) {
    var _x1 = getValues(count, scope);
    /** Push the emf and temperature to the array for graph draw */
    dataplot_array.push({
        x: (count), /** x temperature */
        y: (parseFloat(_x1)) /** y emf */
    });
    chart.render(); /** Rendering the chart */
    stage.update();
}

function getValues(count, scope) {
    /** Get the emf of the corresponding thermocouple type and temperature from the xml */
    var _x1 = xml_doc.getElementsByTagName("tmtype")[thermo_type].getElementsByTagName("t")[count + referMaxValude[thermo_type]].childNodes[0].nodeValue;
    scope.hot_emf = _x1 + " V";
    getName("emf_txt").text = parseFloat(_x1).toFixed(3);
    getName("hot_temperature_txt").text = count;
    stage.update();
    return _x1;
}
/** Calculating the emf depend upon the temperature selected from the slider controls */
function calculateEmf(cold_temp, scope) {
    /** Get the emf from the xml file */
    hot_emf_val = xml_doc.getElementsByTagName("tmtype")[thermo_type].getElementsByTagName("t")[hot_temp + referMaxValude[thermo_type]].childNodes[0].nodeValue;
    colf_emf = xml_doc.getElementsByTagName("tmtype")[thermo_type].getElementsByTagName("t")[cold_temp + scope.referMax].childNodes[0].nodeValue;
    hot_emf_disp = parseFloat(hot_emf_val - colf_emf);
    /** Display the emf value in the result part */
    scope.hot_emf = hot_emf_disp.toFixed(2) + " V";
    getName("emf_txt").text = hot_emf_disp.toFixed(2);
    scope.refernce_emf = colf_emf;
    stage.update();
}