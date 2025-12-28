import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ContextMenuList from '../components/ContextMenuList';
import type { MenuListOption } from '../components/MenuList';

const meta: Meta<typeof ContextMenuList> = {
  title: 'Components/ContextMenuList',
  component: ContextMenuList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenuList>;

const options: MenuListOption[] = [
  { type: 'label', label: 'Menu' },
  { type: 'divider', label: '' },
  { type: 'item', label: 'Rename' },
  { type: 'item', label: 'Duplicate' },
  { type: 'item', label: 'Delete', color: 'var(--color-error)' },
];

export const Basic: Story = {
  render: () => <ContextMenuList appearance='emphasis' options={options} position={{ x: 120, y: 80 }} onClose={() => {}} />,
};
