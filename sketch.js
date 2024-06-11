/*

!! Problems:
	slider text needs to be limited to 2dp

*/




//buffer to send to Bela. 6 elements: 6 sliders
let buffer = [0,0,0,0,0,0];



function setup() {
	
	// createCanvas(WW, WH);
	// background(200);
	
	//Create 6 sliders for each of the 6 variables
	ResonantFrequencyHz = createSlider(20, 1000, 20,0);
	ResonancePeakGainDb = createSlider(0, 30, 0,0);
	ResonanceQ = createSlider(0.5,20,0.5,0);
	ResonanceToneLevelDb = createSlider(-90,0,-90,0);
    InductanceFilterCoefficient = createSlider(0,1,0,0);
    TransducerInputWidebandGainDb = createSlider(-20,20,-20,0);
    
	//Text
	p1 = createP("Resonant Frequency Hz:");
	p2 = createP("Resonance Peak Gain Db:");
	p3 = createP("Resonance Q:");
	p4 = createP("Resonance Tone Level Db:");
	p5 = createP("Inductance Filter Coefficient:");
    p6 = createP("Transducer Input Wideband Gain Db:");
	
	//Input textboxes 
    textBoxResFreq = createInput('');
    textBoxResPeak = createInput('');
    textBoxResQ = createInput('');
    textBoxResTone = createInput('');
    textBoxInduct = createInput('');
    textBoxTransGain = createInput('');
    
	//This function will format colors and positions of the DOM elements 
	formatDOMElements();

}


function draw() {  
	
	// Retrieve the data being sent from render.cpp
	let LevelMeter_value = Bela.data.buffers[0];			// the value between -1 and +1 
	
	// Draw a circle on the left hand side whose position changes with the values received from render.cpp
	// !! could this be adapted to 
	// ellipse(200 + windowWidth/3 + 100,
	// 	windowHeight/2 + (((windowHeight/2)-100)*sine), 50, 50);
	
	let c2 = color(0);
	
	fill(c2);
	rectMode(CORNERS)
	rect(200 + windowWidth/3 + 100,								// bottom left corner x value
		windowHeight/2 + ((windowHeight/2)-100),				// bottom left corner y value
		100 + (200 + windowWidth/3 + 100),						// top right corner x value
		windowHeight/2 + (((windowHeight/2)-100) * LevelMeter_value) + 1);	// top right corner y value 
	
	
	let c1 = color(200);
	
	fill(c1);
	rectMode(CORNERS)
	rect(200 + windowWidth/3 + 100,								// same corners as above
		windowHeight/2 + (((windowHeight/2)-100) * LevelMeter_value) + 1,
		100 + (200 + windowWidth/3 + 100),
		windowHeight/2 - ((windowHeight/2)-100));
	
	
    //store values in the buffer
	buffer[0] = ResonantFrequencyHz.value();
	buffer[1] = ResonancePeakGainDb.value();
	buffer[2] = ResonanceQ.value();
    buffer[3] = ResonanceToneLevelDb.value();
    buffer[4] = InductanceFilterCoefficient.value();
    buffer[5] = TransducerInputWidebandGainDb.value();

	//SEND BUFFER to Bela. Buffer has index 0 (to be read by Bela),
	//contains floats and sends the 'buffer' array.
    Bela.data.sendBuffer(0, 'float', buffer);
}

