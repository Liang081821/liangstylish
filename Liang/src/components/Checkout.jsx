import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import DeleteImgSource from "/images/trash.png";

const Checkout = ({ getTotalQuantity }) => {
  const [totalQuantity, setTotalQuantity] = useState(getTotalQuantity());

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("CartItem")) || [];
    setCartItems(savedItems);
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);

    localStorage.setItem("CartItem", JSON.stringify(updatedItems));
    setTotalQuantity(getTotalQuantity());
  };

  const handleDelete = (index) => {
    const updatedItems = [...cartItems];
    const [itemToDelete] = updatedItems.splice(index, 1);
    localStorage.setItem("CartItem", JSON.stringify(updatedItems));

    setCartItems(updatedItems);
    setTotalQuantity(getTotalQuantity());
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const freight = cartItems.length > 0 ? 30 : 0;

  const [selectedOption, setSelectedOption] = useState("null");
  const [checkoutbutton, setCheckoutButton] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
  });

  //檢查輸入框
  const checkAllFields = () => {
    const newErrors = { ...errors };
    let isAllValid = true;
    Object.keys(formData).forEach((field) => {
      const value = formData[field];
      let isValid = true;

      switch (field) {
        case "name":
          isValid = /^[\u4e00-\u9fff]+$/.test(value);
          break;
        case "email":
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case "phone":
          isValid = /^[\d\s]+$/.test(value);
          break;
        case "address":
          isValid = value.trim() !== "";
          break;
        default:
          isValid = false;
      }

      newErrors[field] = !isValid;

      if (!isValid) {
        console.log(`${field} 格式不正確`);
        isAllValid = false;
      }
    });

    setErrors(newErrors);
    return isAllValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //結帳按鈕狀態控制
  useEffect(() => {
    const hasFields = Object.keys(formData).every((field) => {
      const value = formData[field];
      return value.trim() !== "";
    });
    setCheckoutButton(!(hasFields && selectedOption !== "null"));
  }, [formData, selectedOption]);

  //時間表單
  const handleRadioButtonClick = (value) => {
    setSelectedOption(value);
    console.log(selectedOption);
  };
  //結帳按鈕
  const handleButtonClick = () => {
    console.log("按鈕是可以點擊的");

    if (cartItems.length === 0) {
      alert("請選購商品");
    } else if (checkAllFields()) {
      alert("訂購成功");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setSelectedOption(null);
    }
  };

  if (!Array.isArray(cartItems)) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header totalQuantity={totalQuantity} />
      <CheckoutBody>
        <CheckBrowser>
          <CartTitle>
            <CartTltleTextLeft>購物車</CartTltleTextLeft>
            <CartTltleTextRight>數量</CartTltleTextRight>
            <CartTltleTextRight>單價</CartTltleTextRight>
            <CartTltleTextRight>小計</CartTltleTextRight>
          </CartTitle>
          <CartContainer>
            {cartItems.map((item, index) => (
              <CartItem key={index}>
                <CartImg src={item.main_image} />
                <CartLeftContainer>
                  <CartItemTitle>{item.title}</CartItemTitle>
                  <CartItemIndex>{item.index}</CartItemIndex>
                  <CartItemColor>顏色｜{item.colorName}</CartItemColor>
                  <CartItemSize>尺寸｜{item.size}</CartItemSize>
                </CartLeftContainer>
                <CartItemQuantity
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                >
                  {Array.from({ length: item.stock }, (_, i) => (
                    <CartSelectOption key={i + 1} value={i + 1}>
                      {i + 1}
                    </CartSelectOption>
                  ))}
                </CartItemQuantity>
                <CartItemPrice>TWD.{item.price}</CartItemPrice>
                <CartItemTotalPrice>
                  TWD.{item.price * item.quantity}
                </CartItemTotalPrice>
                <DeleteImg
                  src={DeleteImgSource}
                  onClick={() => handleDelete(index)}
                />
              </CartItem>
            ))}
          </CartContainer>
        </CheckBrowser>

        <CheckMobile>
          <CartTltleTextLeft>購物車</CartTltleTextLeft>

          {cartItems.map((item, index) => (
            <CartItem key={index}>
              <Spilt />
              <MobileLeftContainer>
                <CartImg src={item.main_image} />
                <CartLeftContainer>
                  <CartItemTitle>{item.title}</CartItemTitle>
                  <CartItemIndex>{item.index}</CartItemIndex>
                  <CartItemColor>顏色｜{item.colorName}</CartItemColor>
                  <CartItemSize>尺寸｜{item.size}</CartItemSize>
                </CartLeftContainer>
                <DeleteImg
                  src={DeleteImgSource}
                  onClick={() => handleDelete(index)}
                />
              </MobileLeftContainer>

              <MobileCartContainerTop>
                <CartTltleTextRight>數量</CartTltleTextRight>
                <CartTltleTextRight>單價</CartTltleTextRight>
                <CartTltleTextRight>小計</CartTltleTextRight>
              </MobileCartContainerTop>
              <MobileCartContainerBottom>
                <CartItemQuantity
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                >
                  {Array.from({ length: item.stock }, (_, i) => (
                    <CartSelectOption key={i + 1} value={i + 1}>
                      {i + 1}
                    </CartSelectOption>
                  ))}
                </CartItemQuantity>
                <CartItemPrice>TWD.{item.price}</CartItemPrice>
                <CartItemTotalPrice>
                  TWD.{item.price * item.quantity}
                </CartItemTotalPrice>
              </MobileCartContainerBottom>
            </CartItem>
          ))}
        </CheckMobile>

        <PurchaseInformationContainer>
          <ContainerText>訂購資料</ContainerText>
          <Spilt />
          <InformationContainerFirst>
            <InformationText>收件人姓名</InformationText>
            <InformationInput
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              errors={errors.name}
            />
          </InformationContainerFirst>
          <AdditionalText>
            務必填寫完整收件人姓名，避免包裹無法順利簽收
          </AdditionalText>

          <InformationContainer>
            <InformationText>手機</InformationText>
            <InformationInput
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              errors={errors.phone}
            />
          </InformationContainer>

          <InformationContainer>
            <InformationText>地址</InformationText>
            <InformationInput
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              errors={errors.address}
            />
          </InformationContainer>

          <InformationContainer>
            <InformationText>Email</InformationText>
            <InformationInput
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              errors={errors.email}
            />
          </InformationContainer>

          <InformationContainer>
            <InformationText>配送時間</InformationText>
            <RadioGroup>
              <RadioButtonLabel>
                <RadioButton
                  name="time"
                  checked={selectedOption === "08:00-12:00"}
                  onClick={() => handleRadioButtonClick("08:00-12:00")}
                ></RadioButton>
                08:00-12:00
              </RadioButtonLabel>
              <RadioButtonLabel>
                <RadioButton
                  name="time"
                  checked={selectedOption === "14:00-18:00"}
                  onClick={() => handleRadioButtonClick("14:00-18:00")}
                ></RadioButton>
                14:00-18:00
              </RadioButtonLabel>
              <RadioButtonLabel>
                <RadioButton
                  name="time"
                  checked={selectedOption === "不指定"}
                  onClick={() => handleRadioButtonClick("不指定")}
                ></RadioButton>
                不指定
              </RadioButtonLabel>
            </RadioGroup>
          </InformationContainer>
        </PurchaseInformationContainer>

        <PaymentContainer>
          <ContainerText>付款資料</ContainerText>
          <Spilt />

          <InformationContainerFirst>
            <InformationText>信用卡號碼</InformationText>
            <InformationInput placeholder="**** **** **** ****" />
          </InformationContainerFirst>

          <InformationContainer>
            <InformationText>有效期限</InformationText>
            <InformationInput placeholder="MM / YY" />
          </InformationContainer>

          <InformationContainer>
            <InformationText>安全碼</InformationText>
            <InformationInput placeholder="後三碼" />
          </InformationContainer>
        </PaymentContainer>

        <CheckoutContainer>
          <CheckoutSmallContainer>
            <CheckoutText>總金額</CheckoutText>
            <CheckoutSmallSmallContainer>
              <CheckoutNT>NT.</CheckoutNT>
              <CheckoutNumberTotal>{totalAmount}</CheckoutNumberTotal>
            </CheckoutSmallSmallContainer>
          </CheckoutSmallContainer>

          <CheckoutSmallContainer>
            <CheckoutText>運費</CheckoutText>
            <CheckoutSmallSmallContainer>
              <CheckoutNT>NT.</CheckoutNT>
              <CheckoutNumberFreight>{freight}</CheckoutNumberFreight>
            </CheckoutSmallSmallContainer>
          </CheckoutSmallContainer>

          <CheckoutSpilt />

          <CheckoutSmallContainer>
            <CheckoutTextAmount>應付金額</CheckoutTextAmount>
            <CheckoutSmallSmallContainer>
              <CheckoutNT>NT.</CheckoutNT>
              <CheckoutNumber>{totalAmount + freight}</CheckoutNumber>
            </CheckoutSmallSmallContainer>
          </CheckoutSmallContainer>

          <CheckoutButton onClick={handleButtonClick} disabled={checkoutbutton}>
            {checkoutbutton ? "請填寫資料" : "確認付款"}
          </CheckoutButton>
        </CheckoutContainer>
      </CheckoutBody>

      <Footer totalQuantity={totalQuantity} />
    </>
  );
};

const CheckoutBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CheckBrowser = styled.div`
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const CartTitle = styled.div`
  width: 1160px;
  height: 35px;
  margin-top: 191px;
  display: flex;
`;
const CartTltleTextLeft = styled.p`
  line-height: 19px;
  color: #3f3a3a;
  font-weight: 700;
  margin-right: 330px;

  @media screen and (max-width: 1279px) {
    margin-top: 0px;
  }
`;

const CartTltleTextRight = styled.p`
  line-height: 19px;
  color: #3f3a3a;
  margin-left: 160px;
  @media screen and (max-width: 1279px) {
    margin: 0px;
    width: 104px;
    height: 17px;
    text-align: center;
    font-size: 14px;
    line-height: 17px;
  }
`;

const CartContainer = styled.div`
  border: 1px solid #979797;
  width: 1160px;
  height: auto;
  padding-top: 10px;
  padding-bottom: 40px;
  /* background-color: #167cab; */
`;
const CartItem = styled.div`
  width: 1100px;
  height: 152px;
  margin: 30px 30px 0px 30px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: flex-start;

    width: 432px;
    height: auto;
    margin: 0px 0px 9px 0px;
    position: relative;
  }
`;

const MobileLeftContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;
const CartLeftContainer = styled.div`
  display: flex;
  width: 176px;
  flex-direction: column;
  align-self: flex-start;
