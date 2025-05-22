
import { CHAIN_IDS } from "../lib/constants.js";

const chainIdProvider = {
	get: async (_) => {
		const chains = Object.entries(CHAIN_IDS)
			.map(([chainName, chainId]) => `${chainName}: ${chainId}`)
			.join("\n");
		return `The available chains and their IDs are:\n${chains}`;
	},
};

export { chainIdProvider };
