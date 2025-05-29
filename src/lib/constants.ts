import {
	type Chain,
	arbitrum,
	avalanche,
	base,
	bsc,
	fraxtal,
	linea,
	mainnet,
	optimism,
	polygon,
	scroll,
} from "viem/chains";

export const CHAIN_IDS: Record<string, number> = {
	Ethereum: mainnet.id,
	Optimism: optimism.id,
	"BNB Chain": bsc.id,
	Polygon: polygon.id,
	Sonic: 64165,
	Fantom: 250,
	Fraxtal: 252,
	"zkSync Era": 324,
	Mantle: 5000,
	Base: base.id,
	Mode: 34443,
	Arbitrum: arbitrum.id,
	Avalanche: avalanche.id,
	Linea: linea.id,
	Scroll: scroll.id,
};

export const NORMALIZED_CHAIN_IDS: Record<string, number> = Object.fromEntries(
	Object.entries(CHAIN_IDS).map(([name, id]) => [name.toLowerCase(), id]),
);

export const NORMALIZED_CHAIN_NAMES: Record<string, string> =
	Object.fromEntries(
		Object.entries(CHAIN_IDS).map(([name]) => [name.toLowerCase(), name]),
	);

export const CHAIN_OBJECTS: Record<string, Chain> = {
	ethereum: {
		id: mainnet.id,
		name: "Ethereum",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: {
			default: {
				http: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
			},
		},
	},
	optimism: {
		id: optimism.id,
		name: "Optimism",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: {
			default: { http: ["https://mainnet.optimism.io"] },
		},
	},
	"bnb chain": {
		id: bsc.id,
		name: "BNB Chain",
		nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
		rpcUrls: { default: { http: ["https://bsc-dataseed.binance.org/"] } },
	},
	polygon: {
		id: polygon.id,
		name: "Polygon",
		nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
		rpcUrls: { default: { http: ["https://polygon-rpc.com"] } },
	},
	sonic: {
		id: 64165,
		name: "Sonic",
		nativeCurrency: { name: "SONIC", symbol: "SONIC", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.sonic.org"] } },
	},
	fantom: {
		id: 250,
		name: "Fantom",
		nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.ftm.tools"] } },
	},
	fraxtal: {
		id: 252,
		name: "Fraxtal",
		nativeCurrency: { name: "FRAX", symbol: "FRAX", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.fraxtal.org"] } },
	},
	"zksync era": {
		id: 324,
		name: "zkSync Era",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: { default: { http: ["https://mainnet.era.zksync.io"] } },
	},
	mantle: {
		id: 5000,
		name: "Mantle",
		nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.mantle.xyz"] } },
	},
	base: {
		id: base.id,
		name: "Base",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: { default: { http: ["https://mainnet.base.org"] } },
	},
	mode: {
		id: 34443,
		name: "Mode",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: { default: { http: ["https://mainnet.mode.network"] } },
	},
	arbitrum: {
		id: arbitrum.id,
		name: "Arbitrum",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: { default: { http: ["https://arb1.arbitrum.io/rpc"] } },
	},
	avalanche: {
		id: avalanche.id,
		name: "Avalanche",
		nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
		rpcUrls: { default: { http: ["https://api.avax.network/ext/bc/C/rpc"] } },
	},
	linea: {
		id: linea.id,
		name: "Linea",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.linea.build"] } },
	},
	scroll: {
		id: scroll.id,
		name: "Scroll",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.scroll.io"] } },
	},
};
