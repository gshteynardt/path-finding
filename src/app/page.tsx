'use client';

import { Grid } from '@/shared/components/Grid';
import { useGrid } from '@/shared/hooks/useGrid';

export default function Home() {
    const {
        gridState,
        grid,
        start,
        end,
        sizeR,
        sizeC,
        cellSize,
        gridContainerRef,
        setGrid,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        clearWalls,
    } = useGrid();

    return (
        <main className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 text-white">
            <Grid
                gridRef={gridContainerRef}
                grid={grid}
                sizeC={sizeC}
                sizeR={sizeR}
                cellSize={cellSize}
                gridShape="hexagon"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
            />
        </main>
    );
}
