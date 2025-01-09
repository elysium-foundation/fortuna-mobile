export interface TokenSearchResponse {
  tokenAddress: string;
  chainId: string;
  name: string;
  symbol: string;
  usdPrice: number;
  usdPricePercentChange: {
    oneDay: number;
  };
}
