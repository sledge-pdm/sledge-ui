import { clsx } from '@sledge/core';
import { color } from '@sledge/theme';
import { type Component, For, type JSX, onCleanup, onMount, Show } from 'solid-js';
import Icon from './Icon';
import '../styles/MenuList.css';

const menuDirection = {
  down: 'menu-dir-down',
  up: 'menu-dir-up',
} as const;

export interface MenuListOption {
  type: 'item' | 'label' | 'divider';
  icon?: string; // 8x8
  title?: string;
  label: string;
  disabled?: boolean;
  color?: string;
  fontFamily?: string;
  onSelect?: () => void;
  retainAfterSelect?: boolean;
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
  const menuStyleAdd = appearance === 'simple' ? 'menu-simple' : 'menu-emphasis';

  return (
    <ul
      {...props}
      ref={containerRef}
      class={clsx('menu', menuDirection[dir], menuStyleAdd)}
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
                class='menu-item'
                role='option'
                title={option.title}
                style={{
                  'pointer-events': option.disabled ? 'none' : 'all',
                  opacity: option.disabled ? 0.5 : 1,
                }}
                onClick={() => {
                  option.onSelect?.();
                  if (!option.retainAfterSelect) props.onClose?.();
                }}
              >
                <Show when={option.icon}>
                  <div>
                    <Icon src={option.icon!} base={8} color={option.color ?? color.onBackground} />
                  </div>
                </Show>
                <p
                  class='menu-item-text'
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
              <li class='menu-label' role='option' title={option.title}>
                <Show when={option.icon}>
                  <div>
                    <Icon src={option.icon!} base={8} color={option.color ?? color.onBackground} />
                  </div>
                </Show>
                <p
                  class='menu-item-text'
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
            return <div class='menu-divider' />;
          }
        }}
      </For>
    </ul>
  );
};
