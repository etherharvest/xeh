module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    compose: {
      host: "truffle-develop",
      port: 9545,
      network_id: "*"
    }
  }
};
