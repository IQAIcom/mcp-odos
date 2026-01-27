# 🔄 Odos MCP Server

[![npm version](https://img.shields.io/npm/v/@iqai/mcp-odos.svg)](https://www.npmjs.com/package/@iqai/mcp-odos)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📖 Overview

The Odos MCP Server enables AI agents to interact with [Odos](https://odos.xyz), a leading DEX aggregator that finds optimal swap routes across multiple decentralized exchanges. This server provides comprehensive access to quote retrieval and swap execution functionality.

By implementing the Model Context Protocol (MCP), this server allows Large Language Models (LLMs) to fetch swap quotes, compare prices, and execute token swaps directly through their context window, bridging the gap between AI and decentralized finance.

## ✨ Features

*   **Quote Retrieval**: Get optimal swap quotes with best routes across multiple DEXs.
*   **Multi-Chain Support**: Execute swaps on various blockchain networks including Fraxtal, Ethereum, and more.
*   **Swap Execution**: Execute token swaps with automatic allowance handling.
*   **Chain ID Lookup**: Retrieve chain IDs for supported blockchain networks.

## 📦 Installation

### 🚀 Using npx (Recommended)

To use this server without installing it globally:

```bash
npx @iqai/mcp-odos
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

## 🔐 Configuration (Environment Variables)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `WALLET_PRIVATE_KEY` | Yes | Your wallet private key for executing swaps | - |

## 💡 Usage Examples

### 🔍 Getting Quotes
*   "Get a quote to swap 1000 USDC for FRAX on Fraxtal."
*   "What's the best rate to swap ETH for USDC?"
*   "How much FRAX will I get for 100 USDC on Fraxtal?"

### 💱 Executing Swaps
*   "Swap 100 USDC for FRAX on Fraxtal."
*   "Execute a trade: sell 1000 USDC for ETH."
*   "Trade my USDC for the maximum amount of FRAX."

### 🔗 Chain Information
*   "What is the chain ID for Fraxtal?"
*   "Get the chain ID for Ethereum mainnet."

## 🛠️ MCP Tools

<!-- AUTO-GENERATED TOOLS START -->

### `ODOS_GET_CHAIN_ID`
Get the chain ID for a given chain name

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chain` | string | ✅ | The chain name to get the ID for |

### `ODOS_GET_QUOTE`
Get a quote for a swap or exchange operation

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `chain` | string |  | "fraxtal" | The blockchain network to execute the transaction on. uses fraxtal as default |
| `fromToken` | string | ✅ |  | The token to swap from (address). |
| `toToken` | string | ✅ |  | The token to swap to (address). |
| `amount` | string | ✅ |  | The amount of tokens to swap, in wei. |
| `prettyFormat` | boolean |  | true | Whether to pretty format the quote. |

### `ODOS_SWAP`
Execute a swap transaction

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `chain` | string |  | "fraxtal" | The blockchain network to execute the transaction on. uses fraxtal as default |
| `fromToken` | string | ✅ |  | The token to swap from (address). |
| `toToken` | string | ✅ |  | The token to swap to (address). |
| `amount` | string | ✅ |  | The amount of tokens to swap, in wei. |
| `prettyFormat` | boolean |  | true | Whether to pretty format the quote. |

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
*   `src/services/`: API client and business logic
*   `src/utils/`: Shared utilities
*   `src/index.ts`: Server entry point

## 📚 Resources

*   [Odos Documentation](https://docs.odos.xyz)
*   [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
*   [Odos Platform](https://odos.xyz)

## ⚠️ Disclaimer

This project is an unofficial tool and is not directly affiliated with Odos. It interacts with financial data and decentralized exchanges. Users should exercise caution and verify all data independently. Trading on decentralized exchanges involves risk.

## 📄 License

[ISC](LICENSE)
