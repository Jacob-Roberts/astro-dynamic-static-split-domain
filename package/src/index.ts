import type { AstroIntegration } from 'astro';
import { AstroError } from 'astro/errors';

import { z } from 'zod';

const userOptionsSchema = z.object({
	dynamicBase: z.string(),
});

const name = 'astro-dynamic-static-split-domain';

/**
 * Astro integration to split dynamic and static assets across different domains.
 * @param userOptions {Object} - The options for the integration.
 * @param {string} userOptions.dynamicBase - Required: The base URL for the dynamic server.
 */
function integration(
	userOptions: z.input<typeof userOptionsSchema>
): AstroIntegration {
	const parsedOptions = userOptionsSchema.safeParse(userOptions);

	if (!parsedOptions.success) {
		throw new AstroError(
			`Invalid options passed to "${name}" integration\n`,
			parsedOptions.error.issues.map((i) => i.message).join('\n')
		);
	}

	return {
		name: name,
		hooks: {
			'astro:config:setup': async ({ updateConfig, config, command }) => {
				if (command === 'build') {
					updateConfig({
						serverIslandDynamicBase:
							config.serverIslandDynamicBase ?? parsedOptions.data.dynamicBase,
					});
				}
			},
		},
	};
}

export default integration;
