import { useState } from 'react';
import { Hexagon, ChevronDown, ChevronUp } from 'lucide-react';

import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/shared/components/Tooltip';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/Sheet';
import { Button } from '@/shared/components/Button';
import { ControlsPanel } from '@/shared/components/ControlsPanel';

export type Props = {
    isDrawingPath: boolean;
    isRunning: boolean;
    speed: number;
    bidirectional: boolean;
    onChangeBidirectional: (checked: boolean) => void;
    setSpeed: (speed: number) => void;
    toggleRunning: () => void;
    clearWalls: () => void;
    resetGrid: () => void;
};

export const Header = ({
    isDrawingPath,
    isRunning,
    speed,
    bidirectional,
    onChangeBidirectional,
    setSpeed,
    toggleRunning,
    clearWalls,
    resetGrid,
}: Props) => {
    const [showControls, setShowControls] = useState(true);

    return (
        <>
            <div className="flex items-center justify-between border-b border-slate-800/50 bg-slate-900/80 p-4 shadow-md backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <Hexagon className="size-4 text-white" />
                    </div>
                    <h1 className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-2xl font-bold text-transparent">
                        Pathfinding Visualizer
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-slate-300 hover:bg-slate-800/50"
                                    onClick={() =>
                                        setShowControls(!showControls)
                                    }
                                >
                                    {showControls ? (
                                        <ChevronUp className="size-5" />
                                    ) : (
                                        <ChevronDown className="size-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {showControls
                                    ? 'Hide Controls'
                                    : 'Show Controls'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {/* <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-slate-300 hover:bg-slate-800/50"
                            >
                                <Info className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="border-slate-800 bg-slate-900 text-slate-200">
                            <SheetHeader>
                                <SheetTitle className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
                                    About Pathfinding Algorithms
                                </SheetTitle>
                                <div className="text-sm text-slate-400">
                                    <div className="mt-6 space-y-6">
                                        <div className="text-slate-300">
                                            <p className="mb-4">
                                                Pathfinding algorithms are used
                                                to find the shortest path
                                                between two points in a graph.
                                                This visualization demonstrates
                                                different algorithms and how
                                                they explore the grid to find a
                                                path.
                                            </p>
                                            <p>
                                                <span className="font-semibold text-white">
                                                    BFS (Breadth-First Search)
                                                </span>{' '}
                                                explores all neighbor nodes at
                                                the present depth before moving
                                                on to nodes at the next depth
                                                level.
                                            </p>
                                            <p className="mt-2">
                                                <span className="font-semibold text-white">
                                                    A* (A-Star)
                                                </span>{' '}
                                                uses a heuristic to guide its
                                                search, prioritizing paths that
                                                seem to be leading closer to the
                                                goal.
                                            </p>
                                        </div>
                                        <h3 className="mt-6 text-lg font-semibold text-white">
                                            How to use this visualization:
                                        </h3>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                                <span>
                                                    Start node (draggable)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-sm bg-gradient-to-r from-rose-500 to-pink-500"></div>
                                                <span>
                                                    End node (draggable)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-sm bg-gradient-to-br from-slate-700 to-slate-900"></div>
                                                <span>Wall (click & drag)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-sm bg-gradient-to-r from-sky-400 to-blue-500"></div>
                                                <span>Frontier (active)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-sm bg-violet-600 shadow-[0_0_5px_rgba(139,92,246,0.5)]"></div>
                                                <span>Visited nodes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-sm bg-gradient-to-r from-amber-400 to-yellow-500"></div>
                                                <span>Shortest path</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-slate-300">
                                            <p>
                                                <span className="font-semibold text-white">
                                                    Drag
                                                </span>{' '}
                                                the start and end nodes to
                                                reposition them.
                                            </p>
                                            <p className="mt-2">
                                                <span className="font-semibold text-white">
                                                    Click and drag
                                                </span>{' '}
                                                on empty cells to create walls
                                                or on walls to erase them.
                                            </p>
                                            <p className="mt-2">
                                                Use the control panel to select
                                                an algorithm and adjust
                                                visualization settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet> */}
                </div>
            </div>
            {showControls && (
                <ControlsPanel
                    isRunning={isRunning}
                    isDrawingPath={isDrawingPath}
                    speed={speed}
                    bidirectional={bidirectional}
                    onChangeBidirectional={onChangeBidirectional}
                    setSpeed={setSpeed}
                    resetGrid={resetGrid}
                    toggleRunning={toggleRunning}
                    clearWalls={clearWalls}
                />
            )}
        </>
    );
};
