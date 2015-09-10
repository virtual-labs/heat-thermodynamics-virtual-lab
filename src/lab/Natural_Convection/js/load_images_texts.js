/** This file will call functions to load all the images and texts in the experiment, the function will take 10 parameters,	para 1: bitmap id, para 2: name of the bitmap, para 3: x position, para 4: y position, para 5: scaling factor, para 6: flipping vactor, para 7: andle of roation(if rotation needed), para 8: registration point x of the bitmap, para 9: registration point Y of bitmap, para 10:cursor for the bitmap(pointer or default) */
function loadImagesTexts() {
    /** Images loading in the canvas */
    loadImages(queue.getResult("background"), "background", stage_width / -6.12, 0, 1.22, 1, 0, "", "", 'default');
    loadImages(queue.getResult("wooden_box"), "wooden_box", stage_width / 1.38, stage_height / 1.24, 0.62, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("box_cross_section"), "box_cross_section", stage_width / 1.391, stage_height / 1.237, 0.62, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("Glass_on_box"), "Glass_on_box", stage_width / 1.3, stage_height / 1.28, 0.55, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("arrow"), "arrow_right", stage_width / 1.66, stage_height / 2.85, 0.028, 1, 0, "", "", 'pointer');
    loadImages(queue.getResult("arrow"), "arrow_left", stage_width / 1.76, stage_height / 2.85, 0.028, -1, 0, "", "", 'pointer');
    setText("voltmeter_text", stage_width / 5.4, stage_height / 2.1, "00", "#000000");
    setText("ammeter_text", stage_width / 2.54, stage_height / 2.1, "00", "#000000");
    loadImages(queue.getResult("needle"), "needle", stage_width / 3.999, stage_height / 2.34, 0.09, 1, 0, 1.02, 1.02, 'default');
    loadImages(queue.getResult("needle"), "ammeter_needle", stage_width / 2.25, stage_height / 2.35, 0.09, 1, 0, 1.02, 1.02, 'default');
    loadImages(queue.getResult("indicator_rotation"), "indicator_rotation", stage_width / 4.885, stage_height / 1.588, 0.042, 1, 16, 2, 2, 'default');
    loadImages(queue.getResult("indicator"), "indicator", stage_width / 5.3, stage_height / 1.63, 0.035, 1, 0, "", "", 'default');
    loadImages(queue.getResult("stopwatch"), "stopwatch", stage_width / 1.9, stage_height / 1.49, 0.2, 1, 0, "", "", 'default');
    loadImages(queue.getResult("rod_shadow"), "rod_shadow", stage_width / 1.244230769230769, stage_height / 3.8, 0.5, 1, 0, "", "", 'default');
    loadImages(queue.getResult("arrow_for_anim"), "arrow_for_anim", stage_width / 1.3, stage_height / 1.2, 0.07, 1, 0, "", "", 'default');
    loadImages(queue.getResult("arrow_for_anim"), "arrow_for_anim_right", stage_width / 1.19, stage_height / 1.2, 0.07, 1, 0, "", "", 'default');
    loadImages(queue.getResult("arrow_for_anim"), "arrow_for_anim_middle", stage_width / 1.23, stage_height / 1.2, 0.07, 1, 0, "", "", 'default');
    loadImages(queue.getResult("aluminium"), "aluminium", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("aluminium_inner"), "aluminium_inner", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("copper"), "copper", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("copper_inner"), "copper_inner", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("iron"), "iron", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("iron_inner"), "iron_inner", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("silver"), "silver", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("silver_inner"), "silver_inner", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("steel"), "steel", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("steel_inner"), "steel_inner", stage_width / 1.244230769230769, stage_height / 1.32, 0.5, 1, 0, "", 1, 'default');
    loadImages(queue.getResult("coil"), "coil", stage_width / 1.244230769230769, stage_height / 2.51333333, 0.15, 1, 0, "", "", 'default');
    loadImages(queue.getResult("black_holder"), "black_holder", stage_width / 1.259, stage_height / 2.7, 0.28, 1, 0, "", "", 'default');
    loadImages(queue.getResult("wire"), "wire", stage_width / 1.2394636, stage_height / 4.2, 0.5, 1, 0, "", "", 'default');
    loadImages(queue.getResult("rotatemc"), "rotatemc", stage_width / 1.7, stage_height / 2.5, 0.01, 1, 0, 1, 1, 'default');
    loadImages(queue.getResult("lightOff"), "lightOff", stage_width / 1.76, stage_height / 1.92, 0.05, 1, 0, "", "", 'default');
    loadImages(queue.getResult("arrow_indicator"), "arrow_indicate_right", stage_width / 4, stage_height / 1.66, 0.05, 1, 0, "", "", 'pointer');
    loadImages(queue.getResult("arrow_indicator"), "arrow_indicate_left", stage_width / 6.2, stage_height / 1.66, 0.05, -1, 0, "", "", 'pointer');
    loadImages(queue.getResult("lighton"), "lighton", stage_width / 1.76, stage_height / 1.92, 0.05, 1, 0, "", "", 'default');
    loadImages(queue.getResult("tmpLabel"), "tmpLabel", stage_width / 1.22, stage_height / 2.825, 0.3, 1, 0, "", "", 'default');
    loadImages(queue.getResult("redbutton"), "redbutton", stage_width / 1.53, stage_height / 1.31, 0.02, 1, 0, "", "", 'default');
    loadImages(queue.getResult("greenbutton"), "greenbutton", stage_width / 1.48, stage_height / 1.31, 0.02, 1, 0, "", "", 'default');
    loadImages(queue.getResult("bg_glass"), "bg_glass", stage_width / 8.986111111111111, stage_height / 3.459893048128342, 0.44, 1, 0, "", "", 'default');
    setText("indicator_text", stage_width / 5.36, stage_height / 1.42, "", "#000000");
    setText("stopWatchHr", stage_width / 1.8, stage_height / 1.34, "00", "#000000");
    setText("stopWatchMint", stage_width / 1.67, stage_height / 1.34, "00", "#000000");
    setText("stopWatchSec", stage_width / 1.54, stage_height / 1.34, "00", "#000000");
    setText("start", stage_width / 1.78, stage_height / 1.275, "", "#000000");
    setText("indicatorTxt", stage_width / 5.9, stage_height / 1.71, "", "#fff");
}
/** Assigning the names for each metal rod */
function getmaterialName() {
    convection_stage.getChildByName("aluminium").visible = true;
    convection_stage.getChildByName("copper").visible = false;
    convection_stage.getChildByName("iron").visible = false;
    convection_stage.getChildByName("silver").visible = false;
    convection_stage.getChildByName("steel").visible = false;
    convection_stage.getChildByName("copper_inner").visible = false;
    convection_stage.getChildByName("aluminium_inner").visible = false;
    convection_stage.getChildByName("iron_inner").visible = false;
    convection_stage.getChildByName("silver_inner").visible = false;
    convection_stage.getChildByName("steel_inner").visible = false;
    wire = convection_stage.getChildByName("wire");
    convection_stage.update();
}