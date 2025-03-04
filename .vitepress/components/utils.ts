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
): string {
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

	return propLines.length
		? `${TAB}${propLines.join(`${NEWLINE}${TAB}`)}`
		: '';
}

function getListenersLines(events: Record<string, ComponentEvent>): string {
	const listenersLines: string[] = [];
	for(const name of Object.keys(events)) {
		const listenerName = getColoredText(name, 'prop');
		const listenerValue = getColoredText('...', 'comment');
		const listenerComment = getColoredText(`<-- ${events[name].description}`, 'comment');
		listenersLines.push(`@${listenerName}="${listenerValue}" ${listenerComment}`);
	}

	return listenersLines.length
		? `${TAB}${listenersLines.join(`${NEWLINE}${TAB}`)}`
		: '';
}

function getSlotsLines(slots: Record<string, ComponentSlot>): string {
	const slotLines: string[] = [];
	for (const name of Object.keys(slots)) {
		const slot = slots[name];

		if(name === 'default') {
			slotLines.push(`${slot.value}`);
			continue;
		}

		if(slot.value) {
			const tagName = getColoredText('template', 'tag');
			const slotName = getColoredText(name, 'prop');
			let slotScope = '';
			if(!!slot.scopes?.length) {
				slotScope = '="{ ';
				slotScope += slot.scopes.map(({ name }) => getColoredText(name, 'value')).join(', ');
				slotScope += ' }"';
			}
			const slotValue = `${NEWLINE}${TAB}${TAB}${slot.value}${NEWLINE}${TAB}`;
			slotLines.push(`&lt;${tagName} #${slotName}${slotScope}&gt;${slotValue}&lt;/${tagName}&gt;`);
		}
	}

	return slotLines.length
		? `${NEWLINE}${TAB}${slotLines.join(`${NEWLINE}${TAB}`)}`
		: '';
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
		code += `${NEWLINE}${propsLines}${NEWLINE}`;
	}

	let slotScope = '';
	if(!!params.slots.default?.scopes?.length) {
		const vSlot: ComponentProp = {
			type: 'object',
			controlType: 'text',
			value: params.slots.default.scopes.map((scope) => scope.name),
		};
		slotScope = getPropsLines({ 'v-slot': vSlot }, () => true, false);
		if(!propsLines) {
			code += `${NEWLINE}`;
		}
		code += `${slotScope}${NEWLINE}`;
	}

	const listenerLines = getListenersLines(params.listeners || {});
	if(!!listenerLines) {
		if(!propsLines && !slotScope) {
			code += NEWLINE;
		}
		code += `${listenerLines}${NEWLINE}`;
	}

	code += '&gt;';

	const slotLines = getSlotsLines(params.slots || {});
	if(!!slotLines) {
		code += `${slotLines}`;
	}
	code += `${NEWLINE}&lt;/${getColoredText(params.componentName, 'tag')}&gt;`;
	return code;
}

interface ResetComponentParams {
	props: Record<string, ComponentProp>;
	options: Record<string, ComponentProp>;
	slots: Record<string, ComponentSlot>;
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

	for(const slot of Object.values(slots)) {
		slot.value = slot.initialValue || '';
	}
}