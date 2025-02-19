import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { Done, Next, Skip } from './actions';
import { Pill } from './dots';

const OnboardingComponent = () => {
    const navigation = useNavigation();

    return (
        <Onboarding
            titleStyles={{ color: 'blue' }}
            DotComponent={Pill}
            NextButtonComponent={Next}
            SkipButtonComponent={Skip}
            DoneButtonComponent={Done}
            onSkip={() => navigation.navigate('DefaultNav')}
            onDone={() => navigation.navigate('DefaultNav')}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image />,
                    title: 'Onboarding',
                    subtitle: 'Done with React Native Onboarding Swiper',
                    titleStyles: { color: 'red' },
                },
                {
                    backgroundColor: '#fe6e58',
                    image: <Image />,
                    title: 'The Title',
                    subtitle: 'This is the subtitle that sumplements the title.',
                },
                {
                    backgroundColor: '#999',
                    image: <Image />,
                    title: 'Triangle',
                    subtitle: "Beautiful, isn't it?",
                },
            ]}
        />
    )
};

export default OnboardingComponent;