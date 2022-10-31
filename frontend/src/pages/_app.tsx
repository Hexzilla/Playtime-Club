import type { AppProps } from "next/app";
import { Toaster } from 'react-hot-toast';
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import { createEmotionCache } from "../utils/create-emotion-cache";
import { createTheme } from "../theme";

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider
        theme={createTheme({
          direction: "ltr",
          responsiveFontSizes: true,
          mode: "dark",
        })}
      >
        <CssBaseline />
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
