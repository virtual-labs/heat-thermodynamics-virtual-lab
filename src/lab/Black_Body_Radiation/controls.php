<!--
  *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
  *VALUE (Virtual Amrita Laboratories Universalizing Education)
  *Amrita University, India
  *http://www.amrita.edu/create
  *author:Anitha;
  *Date of modified: 02-07-2015
-->
<ul>
<li><h1 id="variables">Variables<span></span></h1>
<div class="varBox">
    <p class="sliderText textIndend" id="waterTemp"></p>
        <input id="waterSlider" class="sliderClass" type="range" min="0" max="100" step="1" value="35"/>
  
    <div class="rangeVals">
        <span class="minrange" id="minimumRange">0</span><span class="maxrange" id="maximumRange">100</span>
    </div>
	<p class="sliderText textIndend" id="surroundTemp"></p>
        <input id="surroundSlider" class="sliderClass" type="range" min="-10" max="99" step="10" value="20"/>
    
    <div class="rangeVals">
        <span class="minrange" id="minimumRange">-10</span><span class="maxrange" id="maximumRange">99</span>
    </div>
    <p class="sliderText textIndend" id="discMass"></p>
        <input id="massSlider" class="sliderClass" type="range" min="5" max="10" step="0.1" value="5"/>
   
    <div class="rangeVals">
        <span class="minrange" id="minimumRange">5</span><span class="maxrange" id="maximumRange">10</span>
    </div>
   <p class="sliderText textIndend" id="discRadius"></p>
        <input id="radiusSlider" class="sliderClass" type="range" min="1" max="5" step="0.1" value="3"/>
   
    <div class="rangeVals">
        <span class="minrange" id="minimumRange">1</span><span class="maxrange" id="maximumRange">5</span>
    </div>    
	<input class="submitBtns" type="button" value="" id="poweronBtn">
    <input class="submitBtns" type="button" value="" id="fitDiscBtn" disabled style="opacity:0.5">
    <input type="checkbox"  id="checkBox" class="nrmlChkBox" name="testOne">
    <p class="chkBoxText menuContainer" id="crossView"></p>
</div>  
<br/>
</li>
<li style="overflow:visible;"><h1 id="measurements">Measurements</h1>
<div class="varBox">
    <div id="selectTemp" class="sliderText textIndend"></div>
    <div id="temperaturesRow1"> 
        <div id="firstRow1">
        <input class="radioGroup" id="t1Rdo" name="status" type="radio" value="T1" checked="checked">
        <label for="t1Rdo" id="t1Lbl">T1</label>
        </div>
        <div id="firstRow2">
        <input class="radioGroup" id="t2Rdo" name="status" type="radio" value="T2">
        <label for="t2Rdo" id="t2Lbl">T2</label>
        </div>
    </div>
    <div id="temperaturesRow2">
        <div id="secondRow1">
        <input class="radioGroup" id="t3Rdo" name="status" type="radio" value="T3">
        <label for="t3Rdo" id="t3Lbl">T3</label>
        </div>
        <div id="secondRow2">
        <input class="radioGroup" id="t4Rdo" name="status" type="radio" value="T4">
        <label for="t4Rdo" id="t4Lbl">T4</label>
        </div>
    </div>
   <p class="sliderText textIndend" id="tempValue"></p>
</div>
</li>
</ul>