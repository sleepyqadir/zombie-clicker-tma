"use client";
import {
  ThirdwebProvider,
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clientId } from "./constants";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        walletConnect(),
      ]}
      clientId={clientId}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThirdwebProvider>
  );
}
