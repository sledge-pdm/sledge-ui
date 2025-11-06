import { css } from '@acab/ecsstatic';
import { clsx } from '@sledge/core';
import { color } from '@sledge/theme';
import { type Component, For, type JSX, onCleanup, onMount, Show } from 'solid-js';
import Icon from './Icon';

const menuStyle = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  z-index: var(--zindex-dropdown-menu);
  background-color: var(--color-background);
  overflow-y: auto;
`;

const menuStyleSimple = css`
  border: 1px solid var(--color-border);
  border-radius: 1px;
`;

const menuStyleEmphasis = css`
  border: 1px solid var(--color-on-background);
  border-radius: 4px;
`;

const menuItem = css`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 8px 10px 8px 10px;
  overflow: hidden;
  gap: 12px;
  z-index: var(--zindex-dropdown-menu);
  cursor: pointer;
  &:hover {
    background-color: var(--color-surface);
  }
`;
const menuLabel = css`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 6px 10px 2px 10px;
  overflow: hidden;
  gap: 12px;
  opacity: 0.8;
`;

const divider = css`
  height: 1px;
  background-color: var(--color-border);
  margin: 1px 4px;
`;

const itemText = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 100%;
`;

const menuDirection = {
  down: css`
    top: 100%;
    bottom: auto;
    margin-top: 0px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  `,
  up: css`
    top: auto;
    bottom: 100%;
    margin-bottom: 0px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.25);
  `,
};

export interface MenuListOption {
  type: 'item' | 'label' | 'divider';
  icon?: string; // 8x8
  title?: string;
  label: string;
  disabled?: boolean;
  color?: string;
  fontFamily?: string;
  onSelect?: () => void;
}

export type MenuListAppearance = 'simple' | 'emphasis';

interface Props extends Omit<JSX.HTMLAttributes<HTMLUListElement>, 'onClick'> {
  appearance?: MenuListAppearance;
  options: MenuListOption[];
  align?: 'left' | 'right'; // メニューの配置
  menuDir?: 'down' | 'up';
  closeByOutsideClick?: boolean; // メニュー外クリックで閉じるかどうか
  onClose?: () => void; // メニューが閉じるときのコールバック
}

export const MenuList: Component<Props> = (props) => {
  let containerRef: HTMLUListElement | undefined;
  const dir = props.menuDir ?? 'down';

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      props.onClose?.();
    }
  };
  const handleScrollOutside = (e: WheelEvent) => {
    if (containerRef && !containerRef.contains(e.currentTarget as Node)) {
      props.onClose?.();
    }
  };
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onClose?.();
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    if (props.closeByOutsideClick !== false) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('wheel', handleScrollOutside);
    }
  });
  onCleanup(() => {
    document.removeEventListener('keydown', handleKeydown);
    if (props.closeByOutsideClick !== false) {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('wheel', handleScrollOutside);
    }
  });

  const appearance = props.appearance ?? 'emphasis';
  const menuStyleAdd = appearance === 'simple' ? menuStyleSimple : menuStyleEmphasis;

  return (
    <ul
      {...props}
      ref={containerRef}
      class={clsx(menuStyle, menuDirection[dir], menuStyleAdd)}
      role='listbox'
      style={{
        left: props.align === 'right' ? 'auto' : '0px',
        right: props.align === 'right' ? '0px' : 'auto',
        ...(typeof props.style === 'object' ? props.style : {}),
      }}
      onWheel={(e) => {
        e.stopImmediatePropagation();
      }}
    >
      <For each={props.options} fallback={<p>no items</p>}>
        {(option) => {
          if (option.type === 'item') {
            return (
              <li
                class={menuItem}
                role='option'
                title={option.title}
                style={{
                  'pointer-events': option.disabled ? 'none' : 'all',
                  opacity: option.disabled ? 0.5 : 1,
                }}
                onClick={() => {
                  option.onSelect?.();
                  props.onClose?.();
                }}
              >
                <Show when={option.icon}>
                  <div>
                    <Icon src={option.icon!} base={8} color={option.color ?? color.onBackground} />
                  </div>
                </Show>
                <p
                  class={itemText}
                  style={{
                    'font-family': option.fontFamily,
                    color: option.color ?? color.onBackground,
                  }}
                >
                  {option.label}
                </p>
              </li>
            );
          } else if (option.type === 'label') {
            return (
              <li class={menuLabel} role='option' title={option.title}>
                <Show when={option.icon}>
                  <div>
                    <Icon src={option.icon!} base={8} color={option.color ?? color.onBackground} />
                  </div>
                </Show>
                <p
                  class={itemText}
                  style={{
                    'font-family': option.fontFamily,
                    color: option.color ?? color.onBackground,
                  }}
                >
                  {option.label}
                </p>
              </li>
            );
          } else {
            return <div class={divider} />;
          }
        }}
      </For>
    </ul>
  );
};
