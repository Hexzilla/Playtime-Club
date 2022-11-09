import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { AbortedBeaconError } from "@airgap/beacon-sdk";
import { Button, CardContent, Link, Grid } from "@mui/material";
import { RootState } from "store";
import { setLoading } from "slices/play";
import useBeacon from "hooks/useBeacon";
import { requestSign } from "utils/tezos-wallet";
import RoomDetail from "./room-detail";

const TezosBoard = ({ socket }) => {
  const dispatch = useDispatch();
  const { wallet, address, connectWallet } = useBeacon();
  const { loading, connected, playerId, roomId, startTime } = useSelector(
    (state: RootState) => state.play
  );
  const [showDetail, setShowDetail] = useState(false);

  const handleJoin = async () => {
    try {
      // Connect wallet
      const walletAddress = address ? address : await connectWallet();
      if (!walletAddress || !wallet) {
        toast.error("Please connect your wallet");
        return;
      }

      // Check if socket is connected.
      if (!connected) {
        toast.error("Cannot connect server!");
        return;
      }

      // Update loading state.
      dispatch(setLoading(true));

      const payload: string = [
        "Tezos Signed Message:",
        "playtime-tezos.com",
        new Date().toISOString(),
        "Join Room",
        address,
      ].join(" ");

      const signed = await requestSign(wallet, address!, payload);
      console.log("signed", signed);
      if (signed) {
        const { signature } = signed;

        setTimeout(() => {
          socket?.emit("JOIN", signature);
        }, 1);
      }
    } catch (err: any) {
      console.error(err);
      if (err instanceof AbortedBeaconError) {
        toast.error(err.description);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <CardContent>
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          {!roomId ? (
            <div>Please join to game!</div>
          ) : (
            <>
              <div>{!!roomId && <span>Room Number {roomId}</span>}</div>
              <div>
                Playtime{" "}
                {!!startTime && (
                  <span>{moment(startTime).format("DD/MM HH:mm")}</span>
                )}
              </div>
            </>
          )}
          <div>
            You need an Tezos Playtime.club NFT to play.{" "}
            <Link
              href={"https://opensea.com"}
              color="textPrimary"
              variant="subtitle2"
            >
              Buy Here
            </Link>
          </div>
        </Grid>
        <Grid item sm={2} xs={6}>
          <Button
            disabled={loading}
            type="button"
            variant="contained"
            size="large"
            onClick={() => setShowDetail(true)}
          >
            {"Detail"}
          </Button>
        </Grid>
        <Grid item sm={2} xs={12}>
          <Button
            disabled={loading || !!playerId}
            type="button"
            variant="contained"
            size="large"
            onClick={handleJoin}
          >
            {"Join"}
          </Button>
        </Grid>
      </Grid>
      {showDetail && <RoomDetail onClose={() => setShowDetail(false)} />}
    </CardContent>
  );
};

export default TezosBoard;
