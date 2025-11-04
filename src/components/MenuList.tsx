import { css } from '@acab/ecsstatic';
import { clsx } from '@sledge/core';
import { color } from '@sledge/theme';
import { type Component, For, type JSX, onCleanup, onMount, Show } from 'solid-js';

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

interface Props extends Omit<JSX.HTMLAttributes<HTMLUListElement>, 'onClick'> {
  options: MenuListOption[];
  align?: 'left' | 'right'; // メニューの配置
  menuDir?: 'down' | 'up';
  appearance?: 'simple' | 'emphasis';
  closeByOutsideClick?: boolean; // メニュー外クリックで閉じるかどうか
  onClose?: () => void; // メニューが閉じるときのコールバック
}

export const MenuList: Component<Props> = (props) => {
  props.appearance = props.appearance ?? 'emphasis';
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

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('wheel', handleScrollOutside);
  });
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('wheel', handleScrollOutside);
  });

  const menuStyleAdd = props.appearance === 'simple' ? menuStyleSimple : menuStyleEmphasis;

  return (
    <ul
      {...props}
      ref={containerRef}
      class={clsx(menuStyle, menuStyleAdd, menuDirection[dir])}
      role='listbox'
      style={{
        ...(typeof props.style === 'object' ? props.style : {}),
        left: props.align === 'right' ? 'auto' : '0px',
        right: props.align === 'right' ? '0px' : 'auto',
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
                  <img src={option.icon} alt={option.label} width='8' height='8' />
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
                  <img src={option.icon} alt={option.label} width='8' height='8' />
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
