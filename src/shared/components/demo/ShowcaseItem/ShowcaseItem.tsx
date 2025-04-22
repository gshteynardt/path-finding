import type { ReactNode } from 'react';

export type Props = {
    title: string;
    children: ReactNode;
};

export const ShowcaseItem = ({ title, children }: Props) => {
    return (
        <div>
            <div className="text-lg font-semibold leading-snug mb-3">
                {title}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};
