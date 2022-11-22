import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import CountDown from "../../components/countdown";

const StyledButton = styled(Button)(() => ({
  width: 160,
}));

const Home = () => {
  return (
    <Grid mt={6} sx={{ flexGrow: 1 }} container spacing={2}>
      <CountDown></CountDown>
      <Grid mt={8} xs={12}>
        <Grid container justifyContent="center" spacing={1}>
          <Box sx={{ mt: 1 }}>
            <StyledButton size="large" variant="outlined">
              JOIN GAME
            </StyledButton>
          </Box>
        </Grid>
        <Grid container justifyContent="center" spacing={1}>
          <Box sx={{ mt: 2 }}>
            <StyledButton size="large" variant="outlined">
              BUY NFT
            </StyledButton>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
