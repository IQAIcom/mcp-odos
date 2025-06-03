import { fraxtal } from "viem/chains";
import { z } from "zod";
import { isAddress } from "viem/utils";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";
import { getChainFromName } from "../utils/get-chain.js";

const getQuoteParamsSchema = z.object({
	chain: z
		.string()
		.optional()
		.describe(
			"The blockchain network to execute the transaction on. uses fraxtal as default",
		)
		.default("fraxtal"),
	fromToken: z
		.string()
		.refine(isAddress, { message: "Invalid fromToken address" })
		.describe("The token to swap from (address)."),
	toToken: z
		.string()
		.refine(isAddress, { message: "Invalid toToken address" })
		.describe("The token to swap to (address)."),
	amount: z
		.string()
		.regex(/^\d+$/, { message: "Amount must be a string in wei (no decimals)" })
		.describe("The amount of tokens to swap, in wei."),
	prettyFormat: z
		.boolean()
		.optional()
		.describe("Whether to pretty format the quote.")
		.default(true),
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

			const inputChain = args.chain.toLowerCase();

			const chainObject = getChainFromName(inputChain);

			if (args.chain && !chainObject) {
				throw new Error(`Invalid or unsupported chain: ${inputChain}`);
			}

			const walletService = new WalletService(
				walletPrivateKey,
				chainObject ?? fraxtal,
			);

			console.log(
				`[ODOS_GET_QUOTE] Using chain: ${chainObject} (${chainObject.id})`,
			);
			console.log(
				walletService.getWalletClient()?.account?.address ??
					"No wallet address found",
			);

			const service = new GetQuoteActionService(walletService);

			const quote = await service.execute(
				args.fromToken,
				args.toToken,
				chainObject.id,
				args.amount,
			);
			if (quote instanceof Error) {
				return `Error fetching quote: ${quote.message}`;
			}

			return args.prettyFormat
				? service.format(quote)
				: JSON.stringify(quote, null, 2);
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
