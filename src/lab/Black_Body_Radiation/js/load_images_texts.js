/** This file will call functions to load all the images and texts in the experiment */
function loadImagesTexts(){
	/** Images loading in the canvas */
	loadImages(queue.getResult("background"),"background",stage_width/-15,0,1.1);
	loadImages(queue.getResult("crossSectional"),"crossSectional",stage_width/-15.15,0,1.1);
	loadImages(queue.getResult("knobDown"),"knobDown",stage_width/1.65,stage_height/1.345,0.074);
	loadImages(queue.getResult("knobUp"),"knobUp",stage_width/1.65,stage_height/1.345,0.073);	
	loadImages(queue.getResult("stopwatch"),"stopwatch",stage_width/2.8,stage_height/30,0.22);
	loadImages(queue.getResult("startBtn"),"startBtn",stage_width/2.65,stage_height/7.5,0.116);
	loadImages(queue.getResult("stopBtn"),"stopBtn",stage_width/2.65,stage_height/7.5,0.115);
    loadImages(queue.getResult("redButton"),"redButton",stage_width/2,stage_height/7.2,0.02,"",0);
	loadImages(queue.getResult("greenButton"),"greenButton",stage_width/1.9,stage_height/7.2,0.02,"",0);
	loadImages(queue.getResult("wateranim"),"waterAnimation",stage_width/152.8,stage_height/3,9.24810267857143);
	/** Textbox loading */
	setText("stopWatchValHr",stage_width/2.6,stage_height/8.4,"","black",stage_width/400);
	setText("stopWatchValMin",stage_width/2.3,stage_height/8.4,"","black",stage_width/400);
	setText("stopWatchValSec",stage_width/2.05,stage_height/8.4,"","black",stage_width/400);
	setText("indicatorText",stage_width/1.55,stage_height/2.75,"","white",stage_width/550);
	setText("stopwatchLabel",stage_width/2.5,stage_height/6.5,"","black",stage_width/550);
}
