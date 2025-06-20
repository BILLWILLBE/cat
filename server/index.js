const express = require('express');
const { ethers } = require('ethers');
const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', provider);

// Replace with deployed contract addresses
const tokenAddress = process.env.TOKEN_ADDRESS || '0xYourTokenAddress';
const platformAddress = process.env.PLATFORM_ADDRESS || '0xYourPlatformAddress';

const tokenAbi = [
  'function approve(address spender, uint256 value) external returns (bool)'
];

const platformAbi = [
  'function publish(string cid) external',
  'function like(uint256 id) external',
  'function dislike(uint256 id) external',
  'function nextId() view returns (uint256)',
  'function images(uint256) view returns (address author, string cid, uint256 likes, uint256 dislikes)'
];

const token = new ethers.Contract(tokenAddress, tokenAbi, signer);
const platform = new ethers.Contract(platformAddress, platformAbi, signer);

app.get('/images', async (_req, res) => {
  const nextId = await platform.nextId();
  const items = [];
  for (let i = 0; i < nextId; i++) {
    const img = await platform.images(i);
    items.push({ id: i, cid: img.cid, likes: Number(img.likes), dislikes: Number(img.dislikes) });
  }
  res.json(items);
});

app.post('/publish', async (req, res) => {
  try {
    const { cid } = req.body;
    await token.approve(platformAddress, ethers.parseEther('1'));
    const tx = await platform.publish(cid);
    await tx.wait();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/like', async (req, res) => {
  try {
    const { id } = req.body;
    await token.approve(platformAddress, ethers.parseEther('1'));
    const tx = await platform.like(id);
    await tx.wait();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/dislike', async (req, res) => {
  try {
    const { id } = req.body;
    await token.approve(platformAddress, ethers.parseEther('1'));
    const tx = await platform.dislike(id);
    await tx.wait();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
