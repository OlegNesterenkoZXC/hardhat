// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DutchAuction {
    uint256 private constant DURATION = 2 days;
    address payable public immutable seller;
    uint256 public immutable startingPrice;
    uint256 public immutable startAt;
    uint256 public immutable endsAt;
    uint256 public immutable discountRate;
    string public item;
    bool public stopped;

    event Bought(uint256 price, address buyer);

    constructor(
        uint256 _startingPrice,
        uint256 _discountRate,
        string memory _item
    ) {
        require(_startingPrice >= _discountRate * DURATION, "price too low!");
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        startAt = block.timestamp;
        endsAt = block.timestamp + DURATION;
        item = _item;
    }

    modifier notStopped() {
        require(!stopped, "has already stopped!");
        _;
    }

    function getPrice() public view notStopped returns (uint256) {
        uint256 timeElapsed = block.timestamp - startAt;
        uint256 discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function nextBlock() external {}

    function buy() external payable notStopped {
        require(block.timestamp < endsAt, "too late!");
        uint256 price = getPrice();
        require(msg.value >= price, "too low!");
        uint256 refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        seller.transfer(address(this).balance);
        stopped = true;
        emit Bought(price, msg.sender);
    }

    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}
