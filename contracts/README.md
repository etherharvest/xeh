# Ether Harvest Share Token

Our share token is a complex piece of software that needs the capability of upgradeability, hence a regular ERC20/ERC223 token contract is not enough.

## Eternal Storage

The eternal storage is a simple contract that holds the internal state of another contract that holds the logic. This separation of logic and data allows to update a contract without the need to migrate its data. The following code is a proof of concept of eternal storage:

```
// TokenStorage.sol
contract TokenStorage {
  mapping (address => uint256) internal balances;

  function balanceOf(address who) public view returns (uint256) {...}
  function add(address who, uint256 value) public {...}
  function sub(address who, uint256 value) public {...}
}
```

The previous contract has all the necessary functions to update and query the state and the following code shows how to use it:

```
// Token.sol
contract Token {
  TokenStorage internal store;

  constructor(address _store) {
    store = TokenStorage(_store);
  }

  function balanceOf(address who) public view returns(uint256) {
    return store.balanceOf(who);
  }

  function transfer(address to, uint256 value) public returns(bool) {
    require(store.balanceOf(msg.sender) >= value);
    require(to != address(0));
    store.add(to, value);
    store.sub(msg.sender, value);
  }
}
```

This allow us to update then `Token` contract, but still keep the data from the `TokenStorage` intact. The problem with this approach is that every time we upgrade the `Token` contract:, we must inform everyone about the new address for `Token`. This means two things:

  1. We need a way to deprecate the previous contract e.g. using `Pausable`.
  2. We need to coordinate with exchanges and wallet developers in order for them to point to the new contract's address.

Additionally, our `TokenStorage` contract should be only accessible from our current `Token` contract. This could be accomplished with the used of a `Registry` (a contract that maps the roles and permissions of the contracts by address).

## Proxy

Another solution to the upgradeability problem is to use a proxy contract. The function `delegatecall` delegates the logic execution to a function in other contract allowing the latter to modify the storage of the former. If we consider the following two contracts:

```
// A.sol
contract A {
  uint256 public n;

  function set(uint256 _n) {
    n = _n;
  }
}

// B.sol
contract B {
  uint256 public n;

  function set(uint256 _n) {
    n = _n * 2;
  }
}
```

And the proxy contract:

```
contract Proxy {
  uint public n;

  function modify(address impl, uint256 _n) {
    impl.delegatecall(bytes4(sha3("set(uint256)")), _n);
  }
}
```

If we call the function `modify` in `Proxy` with the value `_n = 21`:

  * With `impl` as the address of the contract `A`: the `Proxy` storage variable `n` will be `21`.
  * With `impl` as the address of the contract `B`: the `Proxy` storage variable `n` will be `42`.

Using this tecnique, we can update our contracts not needing for them to be `Pausable` or inform exchanges and wallet developers about a change in the address of the contracts. However, this implementation is hard to maintain.

## Upgradeability with Eternal Storage

