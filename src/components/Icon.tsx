import { createSignal, type Component, type JSX, splitProps } from 'solid-js';

interface IconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** 透明背景 + 白(255,255,255) で描いた αマスク PNG */
  src: string;
  /** 塗り色。未指定なら currentColor を継承 */
  color?: string;
  hoverColor?: string;
  /** 整数倍率。1 = 元サイズそのまま（既定） */
  scale?: number;
  /** 元PNG のドット数（正方形前提）。省略時 16 */
  base?: number;

  transform?: string;
  filter?: string;
  backdropFilter?: string;
}

const Icon: Component<IconProps> = (props: IconProps) => {
  const [local, rest] = splitProps(props, ['src', 'color', 'hoverColor', 'scale', 'base', 'transform', 'filter', 'backdropFilter']);
  const px = (local.base ?? 16) * (local.scale ?? 1);
  const [isHover, setIsHover] = createSignal(false);
  const onMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    setIsHover(true);
    rest.onMouseEnter?.(event);
  };
  const onMouseLeave: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    setIsHover(false);
    rest.onMouseLeave?.(event);
  };

  return (
    <div
      {...rest}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        backgroundColor: isHover() ? local.hoverColor ?? local.color ?? 'currentColor' : local.color ?? 'currentColor',
        mask: `url("${local.src}") center/contain no-repeat`,
        '-webkit-mask': `url("${local.src}") center/contain no-repeat`,
        imageRendering: 'pixelated',
        transform: local.transform,
        '-webkit-transform': local.transform,
        filter: local.filter,
        '-webkit-filter': local.filter,
        'backdrop-filter': local.backdropFilter,
        '-webkit-backdrop-filter': local.backdropFilter,
      }}
    />
  );
};

export default Icon;
