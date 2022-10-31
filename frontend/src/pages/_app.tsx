import type { AppProps } from "next/app";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
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
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
