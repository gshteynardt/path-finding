import { Zap } from 'lucide-react';

import type { AlgorithmStats } from '@/shared/types';

export type Props = {
    algorithmStats: AlgorithmStats;
};

export const StatisticsPanel = ({ algorithmStats }: Props) => {
    const { showStats, pathLength, timeTaken, operations } = algorithmStats;

    return (
        showStats && (
            <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-slate-700/50 bg-slate-900/70 p-4 text-sm shadow-lg backdrop-blur-sm">
                <h3 className="mb-2 flex items-center font-medium text-white">
                    <Zap className="mr-2 size-4 text-cyan-400" />
                    Algorithm Statistics
                </h3>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Path length:</span>
                        <span className="font-medium text-white">
                            {pathLength}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Time taken:</span>
                        <span className="font-medium text-white">
                            {timeTaken.toFixed(2)} ms
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Operations:</span>
                        <span className="font-medium text-white">
                            {operations}
                        </span>
                    </div>
                </div>
            </div>
        )
    );
};
