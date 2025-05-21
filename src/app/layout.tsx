import type { Metadata } from "next";

import { getSession } from "~/auth";
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "~/context/AuthContext";
import { KuroProvider } from "~/context/KuroContext";
import Header from "./views/shared/header";
import Navigator from "./views/shared/navigator";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <AuthProvider>
            <KuroProvider>
              <ToastContainer
                autoClose={5000}
                position="bottom-right"
                theme="dark"
                stacked
              />
              <Header />
              <div className="mb-[88px]">{children}</div>

              <Navigator />
            </KuroProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
