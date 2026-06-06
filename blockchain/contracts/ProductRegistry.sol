// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductRegistry {
    address public owner;

    struct Product {
        string productId;
        string name;
        string manufacturer;
        uint256 timestamp;
        bool isRegistered;
    }

    mapping(string => Product) private products;
    string[] private productIds;

    event ProductRegistered(string productId, string name, string manufacturer, uint256 timestamp);
    event ProductVerified(string productId, bool isAuthentic, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function registerProduct(string memory _productId, string memory _name, string memory _manufacturer) public onlyOwner {
        require(!products[_productId].isRegistered, "Product already registered");
        products[_productId] = Product(_productId, _name, _manufacturer, block.timestamp, true);
        productIds.push(_productId);
        emit ProductRegistered(_productId, _name, _manufacturer, block.timestamp);
    }

    function verifyProduct(string memory _productId) public returns (bool) {
        bool isAuthentic = products[_productId].isRegistered;
        emit ProductVerified(_productId, isAuthentic, block.timestamp);
        return isAuthentic;
    }

    function getProduct(string memory _productId) public view returns (
        string memory, string memory, string memory, uint256, bool
    ) {
        Product memory p = products[_productId];
        return (p.productId, p.name, p.manufacturer, p.timestamp, p.isRegistered);
    }

    function getProductCount() public view returns (uint256) {
        return productIds.length;
    }
}
