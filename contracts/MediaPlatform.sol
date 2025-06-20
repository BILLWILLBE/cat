// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MediaToken.sol";

/// @title Simple media platform with like and dislike mechanics
contract MediaPlatform {
    MediaToken public token;
    address public platformAddress;
    uint256 public constant FEE_PERCENT = 2; // 2% fee on likes
    uint256 public constant TOKEN_UNIT = 1e18; // token has 18 decimals

    struct Image {
        address author;
        string cid;
        uint256 likes;
        uint256 dislikes;
    }

    uint256 public nextId;
    mapping(uint256 => Image) public images;
    mapping(uint256 => mapping(address => bool)) public liked;
    mapping(uint256 => mapping(address => bool)) public disliked;

    event ImagePublished(uint256 id, address indexed author, string cid);
    event Liked(uint256 indexed id, address indexed user);
    event Disliked(uint256 indexed id, address indexed user);

    constructor(MediaToken _token, address _platformAddress) {
        token = _token;
        platformAddress = _platformAddress;
    }

    /// @notice Publish an image using its CID. Costs 1 token.
    function publish(string calldata cid) external {
        require(bytes(cid).length != 0, "empty cid");
        require(
            token.transferFrom(msg.sender, platformAddress, TOKEN_UNIT),
            "pay 1 token"
        );
        images[nextId] = Image({author: msg.sender, cid: cid, likes: 0, dislikes: 0});
        emit ImagePublished(nextId, msg.sender, cid);
        nextId++;
    }

    /// @notice Like an image, rewarding the author minus a platform fee.
    function like(uint256 id) external {
        require(!liked[id][msg.sender], "already liked");
        Image storage img = images[id];
        require(img.author != address(0), "invalid id");
        liked[id][msg.sender] = true;

        require(token.transferFrom(msg.sender, address(this), TOKEN_UNIT), "pay 1 token");
        uint256 fee = (TOKEN_UNIT * FEE_PERCENT) / 100;
        token.transfer(platformAddress, fee);
        token.transfer(img.author, TOKEN_UNIT - fee);
        img.likes += 1;
        emit Liked(id, msg.sender);
    }

    /// @notice Dislike an image. The full token is sent to the platform.
    function dislike(uint256 id) external {
        require(!disliked[id][msg.sender], "already disliked");
        Image storage img = images[id];
        require(img.author != address(0), "invalid id");
        disliked[id][msg.sender] = true;

        require(token.transferFrom(msg.sender, platformAddress, TOKEN_UNIT), "pay 1 token");
        img.dislikes += 1;
        emit Disliked(id, msg.sender);
    }
}
