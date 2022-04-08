//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract calledContract {
    event callEvent(address sender, address origin, address from);
    function calledFunction() public {
        emit callEvent(msg.sender, tx.origin, address(this));
    }
}

library calledLibrary {
    event callEvent(address sender, address origin,  address from);
    function calledFunction() public {
        emit callEvent(msg.sender, tx.origin, address(this));
    }
}

contract caller {

    function make_calls(calledContract _calledContract) public {
    
    // Calling calledContract and calledLibrary directly
    _calledContract.calledFunction();
    calledLibrary.calledFunction();

    // Low-level calls using the address object for calledContract
    (bool callsuccess, ) = address(_calledContract).call(abi.encodeWithSignature("calledFunction()"));
    require(callsuccess, "revert on call");
    (bool delcallsuccess, ) = address(_calledContract).delegatecall(abi.encodeWithSignature("calledFunction()"));
    require(delcallsuccess, "revert on delegatecall");

	}
}
