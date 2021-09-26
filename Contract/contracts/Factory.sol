// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";


contract Factory {
    
    address[] public empadr;
    uint[] public sharep;

    uint256 private _totalShares;
    uint256 private _totalReleased;

    mapping (address => uint) _shares;
    mapping(address => uint256) _released;

    function paymentSplitter() public{
        require(empadr.length == sharep.length, "PaymentSplitter: payees and shares length mismatch");
        require(empadr.length > 0, "PaymentSplitter: no payees");
        for (uint256 i = 0; i < empadr.length; i++) {
            _addPayee(empadr[i], sharep[i]);
        }
    }

    function _addPayee(address empacc, uint shares_) public{
        require(empacc != address(0), "PaymentSplitter: account is the zero address");
        require(shares_ > 0, "PaymentSplitter: shares are 0");
        require(_shares[empacc] == 0, "PaymentSplitter: account already has shares");

        _shares[empacc] = shares_;
        _totalShares = _totalShares + shares_;
    }

    function release(address payable account) public virtual {
        require(_shares[account] > 0, "PaymentSplitter: account has no shares");

        uint256 totalReceived = address(this).balance + _totalReleased;
        uint256 payment = (totalReceived * _shares[account]) / _totalShares - _released[account];

        require(payment != 0, "PaymentSplitter: account is not due payment");

        _released[account] = _released[account] + payment;
        _totalReleased = _totalReleased + payment;

        Address.sendValue(account, payment);
    }
}