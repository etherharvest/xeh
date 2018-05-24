pragma solidity ^0.4.23;

import "../../contracts/ownership/Ownable.sol";
import "../../contracts/storage/EternalStorage.sol";
import "../../contracts/math/SafeMath.sol";
import "../../contracts/token/ERC20/ERC20.sol";


contract Token_V1 is ERC20, Ownable, EternalStorage {
  using SafeMath for uint256;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
  event Mint(address indexed to, uint256 amount);
  event MintFinished();

  modifier canMint() {
    require(!mintingFinished());
    _;
  }

  function initialize() public onlyOwner {
    require(!initialized());

    _bool[keccak256("mintingFinished")] = false;
    _bool[keccak256("token_v1_initialized")] = true;
  }

  function initialized() public view returns (bool) {
    return _bool[keccak256("token_v1_initialized")];
  }

  function mintingFinished() public view returns (bool) {
    return _bool[keccak256("mintingFinished")];
  }

  function mint(address to, uint256 value) public canMint onlyOwner {
    _uint[keccak256("totalSuply")] = totalSupply().add(value);
    _uint[keccak256("balance", to)] = balanceOf(to).add(value);

    emit Mint(to, value);
  }

  function finishMinting() public canMint onlyOwner {
    _bool[keccak256("mintFinished")] = true;
    emit MintFinished();
  }

  function totalSupply() public view returns (uint256) {
    return _uint[keccak256("totalSupply")];
  }

  function balanceOf(address who) public view returns (uint256) {
    return _uint[keccak256("balance", who)];
  }

  function allowance(address owner, address spender)
      public view returns (uint256) {
    return _uint[keccak256("allowance", owner, spender)];
  }

  function transfer(address to, uint256 value) public returns (bool) {
    uint256 senderBalance = balanceOf(msg.sender);

    require(to != address(0));
    require(senderBalance >= value);

    _uint[keccak256("balance", msg.sender)] = balanceOf(msg.sender).sub(value);
    _uint[keccak256("balance", to)] = balanceOf(to).add(value);

    emit Transfer(msg.sender, to, value);
    return true;
  }

  function approve(address spender, uint256 value) public returns (bool) {
    _uint[keccak256("allowance", msg.sender, spender)] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  function transferFrom(address from, address to, uint256 value)
      public returns (bool) {
    require(to != address(0));
    require(balanceOf(from) >= value);
    require(allowance(from, to) >= value);

    _uint[keccak256("balance", from)] = balanceOf(from).sub(value);
    _uint[keccak256("balance", to)] = balanceOf(to).add(value);
    _uint[keccak256("allowance", from, to)] = allowance(from, to).sub(value);

    emit Transfer(from, to, value);
    return true;
  }
}
