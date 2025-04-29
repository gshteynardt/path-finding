'use client';
import { useState, useCallback } from 'react';

import { Grid } from '@/shared/components/Grid';
import { Header } from '@/shared/components/Header';
import { StatisticsPanel } from '@/shared/components/StatisticsPanel';
import { useGrid } from '@/shared/hooks/useGrid';
import { useBFS } from '@/shared/hooks/useBFS';
import { useAlgorithm } from '@/shared/hooks/useAlgorithm';
import { AlgorithmState } from '@/shared/types';

export default function Home() {
    const [algorithmState, setAlgorithmState] = useState<AlgorithmState>(AlgorithmState.IDLE);

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
    } = useGrid({ algorithmState });

    const INF = sizeR * sizeC;

    const {
        animationRef,
        pathAnimationTimeoutsRef,
        startTimeRef,
        algorithmStats,
        speed,
        setSpeed,
        setAlgorithmStats,
        animatePathDrawing,
        reconstructPath,
    } = useAlgorithm({
        INF,
        setGrid,
        setAlgorithmState,
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
        speed,
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

    const resetGrid = useCallback(() => {
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
    }, [animationRef, initializeGrid, pathAnimationTimeoutsRef, resetBFSState, setAlgorithmStats]);

    const toggleRunning = useCallback(() => {
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
    }, [animateBFS, animationRef, isComplete, isDrawingPath, isRunning, queue.length, runAlgorithm]);

    return (
        <main className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 text-white">
            <Header
                isRunning={isRunning}
                isDrawingPath={isDrawingPath}
                speed={speed}
                setSpeed={setSpeed}
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
