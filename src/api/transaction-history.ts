import httpRequest from './http-request';

export const getTransactionHistoryList = (
  params: TransactionHistory.RequestParams,
): Promise<App.ListItem<TransactionHistory.History>> =>
  httpRequest.get('/histories', { params });

export const getSeasonStartTime =
  (): Promise<TransactionHistory.SeasonStartTime> =>
    httpRequest.get('/histories/season-start-time');

export const getMassBalance = (
  params: TransactionHistory.RequestParams,
): Promise<TransactionHistory.MassBalanceResponse> =>
  httpRequest.get('/calculations/mass-balance', { params });

export const getCalculatorMarginOfError = (
  params: TransactionHistory.RequestParams,
): Promise<TransactionHistory.TransactionResponse> =>
  httpRequest.get('/calculations/margin-of-error', { params });

export const getTotalTransaction = (
  params: TransactionHistory.RequestParams,
): Promise<TransactionHistory.TotalTransactionResponse> =>
  httpRequest.get('/calculations', { params });
