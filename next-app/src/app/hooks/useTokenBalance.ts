import { useState, useEffect } from "react";
import { ethers } from "ethers";

/**
 * Hook to fetch a user's ERC20 token balance.
 *
 * @param tokenAddress - Address of the ERC20 token contract.
 * @param userAddress - Address of the user whose balance is being fetched.
 * @returns { balance, error, loading }
 */
const useTokenBalance = (tokenAddress: string, userAddress: string) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!tokenAddress || !userAddress) {
      setError("Token address and user address are required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Check if WalletConnect provider is injected
      if (!window.ethereum) {
        setError("No wallet provider found. Please connect your wallet.");
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(
        "https://ethereum-sepolia-rpc.publicnode.com"
      );

      // ERC20 ABI with only the balanceOf function
      const tokenAbi = [
        "function balanceOf(address account) view returns (uint256)",
      ];
      const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);

      const rawBalance = await contract.balanceOf(userAddress);

      const convertedBalance = parseFloat(rawBalance.toString()) / 1e18;

      console.log(convertedBalance);

      setBalance(convertedBalance.toString());
      setError(null);
    } catch (err) {
      setError(`Failed to fetch balance: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [tokenAddress, userAddress]);

  return { balance, error, loading, refetch: fetchBalance };
};

export default useTokenBalance;
