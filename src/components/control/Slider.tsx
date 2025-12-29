import { type Component, createEffect, createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js';
import '../../styles/Slider.css';
import type { LabelMode } from '../../types';

interface SliderProps {
  min: number;
  max: number;
  defaultValue?: number;
  value?: number;
  dblClickResetValue?: number;
  orientation?: 'horizontal' | 'vertical';
  wheelSpin?: boolean;
  wheelStep?: number;
  allowFloat?: boolean;
  floatSignificantDigits?: number;
  labelMode: LabelMode;
  labelWidth?: number;
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
    newValue = getFixedValue(newValue);
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
      update(raw);
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
    update(raw);
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

  const resetHandlePercent = createMemo(() => {
    if (props.dblClickResetValue === undefined) return undefined;
    const fixed = getFixedValue(props.dblClickResetValue);
    return ((fixed - props.min) / (props.max - props.min)) * 100;
  });

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
      const newValue = value() + delta;
      update(newValue);
    }
  };

  const handleDoubleClick = () => {
    if (props.dblClickResetValue !== undefined) {
      update(props.dblClickResetValue);
    } else if (props.defaultValue !== undefined) {
      update(props.defaultValue);
    }

    props.onDoubleClick?.();
  };

  const renderResetHandle = () => {
    const percent = resetHandlePercent();
    if (percent === undefined) return null;
    const style = props.orientation === 'vertical' ? { bottom: `${percent}%`, opacity: 0.5 } : { left: `${percent}%`, opacity: 0.5 };
    return <div style={style} class={props.orientation === 'vertical' ? 'slider-handle-vertical' : 'slider-handle'} />;
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
    <div
      ref={(el) => (labelRef = el)}
      class='slider-label-container'
      onWheel={handleOnWheel}
      title={props.title}
      style={{
        width: props.labelWidth ? `${props.labelWidth}px` : undefined,
        'min-width': props.labelWidth ? undefined : '42px',
      }}
    >
      <Show
        when={directInputMode()}
        fallback={
          <p
            class='slider-label'
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
          class='slider-label-input'
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
    <div class='slider-root'>
      <Show when={props.labelMode === 'left'}>{labelArea}</Show>

      <div
        class={props.orientation === 'vertical' ? 'slider-vertical' : 'slider'}
        ref={(el) => (sliderRef = el)}
        onPointerDown={handlePointerDown}
        onDblClick={handleDoubleClick}
        onClick={onLineClick}
      >
        <div class={props.orientation === 'vertical' ? 'slider-line-hitbox-vertical' : 'slider-line-hitbox'} onWheel={handleOnWheel}>
          <div class={props.orientation === 'vertical' ? 'slider-line-vertical' : 'slider-line'} />
        </div>
        {renderResetHandle()}
        {props.orientation === 'vertical' ? (
          <div style={{ bottom: `${percent()}%` }} class='slider-handle-vertical' />
        ) : (
          <div style={{ left: `${percent()}%` }} class='slider-handle' />
        )}
      </div>

      <Show when={props.labelMode === 'right'}>{labelArea}</Show>
    </div>
  );
};

export default Slider;
