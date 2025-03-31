import httpRequest from './http-request';

export const getProfileCertificationList = (): Promise<App.DropdownOption[]> =>
  httpRequest.get('/facilities/certifications');

export const getCertificationList = (): Promise<App.DropdownOption[]> =>
  httpRequest.get('/facilities/farm-certifications');

export const getChainOfCustodyList = (): Promise<App.DropdownOption[]> =>
  httpRequest.get('/facilities/chain-of-custody');

export const requestFacilityOarId = (
  params: Onboard.RegisterOarIdParams,
): Promise<Onboard.OarIdItem> =>
  httpRequest.post('/facilities/identifier-systems/register-oarIds', params);

export const searchFacilityOarIds = (
  params: Onboard.RegisterOarIdParams,
): Promise<Onboard.OarIdItem[]> =>
  httpRequest.post('/facilities/identifier-systems/search-oarIds', params);

export const registerOarId = (
  params: Onboard.RegisterOarIdParams,
): Promise<void> =>
  httpRequest.post(`/facilities/identifier-systems/register-oarIds`, params);

export const confirmMatchOarId = (params: Onboard.OarIdParam): Promise<void> =>
  httpRequest.get('/facilities/identifier-systems/oar-ids/confirm-match', {
    params,
  });

export const rejectMatchOarId = (ids: string): Promise<Onboard.OarIdDetail> =>
  httpRequest.get(
    `/facilities/identifier-systems/oar-ids/reject-match?ids=${ids}`,
    {},
  );

export const searchCID = (
  facilityId: string,
): Promise<Array<Onboard.RoleAttributeParams[]>> =>
  httpRequest.get(
    `/facilities/identifier-systems/rmi-cid?facilityId=${facilityId}`,
  );

export const getPartnerFacilities = (
  params: Onboard.FacilityListRequestParams,
): Promise<Auth.Facility[]> =>
  httpRequest.get('/partners/search/facilities', { params });

export const getPartnerTransporters = (
  params: Onboard.FacilityListRequestParams,
): Promise<Auth.Facility[]> =>
  httpRequest.get('/partners/search/transporters', { params });

export const getPartnerBrokers = (
  params: Onboard.FacilityListRequestParams,
): Promise<Auth.Facility[]> =>
  httpRequest.get('/partners/search/brokers', { params });

export const getBusinessPartnerBrokers = (
  params: Onboard.FacilityListRequestParams,
): Promise<Auth.Facility[]> =>
  httpRequest.get('/partners/search/broker-partners', { params });

export const getBusinessPartnerList = (): Promise<Auth.Facility[]> =>
  httpRequest.get('/partners/all');

export const getBrokerPartnerList = (
  params: Onboard.FacilityListRequestParams,
): Promise<Auth.Facility[]> =>
  httpRequest.get('/brokers/invitable-partners', { params });

export const invitePartner = (
  params: Onboard.InvitePartner,
): Promise<Auth.User> => httpRequest.post('/partners/invite', params);

export const invitePartnerTransporter = (
  params: Onboard.InvitePartner,
): Promise<Auth.User> =>
  httpRequest.post('/partners/invite/transporters', params);

export const invitePartnerBrokers = (
  params: Onboard.InvitePartner,
): Promise<Auth.User> => httpRequest.post('/partners/invite/brokers', params);

export const deletePartner = (partnerId: string): Promise<void> =>
  httpRequest.delete(`/partners/${partnerId}`);

export const validateBusinessPartner = async (
  params: Onboard.BusinessPartnerParams,
): Promise<void> => {
  return httpRequest.post('/partners/', params);
};

export const getBusinessPartners = (id: string): Promise<Auth.Facility[]> =>
  httpRequest.get(`/facilities/${id}/business-partner`);

export const checkOarId = (
  params: Onboard.CheckOarIdParams,
): Promise<Onboard.OarIdDetail> =>
  httpRequest.post('/facilities/identifier-systems/check-oarId', params);

export const getInviteRoles = (
  params: Onboard.PartnerRolesParams,
): Promise<RoleAndPermission.Role[]> =>
  httpRequest.get('/partners/roles', { params });
