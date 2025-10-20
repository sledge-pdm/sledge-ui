import { css } from '@acab/ecsstatic';
import { clsx } from '@sledge/core';
import { color, fonts } from '@sledge/theme';
import { createEffect, createMemo, createSignal, For, type JSX, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import Icon from '../Icon';

// Recreate previous style tokens via CSS variables (vars -> CSS custom properties)
const dropdownContainer = css`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
`;

const triggerButton = css`
  display: flex;
  flex-direction: row;
  background-color: var(--color-controls);
  border: 1px solid var(--color-border);
  padding: 5px 11px 5px 11px;
  width: fit-content;
  text-align: left;
  min-width: 100px;
  max-width: 100%;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  &:hover {
    transform: none;
  }
  &:hover {
    background-color: var(--color-button-hover);
  }
  &:active {
    background-color: var(--color-button-hover);
  }
`;

const triggerButtonNoBG = css`
  background: none !important;
  background-color: none !important;
  border: none !important;
`;

const menuStyle = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  z-index: var(--zindex-dropdown-menu);
  background-color: var(--color-controls);
  border: 1px solid var(--color-border);
  margin-top: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  min-width: 100px;
  overflow-y: auto;
  width: fit-content;
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-on-background);
  }
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

const menuItem = css`
  z-index: var(--zindex-dropdown-menu);
  padding: 8px 10px 8px 10px;
  cursor: pointer;
  &:hover {
    background-color: var(--color-surface);
  }
`;

const itemText = css`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color-on-background);
`;

export type DropdownOption<T extends string | number> = {
  label: string;
  value: T;
};

interface Props<T extends string | number = string> {
  value: T | (() => T);
  onChange?: (value: T) => void;
  options: DropdownOption<T>[];
  fullWidth?: boolean;
  align?: 'left' | 'right';
  props?: JSX.HTMLAttributes<HTMLDivElement>;
  noBackground?: boolean;
  wheelSpin?: boolean;
  disabled?: boolean;
  fontFamily?: string;
  title?: string;
}

const Dropdown = <T extends string | number>(p: Props<T>) => {
  p.align = p.align ?? 'left';

  let containerRef: HTMLDivElement | undefined;
  let menuRef: HTMLUListElement | undefined;

  const [open, setOpen] = createSignal(false);
  const [dir, setDir] = createSignal<'down' | 'up'>('down');
  type Coords = { x: number; y: number };
  const [coords, setCoords] = createSignal<Coords>({ x: 0, y: 0 });

  const getValue = () => (typeof p.value === 'function' ? (p.value as () => T)() : p.value);
  const selectedLabel = createMemo(() => {
    const opt = p.options.find((o) => o.value === (typeof p.value === 'function' ? p.value() : p.value));
    return opt?.label ?? '';
  });

  const getLongestLabel = () => Math.max(...p.options.map((o) => o.label.length));
  const getAdjustedLabel = (label?: string) => label?.padEnd(getLongestLabel());

  const toggle = () => {
    setOpen(!open());
    if (open()) decideDirection();
  };
  const select = (option: DropdownOption<T>) => {
    p.onChange?.(option.value);
    setOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  // メニューを開く直前に上下どちらに出すか判定
  const decideDirection = () => {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    // menuRef がまだ無い＝初回は最大高さ(200)で概算
    const menuH = menuRef ? Math.min(menuRef.scrollHeight, 200) : 200;
    setDir(spaceBelow < menuH && spaceAbove > spaceBelow ? 'up' : 'down');
  };

  // 画面外にはみ出さないように位置を調整
  const clampToViewport = (x: number, y: number, w: number, h: number, margin = 4) => {
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

  // Portal 先で表示するため、viewport 基準の固定座標を算出
  const adjustPosition = () => {
    if (!containerRef || !menuRef) return;
    const trigger = containerRef.getBoundingClientRect();
    const menuRect = menuRef.getBoundingClientRect();
    const w = menuRect.width || 160; // fallback
    const h = Math.min(menuRef.scrollHeight, 200) || 160;

    // 横位置
    let x = p.align === 'left' ? trigger.left : trigger.right - w;
    // 縦位置（dir に応じる）
    let y = dir() === 'down' ? trigger.bottom : trigger.top - h;

    const clamped = clampToViewport(x, y, w, h);
    setCoords(clamped);
  };

  onMount(() => {
    const onResize = () => open() && adjustPosition();
    const onScroll = () => open() && adjustPosition();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize as any);
      window.removeEventListener('scroll', onScroll as any);
    };
  });

  // open 変更時や dir 判定後に位置を更新
  createEffect(() => {
    if (open()) {
      queueMicrotask(() => {
        decideDirection();
        adjustPosition();
      });
    }
  });

  const noItem = createMemo<boolean>(() => p.options.length === 0);

  const spin = (isUp: boolean) => {
    const currentIndex = p.options.findIndex((option) => option.value === getValue());
    const nextIndex = isUp ? (currentIndex + 1) % p.options.length : (currentIndex - 1 + p.options.length) % p.options.length;
    const next = p.options[nextIndex].value as T;

    p.onChange?.(next);
  };

  return (
    <div
      class={dropdownContainer}
      ref={containerRef}
      {...p.props}
      onWheel={(e) => {
        if (noItem() || p.disabled) return;
        if (p.wheelSpin === undefined || p.wheelSpin) {
          e.preventDefault();
          spin(e.deltaY > 0);
        }
      }}
      title={p.title}
    >
      <button
        type='button'
        class={clsx(triggerButton, p.noBackground && triggerButtonNoBG)}
        style={{
          display: 'flex',
          'flex-direction': 'row',
          'align-items': 'center',
          'box-sizing': 'border-box',
          overflow: 'hidden',
          opacity: p.disabled || noItem() ? 0.5 : 1,
          cursor: p.disabled || noItem() ? 'not-allowed' : 'pointer',
          'pointer-events': p.disabled || noItem() ? 'none' : 'all',
          width: p.fullWidth ? '100%' : undefined,
        }}
        onClick={toggle}
        aria-haspopup='listbox'
        aria-expanded={open()}
      >
        <p class={itemText} style={{ 'font-family': p.fontFamily ?? fonts.ZFB08, width: p.fullWidth ? '100%' : undefined }}>
          {noItem() ? '- no item -' : getAdjustedLabel(selectedLabel())}
        </p>
        <div>
          <Icon src={'/icons/misc/triangle_7.png'} base={7} color={color.onBackground} style={{ opacity: 0.75 }} />
        </div>
      </button>
      <Show when={open()}>
        <Portal>
          <ul
            ref={menuRef}
            class={clsx(menuStyle, menuDirection[dir()])}
            role='listbox'
            style={{
              position: 'fixed',
              top: `${coords().y}px`,
              left: `${coords().x}px`,
              bottom: 'auto',
              right: 'auto',
            }}
            onTransitionEnd={adjustPosition}
          >
            <For each={p.options}>
              {(option) => (
                <li class={menuItem} role='option' aria-selected={option.value === getValue()} onClick={() => select(option)}>
                  <p class={itemText} style={{ 'font-family': p.fontFamily ?? fonts.ZFB08 }}>
                    {getAdjustedLabel(option.label)}
                  </p>
                </li>
              )}
            </For>
          </ul>
        </Portal>
      </Show>
    </div>
  );
};

export default Dropdown;
