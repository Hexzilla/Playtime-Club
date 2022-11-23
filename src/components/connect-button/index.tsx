import React from "react";
import { Button } from "@mui/material";
import useBeacon from "hooks/useBeacon";

export const ConnectButton = () => {
  const { address, connectWallet, disconnectWallet } = useBeacon();

  const connect = () => {
    if (!address) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  };

  return (
    <Button
      component="a"
      size="medium"
      sx={{ ml: 2 }}
      target="_blank"
      variant="contained"
      onClick={connect}
    >
      {!address ? "Connect Wallet" : "Disconnect"}
    </Button>
  );
};
