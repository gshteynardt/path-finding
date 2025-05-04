import { useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';

import { AlgorithmState, CellState } from '@/shared/types';
import type {
    Point,
    Cell,
    Grid,
    AlgorithmStats,
} from '@/shared/types';
import {
    getCellId,
    refreshGrid,
    reconstructPath,
    expand,
} from '@/shared/utils';

export type Props = {
    grid: Grid;
    sizeR: number;
    sizeC: number;
    start: Point;
    end: Point;
    speed: number;
    INF: number;
    animationRef: RefObject<number | null>;
    pathAnimationTimeoutsRef: RefObject<ReturnType<typeof setTimeout>[]>;
    startTimeRef: RefObject<number | null>;
    algorithmState: AlgorithmState;
    algorithmStats: AlgorithmStats;
    setAlgorithmStats: Dispatch<SetStateAction<AlgorithmStats>>;
    setGrid: Dispatch<SetStateAction<Cell[][]>>;
    toggleAlgorithmState: (state: AlgorithmState) => void;
};

export const useBidirectionalBFS = ({
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
}: Props) => {
    const gridRef = useRef<Cell[][]>([]);

    const queueRefStart = useRef<Point[]>([]);
    const seenRefStart = useRef<boolean[]>([]);
    const frontRefStart = useRef<number>(0);
    const parentStart = useRef<Map<string, Point>>(new Map());

    const queueRefEnd = useRef<Point[]>([]);
    const seenRefEnd = useRef<boolean[]>([]);
    const frontRefEnd = useRef<number>(0);
    const parentEnd = useRef<Map<string, Point>>(new Map());

    const incrementFrontEnd = () => {
        const front = frontRefEnd.current;
        frontRefEnd.current++;

        return front;
    };

    const incrementFrontStart = () => {
        const front = frontRefStart.current;
        frontRefStart.current++;

        return front;
    };

    const runBidirectionalBFS = () => {
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
        const endR = end.row;
        const endC = end.col;

        newGrid[startR][startC].distance = 0;
        newGrid[endR][endC].distance = 0;

        const seenStart: boolean[] = Array(sizeR * sizeC).fill(false);
        seenStart[getCellId({ ...start, sizeC })] = true;

        const seenEnd: boolean[] = Array(sizeR * sizeC).fill(false);
        seenEnd[getCellId({ ...end, sizeC })] = true;

        setGrid(newGrid);

        gridRef.current = newGrid;

        queueRefStart.current = [{ row: startR, col: startC }];
        seenRefStart.current = seenStart;
        frontRefStart.current = 0;

        queueRefEnd.current = [{ row: endR, col: endC }];
        seenRefEnd.current = seenEnd;
        frontRefEnd.current = 0;

        animateBidirectionalBFS();
    };

    const animateBidirectionalBFS = () => {
        if (algorithmState === AlgorithmState.RUNNING) {
            return;
        }

        if (
            frontRefStart.current >= queueRefStart.current.length ||
            frontRefEnd.current >= queueRefEnd.current.length
        ) {
            toggleAlgorithmState(AlgorithmState.COMPLETED);
            console.log('BFS complete - no path found');
            return;
        }

        const stepsPerFrame = speed > 100 ? Math.floor((speed - 100) / 10) + 2 : 1;
        let found = false;

        for (
            let step = 0;
            step < stepsPerFrame &&
            !found &&
            frontRefStart.current < queueRefStart.current.length &&
            frontRefEnd.current < queueRefEnd.current.length;
            step++
        ) {
            const meetingFromStart = expand({
                queue: queueRefStart.current,
                seen: seenRefStart.current,
                otherSeen: seenRefEnd.current,
                incrementFront: incrementFrontStart,
                grid: gridRef.current,
                parent: parentStart.current,
            });

            const meetingFromEnd = expand({
                queue: queueRefEnd.current,
                seen: seenRefEnd.current,
                otherSeen: seenRefStart.current,
                incrementFront: incrementFrontEnd,
                grid: gridRef.current,
                parent: parentEnd.current,
            });

            const meetingPoint = meetingFromStart ?? meetingFromEnd;

            if (meetingPoint) {
                found = true;

                const { pathToStart, pathToEnd } = reconstructPath({
                    grid: gridRef.current,
                    start,
                    end,
                    meetingCell: meetingPoint,
                    parentStart: parentStart.current,
                    parentEnd: parentEnd.current,
                });

                gridRef.current[meetingPoint.row][meetingPoint.col].distance = `${pathToStart.length} + ${pathToEnd.length}`;

                setGrid([...gridRef.current]);

                const endTime = performance.now();
                const timeTaken = endTime - (startTimeRef.current ?? 0);
                const operations = queueRefStart.current.length + queueRefEnd.current.length;

                setAlgorithmStats({
                    pathLength: pathToStart.length + pathToEnd.length,
                    timeTaken,
                    operations,
                    showStats: true,
                });

                toggleAlgorithmState(AlgorithmState.COMPLETED);
                animatePathDrawing(pathToStart.reverse(), pathToEnd.reverse());
                return;
            }
        }

        setGrid([...gridRef.current]);
        animationRef.current = requestAnimationFrame(animateBidirectionalBFS);
    };

    const animatePathDrawing = (pathStart: Point[], pathEnd: Point[]) => {
        if (pathStart.length === 0 && pathEnd.length === 0) {
            return;
        }

        pathAnimationTimeoutsRef.current.forEach((timeout) =>
            clearTimeout(timeout),
        );

        toggleAlgorithmState(AlgorithmState.DRAWING_PATH);

        pathAnimationTimeoutsRef.current = [];
        const baseDelay = 300 - speed * 1.5;
        const delay = Math.max(10, baseDelay);
        let i = 0;

        while (pathStart.length > 0 && pathEnd.length > 0) {
            const startCell = pathStart.pop()!;
            const endCell = pathEnd.pop()!;
            i++;

            const timeout = setTimeout(() => {
                const newGrid = [...grid];

                if (
                    newGrid[startCell.row][startCell.col].state !== CellState.START &&
                    newGrid[startCell.row][startCell.col].state !== CellState.MEETING_POINT
                ) {
                    newGrid[startCell.row][startCell.col] = {
                        ...newGrid[startCell.row][startCell.col],
                        state: CellState.PATH,
                    };
                }

                if (
                    newGrid[endCell.row][endCell.col].state !== CellState.END &&
                    newGrid[endCell.row][endCell.col].state !== CellState.MEETING_POINT
                ) {
                    newGrid[endCell.row][endCell.col] = {
                        ...newGrid[endCell.row][endCell.col],
                        state: CellState.PATH,
                    };
                }

                setGrid((prevGrid) => {
                    const newGrid = [...prevGrid];

                    if (
                        newGrid[startCell.row][startCell.col].state !== CellState.START &&
                        newGrid[startCell.row][startCell.col].state !== CellState.MEETING_POINT
                    ) {
                        newGrid[startCell.row][startCell.col] = {
                            ...newGrid[startCell.row][startCell.col],
                            state: CellState.PATH,
                        };
                    }

                    if (
                        newGrid[endCell.row][endCell.col].state !== CellState.END &&
                        newGrid[endCell.row][endCell.col].state !== CellState.MEETING_POINT
                    ) {
                        newGrid[endCell.row][endCell.col] = {
                            ...newGrid[endCell.row][endCell.col],
                            state: CellState.PATH,
                        };
                    }

                    return newGrid;
                });

            }, delay * i);

            pathAnimationTimeoutsRef.current.push(timeout);
        }

        while (pathStart.length > 0) {
            const startCell = pathStart.pop()!;
            i++;

            const timeout = setTimeout(() => {
                setGrid((prevGrid) => {
                    const newGrid = [...prevGrid];

                    if (
                        newGrid[startCell.row][startCell.col].state !== CellState.START &&
                        newGrid[startCell.row][startCell.col].state !== CellState.MEETING_POINT
                    ) {
                        newGrid[startCell.row][startCell.col] = {
                            ...newGrid[startCell.row][startCell.col],
                            state: CellState.PATH,
                        };
                    }

                    return newGrid;
                });

            }, delay * i);

            pathAnimationTimeoutsRef.current.push(timeout);
        }

        while (pathEnd.length > 0) {
            const endCell = pathEnd.pop()!;
            i++;

            const timeout = setTimeout(() => {
                setGrid((prevGrid) => {
                    const newGrid = [...prevGrid];

                    if (
                        newGrid[endCell.row][endCell.col].state !== CellState.END &&
                        newGrid[endCell.row][endCell.col].state !== CellState.MEETING_POINT
                    ) {
                        newGrid[endCell.row][endCell.col] = {
                            ...newGrid[endCell.row][endCell.col],
                            state: CellState.PATH,
                        };
                    }
                    return newGrid;
                });

            }, delay * i);

            toggleAlgorithmState(AlgorithmState.COMPLETED)
            pathAnimationTimeoutsRef.current.push(timeout);
        }
    };

    const resetBidirectionalBFSState = () => {
        toggleAlgorithmState(AlgorithmState.IDLE);
        gridRef.current = [];

        queueRefStart.current = [];
        seenRefStart.current = [];
        frontRefStart.current = 0;
        parentStart.current = new Map();

        queueRefEnd.current = [];
        seenRefEnd.current = [];
        frontRefEnd.current = 0;
        parentEnd.current = new Map();
    };

    return {
        animationRef,
        pathAnimationTimeoutsRef,
        queue: queueRefStart.current,
        animateBidirectionalBFS,
        runBidirectionalBFS,
        algorithmStats,
        setAlgorithmStats,
        resetBidirectionalBFSState,
    };
};
