import { directions } from '@/shared/constants';
import type { Cell, Point } from '@/shared/types';
import { CellState } from '@/shared/types';
import { getCellId } from '@/shared/utils/grid';

type ExpandProps = {
    grid: Cell[][];
    queue: Point[];
    parent: Map<string, Point>;
    incrementFront: () => number;
    seen: boolean[];
    otherSeen: boolean[];
};

export const expand = ({
    queue,
    parent,
    incrementFront,
    seen,
    otherSeen,
    grid,
}: ExpandProps) => {
    const sizeR = grid.length;
    const sizeC = grid[0].length;
    const { row, col } = queue[incrementFront()];
    const cell = grid[row][col];
    
    if (otherSeen[getCellId({ row, col, sizeC })]) {
        if (cell.state !== CellState.START && cell.state !== CellState.END) {
            cell.state = CellState.MEETING_POINT;
        }

        return { row, col };
    }

    if (cell.state !== CellState.START && cell.state !== CellState.END) {
        cell.state = CellState.VISITED;
    }

    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        const nk = getCellId({ row: nr, col: nc, sizeC });

        if (
            nr >= 0 &&
            nr < sizeR &&
            nc >= 0 &&
            nc < sizeC &&
            !seen[nk] &&
            grid[nr][nc].state !== CellState.WALL
        ) {
            const neighborCell = grid[nr][nc];
            neighborCell.distance = (cell.distance as number) + 1;
            parent.set(`${nr} ${nc}`, { row, col });

            if (
                neighborCell.state !== CellState.START &&
                neighborCell.state !== CellState.END
            ) {
                neighborCell.state = CellState.QUEUE;
            }

            queue.push({ row: nr, col: nc });
            seen[nk] = true;
        }
    }

    return null;
};
