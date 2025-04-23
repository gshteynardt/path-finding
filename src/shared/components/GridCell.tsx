'use client';

import type { GridShape } from '@/shared/types';

export type Props = {
    className?: string;
    distance?: number;
    id: number;
    shape: GridShape;
    size: number;
    color: string;
};

export const GridCell = (props: Props) => {
    const { className, id, shape, size, distance, color } = props;
    const cellShape = shape === 'square' ? 'rounded-sm' : 'rounded-full';

    return (
        <div
            className={`${color} will-change-transform transition-colors duration-300 ease-in-out ${cellShape} ${className} relative flex items-center justify-center`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
            data-id={id}
        >
            {distance && (
                <span className="text-xs font-bold text-white/90 select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    {distance}
                </span>
            )}
        </div>
    );
};
