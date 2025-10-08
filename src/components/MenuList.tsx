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

const menuDirection = {
  down: css`
    top: 100%;
    bottom: auto;
    margin-top: 0px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  up: css`
    top: auto;
    bottom: 100%;
    margin-bottom: 0px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  `,
};

export interface MenuListOption {
  icon?: string; // 8x8
  label: string;
  disabled?: boolean;
  color?: string;
  onSelect?: () => void;
}

interface Props extends Omit<JSX.HTMLAttributes<HTMLUListElement>, 'onClick'> {
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

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <ul
      {...props}
      ref={containerRef}
      class={clsx(menuStyle, menuDirection[dir])}
      role='listbox'
      style={{
        ...(typeof props.style === 'object' ? props.style : {}),
        left: props.align === 'right' ? 'auto' : '0px',
        right: props.align === 'right' ? '0px' : 'auto',
      }}
    >
      <For each={props.options} fallback={<li>選択肢がありません</li>}>
        {(option) => (
          <li
            class={menuItem}
            role='option'
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
            <p class={itemText} style={{ color: option.color ?? color.onBackground }}>
              {option.label}
            </p>
          </li>
        )}
      </For>
    </ul>
  );
};
