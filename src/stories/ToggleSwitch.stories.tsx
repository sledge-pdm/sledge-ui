import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ToggleSwitch from '../components/control/ToggleSwitch';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Control/ToggleSwitch',
  component: ToggleSwitch,
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Basic: Story = {
  render: () => {
    const [checked, setChecked] = createSignal(true);
    return (
      <ToggleSwitch checked={checked()} onChange={setChecked}>
        Enable
      </ToggleSwitch>
    );
  },
};

export const LabelRight: Story = {
  render: () => {
    const [checked, setChecked] = createSignal(false);
    return (
      <ToggleSwitch checked={checked()} onChange={setChecked} labelMode='right'>
        Right label
      </ToggleSwitch>
    );
  },
};
