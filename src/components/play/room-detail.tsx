import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import { RootState } from "store";
import { X as XIcon } from "../../icons/x";

const RoomDetail = ({ onClose }) => {
  const { playerId, roomId, startTime } = useSelector(
    (state: RootState) => state.play
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        marginTop: "40px",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={12} sx={{ position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            onClick={onClose}
          >
            <XIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              pb: 2,
              pt: 3,
              px: 3,
            }}
          >
            <div>
              <Typography variant="h5">Room Information</Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                Player ID {playerId ? playerId : ""}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                Room number {roomId ? roomId : ""}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                Number of players joined in this room 3
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                {!!startTime && (
                  <span>Start Time {moment(startTime).format("MM/DD/YYYY HH:MM")}</span>
                )}
              </Typography>
              
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              px: 3,
              py: 1.5,
            }}
          >
            {/* <Button sx={{ mr: 2 }} variant="outlined">
              Cancel
            </Button> */}
            <Button
              sx={{
                backgroundColor: "error.main",
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
              variant="contained"
            >
              Exit Room
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RoomDetail;
