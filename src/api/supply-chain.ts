import httpRequest from './http-request';

export const getSupplyChainMapping = (): Promise<
  SupplyChain.SupplyChainMapping[]
> => httpRequest.get('/supply-chain');

export const getSupplyChainTiers = (
  params: SupplyChain.SupplyChainTierParams,
): Promise<Array<SupplyChain.SupplyChainTier[]>> =>
  httpRequest.get('/supply-chain/tiers', { params });

export const createCalculatedField = (
  params: SupplyChain.Calculator,
): Promise<SupplyChain.Calculator> =>
  httpRequest.post('/calculate-field', params);

export const updateCalculatedField = (
  id: string,
  params: SupplyChain.Calculator,
): Promise<void> => httpRequest.put(`/calculate-field/${id}`, params);

export const createSupplyChainNodes = (
  params: SupplyChain.SupplyChainNodesParams,
): Promise<SupplyChain.Node[]> =>
  httpRequest.post('/supply-chain-nodes', params);

export const updateSupplyChainNode = (
  id: string,
  params: SupplyChain.UpdateNodeParams,
  signal: AbortSignal,
): Promise<SupplyChain.Node> =>
  httpRequest.put(`/supply-chain-nodes/${id}`, params, { signal });

export const updateSupplyChainNodeMetadata = (
  id: string,
  params: SupplyChain.UpdateNodeMetadataParams,
  signal?: AbortSignal,
): Promise<SupplyChain.Node> =>
  httpRequest.put(`/supply-chain-nodes/metadata/${id}`, params, { signal });

export const deleteSupplyChain = (id: string): Promise<void> =>
  httpRequest.delete(`/supply-chain-nodes/metadata/${id}`);

export const deleteMultiple = (
  params: SupplyChain.PreviewImpactParams,
): Promise<void> =>
  httpRequest.delete(`/supply-chain-nodes/multiple`, { params });

export const getImpactData = (
  params: SupplyChain.PreviewImpactParams,
): Promise<SupplyChain.PreviewImpactResponse> =>
  httpRequest.get(`/supply-chain-nodes/deletion-impacts`, { params });

export const getUpdateImpacts = (
  id: string,
  params: SupplyChain.UpdateNodeMetadataParams,
): Promise<SupplyChain.PreviewImpactResponse> =>
  httpRequest.post(`/supply-chain-nodes/metadata/${id}/update-impacts`, params);
