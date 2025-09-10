#!/bin/bash

# ByteBooks Frontend Setup Script

echo "🚀 Setting up ByteBooks Frontend..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# For production, update this to your actual backend URL
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
EOF
    echo "✅ .env.local file created"
else
    echo "⚠️  .env.local file already exists"
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  http://localhost:5000"
echo ""
echo "Make sure your backend API is running at:"
echo "  http://localhost:3000"
