<!--
  *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
  *VALUE (Virtual Amrita Laboratories Universalizing Education)
  *Amrita University, India
  *http://www.amrita.edu/create
  *author:Anitha;
  *Date of modified: 07-06-2015
-->
<ul>
<li><h1 id="variables"><span></span></h1>
	<div class="varBox box">  
		<p class=" sliderText textIndend" id="material"></p>
        <span class="selectContainer">
		<select class="comboBoxClass" id="dropdown">
		</select>
        </span>
		<p class="sliderText textIndend" id="diameter"></p>
        
			<input id="slider1" class="sliderClass" type="range" min="5" max="10" step="0.1"/>
		<div class="rangeVals">
			<span class="minrange" id="minimumRange">5</span><span class="maxrange" id="maximumRange">10</span>
		</div>
		<p class="sliderText textIndend" id="thickness"></p>
			<input id="slider2" class="sliderClass" type="range" min="1" max="5" step="0.1"/>
		
		<div class="rangeVals">
			<span class="minrange" id="minimumRange">1</span><span class="maxrange" id="maximumRange">5</span>
		</div>
		<p class="sliderText textIndend" id="temperature"></p>
			<input id="slider3" class="sliderClass" type="range" min="-20" max="100" step="1"/>
		
		<div class="rangeVals">
			<span class="minrange" id="minimumRange">-20</span><span class="maxrange" id="maximumRange">100</span>
		</div>
		<input class="submitBtns" type="button" value="" id="poweronBtn">
        
          <input type="checkbox" class="nrmlChkBox menuContainer" name="testOne" id="graphchek"/>
  <p class="chkBoxText menuContainer" id="showResultTxt"></p>

	</div>
</li>
<li><h1 id="measurements"></h1>
	<div class="varBox box">
		<div class="sliderText textIndend" id="result"></div>
        
		<div id="warning" class="sliderText textIndend">
        <img src="<?php getSimPath(); ?>images/warningicon.svg" style="width: 12%;"/>
        <p class="chkBoxText menuContainer" id="warningTxt">Voltage of both heaters must be same.</p> 
        </div>
	</div>
</li>
</ul>