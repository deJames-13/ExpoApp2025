
import { Button } from 'react-native-paper';


const backgroundColor = isLight => (isLight ? 'blue' : 'lightblue');
const color = isLight => backgroundColor(!isLight);

export const Done = ({ isLight, ...props }) => {

    return (
        <Button
            mode='text'
            {...props}
            color={color(isLight)}
        >
            Done
        </Button>
    );
};

export const Skip = ({ isLight, skipLabel, ...props }) => {

    return (
        <Button
            mode='text'
            {...props}
            color={color(isLight)}
        >
            {skipLabel ?? 'Skip'}
        </Button>
    );
};

export const Next = ({ isLight, nextLabel, ...props }) => {

    return (
        <Button
            mode='text'
            {...props}
            color={color(isLight)}
        >
            {nextLabel ?? 'Next'}
        </Button>
    );
};