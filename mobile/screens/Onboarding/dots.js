import { View } from 'react-native';


export const Square = ({ isLight, selected }) => {
    let backgroundColor;
    if (isLight) {
        backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
    } else {
        backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
    }
    return (
        <View
            style={{
                width: 6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor,
            }}
        />
    );
};

export const Pill = ({ isLight, selected }) => {
    let backgroundColor;
    let width = selected ? 8 : 6;
    if (isLight) {
        backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
    } else {
        backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
    }
    return (
        <View
            style={{
                width,
                height: 6,
                marginHorizontal: 3,
                borderRadius: 3,
                backgroundColor,
            }}
        />
    );
}
