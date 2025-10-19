import { css } from '@acab/ecsstatic';
import { color } from '@sledge/theme';
import { createEffect, createSignal, For, onCleanup, onMount, Show, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import Icon from './Icon';
import type { MenuListOption } from './MenuList';

const menuStyle = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  z-index: var(--zindex-dropdown-menu);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  max-height: 200px;
  overflow-y: auto;
`;

const menuItem = css`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 8px 10px 8px 10px;
  overflow: hidden;
  gap: 12px;
  cursor: pointer;
  &:hover {
    background-color: var(--color-surface);
  }
`;

const itemText = css`
  white-space: nowrap;
  padding: 0;
  inset: 0;
`;

type Coords = { x: number; y: number };

interface Props {
  title?: string;
  options: MenuListOption[];
  open: boolean;
  position: Coords; // 表示位置（スクリーン座標, px）
  onClose?: () => void;
  closeByOutsideClick?: boolean;
}

// 画面外にはみ出さないように位置を調整
const clampToViewport = (x: number, y: number, w: number, h: number, margin = 8) => {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  let nx = x;
  let ny = y;
  if (nx + w > vw - margin) nx = Math.max(margin, vw - w - margin);
  if (ny + h > vh - margin) ny = Math.max(margin, vh - h - margin);
  if (nx < margin) nx = margin;
  if (ny < margin) ny = margin;
  return { x: nx, y: ny };
};

export const ContextMenuList: Component<Props> = (props) => {
  let ref: HTMLUListElement | undefined;
  const [coords, setCoords] = createSignal<Coords>(props.position);

  // 外側クリック／Escでクローズ
  const handleClickOutside = (e: MouseEvent) => {
    if (!props.open) return;
    if (!props.closeByOutsideClick) return;
    if (ref && !ref.contains(e.target as Node)) props.onClose?.();
  };
  const handleKeydown = (e: KeyboardEvent) => {
    if (!props.open) return;
    if (e.key === 'Escape') props.onClose?.();
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', adjustPosition, { passive: true });
    window.addEventListener('scroll', adjustPosition, { passive: true });
  });
  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside, { capture: true } as any);
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', adjustPosition as any);
    window.removeEventListener('scroll', adjustPosition as any);
  });

  // open時にサイズを測って画面内に収める
  const adjustPosition = () => {
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const { x, y } = clampToViewport(props.position.x, props.position.y, rect.width, rect.height);
    setCoords({ x, y });
  };

  onMount(() => queueMicrotask(adjustPosition));
  createEffect(() => {
    // 位置やopenが変わったら再調整
    void props.open; // track
    void props.position.x;
    void props.position.y;
    queueMicrotask(adjustPosition);
  });

  return (
    <Show when={props.open}>
      <Portal>
        <ul
          ref={ref}
          class={menuStyle}
          role='listbox'
          style={{
            position: 'fixed',
            top: `${coords().y}px`,
            left: `${coords().x}px`,
            // menuStyle 側の top/bottom を無効化
            bottom: 'auto',
            right: 'auto',
            'min-width': '120px',
            'margin-top': '4px',
            'border-color': color.onBackground,
            'border-radius': '4px',

            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))',
          }}
          onTransitionEnd={adjustPosition}
        >
          <Show when={props.title}>
            <p style={{ margin: '6px 8px', color: color.muted }}>{props.title}</p>
          </Show>
          <For each={props.options} fallback={<p>no items.</p>}>
            {(option, index) => (
              <li
                class={menuItem}
                role='option'
                style={{
                  'pointer-events': option.disabled ? 'none' : 'all',
                  opacity: option.disabled ? 0.5 : 1,
                  'border-bottom': index() !== props.options.length - 1 ? `1px solid ${color.borderSecondary}` : 'none',
                }}
                onClick={() => {
                  option.onSelect?.();
                  props.onClose?.();
                }}
              >
                {/* icon は 8x8 前提 */}
                <Show when={option.icon} fallback={<div style={{ width: '8px', height: '8px' }} />}>
                  <Icon src={option.icon!} base={8} color={color.onBackground} />
                </Show>
                <p class={itemText} style={{ 'font-family': 'k12x8', 'font-size': '8px', 'padding-top': '1px', 'margin-bottom': '-1px' }}>
                  {option.label}
                </p>
              </li>
            )}
          </For>
        </ul>
      </Portal>
    </Show>
  );
};

export default ContextMenuList;
