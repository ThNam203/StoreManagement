import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import SideBar from '@/components/ui/sidebar'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Convenient Store',
  description: 'Convenient Store Management Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={font.className + ' flex flex-row'}>
          <SideBar/>
          {children}
          </body>
      </html>
  )
}
