#!/bin/bash
PROTO_CONTRACTS_DIR=protos
echo $PROTO_CONTRACTS_DIR
rm -rf $PROTO_CONTRACTS_DIR
git clone https://github.com/Tinkoff/investAPI.git $PROTO_CONTRACTS_DIR
cd $PROTO_CONTRACTS_DIR
git filter-branch --prune-empty --subdirectory-filter ./src/docs/contracts/ HEAD