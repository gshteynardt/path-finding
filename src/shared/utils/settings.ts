export const getSpeedLabel = (speed: number) => {
    switch (true) {
        case speed <= 25: {
            return 'Slow';
        }
        case speed <= 75: {
            return 'Normal';
        }
        case speed <= 125: {
            return 'Fast';
        }
        case speed <= 175: {
            return 'Very Fast';
        }

        default: {
            return 'Ultra Fast';
        }
    }
};
