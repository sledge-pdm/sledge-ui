import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Slider from '../components/control/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Control/Slider',
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = createSignal(35);
    return (
      <div style={{ width: '200px' }}>
        <Slider min={0} max={100} value={value()} onChange={setValue} labelMode='right' allowDirectInput wheelSpin dblClickResetValue={50} />
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = createSignal(60);
    return (
      <div style={{ height: '200px' }}>
        <Slider min={0} max={100} value={value()} onChange={setValue} labelMode='right' orientation='vertical' labelWidth={48} />;
      </div>
    );
  },
};
