// config/index.tsx

import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia, localhost } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "dd98afd4a5729fd3c2169d6a34f01a86";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, sepolia, localhost];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
