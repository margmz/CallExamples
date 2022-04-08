// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the calledLibrary to deploy
  const LibraryFactory = await hre.ethers.getContractFactory("calledLibrary");
  const library = await LibraryFactory.deploy();
  //await library.deployed();
  //console.log("calledLibrary deployed to:", library.address);

  // We get the caller contract to deploy
  const CallerFactory = await hre.ethers.getContractFactory('caller', {
    libraries: {
      calledLibrary: library.address,
    },
  });
  const caller = await CallerFactory.deploy();
  //await caller.deployed();
  //console.log("caller contract deployed to:", caller.address);

  // We get the Calledcontract to deploy
  const CalledContractFactory = await hre.ethers.getContractFactory("calledContract");
  const called = await CalledContractFactory.deploy();
  //await called.deployed();
  //console.log("calledContract deployed to:", called.address);

  const tx = await caller.make_calls(called.address);
  const res = await tx.wait();
  
  const eventAbi = [
    'event callEvent(address sender, address origin, address from)',
  ];
  const iface = new hre.ethers.utils.Interface(eventAbi);

  const signer = await hre.ethers.getSigner();

  console.log(`EOA address: ${signer.address}`);
  console.log(`Caller contract address: ${caller.address}`);
  console.log(`Library address: ${library.address}`);
  console.log(`Called contract address: ${called.address}`);

  res.events.map(event => console.log(iface.parseLog(event)));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
