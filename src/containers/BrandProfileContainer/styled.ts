import styled, { css } from 'vue-styled-components';

const labelCSS = css`
  font-size: 14px;
  line-height: 15px;
  padding: 0 4px;
  margin-bottom: 4px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
  text-transform: capitalize;
`;

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 852px;
  margin: 40px auto;

  @media (max-width: 992px) {
    width: 100%;
  }
`;

export const Account = styled.div`
  margin-top: 14px;
`;

export const Title = styled.h1`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.stormGray};
  margin: 0 0 10px;

  @media (max-width: 992px) {
    padding: 0 10px;
  }
`;

export const SubTitle = styled.h2`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  margin: 0 0 16px 14px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 335px 159px 330px;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export const BusinessNumber = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.background.white};
  padding: 10px 20px 14px;
  box-sizing: border-box;
`;

export const Label = styled.div`
  ${labelCSS}
`;

export const Info = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  box-sizing: border-box;
  border-radius: 4px;
  background: ${({ theme }) => theme.background.alabaster};
  color: ${({ theme }) => theme.colors.stormGray};
  text-transform: capitalize;
  padding: 10px 19px 10px 15px;
  height: 38px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
`;

export const Logo = styled.img`
  height: 100%;
  object-fit: cover;
  max-width: 100%;

  @media (max-width: 992px) {
    padding: 0 16px;
  }
`;

export const UpdateProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.background.white};
  padding: 10px;
  box-sizing: border-box;

  button {
    height: 28px;
    padding: 4px;
    justify-content: flex-start;

    span:not(.usdol-icon) {
      text-decoration: underline;
    }
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 508px 330px;
  column-gap: 14px;

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export const Row = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Headquarter = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.background.white};
`;

export const YouCanTitle = styled.h2`
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  margin: 0 0 25px;
  text-align: center;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Actions = styled.div`
  background: ${({ theme }) => theme.background.white};
  padding: 18px 30px 18px 40px;
  display: flex;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Action = styled.div`
  padding-bottom: 94px;
  position: relative;

  &:after {
    content: '';
    width: 1px;
    height: 44px;
    background: ${({ theme }) => theme.background.envy};
    position: absolute;
    top: 63px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
  }

  &:last-child {
    padding-bottom: 0;

    &:after {
      content: none;
    }
  }
`;

export const Figure = styled.figure`
  display: grid;
  row-gap: 18px;
  margin: 0 0 0 26px;
`;

export const Image = styled.img`
  width: 103px;
  height: 103px;
`;
