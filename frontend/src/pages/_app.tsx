import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { store } from '../store';
import { createTheme } from '../theme';
import { BeaconProvider } from '../contexts/BeaconContext';
import { ContextProvider } from '../contexts/ContextProvider';
import '@solana/wallet-adapter-react-ui/styles.css';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps {
  Component: AppProps['Component'] & {
    getLayout: (children: any) => any;
  };
  pageProps: AppProps['pageProps'];
}

const App = (props: MyAppProps) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ReduxProvider store={store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider
            theme={createTheme({
              direction: 'ltr',
              responsiveFontSizes: true,
              mode: 'dark',
            })}
          >
            <CssBaseline />
            <Toaster position="top-center" />
            <BeaconProvider>
              <ContextProvider>
                {getLayout(<Component {...pageProps} />)}
              </ContextProvider>
            </BeaconProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
