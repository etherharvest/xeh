# Ether Harvest Token

[![Build Status](https://travis-ci.org/etherharvest/xeh.svg?branch=master)](https://travis-ci.org/etherharvest/xeh)

Ether Harvest Token (or _XEH_) is a token that will allow the distribution of
profits in the Ether Harvest Platform.

## Getting Started

In order to be able to test the contracts, `truffle` and `solium` cli
tools are required (optionally also you can install Ganache to have a private
test blockchain). These tools can be downloaded using `npm` that comes with
`nodejs`.

### Installing `npm`

If you already have `npm` installed, then skip this section.

Using the script `install.sh` found in the project's root folder you can
install all the dependencies (`npm` included):

```
./install.sh
```

This script only works for `bash` (Linux and MacOS) and `zsh`.

### Installing Ganache

Optionally, you can install `ganache-cli`, a cli tool that simmulates the
Ethereum blockchain:

```
npm install -g ganache-cli
```

If You prefer a graphical interface for your blockchain, you can download
Ganache from this [link](http://truffleframework.com/ganache/).

### Getting the Dependencies

After installing the cli tools needed, you can clone this repository and get
the dependencies for the project. In the project's root folder run:

```
npm install
```

### Test the Project

Now that you have everything, you can `compile` the project, `migrate` it to
the test blockchain and `test` it using `truffle`:

```
truffle compile
truffle migrate
truffle test
```
