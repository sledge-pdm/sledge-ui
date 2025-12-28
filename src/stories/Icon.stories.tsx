import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Icon from '../components/Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
};

export default meta;
type Story = StoryObj<typeof Icon>;

const iconSrc = 'assets/icons/tools/pen.png';
export const Basic: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon src={iconSrc} base={8} color='var(--color-on-background)' />
      <Icon src={iconSrc} base={8} scale={2} color='var(--color-on-background)' />
      <Icon src={iconSrc} base={8} scale={3} color='var(--color-on-background)' />
      <Icon src={iconSrc} base={8} scale={4} color='var(--color-on-background)' />
    </div>
  ),
};

export const Hover: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon src={iconSrc} base={8} color='var(--color-on-background-secondary)' hoverColor='var(--color-accent)' />
      <Icon src={iconSrc} base={8} scale={2} color='var(--color-on-background-secondary)' hoverColor='var(--color-accent)' />
      <Icon src={iconSrc} base={8} scale={3} color='var(--color-on-background-secondary)' hoverColor='var(--color-accent)' />
      <Icon src={iconSrc} base={8} scale={4} color='var(--color-on-background-secondary)' hoverColor='var(--color-accent)' />
    </div>
  ),
};
