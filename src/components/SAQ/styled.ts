import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  padding-bottom: 100px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 16px;
    margin-bottom: 32px;
    box-sizing: border-box;
  }
`;

export const Label = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 15px;
  margin-bottom: 30px;
`;

const stepActiveCSS = css`
  background: ${({ theme }) => theme.background.envy};
`;

const stepCSS = css`
  background: ${({ theme }) => theme.background.ghost};
`;

export const Step = styled('div', { isActive: Boolean })`
  border-radius: 8px;
  width: 40px;
  height: 4px;
  cursor: pointer;
  ${(props) => (props.isActive ? stepActiveCSS : stepCSS)};
`;

export const Part = styled.div`
  margin-top: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
  text-align: center;
`;

export const Form = styled.div``;

export const Content = styled.div`
  width: 640px;
  padding: 20px 0;
  background-color: ${({ theme }) => theme.background.white};

  @media (max-width: 768px) {
    width: 100%;
    max-width: 640px;
  }
`;

export const FormGroup = styled.div`
  padding: 0 40px;
  width: 100%;
  box-sizing: border-box;

  &:not(:last-child) {
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

export const Title = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.highland};
  white-space: pre-line;
`;

export const QuestionAnswers = styled.div`
  margin-top: 20px;
`;

export const Header = styled.div`
  margin-bottom: 5px;
  display: block;
  &:after {
    content: '';
    clear: both;
    display: table;
  }
`;

export const BackButton = styled.div`
  float: left;
`;

export const NextButton = styled.div`
  float: right;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  margin-top: 56px;
`;

export const InputGroup = styled.div`
  > div {
    margin-top: 6px;
  }
`;

export const OtherInput = styled.div`
  margin-top: 15px;
`;
