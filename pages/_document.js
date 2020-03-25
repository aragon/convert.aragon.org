import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import env from 'lib/environment'

const ANALYTICS_CODE = `
  var _paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//arastats.eu/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '9']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript';
    g.async=true;
    g.defer=true;
    g.src=u+'matomo.js';
    s.parentNode.insertBefore(g,s);
  })();
`

function AnalyticsScript() {
  return env('NODE_ENV') !== 'production' ? null : (
    <script dangerouslySetInnerHTML={{ __html: ANALYTICS_CODE }} />
  )
}

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
          <meta name="twitter:description" content={env('SITE_DESCRIPTION')} />
          <meta name="twitter:title" content={env('SITE_TITLE')} />
          <meta name="twitter:image" content="/twitter-card-icon.png" />

          <meta property="og:title" content={env('SITE_TITLE')} />
          <meta property="og:description" content={env('SITE_DESCRIPTION')} />
          <meta property="og:url" content={env('SITE_URL')} />
          <meta property="og:site_name" content={env('SITE_TITLE')} />
          <meta property="og:image" content="/twitter-card-icon.png" />
          <meta
            property="og:image:secure_url"
            content="/twitter-card-icon.png"
          />
          <meta property="og:image:width" content="300" />
          <meta property="og:image:height" content="300" />

          <meta name="description" content={env('SITE_DESCRIPTION')} />
          <style>{`html { background: #1c1c1c }`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
          <AnalyticsScript />
        </body>
      </Html>
    )
  }
}
