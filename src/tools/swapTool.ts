import type { Chain } from "viem";
import { fraxtal, mainnet } from "viem/chains";
import { z } from "zod";
import { AssembleService } from "../services/assemble.js";
import { ExecuteSwapService } from "../services/execute-swap.js";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";

const swapSchema = z.object({
	chain: z
		.string()
		.optional()
		.describe("The blockchain network to execute the transaction on."),
	fromToken: z.string().describe("The token to swap from."),
	toToken: z.string().describe("The token to swap to."),
	chainId: z.number().describe("The chain ID to execute the transaction on."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe("The amount of tokens to swap."),
});

export const swapTool = {
	name: "ODOS_SWAP",
	description: "Execute a swap transaction",
	parameters: swapSchema,
	execute: async (args: z.infer<typeof swapSchema>) => {
		try {
			const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
			if (!walletPrivateKey) {
				throw new Error(
					"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
				);
			}

			console.log("[ODOS_SWAP] Called...");
			// const walletService = new WalletService(walletPrivateKey);
			const walletService = new WalletService(
				walletPrivateKey,
				args.chain ? (args.chain as unknown as Chain) : fraxtal,
			);
			const getQuoteService = new GetQuoteActionService(walletService);
			const quote = await getQuoteService.execute(
				args.fromToken,
				args.toToken,
				args.chainId,
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

				return await executeSwapService.formatWithConfirmation(txn, hash);
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
