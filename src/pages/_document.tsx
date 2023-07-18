import Document, { Head, Html, Main, NextScript } from "next/document";

export default class PageDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/static/favicon-32x32.png" />
          <meta name="author" content="Eric lee" />
          <meta name="keywords" content="twamm lite" />
          <meta name="description" content="" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
