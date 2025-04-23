export type GetStartEndPositionsProps = {
    sizeR: number;
    sizeC: number;
    gap: number;
};

export const getStartEndPositions = ({ sizeR, sizeC, gap }: GetStartEndPositionsProps) => {
    if (sizeR <= 0 && sizeC <= 0) {
        return {
            start: null,
            end: null,
        };
    }

    const safeGap = Math.min(gap, sizeC - 1);
    const midRow = sizeR >> 1;
    const midCol = sizeC >> 1;
    const startCol = midCol - (safeGap >> 1);
    const endCol = midCol + (safeGap >> 1);

    return {
        start: { row: midRow, col: startCol },
        end: { row: midRow, col: endCol },
    };
};
