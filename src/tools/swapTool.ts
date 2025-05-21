import { z } from "zod";
import { AssembleService } from "../services/assemble";
import { ExecuteSwapService } from "../services/execute-swap";
import { GetQuoteActionService } from "../services/get-quote";
import { WalletService } from "../services/wallet";
import type { Chain } from "viem";

const swapSchema = z.object({
  chain: z
      .string()
      .optional()
      .describe("The blockchain network to execute the transaction on."),
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
	
            console.log(
                `[ODOS_SWAP] Called...`,
                );
			// const walletService = new WalletService(walletPrivateKey);
            const walletService = new WalletService(
                walletPrivateKey,
                args.chain ? (args.chain as unknown as Chain) : undefined
              );
			const getQuoteService = new GetQuoteActionService(walletService);
			const quote = await getQuoteService.execute();

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
			} catch (error) {
				return `Error executing swap: ${error instanceof Error ? error.message : String(error)}`;
			}
		} catch (error) {
			return `Error in swap process: ${error instanceof Error ? error.message : String(error)}`;
		}
    }

}