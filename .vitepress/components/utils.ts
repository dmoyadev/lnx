import { ComponentEvent, ComponentProp, ComponentSlot } from './types';

const TAB = '    ';
const NEWLINE = '\n';

function toDashCase(str: string) {
	return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function getColoredText(text: string, type: 'tag' | 'prop' | 'value' | 'comment') {
	switch(type) {
		case 'tag':
			return `<span style="color: #85E89D">${text}</span>`;
		case 'prop':
			return `<span style="color: #B392F0">${text}</span>`;
		case 'value':
			return `<span style="color: #9ECBFF">${text}</span>`;
		case 'comment':
			return `<span style="color: #6A737D">${text}</span>`;
	}
}

function createPropLine(prop, colon, propName, propValue) {
	try {
		if(prop.value === true) {
			return propName;
		}

		return `${colon}${propName}=${propValue}`;
	} catch(e) {
		console.log(e);
		if(prop.defaultValue !== prop.value) {
			return `${colon}${propName}=${propValue}`;
		}
	}
}

function getPropsLines(
	props: Record<string, ComponentProp>,
	checkDefaultValue: (defaultValue: unknown, value: unknown) => boolean,
	showPropsColon = true,
): string[] | undefined {
	const propLines: string[] = [];
	for(const name of Object.keys(props)) {
		const prop = props[name];
		const colon = (showPropsColon && typeof prop.value !== 'string') ? ':' : '';
		const propName = getColoredText(toDashCase(name), 'prop');
		const propStringifiedValue = (colon || !showPropsColon) ? JSON.stringify(prop.value) : prop.value;
		const propValue = getColoredText(`"${propStringifiedValue}"`, 'value');

		if (!checkDefaultValue(prop.defaultValue, prop.value)) {
			continue;
		}

		propLines.push(createPropLine(prop, colon, propName, propValue));
	}

	return propLines.length ? propLines : undefined;
}

function getListenersLines(events: Record<string, ComponentEvent>): string[] | undefined {
	const listenersLines: string[] = [];
	for(const name of Object.keys(events)) {
		const listenerName = getColoredText(name, 'prop');
		const listenerValue = getColoredText('...', 'comment');
		const listenerComment = getColoredText(`<-- ${events[name].description}`, 'comment');
		listenersLines.push(`@${listenerName}="${listenerValue}" ${listenerComment}`);
	}

	return listenersLines.length ? listenersLines : undefined;
}

function getSlotsLines(slots: Record<string, ComponentSlot>): string[] | undefined {
	const slotLines: string[] = [];
	for (const name of Object.keys(slots)) {
		const slot = slots[name];

		if (name === 'default' && !!slot.value) {
			slotLines.push(`${slot.value}`);
			continue;
		}

		if (slot.value) {
			const tagName = getColoredText('template', 'tag');
			const slotName = getColoredText(name, 'prop');
			let slotScope = '';
			if (!!slot.scopes?.length) {
				slotScope = '="{ ';
				slotScope += slot.scopes.map(({ name }) => getColoredText(name, 'value')).join(', ');
				slotScope += ' }"';
			}
			const slotValue = `${NEWLINE}${TAB}${TAB}${slot.value}${NEWLINE}${TAB}`;
			slotLines.push(`&lt;${tagName} #${slotName}${slotScope}&gt;${slotValue}&lt;/${tagName}&gt;`);
		}
	}

	return slotLines.length ? slotLines : undefined;
}

interface DemoCodeParams {
	componentName: string
	props?: Record<string, ComponentProp>;
	checkDefault: (defaultValue: unknown, value: unknown) => boolean;
	slots?: Record<string, ComponentSlot>;
	listeners?: Record<string, ComponentEvent>;
}
export function getDemoCode(params: DemoCodeParams) {
	let code = `&lt;${getColoredText(params.componentName, 'tag')}`;

	const propsLines = getPropsLines(params.props || {}, params.checkDefault);
	if(!!propsLines) {
		if(propsLines.length > 1) {
			code += `${NEWLINE}${TAB}${propsLines.join(`${NEWLINE}${TAB}`)}${NEWLINE}`;
		} else {
			code += ` ${propsLines}`;
		}
	}

	let slotScopeLine: string[] | undefined = undefined;
	if(!!params.slots?.default?.scopes?.length) {
		const vSlot: ComponentProp = {
			type: 'object',
			controlType: 'input',
			value: params.slots.default.scopes.map((scope) => scope.name),
		};
		slotScopeLine = getPropsLines({ 'v-slot': vSlot }, () => true, false);
		if(!propsLines) {
			code += `${NEWLINE}`;
		}
		code += `${TAB}${slotScopeLine.join(`${NEWLINE}${TAB}`)}${NEWLINE}`;
	}

	const listenerLines = getListenersLines(params.listeners || {});
	if(!!listenerLines) {
		if(!propsLines && !slotScopeLine) {
			code += NEWLINE;
		}
		code += `${TAB}${listenerLines.join(`${NEWLINE}${TAB}`)}${NEWLINE}`;
	}

	const slotLines = getSlotsLines(params.slots || {});
	if(!!slotLines) {
		code += '&gt;';
		code += `${NEWLINE}${TAB}${slotLines.join(`${NEWLINE}${TAB}`)}`;
		code += `${NEWLINE}&lt;/${getColoredText(params.componentName, 'tag')}&gt;`;
	} else {
		if((!propsLines || propsLines.length === 1) && !listenerLines) {
			code += ' ';
		}
		code += '/&gt;';
	}

	return code;
}

interface ResetComponentParams {
	props?: Record<string, ComponentProp>;
	options?: Record<string, ComponentProp>;
	slots?: Record<string, ComponentSlot>;
	evalDefaultValue: (defaultValue: unknown) => unknown;
}
export function resetComponent({ props, options, slots, evalDefaultValue }: ResetComponentParams){
	for(const prop of Object.values({
		...props,
		...options, 
	})) {
		try {
			if (prop.defaultValue) {
				prop.value = evalDefaultValue(prop.defaultValue as string);
			}
		} catch(e) {
			console.log(e);
			if (prop.defaultValue) {
				prop.value = prop.defaultValue;
			}
		}
	}

	for(const slot of Object.values(slots || {})) {
		slot.value = slot.initialValue || '';
	}
}