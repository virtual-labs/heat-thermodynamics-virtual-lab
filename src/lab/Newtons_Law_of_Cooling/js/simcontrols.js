/** js file for define the functions.
  *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
  *VALUE (Virtual Amrita Laboratories Universalizing Education)
  *Amrita University, India
  *http://www.amrita.edu/create
  *author:Athira R;
  *Date of modified: 09-06-2015
*/

/**variable declaration*/
var context_canvas_int, queue, context_canvas_int, canvas_width_int, canvas_height_int;

var change_temperature_int, temperature_value, temperature_int,count_temperature, conductivity_int, cooling_value_int;

var height_increment, is_start_int, time_int, tick, count_timer_line, timer_check,stopwatchContainer, resultlabel;

var selectedLiquid, selectedMaterial, thermal_conductivity, specific_heat_liquid, specific_heat_material, boiling_pt;

var line = new createjs.Shape();

var data_plot_values = [];

var gt; //object for Gettext.js

var materialArray=liquidArray=materialArrayTranslate=liquidArrayTranslate=[];

/**specific heat capacity of given materials and liquids*/
var specificHeat = {
    Water: 4.19,
    Milk: 3.93,
    Vegetableoil: 1.67,
    Oliveoil: 1.97,
    Brass: .38,
    Copper: .39,
    Aluminium: .91,
    Silver: .23
};

/**specific heat capacity of given liquids */
var boiling_point = {
    Water: 100,
    Milk: 100,
    Vegetableoil: 230,
    Oliveoil: 300
};

/**thermal conductivity of given materials */
var thermalConductivity = {
    Brass: 109,
    Copper: 401,
    Aluminium: 250,
    Silver: 429
};

var progressText = new createjs.Text("", "16px", "#000000");
/**variable declaration ends*/

/**Start controls for Newton's law of cooling */
$(document).ready(function() {
    gt = new Gettext({
        domain: "messages"
    });
	/** items for material dropdown added into the array and added into the dropdown box. */
    materialArray = [_("Brass"), _("Copper"), _("Aluminium"), _("Silver")];	
	materialArrayTranslate=["Brass","Copper","Aluminium","Silver"];	/**items are added to the array for geeting translated value */
    addintoDropDown($("#materialSubstancedropdwn"), materialArray);
	/** items for liquid dropdown added into the array and added into the dropdown box. */
    liquidArray = [_("Water"), _("Milk"), _("Vegetable oil"), _("Olive oil")];
    liquidArrayTranslate = ["Water","Milk","Vegetable oil","Olive oil"];/**items are added to the array for geeting translated value */
    addintoDropDown($("#liquidDropDown"), liquidArray);
    $("#expName").html(_("Newton's Law of Cooling"));
	$("#variables").html(_("Variables")); /** All texts in control part for language translation */
	$("#measurements").html(_("Measurements"));
	context_canvas_int = document.getElementById("newtonCanvas");
    context_canvas_int.width = $("#canvasBox").width();
    context_canvas_int.height = $("#canvasBox").width();
    canvas_width_int = context_canvas_int.width;
    canvas_height_int = context_canvas_int.height;
    cooling_law_stage = new createjs.Stage(context_canvas_int); /** Initialize createjs stage */
    createjs.Touch.enable(cooling_law_stage);
	/** Createjs cannot trigger mouse evnt automatically. Enabled mouse over / out events */
    cooling_law_stage.enableMouseOver(10);
    cooling_law_stage.mouseMoveOutside = true;
    progressText.x = canvas_width_int / 2.4 - progressText.getMeasuredWidth() / 2;
    progressText.y = canvas_width_int / 2.4;
    cooling_law_stage.addChild(progressText);/** progress bar text*/
	stopwatchContainer=new createjs.Container();/**Container for adding stop watch to the stage*/
	stopwatchContainer.name="stopwatchContainer";
    queue = new createjs.LoadQueue(true); /** Initialize the queue */
    queue.on("progress", handleProgress);/** Loading progress bar */
    queue.on("complete", handleComplete, this);
    queue.loadManifest([{
		/** adding images into the queue */
        id: "initialImg",
        src: simPath + "/images/initialImg.svg",
        type: createjs.LoadQueue.IMAGE
    }, {
        id: "zoomImg",
        src: simPath + "/images/zoomImg.svg",
        type: createjs.LoadQueue.IMAGE
    } , {
        id: "stopwatch",
        src: simPath + "/images/stopwatch.svg",
        type: createjs.LoadQueue.IMAGE
	} , {
        id: "greenbutton",
        src: simPath + "/images/greenbutton.svg",
        type: createjs.LoadQueue.IMAGE
	} , {
        id: "redbutton",
        src: simPath + "/images/redbutton.svg",
        type: createjs.LoadQueue.IMAGE		
    }]);
    tick = setInterval(updateTimer, 100);/** Stage update function in a timer */
});

 /** Initialize gettext function. translate the string can be done by adding _ before the text*/
