import type { Grid, Point } from './grid';

export const enum AlgorithmState {
    IDLE = 'idle',
    PAUSED = 'paused',
    RUNNING = 'running',
    DRAWING_PATH = 'drawingPath',
    COMPLETED = 'completed',
};

export type AlgorithmStats = {
    pathLength: number;
    timeTaken: number;
    operations: number;
    showStats: boolean;
};

export type ReconstructPathProps = {
    end: Point;
    start: Point;
    grid: Grid;
};