function formatDOMElements() {
	
	let WW = windowWidth;
	let WH = windowHeight;
	
	let slider_width = 200;
	let text_width = 100;
	
	createCanvas(WW, WH);
	background(200);

	//Format sliders repeated x6 
	ResonantFrequencyHz.size(WW / 3);										//Sets the slider size to 1/3 the size of the window 
	ResonantFrequencyHz.position(slider_width,						// set the slider to the right of the 
        WH / 2 - 210);													//Sets the slider vertically 
    
    ResonancePeakGainDb.size(WW / 3);
    ResonancePeakGainDb.position(slider_width,
		WH / 2 - 140);

    ResonanceQ.size(WW / 3);
    ResonanceQ.position(slider_width,
		WH / 2 - 70);

    ResonanceToneLevelDb.size(WW / 3);
    ResonanceToneLevelDb.position(slider_width,
		WH / 2 + 0);

    InductanceFilterCoefficient.size(WW / 3);
    InductanceFilterCoefficient.position(slider_width,
		WH / 2 + 70);

    TransducerInputWidebandGainDb.size(WW / 3);
	TransducerInputWidebandGainDb.position(slider_width,
		WH / 2 + 140);
	
	// Format Text repeated x6
    p1.position(slider_width,			// located to the same x as the slider 
    	(WH / 2) - (210 + 40));					// located 40 above the slider 
  
    p2.position(slider_width, 
    	(WH / 2) - (140 + 40));
    	
    p3.position(slider_width, 
    	(WH / 2) - (70 + 40));					
    
    p4.position(slider_width, 
    	(WH / 2) - (0 +40));						
    
    p5.position(slider_width, 
    	(WH / 2) - (-70 + 40));						
    
    p6.position(slider_width, 
    	(WH / 2) - (-140 + 40));					
    	
    	
    	
	// Sorts positions of textbox and button 
	// if textbox is imputted changes slider and vice-versa see functions updateValue() and sliderChange()
	
    textBoxResFreq.position(text_width, 	// positions textbox to the left of the slider 
    	WH / 2 - 210);	
    	// Positions textbox at the same height as the slider 
    textBoxResFreq.size(50);
  
    ResonantFrequencyHz.input(sliderChange);
    
    textBoxResFreq.value(ResonantFrequencyHz.value());
    
    valueDisplayerResFreq = createP();
    valueDisplayerResFreq.position(30,height-50);
    
    // repeat for ResonancePeakGainDb
    textBoxResPeak.position(text_width, 
    	WH / 2 - 140);
    textBoxResPeak.size(50);
  
    ResonancePeakGainDb.input(sliderChange);
    
    textBoxResPeak.value(ResonancePeakGainDb.value());
  
    valueDisplayerResPeak = createP();
    valueDisplayerResPeak.position(30,height-50);
    
    // repeat for ResonanceQ
    textBoxResQ.position(text_width, 
    	WH / 2 - 70);
    textBoxResQ.size(50);
  
    ResonanceQ.input(sliderChange);
    
    textBoxResQ.value(ResonanceQ.value());
  
    valueDisplayerResQ = createP();
    valueDisplayerResQ.position(30,height-50);
    
    // repeat for ResonanceToneLevelDb
    textBoxResTone.position(text_width, 
    	WH / 2);
    textBoxResTone.size(50);
  
    ResonanceToneLevelDb.input(sliderChange);
    
    textBoxResTone.value(ResonanceToneLevelDb.value());
  
    valueDisplayerResTone = createP();
    valueDisplayerResTone.position(30,height-50);
    
    // repeat for InductanceFilterCoefficient
    textBoxInduct.position(text_width, 
    	WH / 2 + 70);
    textBoxInduct.size(50);
  
    InductanceFilterCoefficient.input(sliderChange);
    
    textBoxInduct.value(InductanceFilterCoefficient.value());
  
    valueDisplayerInduct = createP();
    valueDisplayerInduct.position(30,height-50);
    
    // repeat for TransducerInputWidebandGainDb
    textBoxTransGain.position(text_width, 
    	WH / 2 + 140);
    textBoxTransGain.size(50);
  
    TransducerInputWidebandGainDb.input(sliderChange);
    
    textBoxTransGain.value(TransducerInputWidebandGainDb.value());
  
    valueDisplayerTransGain = createP();
    valueDisplayerTransGain.position(30,height-50);
	
}

function keyPressed() {
  if (keyCode === ENTER) {
    updateValue();
  }
}

function updateValue(){
	//if the textbox is updated, update all the sliders
	ResonantFrequencyHz.value(textBoxResFreq.value());
	ResonancePeakGainDb.value(textBoxResPeak.value());
	ResonanceQ.value(textBoxResQ.value());
	ResonanceToneLevelDb.value(textBoxResTone.value());
	InductanceFilterCoefficient.value(textBoxInduct.value());
	TransducerInputWidebandGainDb.value(textBoxTransGain.value());
}

function sliderChange(){
	//if the slider is changed, update the textbox
	textBoxResFreq.value(ResonantFrequencyHz.value());
	textBoxResPeak.value(ResonancePeakGainDb.value());
	textBoxResQ.value(ResonanceQ.value());
	textBoxResTone.value(ResonanceToneLevelDb.value());
	textBoxInduct.value(InductanceFilterCoefficient.value());
	textBoxTransGain.value(TransducerInputWidebandGainDb.value());
}