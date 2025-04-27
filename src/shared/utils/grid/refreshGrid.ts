import { CellState, type Grid } from '@/shared/types';

export const refreshGrid = (grid: Grid, INF: number) => {
    const newGrid = grid.map((row) =>
        row.map((cell) => {
            if (
                cell.state === CellState.WALL ||
                cell.state === CellState.START ||
                cell.state === CellState.END
            ) {
                return {
                    ...cell,
                    distance: cell.state === CellState.START ? 0 : INF,
                    parent: null,
                };
            }

            return {
                ...cell,
                state: CellState.EMPTY,
                distance: INF,
                parent: null,
            };
        }),
    );

    return newGrid;
};
