/*
____  _____ _        _
| __ )| ____| |      / \
|  _ \|  _| | |     / _ \
| |_) | |___| |___ / ___ \
|____/|_____|_____/_/   \_\
http://bela.io
*/
/**
 
*/
 
#include <Bela.h>
#include <stdexcept>
#include <libraries/Scope/Scope.h>
#include <cstdlib>
#include "TransducerFeedbackCancellation.h"
#include "audio-utils/au_Biquad.h"
#include <libraries/Gui/Gui.h>
#include "audio-utils/au_config.h"
#include <cmath>

#define DEBUG_METER_DATA 0

//Audio input channel definitions 
#define INPUT_LOOPBACK_PIN 6
#define INPUT_VOLTAGE_PIN 2
#define INPUT_ACTUATION_SIGNAL_PIN 0
#define OUTPUT_AMP_PIN 2
#define OUTPUT_LOOPBACK_PIN 6
#define OUTPUT_PICKUP_SIGNAL_PIN 4
 
#define RESONANT_FREQ_HZ 380.0
 
Scope scope;
Gui gui; 
TransducerFeedbackCancellation transducer_processing;
 
 
Biquad meter_filter;
 
 
bool setup(BelaContext *context, void *userData)
{
	//Setup the feedback cancellation class initial parameters
	TransducerFeedbackCancellation::Setup processing_setup;
	processing_setup.resonant_frequency_hz = RESONANT_FREQ_HZ;
	processing_setup.resonance_peak_gain_db = 23.5;
	processing_setup.resonance_q = 16.0;
	processing_setup.resonance_tone_level_db = -10.0;
	processing_setup.inductance_filter_coefficient = 0.5;
	processing_setup.transducer_input_wideband_gain_db = 0.0;
	processing_setup.sample_rate_hz = context->audioSampleRate;
	transducer_processing.setup(processing_setup);

	//Setup the biquad parameters for meter filtering
	Biquad::FilterSetup metering_lowpass_setup;
	metering_lowpass_setup.cutoff_freq_hz = 25;
	metering_lowpass_setup.filter_gain_db = 0;
	metering_lowpass_setup.quality_factor = 0.5;
	metering_lowpass_setup.sample_rate_hz = context->audioSampleRate;
	metering_lowpass_setup.filter_type = Biquad::FilterType::LOWPASS;
	meter_filter.setup(metering_lowpass_setup);


	scope.setup(3, context->audioSampleRate);
 
	// Set up the GUI
	gui.setup(context->projectName);

	//Set the buffer to receive from the GUI
	gui.setBuffer('f', 3);

	return true;
}
 
void render(BelaContext *context, void *userData)
{
	static int sample_count = 0;
	//DataBuffer storred in 'buffer'
	DataBuffer & buffer = gui.getDataBuffer(0);
	// Retrieve contents of the buffer as floats
	float * data = buffer.getAsFloat();
 
	// values from sliders in Gui are storred in array data[]
	transducer_processing.setResonantFrequencyHz(data[0]);
	transducer_processing.setResonancePeakGainDb(data[1]);
	transducer_processing.setResonanceQ(data[2]);
	transducer_processing.setResonanceToneLevelDb(data[3]);
	transducer_processing.setInductanceFilterCoefficient(data[4]);
	transducer_processing.setTransducerInputWidebandGainDb(data[5]);
	TransducerFeedbackCancellation::UnprocessedSamples unprocessed;
	TransducerFeedbackCancellation::ProcessedSamples processed = transducer_processing.process(unprocessed);

 
	for(unsigned int n = 0; n < context->audioFrames; ++n)
	{
		float randnum = (float) (rand() / (RAND_MAX / 2.0)) - 1.0;
		// TransducerFeedbackCancellation::UnprocessedSamples unprocessed;
		unprocessed.output_to_transducer = audioRead(context, n, INPUT_ACTUATION_SIGNAL_PIN);
		unprocessed.input_from_transducer = audioRead(context, n, INPUT_VOLTAGE_PIN);
		unprocessed.reference_input_loopback = audioRead(context, n, INPUT_LOOPBACK_PIN);
		// TransducerFeedbackCancellation::ProcessedSamples processed = transducer_processing.process(unprocessed);

 
		// audioWrite(context, n, 0, processed.output_to_transducer * 0.2);
		// audioWrite(context, n, 1, processed.output_to_transducer * 0.2);
		// audioWrite(context, n, 2, processed.input_feedback_removed);
 
		audioWrite(context, n, OUTPUT_AMP_PIN, processed.output_to_transducer * 0.1 );
		audioWrite(context, n, OUTPUT_LOOPBACK_PIN, processed.output_to_transducer * 0.1 );
		scope.log(processed.transducer_return_with_gain_applied, processed.modelled_signal, processed.input_feedback_removed);
		// rectifies the input signal
		sample_t input_feedback_removed_rectified = abs(processed.input_feedback_removed);	
		sample_t input_feedback_removed_rectified_lowpass = meter_filter.process(input_feedback_removed_rectified);
		sample_count ++;

		if (sample_count % 100 == 0) {
			// sketch.js is implemenmted to create bar fropm a value from 0 - 1
			gui.sendBuffer(0, map(input_feedback_removed_rectified_lowpass, 0, 2.3, 0, 1));
#if DEBUG_METER_DATA
			rt_printf("%lf \n", input_feedback_removed_rectified_lowpass);
#endif
		}
	}
}
 
void cleanup(BelaContext *context, void *userData)
{
}