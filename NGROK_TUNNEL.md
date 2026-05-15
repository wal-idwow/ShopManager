# Exposing Local Server with ngrok

This project includes a dev script to tunnel your local server through ngrok, making it accessible from the internet.

## What is ngrok?

ngrok creates secure, public URLs to your local dev server. This is useful for:
- Testing webhooks
- Sharing your dev server with team members
- Testing on different devices/networks
- CI/CD integrations

## Prerequisites

- Node.js and npm installed
- Local server running on port 3000

## Usage

### Start the tunnel

```bash
npm run tunnel
```

This command:
1. Installs ngrok (if not already cached) via npx
2. Creates a tunnel to your local server on port 3000
3. Displays the public ngrok URL in the terminal

### Current live workflow

The project is currently using ngrok for live testing on other phones. The backend serves the built frontend on port 3000, so the same public URL exposes both the home page and the admin panel.

If ngrok shows its free-tier warning page, click through it once to reach the app. That warning page is expected for public access on the free plan.

### Example output

```
ngrok                                                       (Ctrl+C to quit)
Session Status                                        online
Account                                          medal@example.com
Version                                                25.0.0
Region                                               us (United States)
Latency                                                23ms
Web Interface                            http://127.0.0.1:4040
Forwarding                        https://xxx-xxx-xxx-xxx.ngrok.io -> http://localhost:3000
```

### Access your server

Use the forwarding URL (e.g., `https://xxx-xxx-xxx-xxx.ngrok.io`) to access your server from anywhere.

### Configuration

To expose a different local port, modify the script in `package.json`:

```json
"tunnel": "npx ngrok http <YOUR_PORT>"
```

For advanced ngrok options (e.g., custom domain, authentication), see the [ngrok CLI documentation](https://ngrok.com/docs/ngrok-agent/cli).

## Stopping the tunnel

Press `Ctrl+C` in the terminal to stop the ngrok tunnel.

## Notes

- ngrok URLs are temporary and change each time you start a new tunnel
- Free tier includes rate limiting; upgrade for higher limits
- The Web Interface is available at `http://127.0.0.1:4040` for monitoring traffic
- For live phone testing, use the public ngrok URL after restarting the backend and tunnel together
