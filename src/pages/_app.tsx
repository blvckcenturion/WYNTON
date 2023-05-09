import "../assets/css/global.css";
import type { AppProps } from "next/app";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
config.autoAddCss = false

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    document.addEventListener("keydown", (e) => { 
      if (e.key === "Backspace") {
        if (!(e.target instanceof HTMLInputElement) || (e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
        }
      }
    })
  }, [])
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
    </>
  );
}
