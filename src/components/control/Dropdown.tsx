import { clsx } from '@sledge/core';
import { createEffect, createMemo, createSignal, type JSX, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import '../../styles/Dropdown.css';
import { MenuList, type MenuListAppearance, type MenuListOption } from '../MenuList';
import { fonts } from 'src/theme/fonts';

const menuDirection = {
  down: 'dropdown-menu-down',
  up: 'dropdown-menu-up',
} as const;

export type DropdownOption<T extends string | number> = {
  label: string;
  value: T;
};

interface Props<T extends string | number = string> {
  ref?: (ref: HTMLElement) => void;
  value: T | (() => T);
  onChange?: (value: T) => void;
  options: DropdownOption<T>[];
  fullWidth?: boolean;
  align?: 'left' | 'right';
  props?: JSX.HTMLAttributes<HTMLDivElement>;
  buttonProps?: JSX.HTMLAttributes<HTMLButtonElement>;
  noBackground?: boolean;
  wheelSpin?: boolean;
  disabled?: boolean;
  fontFamily?: string;
  title?: string;
  appearance?: MenuListAppearance;
}

const Dropdown = <T extends string | number>(p: Props<T>) => {
  p.align = p.align ?? 'left';
  p.appearance = p.appearance ?? 'emphasis';

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
  const handleScrollOutside = (e: WheelEvent) => {
    if (containerRef && !containerRef.contains(e.currentTarget as Node)) {
      setOpen(false);
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
    // Fallback to 160 if menuRect.width is 0, as menuRef may not be rendered yet
    const w = menuRect.width || 160;
    const h = Math.min(menuRef.scrollHeight, 200) || 160;

    // 横位置
    let x = p.align === 'left' ? trigger.left : trigger.right - w;
    // 縦位置（dir に応じる）
    let y = dir() === 'down' ? trigger.bottom : trigger.top - h - 2;

    const clamped = clampToViewport(x, y, w, h);
    setCoords(clamped);
  };

  onMount(() => {
    const onResize = () => open() && adjustPosition();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize as any);
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
  const menuListOptions = createMemo<MenuListOption[]>(() =>
    p.options.map((option) => {
      return {
        ...option,
        type: 'item',
        onSelect: () => {
          select(option);
        },
      } as MenuListOption;
    })
  );

  const spin = (isUp: boolean) => {
    const currentIndex = p.options.findIndex((option) => option.value === getValue());
    const nextIndex = isUp ? (currentIndex + 1) % p.options.length : (currentIndex - 1 + p.options.length) % p.options.length;
    const next = p.options[nextIndex].value as T;

    p.onChange?.(next);
  };

  const triggerButtonAdd = p.appearance === 'simple' ? 'dropdown-trigger-simple' : 'dropdown-trigger-emphasis';

  return (
    <div
      class='dropdown-container'
      ref={(ref) => {
        containerRef = ref;
        p.ref?.(ref);
      }}
      {...p.props}
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (noItem() || p.disabled) return;
        if (p.wheelSpin === undefined || p.wheelSpin) {
          spin(e.deltaY > 0);
        }
      }}
      title={p.title}
    >
      <button
        type='button'
        class={clsx('dropdown-trigger', triggerButtonAdd, p.noBackground && 'dropdown-trigger-no-bg')}
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
        {...p.buttonProps}
      >
        <p class='dropdown-item-text' style={{ 'font-family': p.fontFamily ?? fonts.ZFB08, width: p.fullWidth ? '100%' : undefined }}>
          {noItem() ? '- no item -' : getAdjustedLabel(selectedLabel())}
        </p>
        <span class='dropdown-indicator' aria-hidden='true' style={{ rotate: open() ? '180deg' : '' }} />
      </button>
      <Show when={open()}>
        <Portal>
          <MenuList
            appearance={p.appearance}
            ref={menuRef}
            class={clsx('dropdown-menu', menuDirection[dir()])}
            options={menuListOptions()}
            onWheel={(e) => {
              e.stopImmediatePropagation();
            }}
            onClose={() => {
              setOpen(false);
            }}
            style={{
              top: `${coords().y}px`,
              left: `${coords().x}px`,
            }}
            onTransitionEnd={adjustPosition}
          />
        </Portal>
      </Show>
    </div>
  );
};

export default Dropdown;
