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

Scope scope;

TransducerFeedbackCancellation transducer_processing;


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
		
		scope.log(processed.transducer_return_with_gain_applied, processed.modelled_signal, processed.input_feedback_removed);
		
		
		

	}
}

void cleanup(BelaContext *context, void *userData)
{
}

