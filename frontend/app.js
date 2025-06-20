const provider = new ethers.BrowserProvider(window.ethereum);
let signer;

const tokenAddress = "0xYourTokenAddress"; // replace with deployed token address
const platformAddress = "0xYourPlatformAddress"; // replace with deployed platform

// ABIs should match the contracts in the `contracts` folder
const tokenAbi = [
  "function approve(address spender, uint256 value) external returns (bool)"
];

const platformAbi = [
  "function publish(string cid) external",
  "function like(uint256 id) external",
  "function dislike(uint256 id) external",
  "function nextId() view returns (uint256)",
  "function images(uint256) view returns (address author, string cid, uint256 likes, uint256 dislikes)"
];

async function connect() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
}

async function publish() {
  const cid = document.getElementById('cid').value;
  const token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const platform = new ethers.Contract(platformAddress, platformAbi, signer);
  await token.approve(platformAddress, ethers.parseEther('1'));
  await platform.publish(cid);
  loadImages();
}

async function like(id) {
  const token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const platform = new ethers.Contract(platformAddress, platformAbi, signer);
  await token.approve(platformAddress, ethers.parseEther('1'));
  await platform.like(id);
  loadImages();
}

async function dislike(id) {
  const token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const platform = new ethers.Contract(platformAddress, platformAbi, signer);
  await token.approve(platformAddress, ethers.parseEther('1'));
  await platform.dislike(id);
  loadImages();
}

async function loadImages() {
  const platform = new ethers.Contract(platformAddress, platformAbi, provider);
  const nextId = await platform.nextId();
  const list = document.getElementById('images');
  list.innerHTML = '';
  for (let i = 0; i < nextId; i++) {
    const img = await platform.images(i);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${img.cid}</strong> - Likes: ${img.likes} Dislikes: ${img.dislikes}
      <button onclick="like(${i})">Like</button>
      <button onclick="dislike(${i})">Dislike</button>
    `;
    list.appendChild(li);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await connect();
  loadImages();
});
