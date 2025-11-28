import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Modern inventory management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress browser extension errors
              if (typeof chrome !== 'undefined' && chrome.runtime) {
                const originalSendMessage = chrome.runtime.sendMessage;
                chrome.runtime.sendMessage = function(...args) {
                  try {
                    return originalSendMessage.apply(this, args);
                  } catch (e) {
                    if (e.message && e.message.includes('Receiving end does not exist')) {
                      return;
                    }
                    throw e;
                  }
                };
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
