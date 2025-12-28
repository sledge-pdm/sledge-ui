import { colorMatch, hexToRGBA, hexWithSharpToRGBA, RGBAToHex, type RGBA } from '@sledge/anvil';
import { createMemo, Show, type Accessor, type Component } from 'solid-js';
import '../styles/ColorBox.css';

interface ColorBoxProps {
  class?: string;
  enableUsingSelection?: boolean;
  sizePx?: number;
  color: string | RGBA;
  forceBorderColor?: string;
  showDisabledBorder?: boolean;
  onClick?: (color: RGBA) => void;
  currentColor?: Accessor<string | RGBA>;
}

const ColorBox: Component<ColorBoxProps> = (props: ColorBoxProps) => {
  const size = () => props.sizePx || 10;

  const getRgba = (value: string | RGBA): RGBA => {
    if (typeof value === 'string') {
      if (value.startsWith('#')) return hexWithSharpToRGBA(value);
      else return hexToRGBA(value);
    }
    return value;
  };

  const getHexWithSharp = (value: string | RGBA): string => {
    if (typeof value === 'string') {
      if (value.startsWith('#')) return value;
      else return `#${value}`;
    }
    return RGBAToHex(value, {
      excludeAlpha: true,
      withSharp: true,
    });
  };

  const colorRgba = createMemo<RGBA>(() => getRgba(props.color));
  const colorHexWithSharp = createMemo<string>(() => getHexWithSharp(props.color));
  const currentColorRgba = createMemo<RGBA | undefined>(() => {
    if (!props.currentColor) return undefined;
    return getRgba(props.currentColor());
  });

  const isSelected = () => {
    const current = currentColorRgba();
    return current ? colorMatch(current, colorRgba()) : false;
  };
  const isWhiteOrNone = () => props.color === 'none' || colorHexWithSharp().toLowerCase() === '#ffffff';

  const preferedBorder = () => (isWhiteOrNone() || isSelected() ? `1px solid var(--color-on-background)` : `1px solid var(--color-border)`);

  const onColorClicked = (color: RGBA) => {
    if (props.onClick) props.onClick(color);
  };

  return (
    <div class={props.class}>
      <div
        class='color-box-outer'
        style={{
          width: `${size()}px`,
          height: `${size()}px`,
        }}
        onClick={() => {
          onColorClicked(colorRgba());
        }}
      >
        <div
          class='color-box-bg'
          style={{
            width: `${size()}px`,
            height: `${size()}px`,
            'background-color': colorHexWithSharp(),
            border: props.forceBorderColor ? `1px solid ${props.forceBorderColor}` : preferedBorder(),
          }}
        />

        <Show when={props.enableUsingSelection && isSelected()}>
          <div
            class='color-box-cursor'
            style={{
              width: `${Math.round(size() / 3)}px`,
              height: `${Math.round(size() / 3)}px`,
            }}
            onClick={() => {
              onColorClicked(colorRgba());
            }}
          />
        </Show>

        <Show when={props.showDisabledBorder && !isSelected()}>
          <div class='color-box-disabled-border' />
        </Show>
      </div>
    </div>
  );
};

export default ColorBox;
