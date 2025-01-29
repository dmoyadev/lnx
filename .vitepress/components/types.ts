interface ComponentPropBase {
	description?: string;
	type: string;
	value: unknown;
	defaultValue?: unknown;
}

interface SelectComponentProp extends ComponentPropBase {
	controlType: 'select' | 'options';
	options: unknown[];
}

interface SwitchComponentProp extends ComponentPropBase {
	controlType: 'switch';
}

interface InputComponentProp extends ComponentPropBase {
	controlType: 'input';
}

interface ArrayComponentProp extends ComponentPropBase {
	controlType: 'array';
}

export type ComponentProp = SelectComponentProp | SwitchComponentProp | InputComponentProp | ArrayComponentProp;

export interface ComponentSlot {
	description: string;
	value?: string;
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