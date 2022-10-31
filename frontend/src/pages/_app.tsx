import React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import "@solana/wallet-adapter-ant-design/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/globals.css";
import { createTheme } from '../theme';
import { ContextProvider } from "../contexts/ContextProvider";


const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  const getLayout = Component['getLayout'] ?? ((page) => page);

  return (
    <ThemeProvider
      theme={createTheme({
        direction: 'ltr',
        responsiveFontSizes: true,
        mode: 'dark',
      })}
    >
      <ToastContainer position="top-center" hideProgressBar/>
      <ContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </ContextProvider>
    </ThemeProvider>
  );
}

export default App;