It is possible to have a general `Proxy` contract that delegates all the calls to another contract. The following idea is taken from [ZeppelinOS](https://github.com/zeppelinos/labs/tree/master/upgradeability_using_eternal_storage)

```
// Proxy.sol
contract Proxy {
  function implementation() public view returns(address);

  function () payable public {
    address _impl = implementation();
    require(_impl != address(0));

    assembly {
      let ptr := mload(0x40)
      callcopydata(ptr, 0, calldatasize)

      let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
      let size := returndatasize
      returndatacopy(ptr, 0, size)

      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }
}
```

Explanation of the assembly:
  0. Variables declared with `let` are pushed to the stack and not the memory, but they can point to the memory (hold a memory address).
  1. `let ptr := mload(0x40)`: In the EVM, the memory addresses from `0x00` to `0x50` are reserved for certain functionalities. The address `0x40` holds a pointer to the first free memory slot. `mload(0x40)` makes `ptr` point to the free memory slot.
  2. `callcopydata(ptr, 0, calldatasize)`: Every solidity call has `data`. In this `data` we have the code of the function to be executed and the arguments of the call. `calldatasize` gets the size of the `data` and `callcopydata(ptr, 0, calldatasize)` copies the `data` from the beginning or offset `0` to the end or offset `calldatasize`.
  3. `let result := delegatecall(...)`: The actual call to the function. The function forwards the `gas` to the `_impl` using the `data` in `ptr` as the `data` of the new call. `calldatasize` indicates whats the size of `ptr`. The last two arguments are for the output arguments that they are not used. If the call is sucessful, the variable `result` will be `1`, otherwise it'll be `0`.
  4. `let size := returndatasize`: When the `delegatecall` returns, the return `data` is available. `returndatasize` gets the size of the return of the function.
  5. `returndatacopy(ptr, 0, size)`: `ptr` now can be used to copy the return `data` because we don't need the `data` anymore.
  6. `switch result ...`: If `result` is `0`, throw `ptr` as `revert`. Otherwise, returns `ptr`.

With the previous contract we can call any function in `_impl` as long as the `Proxy` contract holds a storage similar to the `_impl` contract.

The following is the implementation of the `Proxy` interface:

```
// UpgradeabilityStorage.sol
contract UpgradeabilityStorage is Ownable {
  string internal _version;
  address internal _implementation;

  event Upgraded(string version, address indexed implementation);

  function version() public view returns (string) {
    return _version
  }

  function implementation() public view returns (address) {
    return _implementation;
  }

  function upgradeTo(string version, address implementation) public onlyOwner {
    require(address(0) != implementation);
    require(_implementation != implementation);
    _version = version;
    _implementation = implementation;
    Upgraded(version, implementation);
  }
}

// UpgradeabilityProxy.sol
contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {}
```

> `Ownable` is a contract that implements the `modifier` `onlyOwner` and in its state has the address of the `owner`.

With all of this in place, now we can have upgradeable contracts with eternal storage, by implementing a proxy that combines both tecniques. If we take `TokenStorage` (eternal storage contract from the section "Eternal Storage") and `UpgradeabilityProxy` we would have:

```
contract TokenStorageProxy is TokenStorage, UpgradeabilityProxy {}
```

The address of the deployed `TokenStorageProxy` contract is the one that exchanges and wallets are going to use when they try to access the functionalities of our token.

Additionally, `TokenStorageProxy` contract has as its internal state the `TokenStorage` and the `UpgradeabilityStorage`.

> NOTE: The inheritance order is relevant here. Must be `TokenStorage` first and then `UpgradeabilityProxy`, otherwise it will corrupt the storage of the contract.

Our `Token` now can be upgraded by calling the function `upgradeTo` in `TokenStorageProxy`. The only requirement for our token is that it inherits from `TokenStorage` in order to be able to access the storage in `TokenStorageProxy`:

```
// Token_V0.sol
contract Token_V0 is TokenStorage {
  ...
}

// Token_V1.sol
contract Token_V1 is TokenStorage {
  ...
}

// Token_V2.sol
contract Token_V2 is TokenStorage {
  ...
}
```

Visually, it would be like this:

```
                          -----------
                          | Ownable |
                          -----------
                               ^
                               |
       ---------   -------------------------
       | Proxy |   | UpgradeabilityStorage |
       ---------   -------------------------
           ^            ^
           |            |
       -----------------------      ----------------
       | UpgradeabilityProxy |      | TokenStorage |<--------------
       -----------------------      ----------------              |
                      ^               ^          ^                |
                      |               |          |                |
                    ---------------------   ------------     ------------
                    | TokenStorageProxy |   | Token_V0 | ... | Token_Vn |
                    ---------------------   ------------     ------------
```

Using this approach we can swap a ERC20 token effortlessly with a ERC223. We depend on the `TokenStorage` ability to adapt to changes.

## Advanced Eternal Storage

An eternal storage can be coded in a way that it adapts to changes easily by using `mapppin`s.

```
contract EternalStorage {
  mapping(bytes32 => uint256) internal uintStorage;
  mapping(bytes32 => string) internal stringStorage;
  mapping(bytes32 => address) internal addressStorage;
  mapping(bytes32 => bytes) internal bytesStorage;
  mapping(bytes32 => bool) internal boolStorage;
  mapping(bytes32 => int256) internal intStorage;
}
```

If we swap `TokenStorage` with `EternalStorage` in the previous section, we would have a very flexible eternal storage:

```
contract EternalStorageProxy is EternalStorage, UpgradeabilityProxy {}
```

then a first version of the token can be defined as follows:

```
// Token_V0.sol
contract Token is EternalStorage {

  function balanceOf(address who) public view returns(uint256) {
    return uintStorage[keccak256("balance", who)];
  }

  function transfer(address to, uint256 value) public returns(bool) {
    bytes32 balanceToHash = keccak256("balance", to);
    bytes32 balanceSenderHash = keccak256("balance", msg.sender);

    require(to != address(0));
    require(uintStorage[balanceSenderHash] >= value);

    uintStorage[balanceSenderHash] = balanceOf(msg.sender) - value;
    uintStorage[balanceToHash] = balanceOf(to) + value;
  }
}
```

As the eternal storage lives in `EternalStorageProxy` contract and not `Token_V0`, migrating the data from one version of the token to the next is very easy to do.
