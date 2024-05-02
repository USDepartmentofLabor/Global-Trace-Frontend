import httpRequest from './http-request';

export const getSupplyChainMapping =
  (): Promise<SupplyChain.SupplyChainMapping> =>
    httpRequest.get('/supply-chain');

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
