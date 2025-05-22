import { z } from "zod";
import { chainIdProvider } from "../providers/chainId-provider.js";


export const chainIdTool = {
	name: "ODOS_GET_CHAIN_ID",
	description: "Get the chain ID for a given chain name",
    execute: async () => {
        try {
            console.log(
                `[ODOS_GET_QUOTE] Called...`,
                );

            const chainId = await chainIdProvider.get();
            return chainId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
	