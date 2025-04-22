import { CellState } from '@/shared/types';
import type { Cell } from '@/shared/types';

export const getCellColor = (state: CellState) => {
    switch (state) {
        case CellState.EMPTY:
            return 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/50';
        case CellState.WALL:
            return 'bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700/80 shadow-lg';
        case CellState.START:
            return 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400 cursor-grab active:cursor-grabbing';
        case CellState.END:
            return 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] border border-rose-400 cursor-grab active:cursor-grabbing';
        case CellState.VISITED:
            return 'bg-violet-600/90 shadow-[0_0_15px_rgba(139,92,246,0.6)] border border-violet-400 ring-2 ring-violet-500/40';
        case CellState.QUEUE:
            return 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_12px_rgba(14,165,233,0.6)] border border-sky-300/60';
        case CellState.PATH:
            return 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.6)] border border-amber-300';
        default:
            return 'bg-slate-900/80 border border-slate-800/50';
    }
};

export const getCellDistance = (cell: Cell, inf: number) => {
    if ((cell.state === CellState.VISITED || cell.state === CellState.PATH) && cell.distance !== inf) {
        return cell.distance;
    }
};
