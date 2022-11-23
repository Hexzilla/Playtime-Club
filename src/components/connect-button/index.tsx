import React from "react";
import { Button } from "@mui/material";

export const ConnectButton = () => {
  return (
    <Button
      component="a"
      size="medium"
      sx={{ ml: 2 }}
      target="_blank"
      variant="contained"
    >
      Connect Wallet
    </Button>
  );
};
