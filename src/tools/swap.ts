import { fraxtal } from "viem/chains";
import { isAddress } from "viem/utils";
import { z } from "zod";
import { AssembleService } from "../services/assemble.js";
import { ExecuteSwapService } from "../services/execute-swap.js";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";
import { getChainFromName } from "../utils/get-chain.js";

const swapParamsSchema = z.object({
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

export const swapTool = {
	name: "ODOS_SWAP",
	description: "Execute a swap transaction",
	parameters: swapParamsSchema,
	execute: async (args: z.infer<typeof swapParamsSchema>) => {
		try {
			const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
			if (!walletPrivateKey) {
				throw new Error(
					"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
				);
			}

			console.log("[ODOS_SWAP] Called...");
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
				`[ODOS_SWAP] Using chain: ${chainObject} (${chainObject.id})`,
			);
			console.log(
				walletService.getWalletClient()?.account?.address ??
					"No wallet address found",
			);

			const getQuoteService = new GetQuoteActionService(walletService);
			const quote = await getQuoteService.execute(
				args.fromToken,
				args.toToken,
				chainObject.id,
				args.amount,
			);

			if (quote instanceof Error || !quote.pathId) {
				return `Error fetching quote: ${quote instanceof Error ? quote.message : String(quote)}`;
			}

			const assembleService = new AssembleService(walletService);
			const txn = await assembleService.execute(quote.pathId);
			if (!txn) {
				return `Error assembling transaction: ${txn}`;
			}

			const executeSwapService = new ExecuteSwapService(walletService);

			try {
				await executeSwapService.checkAndSetAllowance(
					quote.inTokens[0],
					BigInt(quote.inAmounts[0]),
					txn.to,
				);

				const hash = await executeSwapService.execute(txn);

				return args.prettyFormat
					? await executeSwapService.formatWithConfirmation(txn, hash)
					: JSON.stringify({ hash, txn }, null, 2);
			} catch (error: unknown) {
				const message =
					error instanceof Error
						? error.message
						: "An unknown error occurred during the execution.";
				throw new Error(`Error executing swap: ${message}`);
			}
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the fetch.";
			console.error(`[ODOS_SWAP] Error: ${message}`);
			throw new Error(`Failed in swap process: ${message}`);
		}
	},
};
