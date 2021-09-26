// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./Factory.sol";

contract Employee is Factory{

    using SafeMath for uint256;

    uint id;
    address payable factory;
    address payable employ;
   

    uint paytime;

    struct Emp{

        string name;
        uint post;
        uint age;
        uint joiningDate;
        uint exitDate;
        uint salary;
        uint experience;
        bool isemp;
        uint share;
    }

    Emp[]  public empl;

    mapping (uint => Emp) epl;

    event EmployAdded(string name, uint age, uint joiningdate);
    event Post(uint post);
    event durationEnd(uint id , uint exp);
    event Salarygiven(string name);
    event SalaryIncreased(uint slry, string name, uint id, uint post);
    event SalaryReduced(uint slry, string name, uint id, uint post);


    modifier isFactory(){
        require(factory == msg.sender);
        _;
    }

    function empInitiator(string memory _name, uint _post, uint _age, uint _sharec) public isFactory(){

        epl[id].name = _name;
        epl[id].post = postAssign(_post);
        epl[id].age = _age;
        epl[id].joiningDate = block.timestamp;
        epl[id].exitDate = 0;
        epl[id].salary = giveSalary();
        epl[id].experience = 0;
        epl[id].isemp = true;
        epl[id].share = assignShare(_sharec);

        id.add(1);
        
        empl.push(epl[id]);
        empadr.push(employ);
        sharep.push(epl[id].share);

        emit EmployAdded(_name, _age, block.timestamp);
    }

    modifier isEmployee(){

        require(epl[id].isemp);
        _;
    }

    

    function assignShare(uint _share) public isEmployee() isFactory() returns(uint){

        epl[id].share = _share;
        return epl[id].share;
    }


    function postAssign(uint _post) public isEmployee() isFactory() returns(uint){

        epl[id].post = _post;  
        
        emit Post(_post);   

        return epl[id].post;           
    }

    function giveSalary() public payable isEmployee() isFactory() returns(uint){
       
        require(factory == msg.sender);         
        employ.transfer(msg.value);
        epl[id].salary = msg.value;

        emit Salarygiven(epl[id].name);

        return epl[id].salary;

    } 

    function empExit() public isEmployee() returns (uint){

        require(factory == msg.sender);

        epl[id].isemp = false;
        epl[id].exitDate = block.timestamp;
        epl[id].experience = epl[id].joiningDate - epl[id].exitDate;

        delete empl[id];

        emit durationEnd(id, epl[id].experience);
        return epl[id].experience;
    }

    function alteringSalary(uint _newsalary) public isEmployee() isFactory(){

        require(factory == msg.sender);

        empl[id].salary =  _newsalary;
        if( empl[id].salary > _newsalary){
            emit SalaryReduced(_newsalary, epl[id].name, id, epl[id].post);
        }       

        else emit SalaryIncreased(_newsalary, epl[id].name, id, epl[id].post);

    }
    
}