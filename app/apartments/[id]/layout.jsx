import '../../../public/global.css'

export default function RootLayout({ children }) {
  return (
    // <html>
    //   <body>
        <div className="base">{children}</div>
    //   </body>
    // </html>
  )
}