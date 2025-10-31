#!/bin/bash
# Script to verify Codespaces secret is available

echo "=== Environment Variable Check ==="
echo ""

ANTHROPIC_KEY="${ANTHROPIC_API_KEY:-$VITE_ANTHROPIC_API_KEY}"

if [ -z "$ANTHROPIC_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY is NOT set"
    echo ""
    echo "Next steps:"
    echo "1. Make sure you've added the Codespaces secret in GitHub settings"
    echo "2. RESTART your Codespace (stop and start it from GitHub)"
    echo "3. Run this script again after restart"
    echo ""
    echo "Secret should be scoped to this repository: $(git config --get remote.origin.url)"
else
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        echo "✅ ANTHROPIC_API_KEY is set"
        echo "   Value starts with: ${ANTHROPIC_API_KEY:0:7}..."
        if [ -n "$VITE_ANTHROPIC_API_KEY" ]; then
            echo "ℹ️  VITE_ANTHROPIC_API_KEY is also defined — consider removing it to avoid leaking secrets to the client."
        fi
    else
        echo "⚠️ Using legacy VITE_ANTHROPIC_API_KEY fallback"
        echo "   Value starts with: ${VITE_ANTHROPIC_API_KEY:0:7}..."
        echo "   Rename this secret to ANTHROPIC_API_KEY when possible."
    fi
    echo ""
    echo "Your secret is configured correctly!"
    echo "You can now run: npm run dev"
fi

echo ""
if [ -n "$ANTHROPIC_MODEL" ]; then
    echo "ℹ️  ANTHROPIC_MODEL is set to: $ANTHROPIC_MODEL"
else
    echo "ℹ️  ANTHROPIC_MODEL is not set — proxy will use default claude-3-5-sonnet-20240620"
fi

echo ""
echo "=== All Anthropic-related environment variables ==="
printenv | grep -E '^(VITE_)?ANTHROPIC_' || echo "No Anthropic environment variables found"
