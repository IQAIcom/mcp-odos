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
				interface ErrorResponse {
					detail: string;
					traceId: string;
					errorCode: number;
				}
				const errorData = data as ErrorResponse;
				throw new Error(
					`Failed to fetch quote: ${errorData.detail} (Trace ID: ${errorData.traceId}, Error Code: ${errorData.errorCode})`,
				);
			}

			return data as QuoteResponse;
		} catch (error) {
			console.error("Error fetching quote:", error);
			throw new Error(
				`Fatally Failed to fetch quote: ${(error as Error).message} with code ${
					(error as { code?: string }).code || "unknown"
				}`,
			);
		}
	}

	format(quote: QuoteResponse) {
		const formattedQuote = dedent`
      💱 Quote Details
      - Input: ${formatUnits(BigInt(quote.inAmounts[0]), 18)} ${quote.inTokens[0]}
      - Output: ${formatUnits(BigInt(quote.outAmounts[0]), 18)} ${quote.outTokens[0]}
      - Price Impact: ${quote.priceImpact ? `${quote.priceImpact?.toFixed(2)}%` : "N/A"}
      - Gas Estimate: ${quote.gasEstimate} (${quote.gasEstimateValue.toFixed(2)} USD)
      - Net Output Value: $${quote.netOutValue.toFixed(2)}
	  - Deprecated: ${quote.deprecated ? quote.deprecated : "N/A"}
	  - Partner Fee Percent: ${quote.partnerFeePercent} %
	  - Path Viz Image: ${quote.pathVizImage ? quote.pathVizImage : "N/A"}
	  - Path ID: ${quote.pathId ? quote.pathId : "N/A"}
	  - Block Number: ${quote.blockNumber}
	  - Percent Diff: ${quote.percentDiff.toFixed(2)}%
	  - Data Gas Estimate: ${quote.dataGasEstimate} units
	  - Gwei Per Gas: ${quote.gweiPerGas} gwei
	  - In Values: ${quote.inValues.map((v) => v.toFixed(2)).join(", ")}
	  - Out Values: ${quote.outValues.map((v) => v.toFixed(2)).join(", ")}
	  - other data: ${JSON.stringify(quote, null, 2)}
    `;
		return formattedQuote;
	}
}
