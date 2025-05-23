import { FastMCP } from "fastmcp";
import { chainIdTool } from "./tools/chainidTool.js";
import { getQuoteTool } from "./tools/getQuoteTool.js";
import { swapTool } from "./tools/swapTool.js";

async function main() {
	console.log("Initializing MCP Odos Server...");

	const server = new FastMCP({
		name: "IQAI Odos MCP Server",
		version: "0.0.1",
	});

	server.addTool(getQuoteTool);
	server.addTool(swapTool);
	server.addTool(chainIdTool);

	try {
		await server.start({
			transportType: "stdio",
		});
		console.log("✅ IQ Odos MCP Server started successfully over stdio.");
		console.log("You can now connect to it using an MCP client.");
	} catch (error) {
		console.error("❌ Failed to start IQ Odos MCP Server:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("❌ An unexpected error occurred:", error);
	process.exit(1);
});
