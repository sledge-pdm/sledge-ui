import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { MenuList, type MenuListOption } from '../components/MenuList';

const meta: Meta<typeof MenuList> = {
  title: 'Components/MenuList',
  component: MenuList,
};

export default meta;
type Story = StoryObj<typeof MenuList>;

const options: MenuListOption[] = [
  { type: 'label', label: 'Actions' },
  { type: 'divider', label: '' },
  { type: 'item', label: 'Add' },
  { type: 'item', label: 'Edit' },
  { type: 'item', label: 'Delete', color: 'var(--color-error)' },
];

export const Basic: Story = {
  render: () => {
    const [message, setMessage] = createSignal('Select an item');
    const withActions = options.map((opt) =>
      opt.type === 'item'
        ? {
            ...opt,
            onSelect: () => setMessage(`Selected: ${opt.label}`),
          }
        : opt
    );
    return (
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'flex-start' }}>
        <MenuList options={withActions} closeByOutsideClick={false} style={{ position: 'relative', top: '0', left: '0' }} />
        <p style={{ 'min-width': '160px' }}>{message()}</p>
      </div>
    );
  },
};
