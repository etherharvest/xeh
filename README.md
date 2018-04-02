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

For `npm` installation we recommend using `asdf` version manager (v0.4.3 is the
latest version at the moment of writing this document):

```
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.4.3
```

Depending on your OS and shell, run the following:

  * Bash on Linux:
  ```
  echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.bashrc
  echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc
  ```
  * Bash on MacOS:
  ```
  echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.bash_profile
  echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.bash_profile
  ```
  * Zsh:
  ```
  echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.zshrc
  echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.zshrc
  ```

In a new shell, install the latest `nodejs` version (at the time of the writing
is 9.10.0):

```
asdf install nodejs 9.10.1
asdf global nodejs 9.10.1
```

And finally add `npm` to your path:

  * Bash on Linux:
  ```
  echo "export PATH=\"$HOME/.asdf/installs/nodejs/9.10.1/.npm/bin:\$PATH\"" >> ~/.bashrc
  ```
  * Bash on MacOS:
  ```
  echo "export PATH=\"$HOME/.asdf/installs/nodejs/9.10.1/.npm/bin:\$PATH\"" >> ~/.bash_profile
  ```
  * Zsh:
  ```
  echo "export PATH=\"$HOME/.asdf/installs/nodejs/9.10.1/.npm/bin:\$PATH\"" >> ~/.zshrc
  ```

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