`;

const CartImg = styled.img`
  width: 114px;
  height: 152px;
`;

const CartItemTitle = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #3f3a3a;
  margin-left: 16px;
  white-space: nowrap;
  @media screen and (max-width: 1279px) {
    margin-left: 10px;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
  }
`;

const CartItemIndex = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  margin-left: 16px;
  margin-top: 18px;
  @media screen and (max-width: 1279px) {
    margin-left: 10px;
    font-size: 14px;
    line-height: 17px;
    margin-top: 20px;
  }
`;

const CartItemColor = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  margin-left: 16px;
  margin-top: 22px;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 17px;
    margin-left: 10px;
    margin-top: 24px;
  }
`;

const CartItemSize = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  margin-left: 16px;
  margin-top: 10px;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 17px;
    margin-left: 11px;
    margin-top: 12px;
  }
`;

const CartItemQuantity = styled.select`
  margin-left: 192px;
  width: 80px;
  height: 32px;
  background-color: #f3f3f3;
  border-radius: 8px;
  border: 1px solid #979797;
  padding-left: 9px;
  @media screen and (max-width: 1279px) {
    margin-left: 12px;
    height: 30px;
  }
`;

const CartSelectOption = styled.option`
  /* text-align: center; */
  font-size: 14px;
  height: 16px;
`;

const CartItemPrice = styled.p`
  margin-left: 56px;
  width: 192px;
  line-height: 16px;
  text-align: center;
  @media screen and (max-width: 1279px) {
    margin-left: 12px; //設計稿
    font-size: 14px;
    line-height: 17px;
    width: 104px;
  }
`;

const CartItemTotalPrice = styled.p`
  width: 192px;
  line-height: 16px;
  text-align: center;

  @media screen and (max-width: 1279px) {
    margin-left: 0px;
    font-size: 14px;
    line-height: 17px;

    width: 104px;
  }
`;

const DeleteImg = styled.img`
  margin-left: 52px;
  height: 44px;
  width: 44px;
  cursor: pointer;
  @media screen and (max-width: 1279px) {
    position: absolute;
    top: 30;
    right: 0;
  }
`;

//手機版container
const CheckMobile = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: block;
    width: 432px;
    margin-top: 122px;
    height: auto;
  }
`;

const MobileCartContainerTop = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;
`;
const MobileCartContainerBottom = styled.div`
  display: flex;
  width: 100%;
  margin-top: 12px;
  justify-content: space-between;
  align-items: center;
