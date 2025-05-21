import { z } from "zod";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";
import type { Address, Chain } from "viem";

const getQuoteParamsSchema = z.object({
  chain: z
      .string()
      .optional()
      .describe("The blockchain network to execute the transaction on."),
});

export const getQuoteTool = {
	name: "ODOS_GET_QUOTE",
	description: "Get a quote for a swap or exchange operation",
    parameters: getQuoteParamsSchema,
    execute: async (args: z.infer<typeof getQuoteParamsSchema>) => {
        try {
            const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
			if (!walletPrivateKey) {
				throw new Error(
					"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
				);
			}
	
		console.log(
			`[ODOS_GET_QUOTE] Called...`,
			);
            
			// const walletService = new WalletService(walletPrivateKey);
            const walletService = new WalletService(
                walletPrivateKey,
                args.chain ? (args.chain as unknown as Chain) : undefined
              );
			const service = new GetQuoteActionService(walletService);
			const quote = await service.execute();
			if (quote instanceof Error) {
				return `Error fetching quote: ${quote.message}`;
			}

			return service.format(quote);
		} catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while fetching quote.";
            console.error(`[ODOS_GET_QUOTE] Error: ${message}`);
            throw new Error(`Failed to fetch quote: ${message}`);
        }
    }

}
