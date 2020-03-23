import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const { renderPage } = ctx

    try {
      ctx.renderPage = () => {
        return renderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })
      }

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
            crossOrigin="anonymous"
          />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@AragonProject" />
          <meta
            name="twitter:description"
            content="Become a juror for Aragon Court"
          />
          <meta name="twitter:title" content="Aragon Court" />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png"
          />

          <meta property="og:title" content="Aragon Court" />
          <meta
            property="og:description"
            content="Become a juror for Aragon Court"
          />
          <meta property="og:url" content="https://court.aragon.org/" />
          <meta property="og:site_name" content="Aragon Court" />
          <meta
            property="og:image"
            content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png"
          />
          <meta
            property="og:image:secure_url"
            content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png"
          />
          <meta property="og:image:width" content="300" />
          <meta property="og:image:height" content="300" />

          <meta name="description" content="Become a juror for Aragon Court" />
          <style>{`html { background: #1c1c1c }`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
