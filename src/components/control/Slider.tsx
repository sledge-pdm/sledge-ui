import { css } from '@acab/ecsstatic';
import { type Component, createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import type { LabelMode } from '../../types';

const sliderRoot = css`
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
`;
const valueLabelContainer = css`
  display: flex;
  flex-direction: row;
  min-width: 42px;
  width: fit-content;
  width: auto;
  box-sizing: content-box;
  overflow: hidden;
`;
const valueLabel = css`
  white-space: nowrap;
  width: fit-content;
  margin-right: 16px;
`;
const valueLabelInput = css`
  white-space: nowrap;
  width: fit-content;
  letter-spacing: 1px;
`;
const slider = css`
  position: relative;
  align-items: center;
  display: flex;
  height: auto;
  overflow: visible;
  flex-grow: 1;
  touch-action: none;
`;
const sliderVertical = css`
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: visible;
  width: auto;
  touch-action: none;
`;
const lineHitbox = css`
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  height: 16px;
  position: absolute;
  width: 100%;
`;
const lineHitboxVertical = css`
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 16px;
  position: absolute;
  height: 100%;
`;
const line = css`
  background-color: var(--color-on-background);
  display: flex;
  height: 1px;
  pointer-events: none;
  width: 100%;
`;
const lineVertical = css`
  background-color: var(--color-on-background);
  display: flex;
  width: 1px;
  pointer-events: none;
  height: 100%;
`;
const handle = css`
  background-color: var(--color-on-background);
  height: 8px;
  left: 50%;
  pointer-events: none;
  position: absolute;
  transform: translateX(-50%);
  width: 2px;
`;
const handleVertical = css`
  background-color: var(--color-on-background);
  width: 8px;
  bottom: 50%;
  pointer-events: none;
  position: absolute;
  transform: translateY(50%);
  height: 2px;
`;

interface SliderProps {
  min: number;
  max: number;
  defaultValue?: number;
  value?: number;
  orientation?: 'horizontal' | 'vertical';
  wheelSpin?: boolean;
  wheelStep?: number;
  allowFloat?: boolean;
  floatSignificantDigits?: number;
  labelMode: LabelMode;
  customFormat?: (value: number) => string;
  allowDirectInput?: boolean;
  title?: string;
  onChange?: (newValue: number) => void;
  onDoubleClick?: () => void;
  onPointerDownOnValidArea?: (e: PointerEvent | MouseEvent) => boolean;
}

const Slider: Component<SliderProps> = (props) => {
  let labelRef: HTMLDivElement;
  let directInputRef: HTMLInputElement;
  let sliderRef: HTMLDivElement;
  const [directInputMode, setDirectInputMode] = createSignal(false);

  const [value, setValue] = createSignal(props.defaultValue ?? props.min);
  createEffect(() => {
    if (props.value !== undefined) setValue(props.value);
  });

  const getFormattedValue = (value: number): string => {
    let formatted = `${value}`;
    if (props.customFormat !== undefined) {
      formatted = props.customFormat(value);
    } else {
      formatted = `${value}`;
    }
    return formatted;
  };

  const [isDrag, setDrag] = createSignal(false);
  const percent = () => ((value() - props.min) / (props.max - props.min)) * 100;

  const update = (newValue: number) => {
    setValue(newValue);
    props.onChange?.(newValue);
  };

  const onPointerDownOnValidArea = (e: PointerEvent | MouseEvent): boolean => {
    if (props.onPointerDownOnValidArea) {
      return props.onPointerDownOnValidArea(e);
    }
    return true;
  };

  const handlePointerDown = (e: PointerEvent) => {
    const shouldStartDrag = onPointerDownOnValidArea(e);
    if (shouldStartDrag) setDrag(true);
    else setDrag(false);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!sliderRef || !isDrag()) {
      setDrag(false);
    } else {
      const rect = sliderRef.getBoundingClientRect();
      let raw: number;
      if (props.orientation === 'vertical') {
        const { top, height } = rect;
        // 上を max, 下を min にする (一般的 UI)。逆にしたい場合は (1 - posRatio)
        let pos = Math.max(0, Math.min(e.clientY - top, height));
        const posRatio = 1 - pos / height; // 上=1 下=0
        raw = props.min + posRatio * (props.max - props.min);
      } else {
        const { left, width } = rect;
        let pos = Math.max(0, Math.min(e.clientX - left, width));
        raw = props.min + (pos / width) * (props.max - props.min);
      }
      update(getFixedValue(raw));
    }
  };

  const cancelHandling = () => {
    setDrag(false);
  };

  const onLineClick = (e: MouseEvent) => {
    const shouldStartDrag = onPointerDownOnValidArea(e);
    if (!sliderRef || !shouldStartDrag) return;
    const rect = sliderRef.getBoundingClientRect();
    let raw: number;
    if (props.orientation === 'vertical') {
      const { top, height } = rect;
      let pos = Math.max(0, Math.min(e.clientY - top, height));
      const posRatio = 1 - pos / height;
      raw = props.min + posRatio * (props.max - props.min);
    } else {
      const { left, width } = rect;
      let pos = Math.max(0, Math.min(e.clientX - left, width));
      raw = props.min + (pos / width) * (props.max - props.min);
    }
    update(getFixedValue(raw));
  };

  const getFixedValue = (raw: number): number => {
    let newValue = raw;
    if (props.allowFloat) {
      if (props.floatSignificantDigits) {
        newValue = parseFloat(raw.toFixed(props.floatSignificantDigits));
      } else {
        newValue = raw;
      }
    } else {
      newValue = Math.round(raw);
    }

    newValue = Math.max(props.min, Math.min(newValue, props.max));

    return newValue;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (directInputMode() && labelRef && !labelRef.contains(e.target as Node)) {
      update(Number(directInputRef.value));
      setDirectInputMode(false);
    }
  };

  const cancelDirectInput = () => {
    setDirectInputMode(false);
  };

  const handleOnWheel = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (props.wheelSpin) {
      const step = props.wheelStep ?? 1;
      const delta = e.deltaY < 0 ? step : -step;
      // 縦方向はホイールの方向と intuitive に一致: 上スクロール(negative deltaY) => 値増加
      const newValue = getFixedValue(value() + delta);
      update(getFixedValue(newValue));
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', cancelHandling);
    document.addEventListener('pointercancel', cancelHandling);
  });
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', cancelHandling);
    document.removeEventListener('pointercancel', cancelHandling);
  });

  const labelArea = (
    <div ref={(el) => (labelRef = el)} class={valueLabelContainer} onWheel={handleOnWheel} title={props.title}>
      <Show
        when={directInputMode()}
        fallback={
          <p
            class={valueLabel}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              setDirectInputMode(true);
              directInputRef.select();
            }}
          >
            {getFormattedValue(value())}
          </p>
        }
      >
        <input
          class={valueLabelInput}
          ref={(el) => (directInputRef = el)}
          onSubmit={(e) => {
            setDirectInputMode(false);
          }}
          onFocusOut={cancelDirectInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              update(Number(directInputRef.value));
              setDirectInputMode(false);
            }
          }}
          value={value()}
          type={'number'}
        />
      </Show>
    </div>
  );

  return (
    <div class={sliderRoot}>
      <Show when={props.labelMode === 'left'}>{labelArea}</Show>

      <div
        class={props.orientation === 'vertical' ? sliderVertical : slider}
        ref={(el) => (sliderRef = el)}
        onPointerDown={handlePointerDown}
        onDblClick={() => {
          props.onDoubleClick?.();
        }}
        onClick={onLineClick}
      >
        <div class={props.orientation === 'vertical' ? lineHitboxVertical : lineHitbox} onWheel={handleOnWheel}>
          <div class={props.orientation === 'vertical' ? lineVertical : line} />
        </div>
        {props.orientation === 'vertical' ? (
          <div style={{ bottom: `${percent()}%` }} class={handleVertical} />
        ) : (
          <div style={{ left: `${percent()}%` }} class={handle} />
        )}
      </div>

      <Show when={props.labelMode === 'right'}>{labelArea}</Show>
    </div>
  );
};

export default Slider;
