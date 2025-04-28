import { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import {
    AlgorithmState,
    AlgorithmStats,
    Cell,
    CellState,
    Point,
    ReconstructPathProps,
} from '@/shared/types';

export type Props = {
    speed: number;
    setGrid: Dispatch<SetStateAction<Cell[][]>>;
    INF: number;
    setAlgorithmState: (state: AlgorithmState) => void;
};

export const useAlgorithm = ({ speed, setGrid, INF, setAlgorithmState }: Props) => {
    const [algorithmStats, setAlgorithmStats] = useState<AlgorithmStats>({
        pathLength: 0,
        timeTaken: 0,
        operations: 0,
        showStats: false,
    });

    const animationRef = useRef<number | null>(null);

    const pathAnimationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>(
        [],
    );

    const startTimeRef = useRef<number>(0);

    const reconstructPath = ({ end, start, grid }: ReconstructPathProps) => {
        const path: Point[] = [];
        const endR = end.row;
        const endC = end.col;

        if (
            grid[endR][endC].distance === INF &&
            grid[endR][endC].parent === null
        ) {
            console.log('No path found to end cell');
            return path;
        }

        let current = { row: endR, col: endC };

        while (!(current.row === start.row && current.col === start.col)) {
            path.push(current);

            const parentCell = grid[current.row][current.col].parent;

            if (!parentCell) {
                console.error(
                    'Path reconstruction error: cell has no parent',
                    current,
                );

                break;
            }

            current = parentCell;
        }

        console.log('Path found with length:', path.length);
        return path;
    };

    const animatePathDrawing = (path: Point[]) => {
        if (path.length === 0) {
            return;
        }

        pathAnimationTimeoutsRef.current.forEach((timeout) =>
            clearTimeout(timeout),
        );

        setAlgorithmState(AlgorithmState.DRAWING_PATH);

        pathAnimationTimeoutsRef.current = [];
        const baseDelay = 300 - speed * 1.5;
        const delay = Math.max(10, baseDelay);

        for (const [index, cell] of path.entries()) {
            const timeout = setTimeout(() => {
                setGrid((prevGrid) => {
                    const newGrid = [...prevGrid];

                    if (
                        newGrid[cell.row][cell.col].state !== CellState.START &&
                        newGrid[cell.row][cell.col].state !== CellState.END
                    ) {
                        // Create a new cell object to ensure React detects the change
                        newGrid[cell.row][cell.col] = {
                            ...newGrid[cell.row][cell.col],
                            state: CellState.PATH,
                        };
                    }

                    return newGrid;
                });

                // Check if animation is complete
                if (index === path.length - 1) {
                    setAlgorithmState(AlgorithmState.COMPLETED);
                }
            }, delay * index);

            pathAnimationTimeoutsRef.current.push(timeout);
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                cancelAnimationFrame(animationRef.current);
            }

            for (const timeout of pathAnimationTimeoutsRef.current) {
                clearTimeout(timeout);
            }
        };
    }, []);

    return {
        animationRef,
        pathAnimationTimeoutsRef,
        startTimeRef,
        algorithmStats,
        setAlgorithmState,
        setAlgorithmStats,
        reconstructPath,
        animatePathDrawing,
    };
};
