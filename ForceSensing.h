/*
 
ForceSensing.h
 
Author: Matt Davison
Date: 14/06/2024
 
*/

#pragma once

#include "audio-utils/au_GoertzelAlgorithm.h"
#include "audio-utils/au_Windowing.h"

class ForceSensing
{
public:

    void setup();
    void setResonantFrequencyHz(sample_t resonant_freq_hz);

    void process(sample_t actuation_sample, sample_t sensed_sample);

    sample_t getDamping();

    /* 
     * This function should be called when the transducer is damped. it stores the last raw val as the calibration value
     * Note: make sure at least 1 window length has passed with the actuator damped before calling this function
     * Also ensure that there is a tone at the resonant frequency, at the required signal level, before calibrating.
     */
    void calibrateDamped();

    /* 
     * This function should be called when the transducer is undamped. it stores the last raw val as the calibration value
     * Note: make sure at least 1 window length has passed with the actuator undamped before calling this function
     * Also ensure that there is a tone at the resonant frequency, at the required signal level, before calibrating.
     */
    void calibrateUndamped();

    virtual void endOfWindow(){}

private:

    RealtimeGoertzel m_actuation_signal_goertzel;
    RealtimeGoertzel m_sensed_signal_goertzel;

    Windowing m_actuation_signal_window;
    Windowing m_sensing_signal_window;

    /*
     * Returns a normalised floating point value of the damping where 1 = undamped, 0 = damped
     * Note: damped & undamped calibration methods must be called first, otherwise this function won't do anything useful
     */
    sample_t mapRawValue(sample_t raw_val);

    sample_t m_undamped_calibration_val;
    sample_t m_damped_calibration_val;

    sample_t m_last_raw_difference_val;

};


/*
 * ForceSensing Implementation
 */
void ForceSensing::setResonantFrequencyHz(sample_t resonant_freq_hz)
{
    m_actuation_signal_goertzel.setTargetFrequencyHz(resonant_freq_hz);
    m_sensed_signal_goertzel.setTargetFrequencyHz(resonant_freq_hz);

    m_actuation_signal_window.setWindowSizeSamples(m_actuation_signal_goertzel.getWindowLengthSamples());
    m_sensing_signal_window.setWindowSizeSamples(m_sensed_signal_goertzel.getWindowLengthSamples());

    m_actuation_signal_goertzel.reset();
    m_sensed_signal_goertzel.reset();
}

void ForceSensing::process(sample_t actuation_sample, sample_t sensed_sample)
{
    //Apply window to signals & feed into Goertzel
    m_actuation_signal_goertzel.processSample(m_actuation_signal_window.applyWindowToSample(actuation_sample));
    m_sensed_signal_goertzel.processSample(m_sensing_signal_window.applyWindowToSample(sensed_sample));
    if (m_actuation_signal_goertzel.checkNewValFlag())
    {
        m_last_raw_difference_val = m_actuation_signal_goertzel.getLastMagnitude() - m_sensed_signal_goertzel.getLastMagnitude();
    }
}

sample_t ForceSensing::getDamping()
{
    return mapRawValue(m_last_raw_difference_val);
}

void ForceSensing::calibrateUndamped()
{
    m_undamped_calibration_val = m_last_raw_difference_val;
}

void ForceSensing::calibrateDamped()
{
    m_damped_calibration_val = m_last_raw_difference_val;
}

sample_t ForceSensing::mapRawValue(sample_t raw_val)
{
    sample_t value_range = m_undamped_calibration_val - m_damped_calibration_val;
    return (raw_val - m_damped_calibration_val) * value_range;
}