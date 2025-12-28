import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Dropdown, { type DropdownOption } from '../components/control/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Control/Dropdown',
  component: Dropdown,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const options: DropdownOption<string>[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export const Basic: Story = {
  render: () => {
    const [value, setValue] = createSignal(options[0].value);
    return <Dropdown value={value} onChange={setValue} options={options} />;
  },
};

export const SimpleAppearance: Story = {
  render: () => {
    const [value, setValue] = createSignal(options[1].value);
    return <Dropdown value={value} onChange={setValue} options={options} appearance='simple' />;
  },
};
