import Document, { Head, Main, NextScript } from 'next/document'

export default class AppDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <html>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' type='image/png' href='/static/icons/favicon.png' />
          <link
            href='https://use.fontawesome.com/releases/v5.3.1/css/all.css'
            rel='stylesheet'
            type='text/css'
          />
          <link
            rel='stylesheet'
            href='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
