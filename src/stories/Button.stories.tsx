import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  render: () => <Button>Primary</Button>,
};

export const HoverText: Story = {
  render: () => (
    <Button hoverContent='Copied' hoverColor='var(--color-accent)'>
      Copy
    </Button>
  ),
};
