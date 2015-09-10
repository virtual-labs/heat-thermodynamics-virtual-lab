<!--
  *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
  *VALUE (Virtual Amrita Laboratories Universalizing Education)
  *Amrita University, India
  *http://www.amrita.edu/create
  *author:Anitha;
  *Date of modified: 24-07-2015
-->
<ul>
<li><h1 id="variables"><span></span></h1>
	<div class="varBox box">  
		<p class="sliderText textIndend" id="material"></p>
        <span class="selectContainer">
		<select class="comboBoxClass" id="dropdown">
		</select>
        </span>
		<p class="sliderText textIndend" id="diameter">:</p>
        <input id="slider1" class="sliderClass" type="range" min="10" max="50" step="1"/>
        <div class="rangeVals">
            <span class="minrange" id="minimumRange">10</span><span class="maxrange" id="maximumRange">50</span>
        </div>
		<p class="sliderText textIndend" id="thickness"></p>
        <input id="slider2" class="sliderClass" type="range" min="0.5" max="1" step="0.05"/>
		<div class="rangeVals">
			<span class="minrange" id="minimumRange">0.5</span><span class="maxrange" id="maximumRange">1</span>
		</div>
		<p class="sliderText textIndend" id="temperature"></p>
		<input id="slider3" class="sliderClass" type="range" min="0" max="30" step="1"/>
		<div class="rangeVals">
			<span class="minrange" id="minimumRange">0</span><span class="maxrange" id="maximumRange">30</span>
		</div>
		<input class="submitBtns" type="button" value="" id="poweronBtn">
		<div id="showResult">
			<input type="checkbox" class="nrmlChkBox" name="testOne" id="crossSectionCheckbox">
            <p class="checkboxText" id="showCrossSection"></p>
		</div>
        <div id="showResult">
			<input type="checkbox" class="nrmlChkBox" name="testOne" id="resultCheckbox">
            <p class="checkboxText" id="showResultTxt"></p>
		</div>
	</div>
</li>
<li><h1 id="measurements"></h1>
	<div class="varBox box">
		<div id="result" class="textIndend"></div>
		<div id="warningImg"><img src="<?php getSimPath(); ?>images/warningicon.svg" style="width: 12%;"/></div><div id="warning"></div>
	</div>
</li>
</ul>