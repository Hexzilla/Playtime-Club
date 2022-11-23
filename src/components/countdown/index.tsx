import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import useInterval from "hooks/useInterval";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 140,
  width: 100,
}));

export const CountDown = ({ startTime }) => {
  const [remainTime, setRemainTime] = useState(-1);
  const [remainHours, setRemainHours] = useState('00');
  const [remainMinutes, setRemainMinutes] = useState('00');
  const [remainSeconds, setRemainSeconds] = useState('00');

  useEffect(() => {
    if (startTime) {
      const remainTime = moment(startTime).diff(moment(), 's');
      setRemainTime(remainTime);
    }
  }, [startTime]);

  useInterval(() => {
    if (remainTime > 0) {
      const updatedTime = remainTime - 1;
      setRemainTime(updatedTime);
      
      const time = moment.utc(remainTime * 1000).format("HH:mm:ss");
      const tokens = time.split(':');
      setRemainHours(tokens[0])
      setRemainMinutes(tokens[1])
      setRemainSeconds(tokens[2])
    } else {
      setRemainHours('00')
      setRemainMinutes('00')
      setRemainSeconds('00')
    }
  }, 1000);

  return (
    <Grid item xs={12}>
      <Grid container justifyContent="center" spacing={1}>
        <Grid item>
          <Item>
            <Typography variant="h2" gutterBottom>
              {remainHours}
            </Typography>
            <Typography variant="h6" gutterBottom>
              HRS
            </Typography>
          </Item>
        </Grid>
        <Grid item>
          <Item>
            <Typography variant="h2" gutterBottom>
              {remainMinutes}
            </Typography>
            <Typography variant="h6" gutterBottom>
              MIN
            </Typography>
          </Item>
        </Grid>
        <Grid item>
          <Item>
            <Typography variant="h2" gutterBottom>
              {remainSeconds}
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
