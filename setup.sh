#!/bin/bash
set -e

echo "=========================================="
echo "  Spring Web App - NetShield Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "pom.xml" ]; then
    echo "❌ Error: pom.xml not found. Are you in the spring-web-app directory?"
    exit 1
fi

# Step 1: Build NetShield
echo "📦 Step 1/4: Building NetShield..."
cd .github/actions/netshield
npm install
npm run build
cd ../../..
echo "✅ NetShield built successfully"
echo ""

# Step 2: Initialize Git
echo "🔧 Step 2/4: Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit: Spring Web App with NetShield"
    echo "✅ Git initialized and initial commit created"
else
    echo "ℹ️  Git already initialized"
fi
echo ""

# Step 3: Instructions for GitHub
echo "🚀 Step 3/4: Push to GitHub"
echo ""
echo "Create a new repository on GitHub, then run:"
echo ""
echo "  git remote add origin https://github.com/YOUR-USERNAME/spring-web-app.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
read -p "Press Enter when you've pushed to GitHub..."
echo ""

# Step 4: Create test branch
echo "🧪 Step 4/4: Create test branch with secrets"
echo ""
read -p "Do you want to create a test branch with fake secrets? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout -b test-secrets
    
    # Add test secrets
    cat >> src/main/resources/application.properties << 'EOF'

# DANGER: Test secrets - NetShield should catch these!
aws.access.key=AKIA4EXAMPLE7TESTKEY9
aws.secret.key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
database.password=SuperSecret123!
api.secret.token=sk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
EOF
    
    git add src/main/resources/application.properties
    git commit -m "Test: Add secrets for NetShield detection"
    
    echo ""
    echo "✅ Test branch created with secrets"
    echo ""
    echo "Next steps:"
    echo "1. Push: git push origin test-secrets"
    echo "2. Go to GitHub and create a Pull Request"
    echo "3. Watch NetShield catch the secrets ❌"
    echo ""
    echo "Note: GitHub push protection might block the push."
    echo "If so, follow the URL to allow it for testing."
fi

echo ""
echo "=========================================="
echo "  Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "To run the app locally:"
echo "  mvn spring-boot:run"
echo ""
echo "Visit: http://localhost:8080"
echo ""
