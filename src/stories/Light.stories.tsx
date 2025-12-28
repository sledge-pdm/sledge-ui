import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Light from '../components/Light';
import ToggleSwitch from '../components/control/ToggleSwitch';

const meta: Meta<typeof Light> = {
  title: 'Components/Light',
  component: Light,
};

export default meta;
type Story = StoryObj<typeof Light>;

export const Basic: Story = {
  render: () => {
    const [on, setOn] = createSignal(true);
    return (
      <div style={{ display: 'flex', gap: '10px', 'align-items': 'center' }}>
        <Light on={on()} />
        <ToggleSwitch checked={on()} onChange={setOn}>
          Power
        </ToggleSwitch>
      </div>
    );
  },
};
