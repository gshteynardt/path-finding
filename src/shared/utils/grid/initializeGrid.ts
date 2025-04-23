import type { Point, Cell } from '@/shared/types';
import { CellState } from '@/shared/types';

export type InitializeGridProps = {
    sizeR: number;
    sizeC: number;
    start: Point;
    end: Point;
};

export const initializeGrid = ({ sizeR, sizeC, start, end }: InitializeGridProps) => {
    const grid: Cell[][] = [];
    const INF = sizeR * sizeC;

    for (let r = 0; r < sizeR; r++) {
        const row: Cell[] = [];

        for (let c = 0; c < sizeC; c++) {
            let state = CellState.EMPTY;

            if (r === start.row && c === start.col) {
                state = CellState.START;
            } else if (r === end.row && c === end.col) {
                state = CellState.END;
            }

            row.push({
                row: r,
                col: c,
                state,
                distance: INF,
                parent: null,
            });
        }

        grid.push(row);
    }

    return grid;
};
