import { css } from '@acab/ecsstatic';
import { type Component } from 'solid-js';

const radioWrapper = css`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;
const hiddenRadio = css`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;
const customRadio = css`
  width: 10px;
  height: 10px;
  border: 1px solid var(--color-button-border);
  border-radius: 0px;
  margin-left: 8px;
  display: inline-block;
  position: relative;
  transition: all 0.1s;
  &::after {
    content: '';
    position: absolute;
    left: 2px;
    top: 2px;
    width: 6px;
    height: 6px;
    background-color: var(--color-enabled);
    opacity: 0;
    transition: opacity 0.1s;
  }
  input:checked + &::after {
    opacity: 1;
  }
`;

const RadioButton: Component<{
  id?: string;
  name?: string;
  label?: string;
  value?: boolean;
  title?: string;
  onChange?: (checked: boolean) => void;
}> = (props) => {
  return (
    <label class={radioWrapper} title={props.title}>
      {props.label}
      <input
        id={props.id}
        class={hiddenRadio}
        type='radio'
        name={props.name}
        checked={props.value}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
      <span class={customRadio}></span>
    </label>
  );
};

export default RadioButton;
