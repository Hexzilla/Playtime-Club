import Head from "next/head";
import Image from "next/image";
import { Box, Button, Container, Divider, Link, Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Recover Password
        </Button>
      </Box>
    </>
  );
}
