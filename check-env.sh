#!/bin/bash
# Script to verify Codespaces secret is available

echo "=== Environment Variable Check ==="
echo ""

ANTHROPIC_KEY="${VITE_ANTHROPIC_API_KEY:-$ANTHROPIC_API_KEY}"

if [ -z "$ANTHROPIC_KEY" ]; then
    echo "❌ VITE_ANTHROPIC_API_KEY (or ANTHROPIC_API_KEY) is NOT set"
    echo ""
    echo "Next steps:"
    echo "1. Make sure you've added the Codespaces secret in GitHub settings"
    echo "2. RESTART your Codespace (stop and start it from GitHub)"
    echo "3. Run this script again after restart"
    echo ""
    echo "Secret should be scoped to this repository: $(git config --get remote.origin.url)"
else
    if [ -n "$VITE_ANTHROPIC_API_KEY" ]; then
        echo "✅ VITE_ANTHROPIC_API_KEY is set"
        echo "   Value starts with: ${VITE_ANTHROPIC_API_KEY:0:7}..."
    else
        echo "✅ ANTHROPIC_API_KEY is set"
        echo "   Value starts with: ${ANTHROPIC_API_KEY:0:7}..."
    fi
    echo ""
    echo "Your secret is configured correctly!"
    echo "You can now run: npm run dev"
fi

echo ""
echo "=== All Anthropic-related environment variables ==="
printenv | grep -E '^(VITE_)?ANTHROPIC_' || echo "No Anthropic environment variables found"
