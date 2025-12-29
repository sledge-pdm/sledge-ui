import { Show, type Component } from 'solid-js';
import '../../styles/ToggleSwitch.css';
import type { LabelMode } from '../../types';

interface Props {
  id?: string;
  name?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  labelMode?: LabelMode;
  title?: string;
  /** 任意でラベル等を配置する場合の slot */
  children?: any;
}

const ToggleSwitch: Component<Props> = (p) => {
  p.labelMode = p.labelMode || 'left'; // デフォルトは左側にラベルを表示

  return (
    /* label 全体でクリック可能に */
    <label class='toggle-wrapper' title={p.title}>
      <Show when={p.labelMode === 'left'}>{p.children}</Show>
      <input
        id={p.id}
        type='checkbox'
        name={p.name}
        checked={p.checked}
        onInput={(e) => p.onChange?.(e.currentTarget.checked)}
        class='toggle-input'
      />
      <span class='toggle-track'>
        <span class='toggle-thumb' />
      </span>
      <Show when={p.labelMode === 'right'}>{p.children}</Show>
    </label>
  );
};

export default ToggleSwitch;
