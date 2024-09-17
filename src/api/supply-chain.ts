import httpRequest from './http-request';

export const getSupplyChainMapping =
  (): Promise<SupplyChain.SupplyChainMapping> =>
    httpRequest.get('/supply-chain');

export const getSupplyChainTiers = (
  params: SupplyChain.SupplyChainTierParams,
): Promise<SupplyChain.SupplyChainTier[]> =>
  httpRequest.get('/supply-chain/tiers', { params });

export const validateCalculatedField = (
  params: SupplyChain.ValidateCalculatorParams,
): Promise<void> => httpRequest.post('/calculate-field/validate', params);

export const createSupplyChainNodes = (
  params: SupplyChain.NodeParams,
): Promise<SupplyChain.Node> => httpRequest.post('/supply-chain-nodes', params);

export const updateSupplyChainNode = (
  id: string,
  params: SupplyChain.NodeParams,
  signal: AbortSignal,
): Promise<SupplyChain.Node> =>
  httpRequest.put(`/supply-chain-nodes/${id}`, params, { signal });

export const deleteSupplyChain = (id: string): Promise<void> =>
  httpRequest.delete(`/supply-chain-nodes/${id}`);
