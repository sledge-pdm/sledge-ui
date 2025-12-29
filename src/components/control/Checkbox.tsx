import { type Component, Show } from 'solid-js';
import '../../styles/Checkbox.css';
import type { LabelMode } from '../../types';

const Checkbox: Component<{
  id?: string;
  name?: string;
  label?: string;
  labelMode?: LabelMode;
  checked?: boolean;
  title?: string;
  onChange?: (checked: boolean) => void;
  inputRef?: (el: HTMLInputElement) => void;
}> = (props) => {
  const labelMode = props.labelMode ?? 'right';
  return (
    <label class='checkbox-wrapper' title={props.title}>
      <Show when={labelMode === 'left'}>{props.label}</Show>
      <input
        id={props.id}
        class='checkbox-input'
        name={props.name}
        type='checkbox'
        checked={props.checked}
        onChange={(e) => props.onChange?.(e.currentTarget.checked)}
        ref={props.inputRef}
      />
      <span
        class='checkbox-custom'
        style={{
          'margin-right': labelMode === 'right' ? '8px' : 0,
          'margin-left': labelMode === 'left' ? '8px' : 0,
        }}
      />
      <Show when={labelMode === 'right'}>{props.label}</Show>
    </label>
  );
};

export default Checkbox;
