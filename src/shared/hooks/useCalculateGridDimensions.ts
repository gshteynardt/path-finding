import { useState, useEffect, useMemo, useRef } from 'react';

import { calculateGridDimensions, getStartEndPositions } from '@/shared/utils';
import { GridState } from '@/shared/types';

type GridSizes = {
    sizeR: number;
    sizeC: number;
};

const baseCellSize = 30;

type ToggleGridState = (state: GridState) => void;

export const useCalculateGridDimensions = (toggleGridState: ToggleGridState) => {
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState(baseCellSize);

    const [sizes, setSizes] = useState<GridSizes>({
        sizeR: 20,
        sizeC: 10,
    });

    const startEndPositions = useMemo(() => {
        return getStartEndPositions({ ...sizes, gap: 10 });
    }, [sizes]);

    useEffect(() => {
        toggleGridState(GridState.MEASURING);

        const container = gridContainerRef.current;

        if (!container) {
            toggleGridState(GridState.MEASURED);
            return;
        }

        const updateDimensions = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const { calculatedR, calculatedC, calculatedCellSize } = calculateGridDimensions({
                    containerWidth,
                    containerHeight,
                    ...sizes,
                });

            setCellSize(calculatedCellSize);

            setSizes((prev) => {
                if (prev.sizeR === calculatedR && prev.sizeC === calculatedC) {
                    return prev;
                }

                return { sizeR: calculatedR, sizeC: calculatedC };
            });

            toggleGridState(GridState.MEASURED);
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };

    }, [toggleGridState]);

    return {
        gridContainerRef,
        cellSize,
        ...sizes,
        ...startEndPositions,
    };
};
