'use client'
import NoSSR from '@/app/utils/no-ssr'

export default function RootLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    return (
        <html lang="en">
            <body>
                <NoSSR>
                    {children}
                </NoSSR>
            </body>
        </html>
    )
}
