import { ODOS_API_URL } from "../constants.js";
import type { AssembleResponseTxn } from "../types.js";
import type { WalletService } from "./wallet.js";

export class AssembleService {
	private readonly walletService: WalletService;

	constructor(walletService: WalletService) {
		this.walletService = walletService;
	}

	async execute(pathId: string) {
		const walletClient = this.walletService.getWalletClient();
		const userAddr = walletClient?.account?.address;
		if (!userAddr) {
			throw new Error("User address is not defined");
		}
		try {
			const response = await fetch(`${ODOS_API_URL}/sor/assemble`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userAddr,
					pathId,
				}),
			});
			if (!response.ok) {
				throw new Error(
					`HTTP error! status: ${response.status} - ${response.statusText}`,
				);
			}
			const data = (await response.json()) as {
				transaction: AssembleResponseTxn;
			};
			return data.transaction as AssembleResponseTxn;
		} catch (error) {
			console.error("Error assembling path:", error);
		}
	}
}
