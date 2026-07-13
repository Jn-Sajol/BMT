#!/bin/bash
# local initialization automation helper script

echo "Initializing BMT Marketing Operating System monorepo workspace..."

# Check Node.js version
if ! [ -x "$(command -v node)" ]; then
  echo "Error: Node.js is not installed." >&2
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Warning: Node.js version should be v20 or greater (detected v$(node -v))."
fi

# Check pnpm
if ! [ -x "$(command -v pnpm)" ]; then
  echo "Installing pnpm dynamically..."
  npm install -g pnpm
fi

echo "Installing monorepo workspace dependencies..."
pnpm install

echo "Verifying build configurations..."
pnpm build

echo "Initialization complete. Run 'pnpm dev' to launch the local development server."
