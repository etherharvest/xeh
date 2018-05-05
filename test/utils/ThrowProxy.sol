pragma solidity ^0.4.17;

contract ThrowProxy {
  address public target;
  bytes data;

  function ThrowProxy(address _target) public {
    target = _target;
  }

  function() public {
    data = msg.data;
  }

  function execute() public returns (bool){
    return target.call(data);
  }
}
