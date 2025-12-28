import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from '../components/Button';
import { showContextMenu } from '../components/ContextMenuListBuilder';

const meta: Meta = {
  title: 'Components/ContextMenuListBuilder',
};

export default meta;
type Story = StoryObj;

export const ShowMenu: Story = {
  render: () => {
    const [count, setCount] = createSignal(0);
    return (
      <Button
        onClick={(e) => {
          showContextMenu(
            [
              { type: 'item', label: 'Count +1', onSelect: () => setCount((c) => c + 1) },
              { type: 'item', label: 'Reset', onSelect: () => setCount(0) },
            ],
            e
          );
        }}
      >
        Open menu (count: {count()})
      </Button>
    );
  },
};
