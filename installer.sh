#!/usr/bin/env bash
set -e

# -------------------------------
# DockShip Installer
# -------------------------------

clear

echo "\x1b[34m"
cat public/ascii.txt
echo "\x1b[0m\n\n"

echo "Welcome to the DockShip installer!"

# 2️⃣ Prompt for Lite Mode
read -p "Do you want to enable Lite Mode? (API only, no UI) [y/N]: " lite_mode
if [[ "$lite_mode" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "DOCKSHIP_LITE=true" > .env
else
  echo "DOCKSHIP_LITE=false" > .env
fi

# 3️⃣ Display GitHub OAuth info
BASE_URL="http://localhost:3000"
REDIRECT_URL="$BASE_URL/api/auth/callback/github"

echo ""
echo "To integrate with GitHub, create a GitHub OAuth App here:"
echo "  https://github.com/settings/developers"
echo ""
echo "Use the following URLs:"
echo "  Base URL:     $BASE_URL"
echo "  Redirect URL: $REDIRECT_URL"
echo ""

# 4️⃣ Prompt for GitHub Client ID and Secret
read -p "Enter your GitHub Client ID: " GITHUB_CLIENT_ID
read -p "Enter your GitHub Client Secret: " GITHUB_CLIENT_SECRET

# Append to .env
echo "GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID" >> .env
echo "GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET" >> .env

# 5️⃣ Install dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# 6️⃣ Build the app
echo ""
echo "Building DockShip..."
npm run build

# 7️⃣ Create systemd service
SERVICE_FILE="/etc/systemd/system/dockship.service"

echo ""
echo "Creating systemd service at $SERVICE_FILE..."
sudo tee $SERVICE_FILE > /dev/null <<EOL
[Unit]
Description=DockShip Control Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$(pwd)
ExecStart=$(which npm) run start
Restart=always
EnvironmentFile=$(pwd)/.env
User=$(whoami)
Group=$(whoami)

[Install]
WantedBy=multi-user.target
EOL

# 8️⃣ Enable and start the service
echo ""
echo "Enabling and starting DockShip service..."
sudo systemctl daemon-reload
sudo systemctl enable dockship
sudo systemctl start dockship

echo ""
echo "✅ DockShip installation complete!"
echo "You can check logs with: sudo journalctl -u dockship -f"
echo "Lite Mode: $(grep DOCKSHIP_LITE .env)"
echo "You can edit .env later to update configuration."
