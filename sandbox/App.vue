<script setup lang="ts">
import { ref } from 'vue';
import {
	LnxButton,
	ButtonVariants,
	ButtonModes,
	ButtonSizes,
	LnxInput,
	LnxIcon,
	LnxInputOTP,
	LnxModal,
} from 'lnxjs-components/src';

const show = ref('');
const inputModel = ref('');
const inputOTPModel = ref<string>('');

const booleanVariants = [true, false];

function toggleDarkMode() {
	document.documentElement.classList.toggle('dark');
}
</script>

<template>
	<LnxButton
		:mode="ButtonModes.OUTLINE"
		@click="toggleDarkMode"
	>
		🌚
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'button' ? show = '' : show = 'button'"
	>
		LnxButton
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'input' ? show = '' : show = 'input'"
	>
		LnxInput
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'input-otp' ? show = '' : show = 'input-otp'"
	>
		LnxInputOTP
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'modal' ? show = '' : show = 'modal'"
	>
		LnxModal
	</LnxButton>

	<template v-if="show === 'button'">
		<div
			v-for="v in ButtonVariants"
			:key="v"
			class="variant-container"
		>
			<span class="variant">{{ v }}</span>
			<div
				v-for="m in ButtonModes"
				:key="m"
				class="variant-container"
			>
				<span class="variant">{{ m }}</span>
				<template
					v-for="s in ButtonSizes"
					:key="s"
				>
					<LnxButton
						:variant="v"
						:mode="m"
						:size="s"
					>
						normal
					</LnxButton>
					<LnxButton
						:variant="v"
						:mode="m"
						:size="s"
						disabled
					>
						disabled
					</LnxButton>
				</template>
			</div>
		</div>
	</template>

	<template v-if="show === 'input'">
		<form>
			<div
				v-for="t in ['text', 'number', 'password']"
				:key="t"
				class="variant-container"
			>
				<span class="variant">{{ t }}</span>
				<div
					v-for="isLoading in booleanVariants"
					:key="String(isLoading)"
					class="variant-container"
				>
					<span class="variant">{{ !isLoading ? 'Loading' : 'Not loading' }}</span>
					<div
						v-for="hasError in booleanVariants"
						:key="String(hasError)"
						class="variant-container"
					>
						<span class="variant">{{ !hasError ? 'Has Error' : 'No error' }}</span>
						<LnxInput
							v-model="inputModel"
							:type="t"
							:is-loading="!isLoading"
							:has-error="!hasError"
							placeholder="placeholder"
						>
							This is the label

							<template #helper>
								This is a helper
							</template>

							<template #error>
								This is an error
							</template>
						</LnxInput>
					</div>
				</div>
			</div>
		</form>
	</template>

	<template v-if="show === 'input-otp'">
		<form>
			<div
				v-for="hasError in booleanVariants"
				:key="String(hasError)"
				class="variant-container"
			>
				<span class="variant">{{ !hasError ? 'Has Error' : 'No error' }}</span>
				<LnxInputOTP
					v-model="inputOTPModel"
					:has-error="!hasError"
				>
					Introduce the code

					<template #helper>
						This is a helper
					</template>

					<template #error>
						This is an error
					</template>
				</LnxInputOTP>
			</div>
		</form>
	</template>

	<template v-if="show === 'modal'">
		<div
			v-for="hideCloseButton in booleanVariants"
			:key="String(hideCloseButton)"
			class="variant-container"
		>
			<span class="variant">{{ !hideCloseButton ? 'Show close button on corner' : 'Don\'t Show close button on corner' }}</span>
			<div
				v-for="allowCloseOnOverlayClick in booleanVariants"
				:key="String(allowCloseOnOverlayClick)"
				class="variant-container"
			>
				<span class="variant">{{ allowCloseOnOverlayClick ? 'Allow close on overlay click' : 'Don\'t allow close on overlay click' }}</span>

				<LnxModal
					title="This is the title"
					:allow-close-on-overlay-click
					:hide-close-button
				>
					<template #default="{ open }">
						<LnxButton @click="open()">
							Open dialog
						</LnxButton>
					</template>

					<template #icon>
						<LnxIcon
							icon="mdi:warning"
							:size="26"
							style="color: var(--lnx-color-danger)"
						/>
					</template>

					<template #content>
						This is the content
					</template>
				</LnxModal>

				<LnxModal
					title="This is the title"
					:allow-close-on-overlay-click
					:hide-close-button
				>
					<template #default="{ open }">
						<LnxButton @click="open()">
							Open dialog with actions
						</LnxButton>
					</template>

					<template #icon>
						<LnxIcon
							icon="mdi:warning"
							:size="26"
							style="color: var(--lnx-color-danger)"
						/>
					</template>

					<template #content>
						This is the content
					</template>

					<template #actions="{ close }">
						<LnxButton
							:variant="ButtonVariants.GRAYSCALE"
							:mode="ButtonModes.CLEAR"
						>
							A secondary action
						</LnxButton>

						<LnxButton :variant="ButtonVariants.GRAYSCALE">
							Another action
						</LnxButton>

						<LnxButton @click="close()">
							Close
						</LnxButton>
					</template>
				</LnxModal>

				<LnxModal
					title="This is the title"
					:allow-close-on-overlay-click
					:hide-close-button
				>
					<template #default="{ open }">
						<LnxButton @click="open()">
							Open extra-long dialog
						</LnxButton>
					</template>

					<template #icon>
						<LnxIcon
							icon="mdi:warning"
							:size="26"
							style="color: var(--lnx-color-danger)"
						/>
					</template>

					<template #content>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a ligula tristique enim luctus maximus. Fusce at dolor nisi. Vivamus rhoncus nisl id mauris consectetur lobortis. Duis suscipit sapien sit amet purus varius mollis. Morbi tincidunt eleifend tristique. Sed egestas ultrices rutrum. In hac habitasse platea dictumst. Aenean eget purus eget nulla finibus lacinia. Donec porttitor eros tincidunt, accumsan libero et, gravida orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed id augue ullamcorper, pretium erat vel, rhoncus justo.

						Nullam aliquam imperdiet enim, id iaculis arcu pretium in. Vestibulum volutpat semper luctus. Sed eget magna nisi. Fusce tellus leo, dictum et aliquam non, fermentum eu lorem. Nullam non eros ac metus lobortis tincidunt eu vel felis. Praesent sodales tincidunt congue. In vitae augue quam. Etiam in dui ut nunc pellentesque pharetra a sed quam. Pellentesque ut justo eget ante aliquam ultrices. Maecenas tempor neque ut metus pellentesque scelerisque. Nam sed cursus ipsum. Integer vel dictum odio, sit amet dictum enim.

						Sed auctor metus faucibus enim venenatis, non ultrices felis imperdiet. Vestibulum tincidunt eros vel risus ultricies, non fringilla elit sagittis. Nam dignissim maximus eros, vel tincidunt eros sodales vel. Nam volutpat diam eu urna semper aliquam. Phasellus in turpis nisl. Suspendisse condimentum ante non dolor faucibus, a iaculis quam venenatis. Etiam at nunc nec leo scelerisque tempor. Morbi semper mauris id neque vehicula, ut tempor nunc tincidunt. Aliquam erat volutpat.

						Etiam interdum est non augue malesuada, vel tristique justo fermentum. Praesent ac neque metus. Cras fringilla lorem at ultrices iaculis. Suspendisse congue nisi id risus vehicula porttitor ac ut ante. Sed hendrerit ante eu tellus elementum, vitae semper enim tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus sed enim tincidunt, faucibus felis ut, dignissim nulla. Quisque ultricies, eros in sollicitudin finibus, lectus lorem tincidunt orci, sed cursus mauris mi ut sem. Praesent gravida rhoncus fermentum. Proin vel mollis neque, in gravida lacus. Aenean a scelerisque mi. Sed egestas quam at augue malesuada ullamcorper nec eu nibh. Ut accumsan at felis a efficitur. Vestibulum dignissim sollicitudin nisi, a aliquet magna efficitur id. Nam vulputate eget sapien et consectetur. Cras non rhoncus arcu.

						Donec velit turpis, hendrerit ac arcu vitae, vestibulum convallis mauris. Mauris vitae ante sed ex rutrum vulputate. Aenean consectetur molestie dapibus. Sed auctor vestibulum tortor, sed tincidunt quam laoreet ac. Nunc facilisis lorem est, non ornare ipsum semper sit amet. Proin suscipit enim mi, eget blandit arcu posuere sit amet. In a mauris facilisis, tincidunt risus nec, tempor ligula. Sed vulputate imperdiet tempor. Phasellus maximus sem nibh, eget vulputate mauris euismod vitae. Integer pharetra magna ac quam suscipit, eget consequat felis ornare. Nam pulvinar rhoncus urna sed tempor. Integer lobortis blandit cursus.

						Etiam mi neque, egestas sit amet vulputate vitae, ultricies eget risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur a justo non diam malesuada rutrum convallis in metus. Donec tincidunt, elit id commodo elementum, quam tellus varius dui, ac sagittis leo diam vel enim. Donec lacinia lacus sed tincidunt pharetra. Aenean quis enim arcu. Aenean viverra ultricies nunc, non fringilla nibh feugiat eu. Fusce ac nibh condimentum, iaculis orci a, pretium nisi. Nullam felis lorem, tempor at tortor ut, ultricies tincidunt est. Aenean molestie lacinia tortor, ut pulvinar ante vulputate id. Morbi at sem eros. Ut vestibulum ante leo. Mauris tristique sodales tellus, at posuere elit accumsan vel. Aenean cursus est quis diam ornare, id sagittis odio venenatis. Cras vitae nisl in odio efficitur viverra.

						Aliquam efficitur imperdiet nisi, id molestie massa pulvinar eu. Proin a elit consectetur, semper massa id, euismod augue. Nulla et suscipit est. Maecenas elementum quis massa eu dictum. Sed non magna tincidunt, hendrerit diam ut, volutpat est. Morbi et neque euismod odio vestibulum consequat. Mauris commodo aliquam varius. Etiam sit amet consectetur tellus. Ut pharetra risus ut tempor egestas. Cras maximus tortor id sapien ultricies, vel mattis eros tristique. Praesent non suscipit magna. Duis aliquam sem a metus vehicula, id varius urna vestibulum. Integer placerat porta tortor, sit amet scelerisque diam iaculis sit amet.

						In suscipit odio non tempus dapibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse lacinia fringilla placerat. Nam vel sem velit. Integer non fringilla leo. Fusce urna nisl, ultricies vitae elit quis, elementum hendrerit velit. Maecenas nunc mi, pretium at elit eu, ullamcorper blandit turpis. Duis scelerisque volutpat porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

						Curabitur pharetra nulla ac volutpat aliquet. Suspendisse vulputate, urna iaculis semper lacinia, justo nibh egestas ante, non hendrerit sapien sapien vitae dolor. Integer lobortis erat non mauris hendrerit, id facilisis dolor pretium. Donec pharetra maximus blandit. Sed lacinia ultrices dui non condimentum. Donec sollicitudin hendrerit scelerisque. Maecenas vitae gravida est, eget faucibus arcu. Curabitur eget gravida velit. Duis sed lorem dapibus, fermentum justo sed, faucibus elit. Maecenas congue dictum tortor, sed cursus mauris laoreet a.

						Vivamus feugiat risus nec aliquam hendrerit. Cras nec mattis nunc. Sed sagittis lacus ut purus ornare tristique. Mauris ac nulla et nibh vulputate porttitor. Curabitur fermentum ac urna non interdum. Proin mattis dui est, a auctor nisl feugiat sit amet. Etiam odio nisl, iaculis sed sollicitudin non, aliquet placerat diam. Maecenas ornare justo id placerat interdum. Nullam nibh erat, vulputate non commodo ut, ultrices sed nunc. Nullam sapien dolor, tempor non nisi sit amet, aliquam cursus augue. Mauris lobortis, enim vel convallis sodales, libero mi iaculis ipsum, sit amet aliquam lectus sem vitae leo. Maecenas posuere sollicitudin mauris, vel cursus dolor gravida nec.

						Vivamus tempus dapibus laoreet. Morbi ullamcorper mollis efficitur. Curabitur sed velit a lorem finibus imperdiet accumsan quis lacus. Maecenas lacinia id sapien et mattis. Fusce sit amet sem nulla. Sed odio erat, venenatis quis dui sodales, vulputate elementum odio. Aliquam sed sem odio. Aliquam quis diam viverra, molestie libero ut, finibus tellus. Ut hendrerit orci nec ante iaculis, nec pellentesque felis elementum. Proin lacus felis, molestie ac neque ac, aliquet accumsan tellus. Suspendisse vitae ex velit. Curabitur id felis at sem accumsan fringilla at vel libero.

						Aenean placerat ex non lectus cursus auctor. Praesent consectetur dignissim consectetur. Donec fringilla urna est, sit amet laoreet arcu varius vel. Integer id ex leo. Donec laoreet odio in metus elementum vehicula. Donec vel purus sed dolor ornare ullamcorper vitae egestas erat. Quisque condimentum faucibus diam id interdum. Nullam ornare ullamcorper iaculis. Donec ultricies congue ex a aliquam. Praesent faucibus pharetra lacus et porttitor.

						Etiam mi neque, egestas sit amet vulputate vitae, ultricies eget risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur a justo non diam malesuada rutrum convallis in metus. Donec tincidunt, elit id commodo elementum, quam tellus varius dui, ac sagittis leo diam vel enim. Donec lacinia lacus sed tincidunt pharetra. Aenean quis enim arcu. Aenean viverra ultricies nunc, non fringilla nibh feugiat eu. Fusce ac nibh condimentum, iaculis orci a, pretium nisi. Nullam felis lorem, tempor at tortor ut, ultricies tincidunt est. Aenean molestie lacinia tortor, ut pulvinar ante vulputate id. Morbi at sem eros. Ut vestibulum ante leo. Mauris tristique sodales tellus, at posuere elit accumsan vel. Aenean cursus est quis diam ornare, id sagittis odio venenatis. Cras vitae nisl in odio efficitur viverra.

						Aliquam efficitur imperdiet nisi, id molestie massa pulvinar eu. Proin a elit consectetur, semper massa id, euismod augue. Nulla et suscipit est. Maecenas elementum quis massa eu dictum. Sed non magna tincidunt, hendrerit diam ut, volutpat est. Morbi et neque euismod odio vestibulum consequat. Mauris commodo aliquam varius. Etiam sit amet consectetur tellus. Ut pharetra risus ut tempor egestas. Cras maximus tortor id sapien ultricies, vel mattis eros tristique. Praesent non suscipit magna. Duis aliquam sem a metus vehicula, id varius urna vestibulum. Integer placerat porta tortor, sit amet scelerisque diam iaculis sit amet.

						In suscipit odio non tempus dapibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse lacinia fringilla placerat. Nam vel sem velit. Integer non fringilla leo. Fusce urna nisl, ultricies vitae elit quis, elementum hendrerit velit. Maecenas nunc mi, pretium at elit eu, ullamcorper blandit turpis. Duis scelerisque volutpat porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

						Curabitur pharetra nulla ac volutpat aliquet. Suspendisse vulputate, urna iaculis semper lacinia, justo nibh egestas ante, non hendrerit sapien sapien vitae dolor. Integer lobortis erat non mauris hendrerit, id facilisis dolor pretium. Donec pharetra maximus blandit. Sed lacinia ultrices dui non condimentum. Donec sollicitudin hendrerit scelerisque. Maecenas vitae gravida est, eget faucibus arcu. Curabitur eget gravida velit. Duis sed lorem dapibus, fermentum justo sed, faucibus elit. Maecenas congue dictum tortor, sed cursus mauris laoreet a.

						Vivamus feugiat risus nec aliquam hendrerit. Cras nec mattis nunc. Sed sagittis lacus ut purus ornare tristique. Mauris ac nulla et nibh vulputate porttitor. Curabitur fermentum ac urna non interdum. Proin mattis dui est, a auctor nisl feugiat sit amet. Etiam odio nisl, iaculis sed sollicitudin non, aliquet placerat diam. Maecenas ornare justo id placerat interdum. Nullam nibh erat, vulputate non commodo ut, ultrices sed nunc. Nullam sapien dolor, tempor non nisi sit amet, aliquam cursus augue. Mauris lobortis, enim vel convallis sodales, libero mi iaculis ipsum, sit amet aliquam lectus sem vitae leo. Maecenas posuere sollicitudin mauris, vel cursus dolor gravida nec.

						Vivamus tempus dapibus laoreet. Morbi ullamcorper mollis efficitur. Curabitur sed velit a lorem finibus imperdiet accumsan quis lacus. Maecenas lacinia id sapien et mattis. Fusce sit amet sem nulla. Sed odio erat, venenatis quis dui sodales, vulputate elementum odio. Aliquam sed sem odio. Aliquam quis diam viverra, molestie libero ut, finibus tellus. Ut hendrerit orci nec ante iaculis, nec pellentesque felis elementum. Proin lacus felis, molestie ac neque ac, aliquet accumsan tellus. Suspendisse vitae ex velit. Curabitur id felis at sem accumsan fringilla at vel libero.

						Aenean placerat ex non lectus cursus auctor. Praesent consectetur dignissim consectetur. Donec fringilla urna est, sit amet laoreet arcu varius vel. Integer id ex leo. Donec laoreet odio in metus elementum vehicula. Donec vel purus sed dolor ornare ullamcorper vitae egestas erat. Quisque condimentum faucibus diam id interdum. Nullam ornare ullamcorper iaculis. Donec ultricies congue ex a aliquam. Praesent faucibus pharetra lacus et porttitor.
					</template>

					<template #actions="{ close }">
						<LnxButton
							:variant="ButtonVariants.GRAYSCALE"
							:mode="ButtonModes.CLEAR"
						>
							A secondary action
						</LnxButton>

						<LnxButton :variant="ButtonVariants.GRAYSCALE">
							Another action
						</LnxButton>

						<LnxButton @click="close()">
							Close
						</LnxButton>
					</template>
				</LnxModal>
			</div>
		</div>
	</template>
</template>

<style scoped>
:global(html.dark) {
	background-color: var(--lnx-color-bg);
	color: var(--lnx-color-text);
}

:global(body) {
	margin: 8px 16px;
}

.btn-toggle {
	margin: 8px;
}

.variant-container {
	margin: 12px 0;
	padding: 12px 4px 4px;
	border: 1px solid var(--lnx-color-text);
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: 4px;
	position: relative;

	.variant {
		padding: 2px 4px;
		background: var(--lnx-color-bg);
		position: absolute;
		left: 4px;
		top: -10px;
		text-transform: uppercase;
		font-size: 12px;
	}
}
</style>