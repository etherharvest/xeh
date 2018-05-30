module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    dockerCompose: {
      host: "ganache-cli",
      port: 8545,
      network_id: "*"
    }
  }
};
