import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Link,
  Toolbar,
} from "@mui/material";
import { Menu as MenuIcon } from "../icons/menu";
import { Logo } from "./logo";
import { ConnectButton } from "./connect-button";

export const MainNavbar = (props) => {
  const { onOpenSidebar } = props;

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottomColor: "divider",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        color: "text.secondary",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <NavLink to="/">
            <Logo
              sx={{
                display: {
                  md: "inline",
                  xs: "none",
                },
                height: 40,
                width: 40,
              }}
            />
          </NavLink>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            onClick={onOpenSidebar}
            sx={{
              display: {
                md: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              alignItems: "center",
              display: {
                md: "flex",
                xs: "none",
              },
            }}
          >
            <NavLink to="/play">
              <Link color="textSecondary" underline="none" variant="subtitle2">
                Play
              </Link>
            </NavLink>
            <NavLink to="/rank">
              <Link
                color="textSecondary"
                sx={{ ml: 2 }}
                underline="none"
                variant="subtitle2"
              >
                Rank
              </Link>
            </NavLink>
            <NavLink to="/nft">
              <Link
                color="textSecondary"
                component="a"
                sx={{ ml: 2 }}
                underline="none"
                variant="subtitle2"
              >
                NFT
              </Link>
            </NavLink>
            <ConnectButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};
