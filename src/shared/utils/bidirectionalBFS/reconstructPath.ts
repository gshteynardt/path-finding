import type { Grid, Point } from '@/shared/types';

export type ReconstructPathProps = {
    end: Point;
    start: Point;
    grid: Grid;
    meetingCell: Point;
    parentStart: Map<string, Point>;
    parentEnd: Map<string, Point>;
};

export const reconstructPath = ({
    start,
    end,
    meetingCell,
    parentStart,
    parentEnd,
}: ReconstructPathProps) => {
    const pathToStart: Point[] = [];
    let current = { ...meetingCell };

    if (!(current.row === start.row && current.col === start.col)) {
        pathToStart.push(current);
    }

    while (!(current.row === start.row && current.col === start.col)) {
        const key = `${current.row} ${current.col}`
        const parentCell = parentStart.get(key);

        if (!parentCell) {
            console.error(
                'Path reconstruction error: cell has no parent from start',
                current,
            );
            break;
        }

        current = parentCell;

        if (!(current.row === start.row && current.col === start.col)) {
            pathToStart.push(current);
        }
    }

    const pathToEnd: Point[] = [];
    current = { ...meetingCell };

    while (!(current.row === end.row && current.col === end.col)) {
        const key = `${current.row} ${current.col}`
        const parentCell = parentEnd.get(key);

        if (!parentCell) {
            console.error(
                'Path reconstruction error: cell has no parent from end',
                current,
            );
            break;
        }

        current = parentCell;

        if (!(current.row === end.row && current.col === end.col)) {
            pathToEnd.push(current);
        }
    }

    return { pathToStart, pathToEnd };
};
