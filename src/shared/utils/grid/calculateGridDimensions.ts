export type CalculateGridDimensionsProps = {
    sizeR: number;
    sizeC: number;
    containerWidth: number;
    containerHeight: number;
};

export const calculateGridDimensions = ({ containerWidth, containerHeight, sizeR, sizeC }: CalculateGridDimensionsProps) => {
    const padding = 0; // change from 10 to 0 to maximize space
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    // calculate optimal cell size to keep cells square
    const cellSizeByWidth = availableWidth / sizeC;
    const cellSizeByHeight = availableHeight / sizeR;
    const maxCellSize = 30;
    const newCellSize = Math.min(cellSizeByWidth, cellSizeByHeight, maxCellSize);

    // calculate how many cells can fit
    const possibleCols = Math.floor(availableWidth / newCellSize);
    const possibleRows = Math.floor(availableHeight / newCellSize);

    // ensure minimum grid size
    const minRows = 5;
    const minCols = 5;
    const newRows = Math.max(minRows, possibleRows);
    const newCols = Math.max(minCols, possibleCols);

    return {
        calculatedR: newRows,
        calculatedC: newCols,
        calculatedCellSize: newCellSize,
    };
};
