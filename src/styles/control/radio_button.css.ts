import { vars } from '@sledge/theme';
import { checkboxWrapper } from '@styles/control/checkbox.css';
import { style } from '@vanilla-extract/css';

export const radioWrapper = checkboxWrapper; // チェックボックスと共通でOK！

export const hiddenRadio = style({
  opacity: 0,
  width: 0,
  height: 0,
  position: 'absolute',
});

export const customRadio = style({
  width: '10px',
  height: '10px',
  border: `1px solid ${vars.color.button.border}`,
  borderRadius: '0px',
  marginLeft: '8px',
  display: 'inline-block',
  position: 'relative',
  transition: 'all 0.1s',
  selectors: {
    [`&::after`]: {
      content: '',
      position: 'absolute',
      left: '2px',
      top: '2px',
      width: '6px',
      height: '6px',
      backgroundColor: vars.color.enabled,
      opacity: 0,
      transition: 'opacity 0.1s',
    },
    [`${radioWrapper} input:checked + &::after`]: {
      opacity: 1,
    },
  },
});
