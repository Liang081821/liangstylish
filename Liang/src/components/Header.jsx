import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../../public/images/logo.png";
import SearchIconImg from "../../public/images/search.png";
import CartImg from "../../public/images/cart-hover.png";
import MemberImg from "../../public/images/member.png";

const Header = ({ totalQuantity }) => {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const handleSearchClick = () => {
    setShowSearchBox(true);
  };
  const handleCloseClick = () => {
    setShowSearchBox(false);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      const keyword = event.target.value;
      window.location.href = `/homepage.html?keyword=${encodeURIComponent(
        keyword
      )}`;
    }
  };

  return (
    <HeaderPart>
      <HeaderTop>
        <HeaderLeft>
          <a href="/homepage.html">
            <LogoImage
              src={Logo}
              alt="STYLiSH logo"
              showSearchBox={showSearchBox}
            />
          </a>
          <Category showSearchBox={showSearchBox}>
            <WomenItem>
              <a href="/homepage.html?tag=women">女 裝</a>
            </WomenItem>
            <ManItem>
              <a href="/homepage.html?tag=men">男 裝</a>
            </ManItem>
            <AccessoryItem>
              <a href="/homepage.html?tag=accessories">配 件</a>
            </AccessoryItem>
          </Category>
        </HeaderLeft>

        <HeaderRight>
          <SearchForm>
            <SearchInput
              type="text"
              placeholder="西裝"
              id="searchInput"
              onKeyDown={handleKeyDown}
            />
            <SearchIcon src={SearchIconImg} alt="#!" />
          </SearchForm>
          <CartDiv>
            <Link to="/checkout">
              <CartIcon src={CartImg} alt="#!" />
              <BrowserQuantity>{totalQuantity}</BrowserQuantity>
            </Link>
          </CartDiv>
          <MemberIcon src={MemberImg} alt="#!" />
        </HeaderRight>
      </HeaderTop>
      <BlackBorder />

      <MobileVersion>
        <MobileSearchIcon
          src={SearchIconImg}
          alt="#!"
          onClick={handleSearchClick}
          showSearchBox={showSearchBox}
        />
      </MobileVersion>

      {showSearchBox && (
        <SearchBox>
          <SearchInputText
            type="text"
            placeholder="西裝"
            className="search-input"
            onKeyDown={handleKeyDown}
          />
          <CloseButton onClick={handleCloseClick}>X</CloseButton>
        </SearchBox>
      )}
    </HeaderPart>
  );
};

const HeaderPart = styled.div``;

const HeaderTop = styled.div`
  width: 100%;
  height: 100px;
  position: fixed;
  background-color: #fff;
  z-index: 2;
  top: 0;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1279px) {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  text-align: center;
  @media screen and (max-width: 1279px) {
    display: block;
    width: 100%;
  }
`;

const LogoImage = styled.img`
  cursor: pointer;
  height: 48px;
  width: 258px;
  margin-top: 26px;
  margin-left: 60px;
  @media screen and (max-width: 1279px) {
    height: 24px;
    width: 129px;
    margin: 14px auto 14px;
    ${(props) =>
      props.showSearchBox &&
      `
    display: none;
  `}
  }
`;

const Category = styled.ul`
  display: flex;
  margin-left: 57px;
  margin-top: 44px;
  height: 28px;
  width: 451px;
  @media screen and (max-width: 1279px) {
    background-color: #313538;
    display: flex;
    margin: 0;
    height: 50px;
    width: 100%;
    ${(props) =>
      props.showSearchBox &&
      `
    margin-top:52px;
  `}
  }
`;

const BaseItem = styled.li`
  display: inline-block;
  position: relative;
  width: 150px;
  text-align: center;
  color: #3f3a3a;
  font-size: 20px;
  line-height: 28px;
  word-spacing: 28px;
  &:hover {
    color: #8b572a;
  }
  @media screen and (max-width: 1279px) {
    display: block;
    color: #828282;
    font-size: 16px;
    line-height: 16px;
    flex-grow: 1;
    border-right: 1px solid #828282;
    margin: 17px 0;
    word-spacing: -3px;
    &:hover {
      color: #ffffff;
    }
  }
`;

const WomenItem = styled(BaseItem)`
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    right: 0;
    bottom: 4px;
    width: 1px;
    background-color: #3f3a3a;
  }
`;

const ManItem = styled(BaseItem)`
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    right: 0;
    bottom: 4px;
    width: 1px;
    background-color: #3f3a3a;
  }
`;

const AccessoryItem = styled(BaseItem)`
  @media screen and (max-width: 1279px) {
    border: none;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-right: 54px;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const SearchForm = styled.div`
  height: 44px;
  width: 214px;
  display: flex;
  border: 1px solid #979797;
  border-radius: 60px;
`;

const SearchInput = styled.input`
  outline: none;
  width: 160px;
  padding-left: 20px;
  font-size: 20px;
  line-height: 24px;
  &::placeholder {
    font-family: "Noto Sans TC", sans-serif;
    color: #788b2a;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  top: 28px;
  right: 236px;
  height: 44px;
  width: 44px;
`;

const CartDiv = styled.div`
  position: relative;
`;

const CartIcon = styled.img`
  margin-left: 42px;
  height: 44px;
  width: 44px;
`;

const BrowserQuantity = styled.div`
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
`;

const MemberIcon = styled.img`
  margin-left: 42px;
  height: 44px;
  width: 44px;
`;

const BlackBorder = styled.div`
  border-bottom: 40px solid #313538;
  width: 100%;
  position: fixed;
  top: 100px;
  z-index: 2;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const MobileVersion = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: block;
  }
`;

const MobileSearchIcon = styled.img`
  @media screen and (max-width: 1279px) {
    position: fixed;
    z-index: 2;
    top: 6px;
    right: 16px;
    height: 40px;
    width: 40px;
    cursor: pointer;
    ${(props) =>
      props.showSearchBox &&
      `
    display: none;
  `}
  }
`;
const SearchBox = styled.div`
  @media screen and (max-width: 1279px) {
    position: fixed;
    top: 4px;
    height: 44px;
    left: 8px;
    right: 8px;
    padding-top: 8px;
    z-index: 2;
    border: 1px solid #979797;
    border-radius: 60px;
  }
`;
const CloseButton = styled.button`
  @media screen and (max-width: 1279px) {
    position: fixed;
    z-index: 2;
    top: 6px;
    right: 16px;
    height: 40px;
    width: 40px;
    font-size: 24px;
  }
`;
const SearchInputText = styled.input`
  @media screen and (max-width: 1279px) {
    outline: none;
    width: 100%;
    padding-left: 20px;
    padding-right: 50px;
    font-size: 20px;
    line-height: 24px;
  }
`;

export default Header;
