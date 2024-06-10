//buffer to send to Bela. 6 elements: 6 sliders
let buffer = [0,0,0,0,0,0];

function setup() {
	//Create 6 sliders
	//both go from 0 to 100, starting with value of 50
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
  
    textBoxResFreq = createInput('');
    textBoxResPeak = createInput('');
    textBoxResQ = createInput('');
    textBoxResTone = createInput('');
    textBoxInduct = createInput('');
    textBoxTransGain = createInput('');
    
    buttonResFreq = createButton('submit');
    buttonResPeak = createButton('submit');
    buttonResQ = createButton('submit');
    buttonResTone = createButton('submit');
    buttonInduct = createButton('submit');
    buttonTransGain = createButton('submit');
    
	
	//This function will format colors and positions of the DOM elements 
	formatDOMElements();

}


function draw() {

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

	//Format sliders
	ResonantFrequencyHz.size(windowWidth / 3);
	ResonantFrequencyHz.position((windowWidth - ResonantFrequencyHz.width) / 2, 	// Sets the slider horizontally in the middle of the window
        windowHeight / 2 - 210);                             //Sets the slider vertically 
    
    ResonancePeakGainDb.size(windowWidth / 3);
    ResonancePeakGainDb.position((windowWidth - ResonancePeakGainDb.width) / 2,
		windowHeight / 2 - 140);

    ResonanceQ.size(windowWidth / 3);
    ResonanceQ.position((windowWidth - ResonanceQ.width) / 2,
		windowHeight / 2 - 70);

    ResonanceToneLevelDb.size(windowWidth / 3);
    ResonanceToneLevelDb.position((windowWidth - ResonanceToneLevelDb.width) / 2,
		windowHeight / 2 + 0);

    InductanceFilterCoefficient.size(windowWidth / 3);
    InductanceFilterCoefficient.position((windowWidth - InductanceFilterCoefficient.width) / 2,
		windowHeight / 2 + 70);

    TransducerInputWidebandGainDb.size(windowWidth / 3);
	TransducerInputWidebandGainDb.position((windowWidth - TransducerInputWidebandGainDb.width) / 2,
		windowHeight / 2 + 140);

    p1.position((windowWidth - ResonantFrequencyHz.width) / 2, 
    	windowHeight / 2 - 210 - (2.5 * p1.height));
  
    p2.position((windowWidth - ResonancePeakGainDb.width) / 2, 
    	windowHeight / 2 - 140 - (2.5 * p2.height));
    	
    p3.position((windowWidth - ResonanceQ.width) / 2, 
    	windowHeight / 2 - 70 - (2.5 * p3.height));
    
    p4.position((windowWidth - ResonanceToneLevelDb.width) / 2, 
    	windowHeight / 2 - 0 - (2.5 * p4.height));
    
    p5.position((windowWidth - InductanceFilterCoefficient.width) / 2, 
    	windowHeight / 2 + 70 - (2.5 * p5.height));
    
    p6.position((windowWidth - TransducerInputWidebandGainDb.width) / 2, 
    	windowHeight / 2 + 140 - (2.5 * p6.height));
  
    textBoxResFreq.position((windowWidth + ResonantFrequencyHz.width) / 2 +10 , windowHeight / 2 - 210);
    textBoxResFreq.size(50);
  
    ResonantFrequencyHz.input(sliderChange);
  
    buttonResFreq.position(textBoxResFreq.x + textBoxResFreq.width+10, textBoxResFreq.y);
    buttonResFreq.mousePressed(updateValue);
    
    textBoxResFreq.value(ResonantFrequencyHz.value());
  
    valueDisplayerResFreq = createP();
    valueDisplayerResFreq.position(30,height-50);
    
    //
    textBoxResPeak.position((windowWidth + ResonancePeakGainDb.width) / 2 +10 , windowHeight / 2 - 140);
    textBoxResPeak.size(50);
  
    ResonancePeakGainDb.input(sliderChange);
  
    buttonResPeak.position(textBoxResPeak.x + textBoxResPeak.width+10, textBoxResPeak.y);
    buttonResPeak.mousePressed(updateValue);
    
    textBoxResPeak.value(ResonancePeakGainDb.value());
  
    valueDisplayerResPeak = createP();
    valueDisplayerResPeak.position(30,height-50);
    
    //
    textBoxResQ.position((windowWidth + ResonanceQ.width) / 2 +10 , windowHeight / 2 - 70);
    textBoxResQ.size(50);
  
    ResonanceQ.input(sliderChange);
  
    buttonResQ.position(textBoxResQ.x + textBoxResQ.width+10, textBoxResQ.y);
    buttonResQ.mousePressed(updateValue);
    
    textBoxResQ.value(ResonanceQ.value());
  
    valueDisplayerResQ = createP();
    valueDisplayerResQ.position(30,height-50);
    
    //
    textBoxResTone.position((windowWidth + ResonanceToneLevelDb.width) / 2 +10 , windowHeight / 2);
    textBoxResTone.size(50);
  
    ResonanceToneLevelDb.input(sliderChange);
  
    buttonResTone.position(textBoxResTone.x + textBoxResTone.width+10, textBoxResTone.y);
    buttonResTone.mousePressed(updateValue);
    
    textBoxResTone.value(ResonanceToneLevelDb.value());
  
    valueDisplayerResTone = createP();
    valueDisplayerResTone.position(30,height-50);
    
    //
    textBoxInduct.position((windowWidth + InductanceFilterCoefficient.width) / 2 +10 , windowHeight / 2 + 70);
    textBoxInduct.size(50);
  
    InductanceFilterCoefficient.input(sliderChange);
  
    buttonInduct.position(textBoxInduct.x + textBoxInduct.width+10, textBoxInduct.y);
    buttonInduct.mousePressed(updateValue);
    
    textBoxInduct.value(InductanceFilterCoefficient.value());
  
    valueDisplayerInduct = createP();
    valueDisplayerInduct.position(30,height-50);
    
    //
    textBoxTransGain.position((windowWidth + TransducerInputWidebandGainDb.width) / 2 +10 , windowHeight / 2 + 140);
    textBoxTransGain.size(50);
  
    TransducerInputWidebandGainDb.input(sliderChange);
  
    buttonTransGain.position(textBoxTransGain.x + textBoxTransGain.width+10, textBoxTransGain.y);
    buttonTransGain.mousePressed(updateValue);
    
    textBoxTransGain.value(TransducerInputWidebandGainDb.value());
  
    valueDisplayerTransGain = createP();
    valueDisplayerTransGain.position(30,height-50);
	
}

function updateValue(){
	//if the textbox is updated, update the slider
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