// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Order {
    using SafeMath for uint256;

    address payable buyer;
    address payable factory;

    struct Buyer {
        address adr;
        string name;
        bool payment;
    }

    struct Package {
        string Pname;
        uint256 price;
        uint256 dateofdep;
        uint256 quantity;
        uint256 invoicehash;
        bool departed;
        bool delivered;
        uint256 refund;
        bool returned;
        Buyer byr;
    }

    uint256 refundtime;
    uint256 totalDispatched;
    uint256 sale;
    uint256 successOrder;
    uint256 rejectOrder;
    uint256 orderno;

    mapping(uint256 => Package) package;
    mapping(uint256 => Buyer) reciever;

    event OrderDelivered(address buyer, string name);
    event OrderDispatched(address buyer, uint256 now);
    event InvoiceGenerated(uint256 hashed, uint256 now);
    event OrderSuccessful(uint256 price, uint256 invoicehash);
    event OrderRejected(uint256 price, uint256 invoicehash);

    function OrderDetails(
        string memory _pname,
        uint256 _price,
        uint256 _quantity,
        string memory _name,
        address _adr
    ) public {
        require(factory == msg.sender || buyer == msg.sender);
        package[orderno].invoicehash = uint256(
            keccak256(abi.encode(block.timestamp, _adr, _name))
        );

        package[orderno] = Package(
            _pname,
            _price,
            block.timestamp,
            _quantity,
            package[orderno].invoicehash,
            true,
            false,
            0,
            false,
            Buyer(_adr, _name, false)
        );
        orderno.add(1);

        totalDispatched.add(1);

        emit OrderDispatched(_adr, block.timestamp);
        emit InvoiceGenerated(package[orderno].invoicehash, block.timestamp);
    }

    function price(uint256 _price) public returns (uint256) {
        package[orderno].price = _price;
        return _price;
    }

    modifier OrderReached() {
        require(package[orderno].delivered);
        _;
    }

    function triggerRefundTime() public {
        package[orderno].refund = uint256(block.timestamp + refundtime);
    }

    function WithinRefundTime() public view returns (bool) {
        return (block.timestamp <= package[orderno].refund);
    }

    function OrderFinalStatus() public payable {
        require(
            buyer == msg.sender && msg.value > package[orderno].price,
            "Account not found! or Balance insufficient or Incomplete Payment!"
        );

        package[orderno].byr.payment = true;
        package[orderno].delivered = true;

        successOrder.add(1);

        factory.transfer(package[orderno].price);

        triggerRefundTime();

        emit OrderSuccessful(
            package[orderno].price,
            package[orderno].invoicehash
        );
    }

    function RevertOrder() public payable OrderReached {
        require(factory == msg.sender && WithinRefundTime());

        buyer.transfer(msg.value);

        successOrder.trySub(1);
        rejectOrder.add(1);

        package[orderno].returned = true;

        emit OrderRejected(
            package[orderno].price,
            package[orderno].invoicehash
        );
    }

    function factoryIntake() public view {
        require(!package[orderno].returned, "Package was returned");
        sale.add(package[orderno].price);
    }
}
