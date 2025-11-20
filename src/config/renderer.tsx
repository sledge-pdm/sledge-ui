import type { Component } from 'solid-js';
import Checkbox from '../components/control/Checkbox';
import Dropdown from '../components/control/Dropdown';
import RadioButton from '../components/control/RadioButton';
import Slider from '../components/control/Slider';
import ToggleSwitch from '../components/control/ToggleSwitch';
import { componentProps } from './components';
import type { ConfigComponentFactory, FieldRenderParams } from './types';

export const ConfigFieldRenderer: Component<FieldRenderParams> = (props) => {
  const { field, value, onChange } = props;

  if (field.condition && !field.condition()) {
    return null;
  }

  if (typeof field.component === 'function') {
    const render = (field.component as ConfigComponentFactory)({ field, value, onChange });
    return typeof render === 'function' ? render() : render;
  }

  switch (field.component) {
    case 'Dropdown':
      return <Dropdown value={value} options={field.props?.options ?? []} onChange={onChange} {...field.props} />;
    case 'Slider':
      return (
        <Slider
          defaultValue={value()}
          value={value()}
          min={field.props?.min ?? 0}
          max={field.props?.max ?? 0}
          labelMode={field.props?.labelMode ?? componentProps.get('Slider')?.labelMode ?? 'left'}
          customFormat={field.customFormat}
          allowDirectInput={field.props?.allowDirectInput ?? true}
          allowFloat={field.props?.allowFloat ?? false}
          floatSignificantDigits={field.props?.floatSignificantDigits}
          wheelSpin={field.props?.wheelSpin ?? true}
          onChange={onChange}
          {...field.props}
        />
      );
    case 'CheckBox':
      return <Checkbox id={field.key ?? field.label ?? ''} checked={value()} onChange={onChange} {...field.props} />;
    case 'RadioButton':
      return <RadioButton id={field.key ?? field.label ?? ''} value={value()} onChange={onChange} {...field.props} />;
    case 'ToggleSwitch':
      return <ToggleSwitch id={field.key ?? field.label ?? ''} checked={value()} onChange={onChange} {...field.props} />;
    case 'Custom':
      return <div>{field.props?.content?.() ?? null}</div>;
    default:
      return null;
  }
};