var _ = function(a) {
    return gt.gettext(a);
};

/** Createjs stage updation happens in every interval  */
function updateTimer() {
    cooling_law_stage.update();
}

 /** Function for display the progress of loading  */
function handleProgress(a) {
    progressText.text = (100 * queue.progress | 0) + " % Loaded";
}

/**All the variables initialize*/
function initialisationOfVariables() {
    temperature_value = 27;
    temperature_int = 0;
    count_temperature = 0;
    height_increment = 25;/** Temporary variable for showing temperature rise */
    time_int = 0;
    count_timer_line = 0;/** Counter variable for drawing indicator line of the calorie meter */
    is_start_int = false;
    $("#graphchek").prop("checked", false);
    $("#graphShowDiv,.selectContainer").hide();
}

function controlsHandle() {
	/**translate the stings used in the experiment by adding '_' before it*/
	resultlabel=_("Thermometer reading:")+" ";
	$("#showResultTxt").html(_("Show Graph"));
	$("#start").val(_("Start Experiment"));
    $("#startheat").val(_("Start Heating"));
	$("#reset").val(_("Reset"));
    $("#plotgraph").val(_("Plot Graph"));
    $("#selectMaterial").html(("Select material:"));
    $("#inputLiquid").html(_("Select liquid:"));
	/**assign initial values of temperature, stop watch*/
    $("#tempReadingValue").html(resultlabel+temperature_value + " ℃");
    $("#hourshw,#mintshw,#secshw").html("00");
	/**set the visibility and properties of necessary controls used in the experiment*/
    $("#start").show();
    $("#plotgraph,.menuContainer").hide();
	$('#materialSubstancedropdwn,#liquidDropDown').find('option:first').attr('selected', 'selected');
    document.getElementById("graphchek").disabled = true;/** Initialize check box as disabled */
	/** Disable mouse events for stop watch start button,enabled only after heating is done */
    $("#materialSubstancedropdwn,#liquidDropDown").prop("disabled", false);
    cooling_law_stage.getChildByName("zoomImg").visible = false;
    cooling_law_stage.getChildByName("initialImg").visible = true;
	/**set the initial readings,opacity for red and green buttons for stop watch*/
	stopwatchContainer.getChildByName("stopWatchBtn").mouseEnabled=false;
	stopwatchContainer.getChildByName("start").text=_("START");
	stopwatchContainer.getChildByName("stopWatchBtn").cursor='pointer';
	stopwatchContainer.getChildByName("greenbutton").alpha=0.5;
	stopwatchContainer.getChildByName("redbutton").alpha=1;
	stopwatchContainer.visible=false;
	stopwatchContainer.getChildByName("stopWatchHr").text=stopwatchContainer.getChildByName("stopWatchMint").text=stopwatchContainer.getChildByName("stopWatchSec").text="00";
}
 /** Adding items to the drop down box from the array*/
