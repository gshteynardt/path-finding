import { useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';

import { useCalculateGridDimensions } from '@/shared/hooks/useCalculateGridDimensions';
import { initializeGrid } from '@/shared/utils';
import type { Cell } from '@/shared/types';
import { GridState, CellState, AlgorithmState } from '@/shared/types';
import { extractRowColFromElem } from '@/shared/utils';

export const useGrid = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gridState, setGridState] = useState<GridState>(GridState.IDLE);
    const [startCell, setStartCell] = useState({ row: 5, col: 5 });
    const [endCell, setEndCell] = useState({ row: 15, col: 25 });

    const [draggedCell, setDraggedCell] = useState<{
        state: CellState;
        row: number;
        col: number;
    } | null>();

    const { sizeR, sizeC, cellSize, start, end, gridContainerRef } = useCalculateGridDimensions(setGridState);
    const stopMouseEvent = false;

    const getInitializedGrid = useCallback(() => {
        if (!start || !end) {
            return [];
        }

        const newGrid = initializeGrid({ sizeR, sizeC, start, end });

        setGrid(newGrid);
        // setPath([]);
        // setDisplayedPath([]);
        // setCurrentPathIndex(0);
        // setAlgorithmState(AlgorithmState.IDLE);
    }, [
        start,
        end,
        sizeR,
        sizeC,
        setGrid,
        // setPath,
        // setDisplayedPath,
        // setCurrentPathIndex,
        // setAlgorithmState,
    ]);

    useEffect(() => {        
        getInitializedGrid();
    }, [getInitializedGrid]);

    useEffect(() => {
        if (!start || !end) {
            return;
        }

        setStartCell(start);
        setEndCell(end);
    }, [end, start]);

    const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (stopMouseEvent) {
            return;
        }

        event.preventDefault();

        const elem = event.target as HTMLDivElement;
        const { row, col } = extractRowColFromElem(elem, sizeC);

        if (isNaN(row) || isNaN(col)) {
            return;
        }

        if (sizeR === 0 || sizeC === 0 || !(row < sizeR && col < sizeC)) {
            console.error('Invalid cell coordinates:', { sizeR, sizeC, row, col });
            return;
        }

        const cell = grid[row][col];

        if (cell.state === CellState.START) {
            setGridState(GridState.DRAGGING);
            setDraggedCell({ state: CellState.START, row, col });
            return;
        }

        if (cell.state === CellState.END) {
            setGridState(GridState.DRAGGING);
            setDraggedCell({ state: CellState.END, row, col });
            return;
        }

        if (cell.state === CellState.WALL) {
            setGridState(GridState.ERASING_WALLS);

            const newGrid = [...grid];
            newGrid[row][col].state = CellState.EMPTY;
            setGrid(newGrid);
        } else if (cell.state === CellState.EMPTY) {
            setGridState(GridState.DRAWING_WALLS);

            const newGrid = [...grid];
            newGrid[row][col].state = CellState.WALL;
            setGrid(newGrid);
        }
    }, [grid, sizeC, sizeR, stopMouseEvent]);

    const handleMouseEnter = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (stopMouseEvent) {
            return;
        }

        const elem = event.target as HTMLDivElement;
        const { row, col } = extractRowColFromElem(elem, sizeC);

        if (isNaN(row) || isNaN(col)) {
            return;
        }

        if (sizeR === 0 || sizeC === 0 || !(row < sizeR && col < sizeC)) {
            console.error('Invalid cell coordinates:', { sizeR, sizeC, row, col });
            return;
        }

        const cell = grid[row][col];

        if (gridState === GridState.DRAGGING && draggedCell) {
            if (
                cell.state === CellState.WALL ||
                (cell.state === CellState.START && draggedCell.state === CellState.END) ||
                (cell.state === CellState.END && draggedCell.state === CellState.START)
            ) {
                return;
            }

            if (!start || !end) {
                return;
            }

            const newGrid = [...grid];

            if (draggedCell.state === CellState.START) {
                newGrid[startCell.row][startCell.col].state = CellState.EMPTY;
                setStartCell({ row, col });
            } else if (draggedCell.state === CellState.END) {
                newGrid[endCell.row][endCell.col].state = CellState.EMPTY;
                setEndCell({ row, col });
            }

            newGrid[row][col].state = draggedCell.state;

            setGrid(newGrid);
            setDraggedCell({ ...draggedCell, row, col });
            return;
        }

        if (gridState === GridState.DRAWING_WALLS && cell.state === CellState.EMPTY) {
            const newGrid = [...grid];
            newGrid[row][col].state = CellState.WALL;
            setGrid(newGrid);
        } else if (gridState === GridState.ERASING_WALLS && cell.state === CellState.WALL) {
            const newGrid = [...grid];
            newGrid[row][col].state = CellState.EMPTY;
            setGrid(newGrid);
        }
    }, [draggedCell, end, endCell.col, endCell.row, grid, gridState, sizeC, sizeR, start, startCell.col, startCell.row, stopMouseEvent]);

    const handleMouseUp = useCallback(() => {
        if (stopMouseEvent) {
            return;
        }

        setGridState(GridState.MEASURED);
    }, [stopMouseEvent]);

    const clearWalls = useCallback(() => {
        if (stopMouseEvent) {
            return;
        }

        const newGrid = grid.map((row) =>
            row.map((cell) => {
                if (cell.state === CellState.WALL) {
                    return { ...cell, state: CellState.EMPTY };
                }
                return cell;
            }),
        );

        setGrid(newGrid);
    }, [grid, stopMouseEvent]);

    return {
        grid,
        gridState,
        start: startCell,
        end: endCell,
        sizeR,
        sizeC,
        cellSize,
        gridContainerRef,
        setGrid,
        setGridState,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        clearWalls,
    };
};
