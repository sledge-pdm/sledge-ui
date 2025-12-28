import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Checkbox from '../components/control/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Control/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  render: () => {
    const [checked, setChecked] = createSignal(true);
    return <Checkbox label='Enable feature' checked={checked()} onChange={setChecked} />;
  },
};

export const LabelLeft: Story = {
  render: () => {
    const [checked, setChecked] = createSignal(false);
    return <Checkbox label='Left label' labelMode='left' checked={checked()} onChange={setChecked} />;
  },
};
