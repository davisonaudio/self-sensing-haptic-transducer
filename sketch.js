/*

17/06/24

!! Problems:
    n/a

*/



//buffer to send to Bela. 6 elements: 6 sliders
let buffer = [380.0,18.0,16.0,-30.0,0.5,0.0, 0.0,0];


function setup() {
    // createCanvas(WW, WH);
    // background(200);
    //Create 6 sliders for each of the 6 variables
    ResonantFrequencyHz = createSlider(Math.log10(10), Math.log10(1000), Math.log10(100),0.001);
    ResonancePeakGainDb = createSlider(0, 30, 23.5,0.001);
    ResonanceQ = createSlider(0.5,30,16.0,0.001);
    ResonanceToneLevelDb = createSlider(-90,0,-10,0.001);
    InductanceFilterCoefficient = createSlider(0,1,0.5,0.001);
    TransducerInputWidebandGainDb = createSlider(-30,30,0,0.001);
    OscillatorFrequencyHz = createSlider(1,4, 0,0.001);
    //Create noise checkbox
    NoiseCheckbox = createCheckbox(' Noise:');
    //Text
    p1 = createP("Resonant Frequency Hz:");
    p2 = createP("Resonance Peak Gain Db:");
    p3 = createP("Resonance Q:");
    p4 = createP("Resonance Tone Level Db:");
    p5 = createP("Inductance Filter Coefficient:");
    p6 = createP("Transducer Input Wideband Gain Db:");
    p7 = createP("Oscillator Frequency Hz:");
    //Input textboxes
    textBoxResFreq = createInput('');
    textBoxResPeak = createInput('');
    textBoxResQ = createInput('');
    textBoxResTone = createInput('');
    textBoxInduct = createInput('');
    textBoxTransGain = createInput('');
    textBoxOscFreq = createInput('');
    //This function will format colors and positions of the DOM elements
    formatDOMElements();

}


function draw() {
    // Retrieve the data being sent from render.cpp
    let LevelMeter_value = Bela.data.buffers[0];            // the value between 0 and +1
    let WH = windowHeight;

    if (LevelMeter_value <= 1 && LevelMeter_value >= -1) {
        clear();
        let c2 = color(0);  //black
        // the bar that rises
        fill(c2);
        rectMode(CORNERS)
        rect(200 + windowWidth/3 + 100,                             // bottom left corner x value
            WH - 100,                                       // bottom left corner y value
            100 + (200 + windowWidth/3 + 100),                      // top right corner x value
            WH - (100 * (LevelMeter_value + 1)) - 100);         // top right corner y value

        let c1 = color(200); // grey
        fill(c1);
        rectMode(CORNERS)
        rect(200 + windowWidth/3 + 100,                             // same corners as above
            WH - (100 * (LevelMeter_value + 1) + 100),
            100 + (200 + windowWidth/3 + 100),
            100);
    }
    else {
        clear();
    }

    //store values in the buffer
    buffer[0] = textBoxResFreq.value();
    buffer[1] = ResonancePeakGainDb.value();
    buffer[2] = ResonanceQ.value();
    buffer[3] = ResonanceToneLevelDb.value();
    buffer[4] = InductanceFilterCoefficient.value();
    buffer[5] = TransducerInputWidebandGainDb.value();
    buffer[6] = textBoxOscFreq.value();

    if (NoiseCheckbox.checked()) {
        buffer[7] = 1;
    }
    else {
        buffer[7] = 0;
    }

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
    ResonantFrequencyHz.size(WW / 3);                                       //Sets the slider size to 1/3 the size of the window
    ResonantFrequencyHz.position(slider_width,                      // set the slider to the right of the
        WH / 2 - 210);                                  //Sets the slider vertically

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

    OscillatorFrequencyHz.size(WW / 3);
    OscillatorFrequencyHz.position(slider_width,
        WH / 2 + 210);

    // Format noise checkbox 
    NoiseCheckbox.position(slider_width,       // located to the same x as the slider
        (WH / 2) - (-260)); 

    // Format Text repeated x6
    p1.position(slider_width,       // located to the same x as the slider
        (WH / 2) - (210 + 40));                 // located 40 above the slider
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
    p7.position(slider_width,
        (WH / 2) - (-210 + 40));

    // Sorts positions of textbox and button
    // if textbox is imputted changes slider and vice-versa see functions updateValue() and sliderChange()
    textBoxResFreq.position(text_width,     // positions textbox to the left of the slider
        WH / 2 - 210);
        // Positions textbox at the same height as the slider
    textBoxResFreq.size(50);
    ResonantFrequencyHz.input(sliderChange);
    textBoxResFreq.value(pow(10,ResonantFrequencyHz.value()));
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
    // repeat for OscillatorFrequencyHz
    textBoxOscFreq.position(text_width,
        WH / 2 + 210);
    textBoxOscFreq.size(50);
    OscillatorFrequencyHz.input(sliderChange);
    textBoxOscFreq.value(pow(10,OscillatorFrequencyHz.value()));
    valueOscillatorFreq = createP();
    valueOscillatorFreq.position(30,height-50);
}

function keyPressed() {
  if (keyCode === ENTER) {
    updateValue();
  }
}

function updateValue(){
    //if the textbox is updated, update all the sliders
    ResonantFrequencyHz.value(Math.log10(textBoxResFreq.value()));
    ResonancePeakGainDb.value(textBoxResPeak.value());
    ResonanceQ.value(textBoxResQ.value());
    ResonanceToneLevelDb.value(textBoxResTone.value());
    InductanceFilterCoefficient.value(textBoxInduct.value());
    TransducerInputWidebandGainDb.value(textBoxTransGain.value());
    OscillatorFrequencyHz.value(Math.log10(textBoxOscFreq.value()));
}

function sliderChange(){
    //if the slider is changed, update the textbox
    textBoxResFreq.value(pow(10,ResonantFrequencyHz.value()));
    textBoxResPeak.value(ResonancePeakGainDb.value());
    textBoxResQ.value(ResonanceQ.value());
    textBoxResTone.value(ResonanceToneLevelDb.value());
    textBoxInduct.value(InductanceFilterCoefficient.value());
    textBoxTransGain.value(TransducerInputWidebandGainDb.value());
    textBoxOscFreq.value(pow(10,OscillatorFrequencyHz.value()));
}
