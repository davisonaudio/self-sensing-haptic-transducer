/*
 
ForceSensing.h
 
Author: Matt Davison
Date: 14/06/2024
 
*/

#pragma once

#include "audio-utils/au_GoertzelAlgorithm.h"

class ForceSensing
{
public:

private:

    RealtimeGoertzel m_actuation_signal_goertzel;
    RealtimeGoertzel m_sensed_signal_goertzel;

};