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
#include "StringWaveguide/String.h"
#include "audio-utils/au_RectangularWave.h"
#include "audio-utils/au_Biquad.h"

Scope scope;

TransducerFeedbackCancellation transducer_processing;

String string;

RectangularWave pulse_train;

Biquad smoothing;


bool setup(BelaContext *context, void *userData)
{

	TransducerFeedbackCancellation::Setup processing_setup;
	processing_setup.resonant_frequency_hz = 380.0;
	processing_setup.resonance_peak_gain_db = 23.5;
	processing_setup.resonance_q = 16.0;
	processing_setup.resonance_tone_level_db = -10.0;
	processing_setup.inductance_filter_coefficient = 0.5;
	processing_setup.transducer_input_wideband_gain_db = 0.0;
	processing_setup.sample_rate_hz = context->audioSampleRate;
	
	transducer_processing.setup(processing_setup);
	
	scope.setup(3, context->audioSampleRate);
	
	string.setFrequency(380.0);
	
	RectangularWave::Setup pulse_setup;
	pulse_setup.sample_rate_hz = context->audioSampleRate;
	pulse_setup.frequency_hz = 380.0;
	pulse_setup.duty_cycle = 0.01;
	
	pulse_train.setup(pulse_setup);
	
	
	Biquad::FilterSetup smoothing_setup;
	smoothing_setup.sample_rate_hz = context->audioSampleRate;
    smoothing_setup.cutoff_freq_hz = 300.0;
    smoothing_setup.quality_factor = 0.7;
    smoothing_setup.filter_gain_db = 0.0;
    smoothing_setup.filter_type = Biquad::FilterType::LOWPASS;
    smoothing.setup(smoothing_setup);
	
	return true;
}

void render(BelaContext *context, void *userData)
{
	for(unsigned int n = 0; n < context->audioFrames; ++n)
	{
		float randnum = (float) (rand() / (RAND_MAX / 2.0)) - 1.0;
		TransducerFeedbackCancellation::UnprocessedSamples unprocessed;
		unprocessed.output_to_transducer = audioRead(context, n, 2);
		unprocessed.input_from_transducer = audioRead(context, n, 0);
		unprocessed.reference_input_loopback = audioRead(context, n, 1);
		
		TransducerFeedbackCancellation::ProcessedSamples processed = transducer_processing.process(unprocessed);
		
		
		

		// audioWrite(context, n, 0, processed.output_to_transducer * 0.2);
		// audioWrite(context, n, 1, processed.output_to_transducer * 0.2);
		// audioWrite(context, n, 2, processed.input_feedback_removed);
		
		
		

		audioWrite(context, n, 0, processed.output_to_transducer * 0.1 );
		audioWrite(context, n, 1, processed.output_to_transducer * 0.1 );
		
		float rectified = smoothing.process(fabs(processed.input_feedback_removed));
		float modulated_p_train = rectified * (1 + (0.5 * pulse_train.process()));
		float audio_output = string.update(modulated_p_train) * 0.2;
		audioWrite(context, n, 2, audio_output);
		
		scope.log(processed.transducer_return_with_gain_applied, processed.modelled_signal, processed.input_feedback_removed);
		
		
		

	}
}

void cleanup(BelaContext *context, void *userData)
{
}

