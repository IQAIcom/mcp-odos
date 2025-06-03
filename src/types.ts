import type { Chain } from "viem";

export interface OdosActionParams {
	walletPrivateKey?: string;
	chain?: Chain;
}
export interface QuoteResponse {
	inTokens: string[];
	outTokens: string[];
	inAmounts: string[];
	outAmounts: string[];
	gasEstimate: number;
	dataGasEstimate: number;
	gweiPerGas: number;
	gasEstimateValue: number;
	inValues: number[];
	outValues: number[];
	netOutValue: number;
	priceImpact: number | null;
	percentDiff: number;
	pathId: string | null;
	blockNumber: number;
	deprecated: string | null;
	partnerFeePercent: number;
	pathVizImage: string | null;
}

export interface AssembleResponseTxn {
	chainId: number; // Chain ID for path execution
	gas: string; // Gas limit (2x naive or 1.1x simulated)
	gasPrice: string; // Gas price for path calculation
	value: string; // Input gas token amount (0 if not input)
	to: string; // Odos router address
	from: string; // Transaction source address
	data: string; // Router calldata for DEX swaps
	nonce: number; // Transaction nonce
}
