import { useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';

import { CellState, AlgorithmState } from '@/shared/types';
import type { Point, Cell, Grid, AlgorithmStats, ReconstructPathProps } from '@/shared/types';
import { directions } from '@/shared/constants';
import { getCellId, refreshGrid } from '@/shared/utils';

export type Props = {
    grid: Grid;
    sizeR: number;
    sizeC: number;
    start: Point;
    end: Point;
    speed: number;
    INF: number;
    animationRef:  RefObject<number | null>;
    pathAnimationTimeoutsRef: RefObject<ReturnType<typeof setTimeout>[]>;
    startTimeRef: RefObject<number | null>;
    algorithmState: AlgorithmState;
    algorithmStats: AlgorithmStats;
    setAlgorithmStats: Dispatch<SetStateAction<AlgorithmStats>>;
    toggleAlgorithmState: (state: AlgorithmState) => void;
    setGrid: (grid: Grid) => void;
    reconstructPath: (props: ReconstructPathProps) => Point[];
    animatePathDrawing: (path: Point[]) => void;
};

export const useBFS = ({
    grid,
    sizeR,
    sizeC,
    start,
    end,
    speed = 10,
    INF,
    animationRef,
    pathAnimationTimeoutsRef,
    algorithmState,
    algorithmStats,
    startTimeRef,
    toggleAlgorithmState,
    setAlgorithmStats,
    setGrid,
    reconstructPath,
    animatePathDrawing,
}: Props) => {
    const gridRef = useRef<Cell[][]>([]);
    const queueRef = useRef<{ row: number; col: number }[]>([]);
    const seenRef = useRef<boolean[]>([]);
    const frontRef = useRef<number>(0);

    const runAlgorithm = () => {
        toggleAlgorithmState(AlgorithmState.RUNNING);

        setAlgorithmStats({
            pathLength: 0,
            timeTaken: 0,
            operations: 0,
            showStats: false,
        });

        startTimeRef.current = performance.now();

        const newGrid = refreshGrid(grid, INF);
        const startR = start.row;
        const startC = start.col;

        newGrid[startR][startC].distance = 0;
        const initialQueue = [{ row: startR, col: startC }];

        const seen: boolean[] = Array(sizeR * sizeC).fill(false);
        seen[getCellId({ ...start, sizeC })] = true;

        setGrid(newGrid);

        gridRef.current = newGrid;
        queueRef.current = initialQueue;
        seenRef.current = seen;
        frontRef.current = 0;
        animateBFS();
    };

    const animateBFS = () => {
        if (algorithmState === AlgorithmState.RUNNING) {
            return;
        }

        if (frontRef.current >= queueRef.current.length) {
            toggleAlgorithmState(AlgorithmState.COMPLETED);
            console.log('BFS complete - no path found');
            return;
        }

        const stepsPerFrame =
            speed > 100 ? Math.floor((speed - 100) / 10) + 2 : 1;

        for (
            let step = 0;
            step < stepsPerFrame && frontRef.current < queueRef.current.length;
            step++
        ) {
            const { row, col } = queueRef.current[frontRef.current];
            frontRef.current++;

            setAlgorithmStats((prev) => ({
                ...prev,
                operations: prev.operations + 1,
            }));

            seenRef.current[getCellId({ row, col, sizeC })] = true;
            const currentCell = gridRef.current[row][col];

            if (row === end.row && col === end.col) {
                console.log('Found path to end cell!');

                const pathFound = reconstructPath({ start, end, grid: gridRef.current });
                const endTime = performance.now();
                const timeTaken = endTime - (startTimeRef.current ?? 0);

                setAlgorithmStats({
                    pathLength: pathFound.length,
                    timeTaken: timeTaken,
                    operations: queueRef.current.length,
                    showStats: true,
                });

                toggleAlgorithmState(AlgorithmState.COMPLETED);
                animatePathDrawing(pathFound);
                return;
            }

            if (
                currentCell.state !== CellState.START &&
                currentCell.state !== CellState.END
            ) {
                currentCell.state = CellState.VISITED;
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
                    !seenRef.current[nk] &&
                    gridRef.current[nr][nc].state !== CellState.WALL
                ) {
                    const neighborCell = gridRef.current[nr][nc];
                    neighborCell.distance = currentCell.distance + 1;
                    neighborCell.parent = { row, col };

                    if (
                        neighborCell.state !== CellState.START &&
                        neighborCell.state !== CellState.END
                    ) {
                        neighborCell.state = CellState.QUEUE;
                    }

                    queueRef.current.push({ row: nr, col: nc });
                    seenRef.current[nk] = true;
                }
            }
        }

        setGrid([...gridRef.current]);
        animationRef.current = requestAnimationFrame(animateBFS);
    };

    const resetBFSState = () => {
        toggleAlgorithmState(AlgorithmState.IDLE);
        gridRef.current = [];
        queueRef.current = [];
        seenRef.current = [];
        frontRef.current = 0;
    };

    return {
        animationRef,
        pathAnimationTimeoutsRef,
        queue: queueRef.current,
        animateBFS,
        runAlgorithm,
        algorithmStats,
        setAlgorithmStats,
        resetBFSState,
    };
};
