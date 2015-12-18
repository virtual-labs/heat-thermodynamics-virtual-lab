(function(){
  angular
       .module('users')
	   .directive("experiment",directiveFunction)
})();

var stage, canvas;

var line = new createjs.Shape();

var startFlag=1;

var selected_liquid="Water";

var selected_material="Brass";

var change_temperature_int, temperature_value, temperature_int, cooling_const, cooling_value_int;

var is_start_int, count_timer_line,count_timer_line1, interval;

var stopwatchContainer, cool_temp_int, time_int;

var thermal_conductivity, specific_heat_liquid, specific_heat_material, boiling_pt;

var dataplotArray = [[1, 10], [ 2, 13], [ 3, 18], [ 4,  20], [5, 17],[6, 10], [7, 13], [8, 18], [ 9, 20], [10, 17]];

var materialArray=liquidArray=[];

var xPos, newPos;

var helpArray=[];
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
var _ ;
/**thermal conductivity of given materials */
var thermalConductivity = {
    Brass: 109,
    Copper: 401,
    Aluminium: 250,
    Silver: 429
};

function directiveFunction(){
	return {
		restrict: "A",
		link: function(scope, element,attrs){
			// variable that decides if something should be drawn on mousemove
			var experiment = true;
			if (element[0].width> element[0].height) {
				element[0].width = element[0].height;
				element[0].height = element[0].height;
			} else {
				element[0].width = element[0].width;
				element[0].height = element[0].width;
			}  
			if (element[0].offsetWidth> element[0].offsetHeight) {
				element[0].offsetWidth = element[0].offsetHeight;
			} else {
				element[0].offsetWidth = element[0].offsetWidth;
				element[0].offsetHeight = element[0].offsetWidth;
			}
			canvas=document.getElementById("demoCanvas");
			canvas.width=element[0].width;
			canvas.height=element[0].height;
			
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			queue.on("complete", handleComplete, this);
			queue.loadManifest([
				{
					id:"background", 
					src:"././images/initialImg.svg",
					type:createjs.LoadQueue.IMAGE},
				{
					id: "zoomImg",
					src:"././images/zoomImg.svg",
					type: createjs.LoadQueue.IMAGE
				} ,
				{
					id: "stopwatch",
					src: "././images/stopwatchOld.svg",
					type: createjs.LoadQueue.IMAGE
				} ,
				{
					id: "greenbutton",
					src: "././images/greenbutton.svg",
					type: createjs.LoadQueue.IMAGE
				} , {
					id: "redbutton",
					src:"././images/redbutton.svg",
					type: createjs.LoadQueue.IMAGE		
				}
			]);
			tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
			stage = new createjs.Stage("demoCanvas");
			stage.enableDOMEvents(true);
			/** Adds chart for drawing cooling graph */
			makegraph();
			/** Loads images and texts to the stage */
			function handleComplete(){
				loadImages(queue.getResult("background"),"background",0,-50,0.65,1,0);
				loadImages(queue.getResult("zoomImg"), "zoomImg", 0, 0, 0.65, 1);
				loadImages(queue.getResult("stopwatch"),"stopwatch",10,580,0.17,1);
				loadImages(queue.getResult("redbutton"),"redbutton",130,665,0.015,1);
				loadImages(queue.getResult("greenbutton"),"greenbutton",150,665,0.015,1);
				setText("stopWatchHr",37,645,"00","#000000",1.32);
				setText("stopWatchMint",82,645,"00","#000000",1.32);
				setText("stopWatchSec",130,645,"00","#000000",1.32);	
				setText("start",50,678,_("START"),"#000000",1);
				createRect("stopWatchBtn",30,663,92,20,"#000","#8a8e93",4);
				setVisibleImg(); /** Set visibility of initial images */			
				initialisationOfVariables();/** Initializing the variables*/
				translationLabels();/** Translation of strings using gettext*/
				stopwatchFn(); /** Start timer event */
			}	
			
			/**add all the strings used for the language translation here. '_' is the shortcut for calling the gettext function defined in the gettext-definition.js*/	
			function translationLabels(){
				helpArray=[_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("Next"),_("Close")];
				scope.btnLabel=_("Start Experiment");
				scope.variables=_("Variables");
				scope.measurements=_("Measurements");
				scope.thermometer_reading=_("Thermometer reading:")
				scope.show_graph=_("Show Graph");
				scope.brass=_('Brass');
				scope.water=_('Water');
				scope.reset_lbl=_("Reset");
				scope.plot_lbl=_("Plot Graph");
				scope.copyright=_("copyright")
				scope.heatng_btn_lbl=_("Start Heating");
				scope.heading=_("Newton's Law of Cooling");
				scope.select_material=_("Select material:");
				scope.select_liquid=_("Select liquid:");
				scope.materialArray = [{material:_('Brass'),type:'Brass'},{material:_('Copper'),type:'Copper'},{material:_('Aluminium'),type:'Aluminium'},{material:_('Silver'),type:'Silver'}];		
				scope.LiquidArray = [{type:'Water',liquid:_('Water')},{type:'Milk',liquid:_('Milk')},{type:'Vegetable oil',liquid:_('Vegetable oil')},{type:'Olive oil',liquid:_('Olive oil')}];			
				scope.$apply();				
			}
		}
	}
}
/** Draws a chart in canvas js for making graph ploting */
function makegraph(){
	chart = new CanvasJS.Chart("graphDiv", {
		axisX: {
			title: _("Time (in minutes)"),//x axis label
			titleFontSize: 18,//chart font size
			labelFontSize: 18,
			minimum: 0,
			maximum: 150,
			interval: 10			
		},
		axisY: {
			title: _("Temperature"),
			titleFontSize: 18,
			labelFontSize: 18		
		},
		showInLegend: false,
		data: [{
			color: "red",
			type: "line",
			lineThickness: 3,
			dataPoints: dataplotArray //datapoints to be plot stored in the array
		}]
	});
}
/** Createjs stage updation happens in every interval  */
function updateTimer() {
	stage.update();
}
/**  All the rectangle added to stage */
function createRect(name,xPos,yPos,width,height,strokecolr,fillcolr,radius){
	var _rect = new createjs.Shape();
	_rect.graphics.setStrokeStyle(0.5);
	_rect.name=name;
	_rect.alpha=0.01;	
	_rect.graphics.beginStroke(strokecolr).beginFill(fillcolr).drawRoundRect(xPos,yPos,width,height,radius);
	stage.addChild(_rect);
	_rect.cursor="pointer";
}
/** All the texts loading and added to the stage */
function setText(name,textX,textY,value,color,fontSize){  
	var _text = new createjs.Text();
	_text.x=textX;
	_text.y=textY;
	_text.textBaseline="alphabetic";
	_text.name=name;
	_text.font ="bold "+fontSize+"em Tahoma";
	_text.text=value;
	_text.color=color;
	stage.addChild(_text);
}
/** Load all the images using in the experiment using createjs*/
function loadImages(image,name,xPos,yPos,sFactor,flipFactor,angle){
	var _bitmap = new createjs.Bitmap(image).set({});
	_bitmap.x=xPos;
	_bitmap.y=yPos;
	_bitmap.name=name;
	_bitmap.alpha=1;
	if(name=="greenbutton"){_bitmap.alpha=0.5;}
	stage.addChild(_bitmap);
}
/** This function will trigger when the user click on the 'Start Experiment button'*/
function start(scope) {
	stage.getChildByName("zoomImg").visible = true;
	stage.getChildByName("stopwatch").visible = true;
	stage.getChildByName("redbutton").visible = true;
	stage.getChildByName("greenbutton").visible = true;
	stage.getChildByName("stopWatchHr").visible = true;
	stage.getChildByName("stopWatchMint").visible = true;
	stage.getChildByName("stopWatchSec").visible = true;
	stage.getChildByName("start").visible = true;
	drawLineinitial();/**draws the initial temperature rise showing line*/		
}
/** Line show initial calaorie meter reading. Its is 27 ℃ */
function drawLineinitial() {
    drawLine(400,520, 400,600, "showLine");
}
/** Draws indicator lines of the calorie meter for showing the temperature rise and rate of cooling down of temperature.*/
function drawLine(x,y,endX,endY,name) {
    line.graphics.setStrokeStyle(4);
    line.alpha = 0.5;
    line.graphics.beginStroke("#cd0a0a");
    line.name = name;
    line.graphics.moveTo(x, y);//start line
    line.graphics.lineTo(endX, endY);//end line
    line.graphics.endStroke();
    stage.addChild(line);// adding line to the stage
}
/** Set initial visibilty of images and text */
function setVisibleImg(){
	stage.getChildByName("zoomImg").visible = false;
	stage.getChildByName("stopwatch").visible = false;
	stage.getChildByName("redbutton").visible = false;
	stage.getChildByName("greenbutton").visible = false;
	stage.getChildByName("stopWatchHr").visible = false;
	stage.getChildByName("stopWatchMint").visible = false;
	stage.getChildByName("stopWatchSec").visible = false;
	stage.getChildByName("start").visible = false;	
}
/** Initialize the variables used in the experiment */
function initialisationOfVariables() {
    temperature_value = 25;/**25 is the initial temprature*/
    temperature_int = 25;
    count_timer_line = 0;/** Counter variable for drawing indicator line of the calorie meter */
	count_timer_line1=0;
	cool_temp_int=0;
	time_int=-1;
    is_start_int = false;
	interval=1;
}
/** Start & stop the stopwatch on clock */
function stopwatchFn(){
	stage.getChildByName("stopWatchBtn").on("click",function(){
		if (stage.getChildByName("start").text == _("START")) {
			startGraphPlotting();	// start plotting the graph on start the stop watch		
		}		
	});
}
/**user click on 'Start plotting' the graph the function will invoke. This function will call an interval 
for the repeated drawing of the graph */
function startGraphPlotting(scope){
	resetStopWatch(); /** resets the stop watch to initial values */
	stage.getChildByName("start").text=_("STOP");
	stage.getChildByName("redbutton").alpha=0.5;
	stage.getChildByName("greenbutton").alpha=1;
	startWatch(stage.getChildByName("stopWatchHr"),stage.getChildByName("stopWatchMint"),stage.getChildByName("stopWatchSec"));
}
/**function invoke when the user stop ploting the graph by hit on the 'Stop click' function*/
function stopPlottingGraph(){
	stage.getChildByName("start").text=_("START");/** Change the stop watch button "STOP" to "START" */
	stage.getChildByName("redbutton").alpha=1;
    stage.getChildByName("greenbutton").alpha=0.5;
	resetStopWatch(); /** resets the stop watch to initial values */
	stage.getChildByName("stopWatchHr").text = "00";
	stage.getChildByName("stopWatchMint").text = "00";
	stage.getChildByName("stopWatchSec").text = "00";
	clearInterval(stop_watch_timer);
}
/**calculate the conductivity from the given values*/
function heating(scope){
	var radius = 3;//radius of the calorie meter
	var m1 = 100;//temperature constant 1, keep the values as constant.
	var m2 = 120;//temperature constant 2
	clearInterval(change_temperature_int);
	/**checking wheteher heating or cooling is encountered, start flag true for heating and false for cooling*/
	is_start_int = is_start_int ? false : true;
	/**actual calculation for the rate of cooling is calculating, kt=(hc*(3.14*r^2)*10^-4/(m1C1)+(m2c2)*/
	cooling_value_int=(thermal_conductivity*Math.PI*radius*radius*Math.pow(10,-4))/((m1*specific_heat_material)+(m2*specific_heat_liquid));	
	dataplotArray.push({x: 0,y: temperature_value}); /** Plots graph for time against temperature */
	chart.render();	// update chart after specified time. 
	change_temperature_int = setInterval(function(){findtemperature(scope)},350*interval);
}
/** this function will toggle between heating and cooling.*/
function startHeatingFn(scope){
	dataplotArray=[];
	makegraph();
	resetStopWatch();
	stopPlottingGraph();
	if(startFlag%2==0){
		//execute this on heating
		scope.control_disable=true;
		scope.heatng_btn_lbl=_("Stop Heating");	
		count_timer_line1=0;
		count_timer_line=0;
		xPos=390;
		scope.divshow=true;
		interval=1;
		temperature_value=Math.round(temperature_int);/**restart from previous temperature*/
	}
	if(startFlag%2!=0){
		/** Execute this on heating */
		scope.divshow=false;
		scope.heatng_btn_lbl=_("Start Heating");
		time_int=-1;			
		interval=6;
		startGraphPlotting();
	}
	/**get the specific heat, thermal conductivity,boiling point of the selected materials and liquids*/
	selected_liquid = removeTextSpace(selected_liquid);
	selected_material = removeTextSpace(selected_material);
	specific_heat_material = specificHeat[selected_material];
	specific_heat_liquid = specificHeat[selected_liquid];
	boiling_pt = boiling_point[selected_liquid];
	thermal_conductivity=thermalConductivity[selected_material];
	heating(scope);
}
/** Get the value of the dropdown box, remove all the white spaces between the texts*/
function removeTextSpace(elmnt) {
    return elmnt.replace(/\s/g, "");
}
/** calculate heating temperature and cooling temperature */
function findtemperature(scope) {
	/**check whether experiment has started, by clicking on the start heating button 
	the material starts heating as the result temperature rises.*/	
	if (is_start_int) {
		count_timer_line1=0;
		/**check whether the temperature reaches the material's boiling point,if not continue heating till there */
		if (temperature_value < 100) {
			/**initial value(minimum) is set as 25. When temperature increases height 
				of the calorie meter reading also increases*/
			temperature_value++;		
			scope.temp_value=temperature_value.toFixed(1) + " ℃";/** display the rising temperature */
			scope.$apply();		
			line.graphics.clear();
			drawLineinitial();// initial line of the calorie meter reading
			count_timer_line++;/**increase the height for line drawing*/
			/**red line indication for increase temperature reading in the thermometer*/
			drawLine(400, 520 , 400, 520- count_timer_line,"riseLine");
			xPos=520- count_timer_line;
		} 
	} else{

		time_int++;	
				
		cooling_const = 60 * time_int * cooling_value_int;		
		var inverse_cooln_const_exp=(1/Math.exp(cooling_const));
		//T(t)=25+((Tmax-25)/Exp(kt))
		temperature_int=25+((temperature_value-25)/Math.exp(cooling_const));				
		scope.temp_value=temperature_int.toFixed(1) + " ℃";/** display the rising temperature */
		scope.$apply();	
		line.graphics.clear();
		drawLineinitial(); /** Draws initial line */
		newPos=xPos+count_timer_line1;
		if (newPos < 520) {
			drawLine(400,xPos+count_timer_line1, 400, 520,"coolLine");/**red line indication for temperature fall in the thermometer*/
			count_timer_line1++;
		}
		
		dataplotArray.push({x: time_int,y: temperature_int}); /** Plots graph for time against temperature */
		chart.render();	// update chart after specified time. 
		
	}
}
/** Reset the experiment */
function resetExperiment() {
	location.reload();
}