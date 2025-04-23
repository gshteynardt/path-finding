'use client';

import type { MouseEvent, RefObject } from 'react';

import { GridCell } from '@/shared/components/GridCell';
import type { Grid as GridType, GridShape} from '@/shared/types';
import { getCellColor, getCellDistance } from '@/shared/utils';

export type Props = {
    gridRef: RefObject<HTMLDivElement | null>;
    grid: GridType;
    sizeC: number;
    sizeR: number;
    cellSize: number;
    gridShape: GridShape;
    onMouseUp: (event: MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
};

export const Grid = (props: Props) => {
    const { gridRef, grid, sizeC, sizeR, cellSize, gridShape, onMouseUp, onMouseLeave } = props;

    return (
        <div
            className="relative flex-1 overflow-hidden"
            ref={gridRef}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]"></div>
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                }}
            >
                <div
                    className={`grid gap-px rounded-lg border border-slate-700/30 bg-slate-800/30 p-px shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-sm`}
                    style={{
                        gridTemplateColumns: `repeat(${sizeC}, ${cellSize}px)`,
                        gridTemplateRows: `repeat(${sizeR}, ${cellSize}px)`,
                        width: `${sizeC * cellSize + 2}px`, // add 2px for border
                        height: `${sizeR * cellSize + 2}px`, // add 2px for border
                        willChange: 'contents',
                        transform: 'translateZ(0)',
                    }}
                >
                    {grid.map((row, rowIdx) =>
                        row.map((cell, colIdx) => {
                            return (
                                <GridCell
                                    key={`${rowIdx}-${colIdx}`}
                                    color={getCellColor(cell.state)}
                                    size={cellSize}
                                    shape={gridShape}
                                    distance={getCellDistance(cell, sizeC * sizeR)}
                                />
                            );
                        }),
                    )}
                </div>
            </div>
        </div>
    );
};
