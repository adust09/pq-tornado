import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";

// Create a public client for read operations
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * API route handler for retrieving the current Merkle root
 * @returns The current root hash from the contract
 */
export async function GET() {
  try {
    console.log("🌲 getContractRoot API: Processing request");

    try {
      // Call the getCurrentRoot function on the contract
      const root = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "getCurrentRoot",
        args: [],
      });

      console.log("🌲 getContractRoot API: Current root retrieved:", root);

      return NextResponse.json({
        success: true,
        root: root,
      });
    } catch (contractError) {
      console.error("🌲 getContractRoot API: Contract error:", contractError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to retrieve current root from contract",
          details:
            contractError instanceof Error
              ? contractError.message
              : String(contractError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("🌲 getContractRoot API: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
