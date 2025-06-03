import { z } from "zod";
import { getChainFromName } from "../utils/get-chain.js";

const chainIdSchema = z.object({
	chain: z.string().describe("The chain name to get the ID for"),
});

export const chainIdTool = {
	name: "ODOS_GET_CHAIN_ID",
	description: "Get the chain ID for a given chain name",
	parameters: chainIdSchema,
	execute: async (args: z.infer<typeof chainIdSchema>) => {
		try {
			console.log("[ODOS_GET_CHAIN_ID] Called...");

			const chain = getChainFromName(args.chain);
			return chain.id.toString();
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};
