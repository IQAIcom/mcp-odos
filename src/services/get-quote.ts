import dedent from "dedent";
import { formatUnits } from "viem";
import { ODOS_API_URL } from "../constants.js";
import type { QuoteResponse } from "../types.js";
import type { WalletService } from "./wallet.js";

export class GetQuoteActionService {
	private readonly walletService: WalletService;

	constructor(walletService: WalletService) {
		this.walletService = walletService;
	}

	async execute(
		fromToken: string,
		toToken: string,
		chainId: number,
		amount: string,
	) {
		const userAddr = this.walletService.getWalletClient()?.account?.address;

		if (!userAddr) {
			throw new Error("User address is not defined");
		}

		try {
			const response = await fetch(`${ODOS_API_URL}/sor/quote/v2`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chainId,
					userAddr,
					inputTokens: [
						{
							tokenAddress: fromToken,
							amount,
						},
					],
					outputTokens: [
						{
							proportion: 1,
							tokenAddress: toToken,
						},
					],
					slippageLimitPercent: 0.3,
					referralCode: 0,
					disableRFQs: true,
					compact: true,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(`Failed to fetch quote: ${response.statusText}`);
			}

			return data as QuoteResponse;
		} catch (error) {
			throw new Error(
				`Fatally Failed to fetch quote: ${(error as Error).message}`,
			);
		}
	}

	format(quote: QuoteResponse) {
		const formattedQuote = dedent`
      💱 Quote Details
      - Input: ${formatUnits(BigInt(quote.inAmounts[0]), 18)} ${quote.inTokens[0]}
      - Output: ${formatUnits(BigInt(quote.outAmounts[0]), 18)} ${quote.outTokens[0]}
      - Price Impact: ${quote.priceImpact ? `${quote.priceImpact.toFixed(2)}%` : "N/A"}
      - Gas Estimate: ${quote.gasEstimate} (${quote.gasEstimateValue.toFixed(2)} USD)
      - Net Output Value: $${quote.netOutValue.toFixed(2)}
    `;
		return formattedQuote;
	}
}
