import type { Chain } from "viem";
import { z } from "zod";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";
import { fraxtal } from "viem/chains";
import { CHAIN_IDS, CHAIN_OBJECTS } from "../lib/constants.js";

const getQuoteParamsSchema = z.object({
	chain: z
		.string()
		.optional()
		.describe("The blockchain network to execute the transaction on."),
	fromToken: z.string().describe("The token to swap from."),
	toToken: z.string().describe("The token to swap to."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe("The amount of tokens to swap."),
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

			console.log("[ODOS_GET_QUOTE] Called...");

			const inputChain = (args.chain ?? "fraxtal").toLowerCase();

			const chainId = CHAIN_IDS[Object.keys(CHAIN_IDS).find(
				key => key.toLowerCase() === inputChain
			) ?? ""];
			// Get the actual chain object
			const chainObject = CHAIN_OBJECTS[inputChain];

			if (args.chain && (!chainId || !chainObject)) {
				throw new Error(`Invalid or unsupported chain: ${inputChain}`);
			}

			const walletService = new WalletService(walletPrivateKey, chainObject ?? fraxtal);

			console.log(
				`[ODOS_GET_QUOTE] Using chain: ${chainObject} (${chainId})`,
			);
			console.log(walletService.getWalletClient()?.account?.address ?? "No wallet address found");

			const service = new GetQuoteActionService(walletService);
			
			const quote = await service.execute(
				args.fromToken,
				args.toToken,
				chainId,
				args.amount,
			);
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
	},
};
