import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ColorBox from '../components/ColorBox';

const meta: Meta<typeof ColorBox> = {
  title: 'Components/ColorBox',
  component: ColorBox,
};

export default meta;
type Story = StoryObj<typeof ColorBox>;

export const Palette: Story = {
  render: () => {
    const [current, setCurrent] = createSignal('#ffcc00');
    const colors = ['#ffcc00', '#00ccff', '#ff66cc', '#ffffff', '#000000'];
    return (
      <div style={{ display: 'flex', gap: '6px' }}>
        {colors.map((color) => (
          <ColorBox
            color={color}
            sizePx={14}
            enableUsingSelection
            currentColor={current}
            onClick={(rgba) => {
              const [r, g, b] = rgba;
              setCurrent(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
            }}
          />
        ))}
      </div>
    );
  },
};
