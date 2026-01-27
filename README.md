# 🔄 ODOS MCP Server

[![npm version](https://img.shields.io/npm/v/@iqai/mcp-odos.svg)](https://www.npmjs.com/package/@iqai/mcp-odos)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📖 Overview

The ODOS MCP Server enables AI agents to interact with [Odos](https://www.odos.xyz), a decentralized exchange aggregator that finds the most efficient swap routes across multiple DEXs. This server provides access to swap quotes and execution capabilities for optimal token swaps.

By implementing the Model Context Protocol (MCP), this server allows Large Language Models (LLMs) to get swap quotes, execute token swaps, and interact with the Odos API directly through their context window, bridging the gap between AI and decentralized exchange aggregation.

<a href="https://glama.ai/mcp/servers/@IQAIcom/mcp-odos">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@IQAIcom/mcp-odos/badge" alt="MCP-ODOS MCP server" />
</a>

## ✨ Features

*   **Optimal Routing**: Get the most efficient swap routes across multiple DEXs through Odos aggregation.
*   **Quote Retrieval**: Fetch detailed swap quotes including expected output amounts and price impact.
*   **Swap Execution**: Execute swaps directly from quotes with wallet integration.
*   **Multi-Chain Support**: Support for various EVM-compatible chains through chain ID configuration.

## 📦 Installation

### 🚀 Using npx (Recommended)

To use this server without installing it globally:

```bash
npx @iqai/mcp-odos
```

### 📦 Using pnpm dlx

```bash
pnpm dlx @iqai/mcp-odos
```

### 🔧 Build from Source

```bash
git clone https://github.com/IQAIcom/mcp-odos.git
cd mcp-odos
pnpm install
pnpm run build
```

## ⚡ Running with an MCP Client

Add the following configuration to your MCP client settings (e.g., `claude_desktop_config.json`).

### 📋 Minimal Configuration

```json
{
  "mcpServers": {
    "odos": {
      "command": "npx",
      "args": ["-y", "@iqai/mcp-odos"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

### ⚙️ Advanced Configuration (Local Build)

```json
{
  "mcpServers": {
    "odos": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-odos/dist/index.js"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

### 🔄 Alternative: Using pnpm dlx

```json
{
  "mcpServers": {
    "odos": {
      "command": "pnpm",
      "args": ["dlx", "@iqai/mcp-odos"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

## 🔐 Configuration (Environment Variables)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `WALLET_PRIVATE_KEY` | Yes | Private key for the wallet executing swaps | - |

### 🔒 Security Notes

*   **Keep your `WALLET_PRIVATE_KEY` private** - Never share or commit your private key.
*   Only use wallets with funds you're willing to risk when interacting with DeFi protocols.
*   Consider using a dedicated wallet for MCP interactions.

## 💡 Usage Examples

### 📊 Getting Quotes
*   "Get a quote to swap 1 ETH for USDC on Ethereum mainnet."
*   "What's the best rate to swap 1000 USDC to DAI?"
*   "Show me a quote for swapping 0.5 ETH to WBTC on chain 1."

### 🔄 Executing Swaps
*   "Execute the swap from the quote I just received."
*   "Swap 100 USDC to ETH using the Odos aggregator."

### 🔍 Chain Information
*   "What chain ID am I connected to?"
*   "Get the current chain ID."

## 🛠️ MCP Tools

<!-- AUTO-GENERATED TOOLS START -->

### `ODOS_GET_QUOTE`
Fetch a quote for a token swap from Odos API.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | ✅ | The chain ID of the network |
| `sellToken` | string | ✅ | The token address to sell |
| `buyToken` | string | ✅ | The token address to buy |
| `sellAmount` | string | ✅ | The amount of tokens to sell (in base units) |

### `ODOS_SWAP`
Execute a swap using an Odos quote.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | ✅ | The chain ID of the network |
| `sellToken` | string | ✅ | The token address to sell |
| `buyToken` | string | ✅ | The token address to buy |
| `sellAmount` | string | ✅ | The amount of tokens to sell (in base units) |
| `quote` | string | ✅ | The quote received from ODOS_GET_QUOTE |
| `walletProvider` | string | ✅ | The wallet provider identifier |

### `ODOS_GET_CHAIN_ID`
Get the current chain ID.

_No parameters_

<!-- AUTO-GENERATED TOOLS END -->

## 👨‍💻 Development

### 🏗️ Build Project
```bash
pnpm run build
```

### 👁️ Development Mode (Watch)
```bash
pnpm run watch
```

### ✅ Linting & Formatting
```bash
pnpm run lint
pnpm run format
```

### 📁 Project Structure
*   `src/tools/`: Individual tool definitions
*   `src/lib/`: Shared utilities, constants, and configuration
*   `src/index.ts`: Server entry point

## 📚 Resources

*   [Odos Protocol](https://www.odos.xyz)
*   [Odos API Documentation](https://docs.odos.xyz)
*   [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

## ⚠️ Disclaimer

This project interacts with decentralized exchanges and DeFi protocols. Trading in cryptocurrencies involves significant risk including price slippage, impermanent loss, and potential loss of funds. Users should verify all swap parameters and understand the risks before executing trades. The authors are not responsible for any financial losses incurred through the use of this software.

## 📄 License

[MIT](LICENSE)
