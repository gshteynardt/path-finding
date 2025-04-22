import type { Meta, StoryObj } from '@storybook/react';

import { Showcase } from '@/shared/components/demo/Showcase/Showcase';
import { ShowcaseItem } from '@/shared/components/demo/ShowcaseItem/ShowcaseItem';
import { GridCell } from '@/shared/components/GridCell';
import { CellState } from '@/shared/types';
import { getCellDistance, getCellColor } from '@/shared/utils';

const INF = 100;

const meta = {
    title: 'Example/GridCell',
    component: GridCell,
    parameters: {
        // Optional parameter to center the component in the Canvas.
        // More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GridCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareEmpty: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.EMPTY),
    },
};

export const SquareStart: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.START),
    },
};

export const SquareEnd: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.END),
    },
};

export const SquareQueue: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.QUEUE),
    },
};

export const SquareVisited: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.VISITED),
        distance: 10,
    },
};

export const SquareWall: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.WALL),
    },
};

export const SquarePath: Story = {
    args: {
        shape: 'square',
        size: 30,
        color: getCellColor(CellState.PATH),
        distance: 10,
    },
};

const states = Object.values(CellState);

const cells = states.map((state) => ({
    row: 0,
    col: 0,
    state,
    distance: 10,
    parent: null,
}));

export const GridCellShowcase = {
    name: 'Showcase',
    render: () => (
        <div className="flex flex-col gap-12">
            <Showcase title="grid cell square">
                {cells.map((cell) => (
                    <ShowcaseItem key={cell.state} title={cell.state}>
                        <GridCell
                            shape="square"
                            color={getCellColor(cell.state)}
                            size={30}
                            distance={getCellDistance(cell, INF)}
                        />
                    </ShowcaseItem>
                ))}
            </Showcase>
            <Showcase title="grid cell hexagon">
                {cells.map((cell) => (
                    <ShowcaseItem key={cell.state} title={cell.state}>
                        <GridCell
                            shape="hexagon"
                            color={getCellColor(cell.state)}
                            size={30}
                            distance={getCellDistance(cell, INF)}
                        />
                    </ShowcaseItem>
                ))}
            </Showcase>
        </div>
    ),
};
