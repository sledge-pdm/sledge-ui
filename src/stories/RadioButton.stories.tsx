import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import RadioButton from '../components/control/RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Control/RadioButton',
  component: RadioButton,
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = createSignal<'a' | 'b'>('a');
    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <RadioButton
          name='radio-group'
          label='Option A'
          value={selected() === 'a'}
          onChange={(checked) => checked && setSelected('a')}
        />
        <RadioButton
          name='radio-group'
          label='Option B'
          value={selected() === 'b'}
          onChange={(checked) => checked && setSelected('b')}
        />
      </div>
    );
  },
};
