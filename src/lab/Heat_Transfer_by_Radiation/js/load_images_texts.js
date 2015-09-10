  /** This file will call functions to load all the images and texts in the experiment */
  function loadImagesTexts(){
	/** Images loading in the canvas */
	loadImages(queue.getResult("backGround"),"backGround",stage_width/(-9.22),stage_height/(-8),1.23,"",0);		
	loadImages(queue.getResult("discShadow"),"discShadowCommon",stage_width/4.5,stage_height/1.315,0.22,"",0);
	loadImages(queue.getResult("commonDisc"),"commonDiscInner",stage_width/5.2,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("commonDisc"),"commonDisc",stage_width/5.2,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("discShadow"),"discShadow",stage_width/1.69,stage_height/1.315,0.22,"",0);	
	loadImages(queue.getResult("copper"),"copperInner",stage_width/1.78,stage_height/1.37,0.23,"",0);	
	loadImages(queue.getResult("copper"),"copper",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("steel"),"steelInner",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("steel"),"steel",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("iron"),"ironInner",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("iron"),"iron",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("brass"),"brassInner",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("brass"),"brass",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("aluminium"),"aluminiumInner",stage_width/1.78,stage_height/1.37,0.23,"",0);
	loadImages(queue.getResult("aluminium"),"aluminium",stage_width/1.78,stage_height/1.37,0.23,"",0);	
	loadImages(queue.getResult("wires"),"wireOne",stage_width/4.7,stage_height/1.5,0.56,"",0);
	loadImages(queue.getResult("stopWatch"),"stopWatch",stage_width/4.5,stage_height/2.3,0.22,"",0);
	loadImages(queue.getResult("redButton"),"redButton",stage_width/2.7,stage_height/1.85,0.02,"",0);
	loadImages(queue.getResult("greenButton"),"greenButton",stage_width/2.55,stage_height/1.85,0.02,"",0);
	loadImages(queue.getResult("needle"),"aNeedle",stage_width/2.4,stage_height/3,0.0796,"",0);
	loadImages(queue.getResult("needle"),"vNeedle",stage_width/4.18,stage_height/3,0.0796,"",0);
	loadImages(queue.getResult("indicatorSelectorSwitchBase"),"indicatorSelectorSwitchBase",stage_width/1.8,stage_height/3.2,0.043,"",0);
	loadImages(queue.getResult("indicatorSelectorSwitch"),"indicatorSelectorSwitch",stage_width/1.85,stage_height/3.4,0.0314,"",0);
	loadImages(queue.getResult("lightOn"),"mlightOn",stage_width/1.345,stage_height/2.69,0.0531,"",0);	
	loadImages(queue.getResult("switchOff"),"switchOff",stage_width/1.32,stage_height/4.1,0.039,'pointer',0);
	loadImages(queue.getResult("switchOn"),"switchOn",stage_width/1.32,stage_height/3.8,0.052,'pointer',0);	
	loadImages(queue.getResult("tuner"),"tpTuner",stage_width/1.472,stage_height/3.57,0.014,"",0);
	loadImages(queue.getResult("tuner"),"bpTuner",stage_width/1.166,stage_height/3.57,0.014,"",0);
	loadImages(queue.getResult("arrow"),"bpUpArrow",stage_width/1.15,stage_height/4.2,0.0193,'pointer',0);
	loadImages(queue.getResult("arrow"),"bpDownArrow",stage_width/1.18,stage_height/4.2,0.0193,'pointer',90);
	loadImages(queue.getResult("arrow"),"tpUpArrow",stage_width/1.45,stage_height/4.2,0.0193,'pointer',0);	
	loadImages(queue.getResult("arrow"),"tpDownArrow",stage_width/1.49,stage_height/4.2,0.0193,'pointer',90);
	loadImages(queue.getResult("on"),"motorOn",stage_width/1.315,stage_height/2.48,0.027,'pointer',0);
	loadImages(queue.getResult("off"),"motorOff",stage_width/1.315,stage_height/2.48,0.027,'pointer',0);
	loadImages(queue.getResult("indicatorArrow"),"indicatorFwdArrow",stage_width/1.68,stage_height/3.35,0.031,'pointer',0);
	loadImages(queue.getResult("indicatorArrow"),"indicatorBkdArrow",stage_width/1.95,stage_height/3.02,0.031,'pointer',180);
	loadImages(queue.getResult("glasseffect"),"glassEffect",stage_width/25.6,stage_height/4.9,0.923,"",0);
	/** Textbox loading */
	setText("indicatorTimer",stage_width/2,stage_height/3.75,"27.00","white",stage_width/420);	
	setText("stopWatchValHr",stage_width/4,stage_height/1.935,"00","black",stage_width/380);
	setText("stopWatchValMin",stage_width/3.32,stage_height/1.935,"00","black",stage_width/380);
	setText("stopWatchValSec",stage_width/2.83,stage_height/1.935,"00","black",stage_width/380);
	setText("voltmeterReading",stage_width/5.6,stage_height/2.5,"0","black",stage_width/420);
	setText("ammeterReading",stage_width/2.8,stage_height/2.5,"0","black",stage_width/420);
	setText("indicatorReading",stage_width/1.88,stage_height/2.5,"","black",stage_width/420);
	setText("watchStartStop",stage_width/3.75,stage_height/1.8,"","black",stage_width/520);
  }
  /** initial visibility of all the disc except aluminium set as false */
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