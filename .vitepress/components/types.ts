interface ComponentPropBase {
	description?: string;
	type: string | { name: string; link: string };
	value: unknown;
	defaultValue?: unknown;
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

interface StaticComponentProp extends ComponentPropBase {
	controlType: 'none';
}

export type ComponentProp = SelectComponentProp | SwitchComponentProp | InputComponentProp | StaticComponentProp;

export interface ComponentSlot {
	description: string;
	readonly?: boolean;
	value?: string;
	initialValue?: string;
	defaultValue?: string;
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