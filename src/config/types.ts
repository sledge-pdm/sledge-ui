import type { Accessor, JSX } from 'solid-js';
import type { DropdownOption } from '../components/control/Dropdown';
import type { LabelMode } from '../types';
import type { ConfigComponentName } from './components';

export type ConfigPath = readonly (string | number)[];

// Path helpers for type-safe meta definitions.
export type Path<T> = T extends object
  ? {
      [K in keyof T]-?: [K, ...Path<T[K]>] | [K];
    }[keyof T]
  : [];

export type PathValue<T, P extends readonly any[]> = P extends [infer K, ...infer R]
  ? K extends keyof T
    ? PathValue<T[K], Extract<R, readonly any[]>>
    : never
  : T;

// Join path segments into a slash-separated string literal.
type JoinPath<P extends readonly any[], Sep extends string = '/'> = P extends []
  ? never
  : P extends [infer H]
  ? H & string
  : P extends [infer H, ...infer R]
  ? `${H & string}${Sep}${JoinPath<Extract<R, readonly any[]>, Sep>}`
  : never;

export type PathString<T> = JoinPath<Path<T>>;

export type DropdownFieldProps<T extends string | number = any> = {
  options: DropdownOption<T>[];
  labelMode?: LabelMode;
};

export type SliderFieldProps = {
  min?: number;
  max?: number;
  step?: number;
  labelWidth?: number;
  allowFloat?: boolean;
  floatSignificantDigits?: number;
  allowDirectInput?: boolean;
  wheelSpin?: boolean;
  labelMode?: LabelMode;
};

export type ToggleSwitchFieldProps = Record<string, unknown>;
export type RadioButtonFieldProps = Record<string, unknown>;
export type CheckBoxFieldProps = Record<string, unknown>;

export type CustomRenderArgs<TValue = any, TField extends ConfigFieldBase = ConfigFieldBase> = {
  field: TField;
  value: Accessor<TValue>;
  onChange: (value: TValue) => void;
};

export type ConfigComponentFactory<TValue = any, TField extends ConfigFieldBase = ConfigFieldBase> = (
  args: CustomRenderArgs<TValue, TField>
) => JSX.Element | (() => JSX.Element);

type FieldBaseCommon = {
  label?: string;
  tips?: string;
  customFormat?: (value: number) => string;
  condition?: () => boolean;
};

export type ConfigFieldBase = FieldBaseCommon & {
  // Either path (for nested store objects) or key (for flat records like presets).
  path?: ConfigPath | PathString<any>;
  key?: string;
};

export type DropdownField = ConfigFieldBase & {
  component: 'Dropdown';
  props?: DropdownFieldProps;
};

export type SliderField = ConfigFieldBase & {
  component: 'Slider';
  props?: SliderFieldProps;
};

export type ToggleSwitchField = ConfigFieldBase & {
  component: 'ToggleSwitch';
  props?: ToggleSwitchFieldProps;
};

export type RadioButtonField = ConfigFieldBase & {
  component: 'RadioButton';
  props?: RadioButtonFieldProps;
};

export type CheckBoxField = ConfigFieldBase & {
  component: 'CheckBox';
  props?: CheckBoxFieldProps;
};

type CustomField = ConfigFieldBase & {
  component: 'Custom';
  props?: {
    content?: () => JSX.Element;
  };
};

// Union for standard fields.
export type ConfigField =
  | DropdownField
  | SliderField
  | ToggleSwitchField
  | RadioButtonField
  | CheckBoxField
  | CustomField
  | (ConfigFieldBase & { component: ConfigComponentFactory<any, ConfigFieldBase> });

// Map component to its props to enable contextual typing in meta definitions.
export type ComponentPropsMap = {
  Dropdown: DropdownFieldProps;
  Slider: SliderFieldProps;
  ToggleSwitch: ToggleSwitchFieldProps;
  RadioButton: RadioButtonFieldProps;
  CheckBox: CheckBoxFieldProps;
  Custom: CustomField['props'];
};

// Typed field constrained by a config shape and component to enforce correct paths/props.
export type ConfigFieldOf<
  TConfig,
  C extends ConfigComponentName | ConfigComponentFactory<any, ConfigFieldBase> = ConfigComponentName | ConfigComponentFactory<any, ConfigFieldBase>
> = ConfigFieldBase & {
  component: C;
  path: Path<TConfig> | PathString<TConfig>;
  props?: C extends ConfigComponentName ? ComponentPropsMap[C] : never;
  customFormat?: (value: number) => string;
  condition?: () => boolean;
};

export type ConfigSchema = readonly ConfigField[];

export type FieldValueGetter<T = any> = Accessor<T>;
export type FieldValueSetter<T = any> = (value: T) => void;

// Combine value getter/setter with the field definition to simplify renderers.
export type FieldRenderParams<T = any> = {
  field: ConfigField;
  value: FieldValueGetter<T>;
  onChange: FieldValueSetter<T>;
};
