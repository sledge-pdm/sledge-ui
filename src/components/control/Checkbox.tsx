import { css } from '@acab/ecsstatic';
import { type Component, Show } from 'solid-js';
import type { LabelMode } from '../../types';

const checkBoxWrapper = css`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const hiddenCheckbox = css`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const customCheckbox = css`
  width: 10px;
  height: 10px;
  border: 1px solid var(--color-button-border);
  border-radius: 0px;
  display: inline-block;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 2px;
    background-color: var(--color-enabled);
    opacity: 0;
    transform-origin: center center;
  }
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  /* Checked state: sibling selector (input:checked + span) */
  input:checked + &::before {
    opacity: 1;
  }
  input:checked + &::after {
    opacity: 1;
  }
`;

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
    <label class={checkBoxWrapper} title={props.title}>
      <Show when={labelMode === 'left'}>{props.label}</Show>
      <input
        id={props.id}
        class={hiddenCheckbox}
        name={props.name}
        type='checkbox'
        checked={props.checked}
        onChange={(e) => props.onChange?.(e.currentTarget.checked)}
        ref={props.inputRef}
      />
      <span
        class={customCheckbox}
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
