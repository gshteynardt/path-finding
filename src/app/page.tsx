'use client';

import { Grid } from '@/shared/components/Grid';
import { Header } from '@/shared/components/Header';
import { StatisticsPanel } from '@/shared/components/StatisticsPanel';
import { useGrid } from '@/shared/hooks/useGrid';
import { useBFS } from '@/shared/hooks/useBFS';
import { useAlgorithm } from '@/shared/hooks/useAlgorithm';
import { AlgorithmState } from '@/shared/types';

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
        initializeGrid,
        setGrid,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        clearWalls,
    } = useGrid();

    const INF = sizeR * sizeC;

    const {
        animationRef,
        pathAnimationTimeoutsRef,
        startTimeRef,
        algorithmState,
        algorithmStats,
        setAlgorithmState,
        setAlgorithmStats,
        animatePathDrawing,
        reconstructPath,
    } = useAlgorithm({
        speed: 150,
        INF,
        setGrid,
    });

    const {
        queue,
        animateBFS,
        runAlgorithm,
        resetBFSState,
    } = useBFS({
        grid,
        sizeR,
        sizeC,
        start,
        end,
        speed: 90,
        INF,
        animationRef,
        pathAnimationTimeoutsRef,
        startTimeRef,
        algorithmState,
        algorithmStats,
        toggleAlgorithmState: setAlgorithmState,
        setAlgorithmStats,
        setGrid,
        animatePathDrawing,
        reconstructPath,
    });

    const isRunning = algorithmState === AlgorithmState.RUNNING;
    const isComplete = algorithmState === AlgorithmState.COMPLETED;
    const isDrawingPath = algorithmState === AlgorithmState.DRAWING_PATH;

    const resetGrid = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        for (const timeout of pathAnimationTimeoutsRef.current) {
            clearTimeout(timeout);
        }

        pathAnimationTimeoutsRef.current = [];

        initializeGrid();
        setAlgorithmStats((prev) => ({ ...prev, showStats: false }));
        resetBFSState();
    };

    const toggleRunning = () => {
        if (isDrawingPath) {
            return;
        }

        if (isRunning) {
            setAlgorithmState(AlgorithmState.PAUSED);

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        } else {
            setAlgorithmState(AlgorithmState.RUNNING);

            if (queue.length === 0 || isComplete) {
                runAlgorithm();
            } else {
                animationRef.current = requestAnimationFrame(animateBFS);
            }
        }
    };

    return (
        <main className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 text-white">
            <Header
                isRunning={isRunning}
                isDrawingPath={isDrawingPath}
                resetGrid={resetGrid}
                toggleRunning={toggleRunning}
                clearWalls={clearWalls}
            />
            <Grid
                ref={gridContainerRef}
                state={gridState}
                grid={grid}
                sizeC={sizeC}
                sizeR={sizeR}
                cellSize={cellSize}
                gridShape="square"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
            />
            <StatisticsPanel algorithmStats={algorithmStats} />
        </main>
    );
}
