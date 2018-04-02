#!/bin/bash

function usage() {
  echo "
  Installs npm using asdf cli tool.

  Usage:
    ${BASH_SOURCE[0]} [-v <VERSION> -h]

  Arguments:
    -v <VERSION> - npm version. Defaults to the latest listed in asdf.
    -h           - Shows this help.
  "

  exit $1
}

NC='\033[0m' # No Color

function error() {
  RED='\033[0;31m'
  echo -e "${RED}ERROR: $1${NC}"
}

function info() {
  GREEN='\033[0;32m'
  echo -e "${GREEN}INFO: $1${NC}"
}

function warn() {
  YELLOW='\033[1;33m'
  echo -e "${YELLOW}WARN: $1${NC}"
}


while getopts :v:h option
do
  case "$option" in
    v)
      VERSION="${OPTARG}"
      ;;
    h)
      usage 0
      ;;
  esac
done

###############
# Detect system

case $(basename $SHELL) in
  zsh)
    CONFIG_FILE=$HOME/.zshrc
    ;;
  bash)
    if [ "$(uname)" == "Darwin" ]
    then
      CONFIG_FILE=$HOME/.bash_profile
    else
      CONFIG_FILE=$HOME/.bashrc
    fi
    ;;
  *)
    error "Shell $SHELL not supported"
    exit 1
    ;;
esac

########################
# Install asdf if needed

if [ ! -d $HOME/.asdf ]
then
  ASDF_VERSION=v0.4.3
  echo -e '. $HOME/.asdf/asdf.sh' >> $CONFIG_FILE
  echo -e '. $HOME/.asdf/completions/asdf.bash' >> $CONFIG_FILE
  . $HOME/.asdf/asdf.sh
  . $HOME/.asdf/completions/asdf.bash
else
  info "asdf is already installed"
fi

#######################
# Install NodeJS plugin

asdf plugin-add nodejs
bash $HOME/.asdf/plugins/nodejs/bin/import-release-team-keyring

####################
# Get NodeJS version

if [ -n "$VERSION" ]
then
  SELECTED="$VERSION"
  VERSION="$(asdf list-all nodejs | grep "$VERSION")"
  if [ -z "$VERSION" ]
  then
    error "Version $VERSION is not available in asdf"
    exit 1
  fi
fi

if [ -z "$VERSION" ]
then
  VERSION=$(asdf list-all nodejs | tail -n1)
fi

asdf install nodejs "$VERSION"
asdf global nodejs "$VERSION"

BIN="$HOME/.asdf/installs/nodejs/$VERSION/.npm/bin"

sed -i '/^export PATH=".*\/\.asdf\/installs\/nodejs\/.*\/.npm\/bin\:\$PATH"$/d' $CONFIG_FILE
echo "export PATH=\"$BIN:\$PATH\"" >> $CONFIG_FILE
export PATH="$BIN:$PATH"
info "npm v$VERSION has been installed"

###############
# Build project

npm install

if [ $? -eq 0 ]
then
  info "project has been built"
  warn "Install Ganache to test the project"
else
  error "cannot build the project"
fi

exit 0
