import * as React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 140,
  width: 100,
}));

export default function SpacingGrid() {
  return (
    <Grid item xs={12}>
      <Grid container justifyContent="center" spacing={1}>
        <Grid item>
          <Item>
            <Typography variant="h2" gutterBottom>
              00
            </Typography>
            <Typography variant="h6" gutterBottom>
              HRS
            </Typography>
          </Item>
        </Grid>
        <Grid item>
          <Item>
            <Typography variant="h2" gutterBottom>
              00
            </Typography>
            <Typography variant="h6" gutterBottom>
              MIN
            </Typography>
          </Item>
        </Grid>
        <Grid item>
          <Item>
            <Typography variant="h2" gutterBottom>
              00
            </Typography>
            <Typography variant="h6" gutterBottom>
              SEC
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Grid>
  );
}
