import type { Chain } from "viem";
import { fraxtal, mainnet } from "viem/chains";
import { z } from "zod";
import { CHAIN_IDS, CHAIN_OBJECTS } from "../lib/constants.js";
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
			const inputChain = (args.chain ?? "fraxtal").toLowerCase();

			const chainId =
				CHAIN_IDS[
					Object.keys(CHAIN_IDS).find(
						(key) => key.toLowerCase() === inputChain,
					) ?? ""
				];
			// Get the actual chain object
			const chainObject = CHAIN_OBJECTS[inputChain];

			if (args.chain && (!chainId || !chainObject)) {
				throw new Error(`Invalid or unsupported chain: ${inputChain}`);
			}

			const walletService = new WalletService(
				walletPrivateKey,
				chainObject ?? fraxtal,
			);

			console.log(`[ODOS_SWAP] Using chain: ${chainObject} (${chainId})`);
			console.log(
				walletService.getWalletClient()?.account?.address ??
					"No wallet address found",
			);

			const getQuoteService = new GetQuoteActionService(walletService);
			const quote = await getQuoteService.execute(
				args.fromToken,
				args.toToken,
				chainId,
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