function addintoDropDown(getId,valueSet) {
    var selected = getId;
    $.each(valueSet, function(val, text) {
        selected.append($("<option></option>").val(val).html(text));
    });
}
/**loading the images and initialize the html control events*/
function handleComplete(event) {
	/**loading images for the experiment*/
    loadImages(queue.getResult("initialImg"), "initialImg", 0, 0, 1.113, 1);
    loadImages(queue.getResult("zoomImg"), "zoomImg", 0, canvas_height_int / -10.6625, 1.113, 1);
	loadImages(queue.getResult("stopwatch"),"stopwatch",canvas_height_int/1.4,canvas_height_int/1.2,0.25,1);
	loadImages(queue.getResult("redbutton"),"redbutton",canvas_height_int/1.14,canvas_height_int/1.055,0.025,1);
	loadImages(queue.getResult("greenbutton"),"greenbutton",canvas_height_int/1.1,canvas_height_int/1.055,0.025,1);
    setText("stopWatchHr",canvas_width_int/1.33,canvas_height_int/1.084,"00","#000000");
	setText("stopWatchMint",canvas_width_int/1.24,canvas_height_int/1.084,"00","#000000");
    setText("stopWatchSec",canvas_width_int/1.15,canvas_height_int/1.084,"00","#000000");
	createRect("stopWatchBtn",canvas_width_int/1.342,canvas_height_int/1.054,canvas_width_int/8.2,canvas_height_int/40,"#000","#8a8e93",4);
	setText("start",canvas_width_int/1.3,canvas_height_int/1.03,_("START"),"#000000");
    initialisationOfVariables();// variable initialization
    controlsHandle();// contols initialization
	cooling_law_stage.addChild(stopwatchContainer);//adds the stop watch to the container
	/** Start the experiment bt hitting the 'Start experiment' button.
	Shows the zoomed view of the apparatus and experiment setup*/
    $("#start").click(function() {
        startExperiment();
    });
	
	/** Start heating the substance by hitting the 'Start Heating' button*/
    $("#startheat").click(function() {
		/**get the element, which is selected from the material drop down and liquid drop down, and remove the space between the strings for access the material property from the array list*/
		selectedLiquid = removeTextSpace(liquidArrayTranslate[($("#liquidDropDown").find("option:selected").index())]);
		selectedMaterial = removeTextSpace(materialArrayTranslate[($("#materialSubstancedropdwn").find("option:selected").index())]);
		/**get the thermal conductivity, specific heat and boiling point of the selected 
		material and liquid from pre-defined array*/
		thermal_conductivity = thermalConductivity[selectedMaterial];
		specific_heat_liquid = specificHeat[selectedLiquid];
		specific_heat_material = specificHeat[selectedMaterial];
		boiling_pt = boiling_point[selectedLiquid];
        $("#graphShowDiv,#plotgraph").hide();
        document.getElementById("graphchek").disabled = true;
        $("#graphchek").prop("checked", false);
        data_plot_values = [];/** Clear the array for data plot before start heating */
        startHeating();/** Heating of the substance by rising the temperature */
    });
	
	/** Checkbox functionality for displaying graph */
    $("#graphchek").change(function() {
		/** Checking whether the check box is selected either to show or hide the 
		graph plotted for temperature against time */
        if (!$("#graphchek").is(":checked")){
			 $("#graphShowDiv,#plotgraph").hide();
			 }
        else {
			/** if checked showing the graph area */
            showGraph();
            $("#graphShowDiv,#plotgraph").show();
        }
    });
	
	/** graph showing when click on 'Plot graph' button  */
    $("#plotgraph").click(function() {
        if ($("#plotgraph").val() == _("Plot Graph")) {
			startGraphPlotting();    // start plotting the graph on button click   
        } else {
           stopPlottingGraph(); //reset the graph
        }
    });
	
    $("#reset").click(function() {
        resetExperiment();
    });
	/**button click function for start and stop of the stop watch */
	stopwatchContainer.getChildByName("stopWatchBtn").on("click",function(){
		if (stopwatchContainer.getChildByName("start").text == _("START")) {
        	startGraphPlotting();	// start plotting the graph on start the stop watch		
        } else {
          stopPlottingGraph();//reset the graph by clicking on the 'STOP' on stop watch
        }
    });
   }

 /**get the value of the dropdown box, remove all the white spaces between the texts*/
