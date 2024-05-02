import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const getDNAList = (
  params: App.RequestParams,
): Promise<App.ListItem<DNAManagement.DNA>> =>
  httpRequest.get('/dna-testings', { params });

export const createDNATest = (
  params: DNAManagement.CreateDNATestParams,
): Promise<boolean> =>
  httpRequest.post('dna-testings', jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getRequestingFacilities = (): Promise<Auth.Facility[]> =>
  httpRequest.get('/dna-testings/requesting-facility');

export const getProductSuppliers = (): Promise<Auth.Facility[]> =>
  httpRequest.get('/dna-testings/product-supplier');

export const deleteDNA = async (id: string): Promise<void> =>
  httpRequest.delete(`/dna-testings/${id}`);
