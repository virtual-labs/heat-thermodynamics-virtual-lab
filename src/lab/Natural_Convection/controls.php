<!--
   *Developed by Amrita CREATE (Center for Research in Advanced Technologies for Education),
   *VALUE (Virtual Amrita Laboratories Universalizing Education)
   *Amrita University, India
   *http://www.amrita.edu/create
   *author:Saranya S;
   *Date of modified: 07-06-2015
   -->
<ul>
   <li>
      <h1 id="variables">Variables<span></span></h1>
      <div class="varBox box">
         <p class="sliderText textIndend menuContainer" id="material">Choose material:</p>
         <span class="selectContainer">
         <select class="comboBoxClass menuContainer" id="dropdown">
         </select>
         </span>
         <p class="sliderText textIndend menuContainer" id="sideOfBox">Side of wooden box (cm):</p>
         <input id="boxSide" class="sliderClass" type="range" min="5" max="10" step="0.1" value="5"/>
         <div class="rangeVals">
            <span class="minrange" id="minimumRange">5</span><span class="maxrange" id="maximumRange">10</span>
         </div>
         <p class="sliderText textIndend menuContainer" id="heightOfBox">Height of wooden box(cm):</p>
         <input id="boxHeight" class="sliderClass" type="range" min="70" max="80" step="1" value="70" />
         <div class="rangeVals">
            <span class="minrange" id="minimumRange">70</span><span class="maxrange" id="maximumRange">80</span>
         </div>
         <p class="sliderText textIndend menuContainer" id="diameterOfCylinder">Diameter of cylinder(cm):</p>
         <input id="cylinderDiameter" class="sliderClass" type="range" min="4" max="10" step="1" value="4" />
         <div class="rangeVals">
            <span class="minrange" id="minimumRange">4</span><span class="maxrange" id="maximumRange">10</span>
         </div>
         <!--legth of the cylinder slider-->
         <p class="sliderText textIndend menuContainer" id="lengthOfCylinder">Length of cylinder (cm):</p>
         <input id="cylinderLength" class="sliderClass" type="range" min="50" max="60" step="1" value="50" />
         <div class="rangeVals">
            <span class="minrange" id="minimumRange">50</span><span class="maxrange" id="maximumRange">60</span>
         </div>
         <!--end of length of cylinder-->
         <!--thickness of the cylinder slider-->
         <p class="sliderText textIndend menuContainer" id="thicknessOfCylinder">Thickness of the cylinder (cm):</p>
         <input id="cylinderthickness" class="sliderClass" type="range" min="0.1" max="0.3" step="0.01" value="0.1" />
         <div class="rangeVals">
            <span class="minrange" id="minimumRange">0.1</span><span class="maxrange" id="maximumRange">0.3</span>
         </div>
         <!--end of thickness of cylinder-->
         <!--  poweron button-->
         <input class="submitBtns" type="button" value="Power On" id="poweronBtn">
         <!--  end poweron button-->
         <!--check box1-->
         <div id="showResult">
            <input type="checkbox" class="nrmlChkBox menuContainer" name="testOne" id="crossSectionChkBox">
            <p class="sliderText textIndend menuContainer" id="showResultTxtcross">Show cross section</p>
         </div>
         <!--end check box1-->
         <!--check box2-->
         <div id="showResult">
            <input type="checkbox" class="nrmlChkBox menuContainer" name="testOne" id="resultChkBox">
            <p class="sliderText textIndend menuContainer" id="showResultTxt">Show result</p>
         </div>
         <!--end check box2-->
      </div>
   </li>
   <li>
      <h1 id="reultTxt">Result</h1>
      <div class="varBox box">
         <span  class="sliderText textIndend menuContainer" id="heatCoefficient" style="margin: -21px 15px 30px 14px;">Heat transfer coefficient(h):</span>
         <span id="heat_value" class="sliderText textIndend menuContainer" style="margin: -44px 12px 27px 201px;"></span>
         <span  class="sliderText textIndend menuContainer" id="nusseltNum"  style="margin:-20px 15px 27px 12px">Nusselt number(N):</span>
         <span id="nusslet_number" class="sliderText textIndend menuContainer" style="margin:-42px 12px 27px 148px;" ></span>		
      </div>
   </li>
</ul>