function removeTextSpace(elmnt) {
    return elmnt.replace(/\s/g, "");
}

/**function for stopping the graph plot which the user click 'stop' on the stopwatch or click on the stop plotting button*/
function stopPlottingGraph(){
	resetStopWatch();
	$("#plotgraph").val(_("Plot Graph"));
	stopwatchContainer.getChildByName("start").text=_("START");/** Change the stop watch button "STOP" to "START" */
	stopwatchContainer.getChildByName("redbutton").alpha=1;
    stopwatchContainer.getChildByName("greenbutton").alpha=0.5;
	data_plot_values = [];/** Clear the array for plotting graph before each start */
	clearInterval(timer_check);
}
/**pushing the time and temperature into the array for graph and call function to draw*/
function plotgraphInterval(){	
		data_plot_values.push([minute,temperature_value.toFixed(1)]);
		showGraph(data_plot_values);
}

/**starting the stopwatch for finding the rate of cooling  */
function startGraphPlotting(){
	resetStopWatch();
	/**start the stop watch */
	startWatch(stopwatchContainer.getChildByName("stopWatchHr"),stopwatchContainer.getChildByName("stopWatchMint"),stopwatchContainer.getChildByName("stopWatchSec")); 
	/** change the plot graph button text "plot graph" to "stop plotting" and stop watch label to "STOP"*/		
	$("#plotgraph").val(_("Stop Plotting"));
	stopwatchContainer.getChildByName("start").text=_("STOP");/** Change the stop watch button "START" to "STOP" */
	/**Set opacity of stop watch red and green buttons*/
	stopwatchContainer.getChildByName("redbutton").alpha=0.5;
    stopwatchContainer.getChildByName("greenbutton").alpha=1;
	timer_check=setInterval(plotgraphInterval,10);// graph draw in every interval of 10 millisecond
}

/**Draws indicator lines of the calorie meter for showing the temperature rise and rate of cooling down of temperature.*/
function drawLine(x,y,endX,endY,name) {
    line.graphics.setStrokeStyle(4);
    line.alpha = 0.5;
    line.graphics.beginStroke("#cd0a0a");
    line.name = name;
    line.graphics.moveTo(x, y);//start line
    line.graphics.lineTo(endX, endY);//end line
    line.graphics.endStroke();
    cooling_law_stage.addChild(line);// adding line to the stage
}

/** All the images loading and added to the stage.*/
function loadImages(image,name,xPos,yPos,sFactor,flipFactor) {
    var bitmap = new createjs.Bitmap(image).set({});
    getBoundFn(bitmap, sFactor);
    bitmap.scaleX = bitmap.scaleX * flipFactor;
    bitmap.x = xPos;
    bitmap.y = yPos;
    bitmap.name = name;
	//adds the stop watch images to a container
	if(name=="stopwatch"||name=="redbutton"||name=="greenbutton"){
		stopwatchContainer.addChild(bitmap);cooling_law_stage.update();}
	else cooling_law_stage.addChild(bitmap);//adding bitmap to the stage
}

 /** Image scaling function. scale the bitmap depend upon the scaling factor.*/
