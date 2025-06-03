import type { Chain } from "viem";
import * as chains from "viem/chains";

export function getChainFromName(name: string): Chain {
	switch (name.toLowerCase()) {
		case "fraxtal":
			return chains.fraxtal;
		case "mainnet":
			return chains.mainnet;
		case "optimism":
			return chains.optimism;
		case "polygon":
			return chains.polygon;
		case "bsc":
			return chains.bsc;
		case "base":
			return chains.base;
		case "arbitrum":
			return chains.arbitrum;
		case "avalanche":
			return chains.avalanche;
		case "linea":
			return chains.linea;
		case "scroll":
			return chains.scroll;
		case "mode":
			return chains.mode;
		case "sonic":
			return chains.sonic;
		case "fantom":
			return chains.fantom;
		case "zksync era":
			return chains.zksync;
		case "mantle":
			return chains.mantle;
		case "sepolia":
			return chains.sepolia;
		case "goerli":
			return chains.goerli;
		case "polygon mumbai":
			return chains.polygonMumbai;
		case "arbitrum goerli":
			return chains.arbitrumGoerli;
		case "bsc testnet":
			return chains.bscTestnet;
		case "eth":
			return chains.mainnet;
		case "matic":
			return chains.polygon;
		case "bnb":
			return chains.bsc;
		case "avax":
			return chains.avalanche;
		case "arb":
			return chains.arbitrum;
		case "ftm":
			return chains.fantom;
		case "era":
			return chains.zksync;
		default:
			throw new Error(`Chain ${name} not supported`);
	}
}
