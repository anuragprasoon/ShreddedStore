import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
            <body>
        <Main />
        <NextScript />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </Html>
  );
}
