import styled from 'vue-styled-components';
import resources from 'config/resources';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TableContainer = styled.div`
  display: flex;
  padding: 18px 16px;
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  max-width: 245px;
  margin: 16px auto 0;
`;

export const AddNew = styled.div`
  margin: 20px 0;
`;

export const ExcelFormat = styled.p`
  margin: 10px 0 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

export const DownloadTemplate = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Download = styled.span`
  color: ${({ theme }) => theme.colors.highland};
  cursor: pointer;
  text-decoration: underline;
  margin-left: 6px;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.EMPTY_UPLOAD_TRANSLATE,
})`
  width: 265px;
  height: 215px;
`;

export const EmptyText = styled.div`
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  white-space: pre;
  line-height: 40px;
  color: ${({ theme }) => theme.colors.abbey};
`;
