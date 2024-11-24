export const networks = [
  'xrpl:0',
  'xrpl:1',
  'eip155:7668',
  'eip155:7672',
] as const;

export type NETWORK = (typeof networks)[number];

export const NETWORK_MAP: Record<NETWORK, string> = {
  'xrpl:0': 'XRPL Mainnet',
  'xrpl:1': 'XRPL Testnet',
  'eip155:7668': 'TRN Mainnet',
  'eip155:7672': 'TRN Porcini',
};
