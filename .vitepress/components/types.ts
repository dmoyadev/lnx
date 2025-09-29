interface ComponentPropBase {
	description?: string;
	type: string | { name: string; link: string };
	value: unknown;
	defaultValue?: string;
	helper?: string;
	hideAllVariationsButton?: boolean;
	configurableOptionName?: string
}

interface SelectComponentProp extends ComponentPropBase {
	controlType: 'select' | 'options';
	options: unknown[];
}

interface SwitchComponentProp extends ComponentPropBase {
	controlType: 'switch';
}

interface InputComponentProp extends ComponentPropBase {
	controlType: 'input' | 'number';
}

interface InputArrayComponentProp extends ComponentPropBase {
	controlType: 'input-array';
}

interface StaticComponentProp extends ComponentPropBase {
	controlType: 'none';
}

export type ComponentProp = SelectComponentProp
	| SwitchComponentProp
	| InputComponentProp
	| StaticComponentProp
	| InputArrayComponentProp
	;

export interface ComponentSlot {
	description: string;
	readonly?: boolean;
	value?: string;
	initialValue?: string; /* To reset the slot content in the showcase */
	defaultValue?: string; /* Content that shows up when the slot is not given */
	scopes?: {
		name: string;
		type: string;
	}[];
}

export interface ComponentEvent {
	type: string | { name: string; link: string };
	description?: string;
	isNative?: boolean;
}

export interface EmittedEvent {
	name: string;
	timestamp: Date;
	data: unknown;
}

export interface ComponentCSSVars {
	description?: string;
	value: string;
	helper?: string;
}