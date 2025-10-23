import { css } from '@acab/ecsstatic';
import { Show, type Accessor, type Component } from 'solid-js';

const outerContainer = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
const background = css`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const cursor = css`
  margin: 0;
  padding: 0;
  backdrop-filter: invert();
  filter: grayscale() contrast(20) contrast(20);
`;
const disabledBorder = css`
  position: absolute;
  margin: 0;
  padding: 0;
  width: 150%;
  height: 1px;
  top: 50%;
  transform-origin: 50% 50%;
  transform: translateY(-50%) rotate(45deg);
  backdrop-filter: invert(50%);
`;

interface ColorBoxProps {
  class?: string;
  enableUsingSelection?: boolean;
  sizePx?: number;
  color: string;
  forceBorderColor?: string;
  showDisabledBorder?: boolean;
  onClick?: (color: string) => void;
  currentColor?: Accessor<string>;
}

const ColorBox: Component<ColorBoxProps> = (props: ColorBoxProps) => {
  const size = () => props.sizePx || 10;

  const isSelected = () => props.currentColor?.() === props.color;
  const isWhiteOrNone = () => props.color === 'none' || props.color.toLowerCase() === '#ffffff';

  const preferedBorder = () => (isWhiteOrNone() || isSelected() ? `1px solid var(--color-on-background)` : `1px solid var(--color-border)`);

  const onColorClicked = (color: string) => {
    if (props.onClick) props.onClick(color);
  };

  return (
    <div class={props.class}>
      <div
        class={outerContainer}
        style={{
          width: `${size()}px`,
          height: `${size()}px`,
        }}
        onClick={() => {
          onColorClicked(props.color);
        }}
      >
        <div
          class={background}
          style={{
            width: `${size()}px`,
            height: `${size()}px`,
            'background-color': props.color,
            border: props.forceBorderColor ? `1px solid ${props.forceBorderColor}` : preferedBorder(),
          }}
        />

        <Show when={props.enableUsingSelection && isSelected()}>
          <div
            class={cursor}
            style={{
              width: `${Math.round(size() / 3)}px`,
              height: `${Math.round(size() / 3)}px`,
            }}
            onClick={() => {
              onColorClicked(props.color);
            }}
          />
        </Show>

        <Show when={props.showDisabledBorder && !isSelected()}>
          <div class={disabledBorder} />
        </Show>
      </div>
    </div>
  );
};

export default ColorBox;
