export enum CellState {
    EMPTY = 'empty',
    WALL = 'wall',
    START = 'start',
    END = 'end',
    MEETING_POINT = 'meetingPoint',
    VISITED = 'visited',
    QUEUE = 'queue',
    PATH = 'path',
};

export const enum GridState {
    IDLE = 'idle',
    DRAGGING = 'dragging',
    ERASING_WALLS = 'erasingWalls',
    DRAWING_WALLS = 'drawingWalls',
    MEASURING = 'measuring',
    MEASURED = 'measured',
};

export type Point = {
    row: number;
    col: number;
};

export type Cell = {
    row: number;
    col: number;
    state: CellState;
    distance: number | string;
    parent: Point | null;
};

export type DraggedCell = {
    state: CellState;
    row: number;
    col: number;
};

export type Grid = Cell[][];
export type GridShape = 'square' | 'hexagon';
