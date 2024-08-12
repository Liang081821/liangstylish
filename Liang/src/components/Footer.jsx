import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LineImg from "../../public/images/line.png";
import FaceBookImg from "../../public/images/facebook.png";
import TwitterImg from "../../public/images/twitter.png";
import CartImg from "../../public/images/cart-mobile.png";
import ProfileImg from "../../public/images/member-mobile.png";

const Footer = ({ totalQuantity }) => {
  return (
    <footer>
      {/* Browser Footer */}
      <WebFooter>
        <FooterNav>
          <FooterList>
            <FooterText>
              <FooterLink href="#!">關於 STYLiSH</FooterLink>
            </FooterText>
            <FooterText>
              <FooterLink href="#!">服務條款</FooterLink>
            </FooterText>
            <FooterText>
              <FooterLink href="#!">隱私政策</FooterLink>
            </FooterText>
            <FooterText>
              <FooterLink href="#!">聯絡我們</FooterLink>
            </FooterText>
            <FooterText>
              <FooterLink href="#!">FAQ</FooterLink>
            </FooterText>
          </FooterList>
        </FooterNav>
        <SocialMediaList>
          <SocialMediaItem>
            <FooterImage src={LineImg} alt="Line" />
          </SocialMediaItem>
          <SocialMediaItem>
            <FooterImage src={TwitterImg} alt="Twitter" />
          </SocialMediaItem>
          <SocialMediaItem>
            <FooterImage src={FaceBookImg} alt="Facebook" />
          </SocialMediaItem>
        </SocialMediaList>
        <Copyright>© 2018. All rights reserved.</Copyright>
      </WebFooter>

      {/* Mobile Footer */}
      <MobileFooter>
        <FooterBox>
          <MobileFooterNav>
            <MobileFooterText>
              <a href="#!">關於 STYLiSH</a>
            </MobileFooterText>
            <MobileFooterText>
              <a href="#!">服務條款</a>
            </MobileFooterText>
            <MobileFooterText>
              <a href="#!">隱私政策</a>
            </MobileFooterText>
          </MobileFooterNav>
          <MobileFooterNav2>
            <MobileFooterText>
              <a href="#!">聯絡我們</a>
            </MobileFooterText>
            <MobileFooterText>
              <a href="#!">FAQ</a>
            </MobileFooterText>
          </MobileFooterNav2>
          <MobileFooterUl>
            <MobileFooterImageContainer>
              <MobileFooterImage src="images/line.png" alt="#!" />
            </MobileFooterImageContainer>
            <MobileFooterImageContainer>
              <MobileFooterImage src="images/twitter.png" alt="#!" />
            </MobileFooterImageContainer>
            <MobileFooterImageContainer>
              <MobileFooterImage src="images/facebook.png" alt="#!" />
            </MobileFooterImageContainer>
          </MobileFooterUl>
        </FooterBox>
        <MobileCopyright>© 2018. All rights reserved.</MobileCopyright>
      </MobileFooter>

      <MobileFooterBottom>
        <MobileVersionBox>
          <MobileLayoutCart>
            <Link to="/checkout">
              <img src={CartImg} alt="#!" />
              <MobileQuantity>{totalQuantity}</MobileQuantity>
            </Link>
          </MobileLayoutCart>
          <MobileIconText>
            <a>購物車</a>
          </MobileIconText>
        </MobileVersionBox>
        <MobileVersionBox>
          <img src={ProfileImg} alt="#!" />
          <MobileIconText>
            <a>會員</a>
          </MobileIconText>
        </MobileVersionBox>
      </MobileFooterBottom>
    </footer>
  );
};
const WebFooter = styled.div`
  width: 100%;
  background: #313538;
  display: flex;
  height: 115px;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const FooterNav = styled.nav``;
const FooterList = styled.ul``;
const FooterText = styled.li`
  width: 134px;
  text-align: center;
  position: relative;
  color: #f5f5f5;
  font-size: 16px;
  line-height: 22px;
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 3px;
    right: 0;
    bottom: 3px;
    width: 1px;
    background-color: #f5f5f5;
  }
  &:last-child {
    border-right: none;
  }
`;
const FooterLink = styled.a``;
const SocialMediaList = styled.ul`
  margin-left: 101px;
`;
const SocialMediaItem = styled.li``;
const FooterImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 30px;
`;
const Copyright = styled.div`
  line-height: 17.38px;
  font-size: 12px;
  color: #828282;
`;
// mobile footer
const MobileFooter = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    margin-bottom: 60px;
    padding: 23px 0px 20px 0px;
    width: 100%;
    background-color: #313538;
  }
`;
const FooterBox = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    height: 76px;
    margin: 0px auto;
  }
`;
const MobileFooterNav = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    color: #d3d3d3;
    margin-right: 36px;
  }
`;
const MobileFooterNav2 = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    color: #d3d3d3;
    margin-right: 31px;
  }
`;
const MobileFooterText = styled.div`
  @media screen and (max-width: 1279px) {
    margin-bottom: 8px;
    white-space: nowrap;
    font-size: 14px;
    line-height: 20px;
  }
`;
const MobileFooterUl = styled.ul`
  @media screen and (max-width: 1279px) {
    margin-top: 18px;
    column-gap: 14px;
  }
`;
const MobileFooterImageContainer = styled.li`
  @media screen and (max-width: 1279px) {
  }
`;
const MobileFooterImage = styled.img`
  @media screen and (max-width: 1279px) {
    width: 20px;
    height: 20px;
  }
`;
const MobileCopyright = styled.div`
  @media screen and (max-width: 1279px) {
    color: #828282;
    margin: 13px 0px 0px 0px;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
  }
`;
const MobileFooterBottom = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    position: fixed;
    bottom: 0;
    display: flex;
    height: 60px;
    z-index: 2;
    align-items: center;
    justify-content: space-evenly;
    background-color: #313538;
    width: 100%;
    padding: 8px 0px 8px;
    &::after {
      content: "";
      position: absolute;
      top: 20px;
      bottom: 20px;
      left: 50%;
      width: 1px;
      background-color: #ccc;
    }
  }
`;
const MobileVersionBox = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
  }
`;
const MobileLayoutCart = styled.div`
  @media screen and (max-width: 1279px) {
    position: relative;
  }
`;
const MobileQuantity = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 24px;
    height: 24px;
    font-size: 16px;
    text-align: center;

    border-radius: 50%;
    background-color: #8b572a;
    color: white;
  }
`;
const MobileIconText = styled.div`
  @media screen and (max-width: 1279px) {
    color: #ffffff;
    font-size: 16px;
    line-height: 16px;
  }
`;

export default Footer;
