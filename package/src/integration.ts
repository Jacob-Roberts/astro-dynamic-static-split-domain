import { defineIntegration } from 'astro-integration-kit';
import { z } from 'zod';

export const integration = defineIntegration({
	name: 'astro-dynamic-static-split-domain',
	optionsSchema: z.object({
		dynamicBase: z.string(),
	}),
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async ({ updateConfig, config, command }) => {
					if (command === 'build') {
						updateConfig({
							// @ts-ignore until this API gets merged
							serverIslandDynamicBase:
								// @ts-ignore until this API gets merged
								config.serverIslandDynamicBase ?? options.dynamicBase,
						});
					}
				},
			},
		};
	},
});
