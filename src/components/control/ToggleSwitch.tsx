import { css } from '@acab/ecsstatic';
import { Show, type Component } from 'solid-js';
import type { LabelMode } from '../../types';

const toggleWrapper = css`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
`;
const toggleInput = css`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;
const toggleTrack = css`
  width: 16px;
  height: 10px;
  background-color: var(--color-muted);
  border: 1px solid var(--color-button-border);
  border-radius: 0px;
  position: relative;
  transition: background-color 0.05s;
`;
const toggleThumb = css`
  position: absolute;
  top: -1px;
  left: -1px;
  width: 8px;
  height: 10px;
  background-color: white;
  border: 1px solid var(--color-button-border);
  border-radius: 0px;
  transition: transform 0.02s;
`;
// State styles via sibling selectors
const toggleState = css`
  input:checked + ${toggleTrack} {
    background-color: var(--color-enabled);
  }
  input:checked + ${toggleTrack} ${toggleThumb} {
    transform: translateX(8px);
  }
`;

interface Props {
  id?: string;
  name?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  labelMode?: LabelMode;
  /** 任意でラベル等を配置する場合の slot */
  children?: any;
}

const ToggleSwitch: Component<Props> = (p) => {
  p.labelMode = p.labelMode || 'left'; // デフォルトは左側にラベルを表示

  return (
    /* label 全体でクリック可能に */
    <label class={`${toggleWrapper} ${toggleState}`}>
      <Show when={p.labelMode === 'left'}>{p.children}</Show>
      <input id={p.id} type='checkbox' name={p.name} checked={p.checked} onInput={(e) => p.onChange?.(e.currentTarget.checked)} class={toggleInput} />
      <span class={toggleTrack}>
        <span class={toggleThumb} />
      </span>
      <Show when={p.labelMode === 'right'}>{p.children}</Show>
    </label>
  );
};

export default ToggleSwitch;
