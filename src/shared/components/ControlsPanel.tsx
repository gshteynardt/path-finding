import { Play, Pause, RotateCcw, Trash2, Zap } from 'lucide-react';

import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Slider } from '@/shared/components/Slider';
import { Checkbox } from '@/shared/components/Checkbox';
import { Label } from '@/shared/components/Label';
import { getSpeedLabel } from '@/shared/utils';

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

export const ControlsPanel = ({
    isDrawingPath,
    isRunning,
    speed,
    bidirectional,
    setSpeed,
    onChangeBidirectional,
    toggleRunning,
    clearWalls,
    resetGrid,
}: Props) => {
    return (
        <div className="absolute right-4 top-20 z-10 w-72 overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/80 shadow-lg backdrop-blur-md">
            <div className="border-b border-slate-800/50 p-4">
                <h2 className="text-lg font-semibold text-white">
                    Control Panel
                </h2>
            </div>
            <div className="space-y-6 p-4">
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-400">
                        Core Controls
                    </h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={toggleRunning}
                            disabled={isDrawingPath}
                            className={`flex-1 rounded-full ${
                                isRunning
                                    ? 'border-rose-400 bg-rose-500 hover:bg-rose-600'
                                    : 'border-emerald-400 bg-emerald-500 hover:bg-emerald-600'
                            } shadow-lg ${
                                isDrawingPath
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                            }`}
                        >
                            {isRunning ? (
                                <Pause className="mr-2 size-4" />
                            ) : (
                                <Play className="mr-2 size-4" />
                            )}
                            {isRunning ? 'Stop' : 'Start'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={resetGrid}
                            disabled={isRunning || isDrawingPath}
                            className="flex-1 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            <RotateCcw className="mr-2 size-4" />
                            Restart
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        onClick={clearWalls}
                        disabled={isRunning || isDrawingPath}
                        className="w-full rounded-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        <Trash2 className="mr-2 size-4" />
                        Clear Walls
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="bidirectional"
                        checked={bidirectional}
                        onCheckedChange={onChangeBidirectional}
                        disabled={isRunning || isDrawingPath}
                        className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                    />
                    <Label
                        htmlFor="bidirectional"
                        className="text-sm text-slate-300"
                    >
                        Bi-directional
                    </Label>
                </div>
                {/* Speed Control */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-400">
                            Speed
                        </h3>
                        <Badge
                            variant="outline"
                            className={`border-slate-700 bg-slate-800/50 ${
                                speed > 100
                                    ? 'text-amber-400'
                                    : 'text-slate-300'
                            }`}
                        >
                            {getSpeedLabel(speed)}
                            {speed > 100 && (
                                <Zap className="ml-1 inline size-3.5" />
                            )}
                        </Badge>
                    </div>
                    <Slider
                        value={[speed]}
                        min={1}
                        max={200}
                        step={1}
                        onValueChange={(value) => setSpeed(value[0])}
                        disabled={isRunning || isDrawingPath}
                    />
                </div>
            </div>
        </div>
    );
};