`;

const PurchaseInformationContainer = styled.div`
  margin-top: 48px;
  margin-bottom: 2px;
  /* background-color: #ff6dce; */
  width: 1160px;
  height: 363px;
  @media screen and (max-width: 1279px) {
    width: 432px;
    height: 441px;
    margin-top: 10px;
    /* background-color: #743131; */
  }
`;
const ContainerText = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #3f3a3a;
  font-weight: 700;
  @media screen and (max-width: 1279px) {
  }
`;

const Spilt = styled.div`
  width: 1160px;
  color: #3f3a3a;
  margin-top: 16px;
  border-bottom: 1px solid black;
  @media screen and (max-width: 1279px) {
    width: 432px;
    margin-top: 10px;
  }
`;

const InformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;

  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: start;
    margin-top: 20px;
    margin-bottom: 0px;
  }
`;

const InformationContainerFirst = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;

  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: start;
    margin-top: 20px;
    margin-bottom: 0px;
  }
`;

const AdditionalText = styled.p`
  margin-left: 344px;
  margin-top: 10px;

  font-size: 16px;
  line-height: 19px;
  color: #8b572a;

  @media screen and (max-width: 1279px) {
    margin-left: 0px;
    font-size: 14px;
    line-height: 17px;
    margin-top: 6px;
  }
`;
const InformationText = styled.p`
  width: 120px;

  font-size: 16px;
  line-height: 19px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 17px;
  }
`;

const InformationInput = styled.input`
  width: 576px;
  height: 32px;
  color: #979797;
  padding-left: 8px;
  border: ${(props) => (props.errors ? "2px solid red" : "1px solid #979797")};
  border-radius: 8px;
  outline: none;

  @media screen and (max-width: 1279px) {
    width: 432px;
    height: 32px;

    margin-top: 10px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  column-gap: 32px;

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    column-gap: 26px;
  }
`;

const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
  font-size: 16px;
  line-height: 26px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    column-gap: 6px;
  }
`;

const RadioButton = styled.input.attrs({ type: "radio" })`
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  border: 1px solid #979797;
`;

const PaymentContainer = styled.div`
  margin-top: 48px;
  /* background-color: #0fa142; */
  width: 1160px;
  height: 216px;

  @media screen and (max-width: 1279px) {
    width: 432px;
    height: 266px;
    margin-top: 19px;
  }
`;

const CheckoutContainer = styled.div`
  width: 240px;
  height: 282px;
  margin-top: 40px;
  margin-left: 920px;
  margin-bottom: 148px;
  @media screen and (max-width: 1279px) {
    margin: 24px 0px 28px 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 24px;
    padding-left: 24px;
    height: 248px;
  }
`;
const CheckoutSmallContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  @media screen and (max-width: 1279px) {
    width: 240px;
  }
`;

const CheckoutSmallSmallContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;
const CheckoutText = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #3f3a3a;
`;

const CheckoutTextAmount = styled.p`
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    line-height: 19px;
    margin-left: 4px;
    color: #3f3a3a;
  }
`;
const CheckoutNT = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #3f3a3a;
`;
const CheckoutNumber = styled.p`
  font-size: 30px;
  line-height: 36px;
  color: #3f3a3a;
`;
const CheckoutNumberTotal = styled.p`
  font-size: 30px;
  line-height: 36px;
  color: #3f3a3a;
  margin-right: 4px;

  @media screen and (max-width: 1279px) {
    font-size: 30px;
    line-height: 36px;
    margin-right: 4px;
    color: #3f3a3a;
  }
`;

const CheckoutNumberFreight = styled.p`
  font-size: 30px;
  line-height: 36px;
  margin-right: 2px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    font-size: 30px;
    line-height: 36px;
    margin-right: 2px;
    color: #3f3a3a;
  }
`;

const CheckoutSpilt = styled.div`
  width: 240px;
  border-bottom: 1px solid #3f3a3a;
  margin-bottom: 20px;
`;

const CheckoutButton = styled.button`
  height: 64px;
  width: 100%;
  background-color: #000000;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 4px;
  color: #ffffff;
  margin-top: 30px;
  cursor: ${(prop) => (prop.disabled ? "auto" : "pointer")};

  @media screen and (max-width: 1279px) {
    font-size: 16px;
    letter-spacing: 3.2px;
    margin-top: 16px;
    height: 44px;
  }
`;

export default Checkout;
