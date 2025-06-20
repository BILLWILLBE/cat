# cat

This repository contains a simple example of a decentralized media platform implemented in Solidity. The platform uses an ERC-20 compatible token for publishing images and interacting with content.

## Contracts

- `MediaToken.sol` – minimal ERC-20 token whose constructor accepts the desired initial supply (for example `100_000_000_000 * 10**18`).
- `MediaPlatform.sol` – allows users to publish an image (identified by a CID), like or dislike existing images. Each action costs one token. Likes reward the author after subtracting a 2% platform fee while dislikes send the entire token to the platform.

These contracts are examples only and omit many production features such as access control and input validation.

## Frontend

The `frontend` directory contains a very small web interface using ethers.js. Replace the placeholder contract addresses in `app.js` with deployed values and serve the files with any web server.

## Backend

The `server` directory includes a minimal Express-based server showing how the contracts could be called from Node.js. Environment variables configure RPC and contract addresses.

Install dependencies and run the server:

```bash
cd server
npm install
node index.js
```

## Pushing to GitHub

This repository has no remote by default. To push your local commits to your own GitHub repository:

```bash
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

Subsequent pushes can omit the `-u` flag and specify a branch name if needed.
