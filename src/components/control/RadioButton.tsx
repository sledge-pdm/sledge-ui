import { type Component } from 'solid-js';
import '../../styles/RadioButton.css';

const RadioButton: Component<{
  id?: string;
  name?: string;
  label?: string;
  value?: boolean;
  title?: string;
  onChange?: (checked: boolean) => void;
}> = (props) => {
  return (
    <label class='radio-wrapper' title={props.title}>
      {props.label}
      <input
        id={props.id}
        class='radio-input'
        type='radio'
        name={props.name}
        checked={props.value}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
      <span class='radio-custom'></span>
    </label>
  );
};

export default RadioButton;
