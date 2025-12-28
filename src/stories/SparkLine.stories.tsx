import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SparkLine } from '../components/SparkLine';

const meta: Meta<typeof SparkLine> = {
  title: 'Components/SparkLine',
  component: SparkLine,
};

export default meta;
type Story = StoryObj<typeof SparkLine>;

export const Basic: Story = {
  render: () => {
    const height = 40;
    const length = 40;
    // 20 items
    const [values, setValues] = createSignal<number[]>([
      // 2, 4, 6, 8, 10, 8, 6, 7, 9, 11, 10, 9, 12, 14, 13, 15, 17, 16, 14, 12, 10, 9, 8, 10, 12, 13, 11, 9, 8, 6, 5, 7, 9, 12, 14, 13, 12, 11, 10, 9,
    ]);

    const rnd = () => Math.floor(Math.random() * height);

    const defaultValues: number[] = [];
    for (let i = 0; i < length; i++) {
      defaultValues.push(rnd());
    }
    setValues(defaultValues);

    setInterval(() => {
      if (values().length >= length) setValues(values().slice(1, length));
      setValues((arr) => {
        return [...arr, rnd()];
      });
    }, 100);

    return <SparkLine height={height} length={40} lengthMult={4} values={values()} color='#FF00FF' />;
  },
};
