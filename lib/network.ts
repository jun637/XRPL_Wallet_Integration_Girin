export const networks = [
  'xrpl:0',
  'xrpl:1',
] as const;

export type NETWORK = (typeof networks)[number];

export const NETWORK_MAP: Record<NETWORK, string> = {
  'xrpl:0': 'XRPL Mainnet',
  'xrpl:1': 'XRPL Testnet',
};
