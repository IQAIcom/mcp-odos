# MCP-ODOS: Model Context Protocol Server for Decentralized Exchanges

This project implements a Model Context Protocol (MCP) server to interact with decentralized exchanges (DEXs). It allows MCP-compatible clients (like AI assistants, IDE extensions, or custom applications) to access functionalities such as getting quotes for swaps and executing swaps.

This server is built using TypeScript and `fastmcp`.

## Features (MCP Tools)

The server exposes the following tools that MCP clients can utilize:

- **`ODOS_GET_QUOTE`**: Fetch a quote for a swap.
  - Parameters: `chainId` (number), `sellToken` (string), `buyToken` (string), `sellAmount` (string)
- **`ODOS_EXECUTE_SWAP`**: Execute a swap.

  - Parameters: `chainId` (number), `sellToken` (string), `buyToken` (string), `sellAmount` (string), `quote` (string), `walletProvider` (string)

### Parameter breakdown

- `chainId`: The chain ID of the DEX.
- `sellToken`: The token you want to sell.
- `buyToken`: The token you want to buy.
- `sellAmount`: The amount of tokens you want to sell.
- `quote`: The quote you got from the `get-quote` service.
- `walletProvider`: The wallet provider you want to use.

## Prerequisites

- Node.js (v18 or newer recommended)
- pnpm (See <https://pnpm.io/installation>)

## Installation

There are a few ways to use `mcp-odos`:

**1. Using `pnpm dlx` (Recommended for most MCP client setups):**

You can run the server directly using `pnpm dlx` without needing a global installation. This is often the easiest way to integrate with MCP clients. See the "Running the Server with an MCP Client" section for examples.
(`pnpm dlx` is pnpm's equivalent of `npx`)

**2. Global Installation from npm (via pnpm):**

Install the package globally to make the `mcp-odos` command available system-wide:

```bash
pnpm add -g mcp-odos
```

**3. Building from Source (for development or custom modifications):**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/IQAIcom/mcp-odos.git
    cd mcp-odos
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Build the server:**
    This compiles the TypeScript code to JavaScript in the `dist` directory.

    ```bash
    pnpm run build
    ```

    The `prepare` script also runs `pnpm run build`, so dependencies are built upon installation if you clone and run `pnpm install`.

## Configuration (Environment Variables)

This MCP server may require certain environment variables to be set by the MCP client that runs it. These are typically configured in the client's MCP server definition (e.g., in a `mcp.json` file for Cursor, or similar for other clients).

- Any necessary environment variables for wallet providers or API keys.

## Running the Server with an MCP Client

MCP clients (like AI assistants, IDE extensions, etc.) will run this server as a background process. You need to configure the client to tell it how to start your server.

Below is an example configuration snippet that an MCP client might use (e.g., in a `mcp_servers.json` or similar configuration file). This example shows how to run the server using the published npm package via `pnpm dlx`.

```json
{
  "mcpServers": {
    "iq-odos-mcp-server": {
      "command": "pnpm",
      "args": ["dlx", "mcp-odos"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

**Alternative if Globally Installed:**

If you have installed `mcp-odos` globally (`pnpm add -g mcp-odos`), you can simplify the `command` and `args`:

```json
{
  "mcpServers": {
    "iq-odos-mcp-server": {
      "command": "mcp-odos",
      "args": [],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

- **`command`**: The executable to run.
  - For `pnpm dlx`: `"pnpm"` (with `"dlx"` as the first arg)
  - For global install: `"mcp-odos"`
- **`args`**: An array of arguments to pass to the command.
  - For `pnpm dlx`: `["dlx", "mcp-odos"]`
  - For global install: `[]`
- **`env`**: An object containing environment variables to be set when the server process starts. This is where you provide any necessary environment variables.
- **`workingDirectory`**: Generally not required when using the published package via `pnpm dlx` or a global install, as the package should handle its own paths correctly. If you were running from source (`node dist/index.js`), then setting `workingDirectory` to the project root would be important.
