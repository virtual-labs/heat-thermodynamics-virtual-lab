/** This file will call functions to load all the images and texts in the experiment */
function loadImagesTexts(){
	/** Images loading in the canvas */
	loadImages(queue.getResult("backGround"),"backGround",stage_width/(-26),stage_height/(-24),1.077,"",0);		
	loadImages(queue.getResult("stopWatch"),"stopWatch",stage_width/3.2,stage_height/1.55,0.22,"",0);
	loadImages(queue.getResult("redButton"),"redButton",stage_width/2.18,stage_height/1.33,0.02,"",0);
	loadImages(queue.getResult("greenButton"),"greenButton",stage_width/2.07,stage_height/1.33,0.02,"",0);
	loadImages(queue.getResult("needle"),"aNeedle",stage_width/2.3,stage_height/2.42,0.0756,"",0);
	loadImages(queue.getResult("needle"),"vNeedle",stage_width/3.8,stage_height/2.42,0.0756,"",0);
	loadImages(queue.getResult("indicatorSelectorSwitchBase"),"indicatorSelectorSwitchBase",stage_width/4.35,stage_height/1.67,0.038,"",0);
	loadImages(queue.getResult("indicatorSelectorSwitch"),"indicatorSelectorSwitch",stage_width/4.7,stage_height/1.72,0.0485,"",0);
	loadImages(queue.getResult("lightOn"),"lightOn",stage_width/1.858,stage_height/2.92,0.0483,"",0);	
	loadImages(queue.getResult("off_button"),"off_button",stage_width/1.81,stage_height/2.72,0.029,'pointer',0);
	loadImages(queue.getResult("on_button"),"on_button",stage_width/1.81,stage_height/2.68,0.029,'pointer',0);	
	loadImages(queue.getResult("rotate_bar"),"mhTuner",stage_width/1.45,stage_height/2.61,0.0088,"",0);
	loadImages(queue.getResult("rotate_bar"),"ghTuner",stage_width/1.235,stage_height/2.61,0.0088,"",0);
	loadImages(queue.getResult("rotate_arrow"),"ghUpArrow",stage_width/1.228,stage_height/2.9,0.0248,'pointer',0);
	loadImages(queue.getResult("rotate_arrow"),"ghDownArrow",stage_width/1.26,stage_height/2.9,0.0248,'pointer',90);
	loadImages(queue.getResult("rotate_arrow"),"mhUpArrow",stage_width/1.44,stage_height/2.9,0.0248,'pointer',0);	
	loadImages(queue.getResult("rotate_arrow"),"mhDownArrow",stage_width/1.49,stage_height/2.9,0.0248,'pointer',90);
    loadImages(queue.getResult("MH_switch"),"MH_switch",stage_width/2.528,stage_height/1.745,0.043,'pointer',0);
	loadImages(queue.getResult("GH_switch"),"GH_switch",stage_width/2.528,stage_height/1.828,0.039,'pointer',0);	
	loadImages(queue.getResult("indicatorArrow"),"indicatorFwdArrow",stage_width/3.8,stage_height/1.74,0.04,'pointer',0);
	loadImages(queue.getResult("indicatorArrow"),"indicatorBkdArrow",stage_width/5.2,stage_height/1.62,0.04,'pointer',180);
	loadImages(queue.getResult("cross_section"),"cross_section",stage_width/1.6,stage_height/1.68,0.31,'',0);
	loadImages(queue.getResult("wateranim"),"waterAnimationTop",stage_width/1.5,stage_height/1.64,1.13,'',0);
	loadImages(queue.getResult("wateranim"),"waterAnimationBottom",stage_width/1.5,stage_height/1.31,1.13,'',0);
	loadImages(queue.getResult("glasseffect"),"glassEffect",stage_width/6.4,stage_height/3.265,0.39,"",0);
	/** Textbox loading */
	setText("indicatorTimer",stage_width/5.6,stage_height/1.785,"27.00","white",stage_width/450);	
	setText("stopWatchValHr",stage_width/2.95,stage_height/1.375,"00","black",stage_width/380);
	setText("stopWatchValMin",stage_width/2.56,stage_height/1.375,"00","black",stage_width/380);
	setText("stopWatchValSec",stage_width/2.26,stage_height/1.375,"00","black",stage_width/380);
	setText("voltmeterReading",stage_width/4.9,stage_height/2.135,"0","black",stage_width/420);
	setText("ammeterReading",stage_width/2.6,stage_height/2.135,"0","black",stage_width/420);
	setText("indicatorReading",stage_width/4.8,stage_height/1.468,"","black",stage_width/450);
	setText("watchStartStop",stage_width/2.77,stage_height/1.308,"","black",stage_width/550);
	setText("MH_text",stage_width/1.49,stage_height/2.37,"MH","black",stage_width/600);
	setText("GH_text",stage_width/1.26,stage_height/2.37,"GH","black",stage_width/600);
}