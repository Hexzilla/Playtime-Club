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
  const {
    wallet,
    publicKey,
    address: walletAddress,
    connectWallet,
  } = useBeacon();
  const { loading, connected, playerId, roomId, startTime } = useSelector(
    (state: RootState) => state.play
  );
  const [showDetail, setShowDetail] = useState(false);

  const connect = async () => {
    if (!walletAddress) {
      const permissions = await connectWallet();
      if (!permissions) {
        return null;
      }

      const _publicKey = permissions.accountInfo.publicKey;
      const _walletAddress = permissions.address;
      return [_publicKey, _walletAddress];
    }
    return Promise.resolve([publicKey, walletAddress]);
  };

  const handleJoin = async () => {
    try {
      // Connect wallet
      const connectResult = await connect();
      if (!connectResult) {
        toast.error("Failed to connect wallet");
        return;
      }

      const [publicKey, walletAddress] = connectResult;
      if (!walletAddress) {
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

      const dappUrl = "playtime.com";
      const payload: string = [
        "Tezos Signed Message:",
        dappUrl,
        new Date().toISOString(),
        `${dappUrl} would like to join room with ${walletAddress}`,
      ].join(" ");

      const signed = await requestSign(wallet!, walletAddress!, payload);
      console.log("signed", signed);
      if (signed) {
        const { signature } = signed;

        setTimeout(() => {
          const request = {
            network: "tez",
            publicKey,
            address: walletAddress,
            message: payload,
            signature,
          };
          socket?.emit("JOIN", JSON.stringify(request));
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
