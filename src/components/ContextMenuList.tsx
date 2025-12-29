import type { Vec2 } from '@sledge-pdm/core';
import { createEffect, createSignal, onMount, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import '../styles/ContextMenuList.css';
import { MenuList, type MenuListAppearance, type MenuListOption } from './MenuList';

interface Props {
  appearance?: MenuListAppearance;
  options: MenuListOption[];
  position: Vec2;
  onClose?: () => void;
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
  let containerRef: HTMLElement | undefined;
  const [coords, setCoords] = createSignal<Vec2>(props.position);

  // open時にサイズを測って画面内に収める
  const adjustPosition = () => {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    const { x, y } = clampToViewport(props.position.x, props.position.y, rect.width, rect.height);
    setCoords({ x, y });
  };

  onMount(() => queueMicrotask(adjustPosition));
  createEffect(() => {
    props.position.x;
    props.position.y;
    queueMicrotask(adjustPosition);
  });

  return (
    <Portal>
      <MenuList
        appearance={props.appearance}
        ref={(ref) => (containerRef = ref)}
        class='context-menu'
        closeByOutsideClick
        onClose={() => props.onClose?.()}
        options={props.options}
        style={{
          top: `${coords().y}px`,
          left: `${coords().x}px`,
          'min-width': '120px',
        }}
        onTransitionEnd={adjustPosition}
      />
    </Portal>
  );
};

export default ContextMenuList;
