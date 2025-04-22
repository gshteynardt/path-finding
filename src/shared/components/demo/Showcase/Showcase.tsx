import type { ReactNode } from 'react';

export type Props = {
    className?: string;
    title?: string;
    description?: ReactNode;
    children: ReactNode;
};

export const Showcase = ({
    title,
    description,
    className = '',
    children,
}: Props) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {title && (
                <div className="text-2xl leading-tight font-bold">
                    {title}
                </div>
            )}
            {description && (
                <div className="text-base leading-relaxed font-normal">
                    {description}
                </div>
            )}
            <div
                className={`flex flex-wrap gap-6 flex-grow ${
                    title || description ? 'mt-5' : ''
                }`}
            >
                {children}
            </div>
        </div>
    );
};
