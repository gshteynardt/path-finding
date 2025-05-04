'use client';
import { useState, useCallback } from 'react';

import { Grid } from '@/shared/components/Grid';
import { Header } from '@/shared/components/Header';
import { StatisticsPanel } from '@/shared/components/StatisticsPanel';
import { useGrid } from '@/shared/hooks/useGrid';
import { useBFS } from '@/shared/hooks/useBFS';
import { useBidirectionalBFS } from '@/shared/hooks/useBidirectionalBFS';
import { useAlgorithm } from '@/shared/hooks/useAlgorithm';
import { AlgorithmState } from '@/shared/types';

export default function Home() {
    const [algorithmState, setAlgorithmState] = useState<AlgorithmState>(AlgorithmState.IDLE);
    const [bidirectional, setBidirectional] = useState(false);

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
        queue: bfsQueue,
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

    const {
        queue: bidirectionalBFSQueue,
        runBidirectionalBFS,
        resetBidirectionalBFSState,
        animateBidirectionalBFS,
    } = useBidirectionalBFS({
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

        if (bidirectional) {
            resetBidirectionalBFSState();
        } else {
            resetBFSState();
        }
    }, [animationRef, bidirectional, initializeGrid, pathAnimationTimeoutsRef, resetBFSState, resetBidirectionalBFSState, setAlgorithmStats]);

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
            const algorithm = bidirectional ? runBidirectionalBFS : runAlgorithm;
            const animation = bidirectional ? animateBidirectionalBFS : animateBFS;
            const queue = bidirectional ? bidirectionalBFSQueue : bfsQueue;

            if (queue.length === 0 || isComplete) {
                algorithm();
            } else {
                animationRef.current = requestAnimationFrame(animation);
            }
        }
    }, [animateBFS, animateBidirectionalBFS, animationRef, bfsQueue, bidirectional, bidirectionalBFSQueue, isComplete, isDrawingPath, isRunning, runAlgorithm, runBidirectionalBFS]);

    return (
        <main className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 text-white">
            <Header
                isRunning={isRunning}
                isDrawingPath={isDrawingPath}
                bidirectional={bidirectional}
                onChangeBidirectional={setBidirectional}
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