function getBoundFn(bitmap, sFactor) {
    var bound = bitmap.getBounds();
    scaleFactor = Math.min(context_canvas_int.width / bound.width, context_canvas_int.height / bound.height);
    bitmap.scaleX = bitmap.scaleY = sFactor * scaleFactor;
}
function setText(name,textX,textY,value,color){  
	var text = new createjs.Text();
	text.x=textX;
	text.y=textY;
	text.textBaseline="alphabetic";
	text.name=name;
	text.font ="bold "+ canvas_height_int/426.5+"em Tahoma";
	text.text=value;
	text.color=color;
	stopwatchContainer.addChild(text);
  }
//for creating rectangle
function createRect(name,xPos,yPos,width,height,strokecolr,fillcolr,radius){
	var rect = new createjs.Shape();
	rect.graphics.setStrokeStyle(0.5);
	rect.name=name;
	rect.graphics.beginStroke(strokecolr).beginFill(fillcolr).drawRoundRect(xPos,yPos,width,height,radius);
	stopwatchContainer.addChild(rect);
}
/**By clicking the 'Start Experiment' button one can see the zoomed view of the apparatus, setting up the experiment,and start the experiment.*/
function startExperiment() {
    $("#start").hide();
	/** set the visiblity  of the initial image to false and zoomed view to true */
    cooling_law_stage.getChildByName("zoomImg").visible = true;
    cooling_law_stage.getChildByName("initialImg").visible = false;
	/**set initial value of x & y for drawing line for temperature heating*/
    startx = canvas_width_int / 1.91;
    starty = canvas_height_int / 1.522;
    drawLineinitial();/**draws the initial temperature rise showing line*/
    cooling_law_stage.getChildByName("showLine").visible = true;
	/**all the controls of the experiment added to a common container called 'menuContainer',
	hide and show the container when needed*/
    $(".menuContainer,.selectContainer").show();
    height_increment = 27;/**initialize the variable from temperature rise to 27 */
	// show the stop watch
	stopwatchContainer.visible=true;
}
/**Line show initial calaorie meter reading. Its is 27 ℃ */
function drawLineinitial() {
    drawLine(canvas_width_int / 1.91, canvas_height_int / 1.44, canvas_width_int / 1.91,canvas_height_int / 1.52, "showLine");
}
/**function for drawing the graph based on the time and temperature*/
function showGraph(dataArr) {
    $.plot($("#graphShowDiv"), [{
        data: dataArr,
        label: _("Temperature (Y axis) Vs Time (X axis)"),
        color: "red"
    }], {
        series: {/** shows the points  and lines plotted*/
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        grid: {/**allows mouse events*/		
            hoverable: true,
            clickable: true
        }
    });
}

/**reset the experiment by clicking on the reset button*/
function resetExperiment() {
    initialisationOfVariables(); //variable initialization
    controlsHandle();// handle all the menu controls
    resetStopWatch(); //reset the stopwatch
    data_plot_values = [];//clear the array, which plots the values for graph.
    line.graphics.clear();
    clearInterval(change_temperature_int);// clear the timer for calculating temperature
}
/**controls end */

/**calculation for Newton's law of cooling*/
/** starts heating of the material selected from the dropdown box*/
function startHeating() {
    var radius = 3;//radius of the calorie meter
    var m1 = 100;//temperature constant 1, keep the values as constant.
    var m2 = 120;//temperature constant 2
    clearInterval(change_temperature_int);
	/**checking wheteher heating or cooling is encountered*/
    is_start_int = is_start_int ? false : true;
	/**actual calculation for the rate of cooling is calculating*/
    change_temperature_int = setInterval("findtemperature()", 150);
    $("#materialSubstancedropdwn,#liquidDropDown").prop("disabled", true);
	
	/**mathematical equation for finding the rate at which a substance cools after heating */
	/**Newtons law of Cooling-rK = ((h*pi*r*r)/10000)/((m1*C1)+(m2*C2)), 1000 can be written as 1e4*/
		
    cooling_value_int = Number(thermal_conductivity) * Number(Math.PI) * Math.pow(Number(radius), 2) /1e4 / (Number(m1) * Number(specific_heat_material) + Number(m2) * Number(specific_heat_liquid));
	
    conductivity_int = Number(60 * cooling_value_int);
	/**check whether heating started or not*/
    if (is_start_int) {/**check whether heating of the material started*/
        $("#startheat").val(_("Stop Heating"));/**change text of button to 'Stop heating' */
		/**stop the stop watch timer if started already started*/
        resetStopWatch();
        stopwatchContainer.getChildByName("stopWatchHr").text=stopwatchContainer.getChildByName("stopWatchMint").text=stopwatchContainer.getChildByName("stopWatchSec").text="00";
        stopwatchContainer.getChildByName("start").text=_("START");
		stopwatchContainer.getChildByName("stopWatchBtn").mouseEnabled=false;
	  	stopwatchContainer.getChildByName("redbutton").alpha=1;
       stopwatchContainer.getChildByName("greenbutton").alpha=0.5;
    } else {/**to stop heating*/
		stopwatchContainer.getChildByName("stopWatchBtn").mouseEnabled=true;
        document.getElementById("graphchek").disabled = false;
        $("#startheat").val(_("Start Heating"));
    }
}

/**calculate heating temperature and cooling temperature */
function findtemperature() {
	/**check whether experiment has started, by clicking on the start heating button 
	the material starts heating as the result temperature rises.*/
    if (is_start_int) {
		/**check whether the temperature reaches the material's boiling point,
		if not continue heating till there */
        if (temperature_value < boiling_pt) {
			/**initial height(minimum) is set as 27. When temperature increases height 
			of the calorie meter reading also increases*/
            temperature_value = height_increment;
            height_increment++;
            $("#tempReadingValue").html(resultlabel+temperature_value.toFixed(1) + " ℃");
            line.graphics.clear();
            drawLineinitial();// initial line of the calorie meter reading
            count_timer_line++;/**increase the height for line drawing*/
            drawLine(startx, starty, startx, starty - count_timer_line,"riseLine");
			
			/**calculating the time for cooling, T=(T(0)-T(s)/T(t)-T(s))/k, where T(s) is the initial temperature,
			T(0) is the boiling point, k is the conductivity*/
            time_int = Math.log(Number(boiling_pt - 27) / Number(temperature_value - 27)) /Number(conductivity_int);
        } 
		else { /**if the temperature reaches the boiling point then stop heating*/
			clearInterval(change_temperature_int);
		}
    }
	/**cooling of the material*/
	else {
        is_start_int = false;
        count_temperature++;
		/**calculate the cooling temperature value , formula, T(t)=T(s)+(T(0)-T(s))e(-kt), here Ts is the initial temperature, T(0) is the boiling point , K is conductivity, can be calculated by (60 * cooling temperature)*/
        temperature_int = 27 + (boiling_pt - 27) * (1 / Math.exp(conductivity_int * time_int.toFixed()));
		/**temperature reduces in an interval of 10 millisecond*/
        if (count_temperature % 20 == 0) {
            time_int++;
        }
		/**if the temperature value is less than mimimum  temperature(27), then set the 
		temperature to the minimum value. Never the temperature falls below 27*/
        if (temperature_value >= 27) {
            if (temperature_int < 27) {
                temperature_int = 27;
                temperature_value = temperature_int;
            } else {
                temperature_value = temperature_int;
            }
            height_increment = temperature_value;
			/**display the temperature into the text box*/
            $("#tempReadingValue").html(resultlabel+temperature_value.toFixed(1) + " ℃");
			/**clear the indicatgor red line for redrawing and draw initial line*/
           	line.graphics.clear();
            drawLineinitial();
			/**drawing the cooling indication of the calorie meter*/
            if (count_timer_line > 0) {
                drawLine(startx, starty, startx, starty - count_timer_line,"coolLine");
                count_timer_line -= .25;// decreasing the cooling indicator line, value is incremented by 0.25 
            }
        } else count_temperature = 0;
    }
}
/**calculation ends*/