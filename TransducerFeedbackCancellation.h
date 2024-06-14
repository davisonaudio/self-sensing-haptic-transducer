/*
 
TransducerFeedbackCancellation.h
 
Author: Matt Davison
Date: 05/03/2024
 
*/
 
#pragma once
 
#include "audio-utils/au_Biquad.h"
#include "audio-utils/au_Onepole.h"
#include "audio-utils/au_ToneGenerator.h"
 
 
class TransducerFeedbackCancellation
{
public:
    enum class AmplifierType
    {
        CURRENT_DRIVE,
        VOLTAGE_DRIVE
    };
 
    struct Setup
    {
        sample_t resonant_frequency_hz;
        sample_t resonance_peak_gain_db;
        sample_t resonance_q;
        sample_t resonance_tone_level_db;
        sample_t inductance_filter_coefficient;
        sample_t transducer_input_wideband_gain_db;
 
        sample_t sample_rate_hz;
        AmplifierType amplifier_type;
    };
 
    void setResonantFrequencyHz(sample_t resonant_frequency_hz);
    void setResonancePeakGainDb(sample_t resonance_peak_gain_db);
    void setResonanceQ(sample_t resonance_q);
    void setResonanceToneLevelDb(sample_t resonance_tone_level_db);
    void setInductanceFilterCoefficient(sample_t inductance_filter_coefficient);
    void setTransducerInputWidebandGainDb(sample_t transducer_input_wideband_gain_db);
 
    struct UnprocessedSamples
    {
        sample_t output_to_transducer;
        sample_t input_from_transducer;
        sample_t reference_input_loopback;
    };
 
    struct ProcessedSamples
    {
        sample_t input_feedback_removed;
        sample_t output_to_transducer;
        sample_t modelled_signal;
        sample_t transducer_return_with_gain_applied;
    };
 
 
    void setup(Setup setup_parameters);
 
    ProcessedSamples process(UnprocessedSamples unprocessed);
 
private:
 
    Biquad m_resonance_filter;
    Onepole m_series_inductance_filter;
    ToneGenerator m_resonance_tone;
    sample_t m_transducer_input_wideband_gain_lin;
 
    sample_t applyTransducerModelFilter(sample_t input_sample);
};
 
/*
* Implementation of methods
*/
 
 
void TransducerFeedbackCancellation::setResonantFrequencyHz(sample_t resonant_frequency_hz)
{
    //m_resonance_filter.setCutoff(resonant_frequency_hz);
    m_resonance_tone.setFrequency(resonant_frequency_hz);
}
 
void TransducerFeedbackCancellation::setResonancePeakGainDb(sample_t resonance_peak_gain_db)
{
    m_resonance_filter.setFilterGain(resonance_peak_gain_db);  
}
 
void TransducerFeedbackCancellation::setResonanceQ(sample_t resonance_q)
{
    m_resonance_filter.setQ(resonance_q);
}
 
void TransducerFeedbackCancellation::setResonanceToneLevelDb(sample_t resonance_tone_level_db)
{
    m_resonance_tone.setLeveldB(resonance_tone_level_db);
}
void TransducerFeedbackCancellation::setInductanceFilterCoefficient(sample_t inductance_filter_coefficient)\
{
    m_series_inductance_filter.setB1(inductance_filter_coefficient);
}
 
void TransducerFeedbackCancellation::setTransducerInputWidebandGainDb(sample_t transducer_input_wideband_gain_db)
{
    m_transducer_input_wideband_gain_lin = dBToLin(transducer_input_wideband_gain_db);
}
 
 
void TransducerFeedbackCancellation::setup(Setup setup_parameters)
{
    //Setup of transducer resonance modelling filter, using peak biquad
    Biquad::FilterSetup resonance_filter_setup;
    resonance_filter_setup.cutoff_freq_hz = setup_parameters.resonant_frequency_hz;
    resonance_filter_setup.filter_gain_db = setup_parameters.resonance_peak_gain_db;
    resonance_filter_setup.quality_factor = setup_parameters.resonance_q;
    resonance_filter_setup.sample_rate_hz = setup_parameters.sample_rate_hz;
    resonance_filter_setup.filter_type = Biquad::FilterType::PEAK;
 
    m_resonance_filter.setup(resonance_filter_setup);
 
    //Setup of series inductance modelling filter (causes rise in impedance at HF) using onepole filter
    m_series_inductance_filter.setB1(setup_parameters.inductance_filter_coefficient);
 
    m_transducer_input_wideband_gain_lin = dBToLin(setup_parameters.transducer_input_wideband_gain_db);
 
    //Setup of tone generator
    m_resonance_tone.setFrequency(setup_parameters.resonant_frequency_hz);
    m_resonance_tone.setSampleRate(setup_parameters.sample_rate_hz);
    m_resonance_tone.setLeveldB(setup_parameters.resonance_tone_level_db);
 
}
 
TransducerFeedbackCancellation::ProcessedSamples TransducerFeedbackCancellation::process(UnprocessedSamples unprocessed)
{
    ProcessedSamples processed;
 
    //Process input from transducer
    processed.modelled_signal = applyTransducerModelFilter(unprocessed.reference_input_loopback);
     
    if (processed.modelled_signal != processed.modelled_signal)
    {
    	rt_printf("MODELLED SIGNAL NAN\n");
    }
    processed.transducer_return_with_gain_applied = m_transducer_input_wideband_gain_lin * unprocessed.input_from_transducer;
    
    
    if (processed.transducer_return_with_gain_applied != processed.transducer_return_with_gain_applied)
    {
    	rt_printf("GAIN APPLIED SIGNAL NAN\n");
    }
    processed.input_feedback_removed = processed.transducer_return_with_gain_applied - processed.modelled_signal;
   
    if (isnan(processed.input_feedback_removed))
    {
    	rt_printf("FEEDBACK REMOVED SIGNAL NAN\n");
    }
 
    //Process output to transducer
    processed.output_to_transducer = unprocessed.output_to_transducer + m_resonance_tone.process();
    if (processed.output_to_transducer != processed.output_to_transducer)
    {
    	rt_printf("OUTPUT TO TRANSDUCER SIGNAL NAN\n");
    }
 
    return processed;
}
 
sample_t TransducerFeedbackCancellation::applyTransducerModelFilter(sample_t input_sample)
{
    sample_t output = m_resonance_filter.process(input_sample);
    
    output = m_series_inductance_filter.process(output);
    return output;
}