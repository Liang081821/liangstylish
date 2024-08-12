import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import LoadingGif from "../../public/images/loading.gif";

const Homepage = ({ getTotalQuantity }) => {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selectedIndex, setselectedIndex] = useState(null);
  const [updatedSizes, setUpdatedSizes] = useState([]);

  //1、抓資料回來
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (productId) {
      axios
        .get(
          `https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`
        )
        .then((response) => {
          setProduct(response.data.data);
          setselectedIndex(productId);
          console.log(`抓取${productId}資料中`);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, []);

  //2、檢查庫存
  const getAvailableStock = () => {
    if (selectedColor && selectedSize && selectedIndex) {
      const stock = product.variants;
      const item = stock.find(
        (s) => s.color_code === selectedColor && s.size === selectedSize
      ); // s 代表每一個 object, stock 是一個 array, item 返回一個 object
      console.log("庫存查詢中");

      const storedData = JSON.parse(localStorage.getItem("CartItem")) || [];
      const storedItem = storedData.find(
        (data) =>
          data.index === selectedIndex &&
          data.colorCode === selectedColor &&
          data.size === selectedSize
      );
      const storedQuantity = storedItem ? storedItem.quantity : 0; // 取得數據

      if (item) {
        const availableStock = item.stock - storedQuantity;
        return availableStock > 0 ? availableStock : 0; // 返回一個 number
      }
    }
    return 0;
  };

  //3、添加商品相關功能
  const maxQuantity = getAvailableStock(); //庫存即時數量
  const isAddDisabled = quantity >= maxQuantity || maxQuantity === 0;
  const handleAdd = () => {
    if (quantity < maxQuantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };
  const handleRemove = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
  };

  //4、size & color相關
  const updateSizes = (color, index) => {
    if (product) {
      const initialSizes = product.sizes.map((size) => {
        const storedData = JSON.parse(localStorage.getItem("CartItem")) || [];
        const storedItem = storedData.find(
          (data) =>
            data.index === index &&
            data.colorCode === color &&
            data.size === size
        );
        const storedQuantity = storedItem ? storedItem.quantity : 0;

        const item = product.variants.find(
          (variant) => variant.color_code === color && variant.size === size
        );
        return {
          size,
          isDisabled: !item || item.stock - storedQuantity <= 0,
        };
      });
      setUpdatedSizes(initialSizes);
    }
  };

  useEffect(() => {
    updateSizes(selectedColor, selectedIndex);
  }, [product, selectedColor, selectedIndex]);

  const handleColorClick = (colorCode) => {
    setSelectedColor(colorCode);
    setSelectedSize(null);
    setQuantity(0);

    updateSizes(colorCode, selectedIndex);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    setQuantity(0);
  };
  const remainingStock = maxQuantity - quantity; //庫存數量-購物框內數量
  const [addToChartDisable, setAddToChartDisable] = useState(true);
  const [cartText, setCartText] = useState("請完成選購");

  //5、購物車功能
  useEffect(() => {
    if (selectedColor && selectedSize && quantity) {
      setAddToChartDisable(false);
      setCartText("加入購物車");
      console.log("可以加入購物車了");
    } else {
      setAddToChartDisable(true);
      setCartText("請完成選購");
      console.log("先完成選購才能按按鈕！");
    }
  }, [selectedColor, selectedSize, quantity]);

  const [totalQuantity, setTotalQuantity] = useState(getTotalQuantity());
  console.log(`Homepage${totalQuantity}`);

  //6、加入 localstorage
  const storeInLocalStorage = () => {
    if (selectedColor && selectedSize && selectedIndex) {
      const colorObject = product.colors.find(
        (color) => color.code === selectedColor
      );
      const storedData = JSON.parse(localStorage.getItem("CartItem")) || [];

      const existingItemIndex = storedData.findIndex(
        (item) =>
          item.index === selectedIndex &&
          item.colorCode === selectedColor &&
          item.size === selectedSize
      );
      const previousQuantity =
        existingItemIndex !== -1 ? storedData[existingItemIndex].quantity : 0;
      const newQuantity = previousQuantity + quantity;

      const stock = product.variants;
      const item = stock.find(
        (s) => s.color_code === selectedColor && s.size === selectedSize
      );

      const updatedItem = {
        quantity: newQuantity,
        price: product.price,
        colorName: colorObject.name,
        colorCode: colorObject.code,
        title: product.title,
        main_image: product.main_image,
        size: selectedSize,
        index: selectedIndex,
        stock: item.stock,
      };

      if (existingItemIndex !== -1) {
        storedData[existingItemIndex] = updatedItem;
      } else {
        storedData.push(updatedItem);
      }
      localStorage.setItem("CartItem", JSON.stringify(storedData)); // 確保 Key 是 'CartItem'
      setTotalQuantity(getTotalQuantity());

      alert("加入購物車成功！");
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(0);
    } else {
      console.log(
        "Missing required data:",
        selectedColor,
        selectedSize,
        selectedIndex
      );
    }
  };

  if (!product) {
    return (
      <LoadingContainer>
        <Loading>跳轉中</Loading>
        <LoadingImg src={LoadingGif}></LoadingImg>
      </LoadingContainer>
    );
  }

  return (
    <Body>
      <Header totalQuantity={totalQuantity}></Header>
      <ProductHomepage>
        <ProductTopBox>
          <ProductImg
            src={`https://api.appworks-school.tw/assets/${product.id}/main.jpg`}
          />
          <ProductBox>
            <ProductName>{product.title}</ProductName>
            <ProductIndex>{product.id}</ProductIndex>
            <ProductPrice>TWD.{product.price}</ProductPrice>
            <ProductSpilt></ProductSpilt>

            <ProductColorContainer>
              <ProductColorText>顏色|</ProductColorText>
              {product.colors.map((color) => (
                <ProductColorBase
                  key={color.code}
                  style={{ backgroundColor: `#${color.code}` }}
                  isSelected={selectedColor === color.code}
                  onClick={() => handleColorClick(color.code)}
                />
              ))}
            </ProductColorContainer>

            <ProductSizeContainer>
              <ProductSizeText>尺寸|</ProductSizeText>
              {updatedSizes.map((sizeData, index) => {
                const isDisabled = sizeData.isDisabled;

                return (
                  <ProductSize
                    key={index}
                    sizeSelected={selectedSize === sizeData.size}
                    onClick={() => handleSizeClick(sizeData.size)}
                    disabled={isDisabled}
                  >
                    {sizeData.size}
                  </ProductSize>
                );
              })}
            </ProductSizeContainer>
            <ProductQuantityContainer>
              <ProductQuantityText>數量|</ProductQuantityText>
              <ProductQuantity>
                <ProductRemoveButton onClick={handleRemove}>
                  -
                </ProductRemoveButton>
                <ProductNumber>{quantity}</ProductNumber>
                <ProductAddButton onClick={handleAdd} disabled={isAddDisabled}>
                  +
                </ProductAddButton>
              </ProductQuantity>

              {selectedColor && selectedSize && (
                <AvaliableQuantity>
                  剩餘數量：{remainingStock}
                </AvaliableQuantity>
              )}
            </ProductQuantityContainer>

            <AddtoCart
              disabled={addToChartDisable}
              onClick={storeInLocalStorage}
            >
              {cartText}
            </AddtoCart>

            <ProductContent>
              <ProductText>實品顏色依單品照為主</ProductText>
              <ProductText></ProductText>
              <ProductText>棉 100%</ProductText>
              <ProductText>厚薄：薄</ProductText>
              <ProductText>彈性：無</ProductText>
              <ProductText></ProductText>
              <ProductText>清洗：手洗，溫水</ProductText>
              <ProductText>產地：中國</ProductText>
            </ProductContent>
          </ProductBox>
        </ProductTopBox>
        <ProductDetailContainer>
          <ProductMoreDetail>更多產品資訊</ProductMoreDetail>
          <ProductDetailSpilt></ProductDetailSpilt>
        </ProductDetailContainer>
        <ProductEnContent>
          O.N.S is all about options, which is why we took our staple polo shirt
          and upgraded it with slubby linen jersey, making it even lighter for
          those who prefer their summer style extra-breezy.
        </ProductEnContent>
        {product.images.map((imageUrl, index) => (
          <ProductDetailImg
            key={index} // 使用索引作為唯一鍵值
            src={imageUrl}
          />
        ))}
      </ProductHomepage>
      <Footer totalQuantity={totalQuantity}></Footer>
    </Body>
  );
};
const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Loading = styled.div`
  font-size: 20px;
`;
const LoadingImg = styled.img`
  width: 150px;
  height: auto;
`;
const Body = styled.div``;

const ProductHomepage = styled.section`
  width: 960px;
  height: auto;
  margin: 205px auto 49px;
  @media screen and (max-width: 1279px) {
    width: auto;
    height: auto;
    margin: 102px auto 32px;
  }
`;
const ProductTopBox = styled.div`
  display: flex;
  column-gap: 40px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    row-gap: 17px;
  }
`;

const ProductImg = styled.img`
  width: 560px;
  height: 746.67px;
  @media screen and (max-width: 1279px) {
    width: auto;
    height: auto;
  }
`;
const ProductBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  @media screen and (max-width: 1279px) {
  }
`;
const ProductName = styled.p`
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 6.4px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    margin-left: 24px;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 4px;
  }
`;
const ProductIndex = styled.div`
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 4px;
  margin-top: 16px;
  color: #bababa;
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 3.2px;
    margin-top: 10px;
    margin-left: 24px;
  }
`;

const ProductPrice = styled.p`
  font-size: 30px;
  line-height: 36px;
  margin-top: 40px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
    line-height: 24px;
    margin-top: 20px;
    margin-left: 24px;
    color: #3f3a3a;
  }
`;
const ProductSpilt = styled.div`
  color: #3f3a3a;
  margin-top: 20px;
  border-bottom: 1px solid #3f3a3a;
  @media screen and (max-width: 1279px) {
    margin: 10px 24px 0px;
  }
`;
const ProductColorContainer = styled.div`
  margin-top: 30px;
  height: 36px;
  color: #3f3a3a;
  display: flex;
  align-items: center;

  @media screen and (max-width: 1279px) {
    margin-left: 24px;
    height: 36px;
  }
`;
const ProductColorText = styled.p`
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 4px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 2.8px;
    margin-right: 0px; //可改
    width: 62px;
  }
`;
const ProductColorBase = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 32px;
  border: 1px solid #d3d3d3;
  cursor: pointer;
  outline: ${(props) =>
    props.isSelected
      ? "5px solid #ffffff"
      : "none"}; //outline 會在 shadow 的上層
  box-shadow: ${(props) =>
    props.isSelected ? "0 0 0 6px rgba(0, 0, 0, 0.3)" : "none"};
  @media screen and (max-width: 1279px) {
    margin-left: 0px;
    margin-right: 27px;
  }
`;
const ProductSizeContainer = styled.div`
  margin-top: 30px;
  height: 36px;
  display: flex;
  @media screen and (max-width: 1279px) {
    margin: 28px 0px 0px 24px;
  }
`;
const ProductSizeText = styled.p`
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 4px;
  margin-right: 4px;
  color: #3f3a3a;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 2.8px;
    margin-right: 0px; //可改
    width: 62px;
  }
`;
const ProductSize = styled.button`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  font-size: 20px;
  line-height: 36px;
  cursor: pointer;
  color: ${(prop) => (prop.sizeSelected ? "#ffffff" : " #000000")};
  background-color: ${(prop) => (prop.sizeSelected ? "#000000" : " #ECECEC")};
  ${(props) =>
    props.disabled &&
    ` background-color: #ECECEC;
      opacity:25%;
      color: #3F3A3A;
      cursor: not-allowed;
    `}
  @media screen and (max-width: 1279px) {
    margin: 0px 15px 0px 0px;
  }
`;
const ProductQuantityContainer = styled.div`
  margin-top: 22px;
  height: 44px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1279px) {
    margin-top: 30px;
  }
`;
const ProductQuantityText = styled.p`
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 4px;
  margin-right: 4px; //可改
  color: #3f3a3a;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const ProductQuantity = styled.div`
  border: 1px solid #979797;
  height: 44px;
  width: 160px;
  margin-left: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 1279px) {
    width: 100%;
    margin: 0px 24px 0px;
    justify-content: space-around;
  }
`;
const ProductRemoveButton = styled.button`
  font-size: 16px;
  line-height: 32px;
  width: 9px;
  margin-left: 15px;
  @media screen and (max-width: 1279px) {
    margin-left: 0px;
  }
`;

const ProductNumber = styled.div`
  font-size: 16px;
  line-height: 32px;
  @media screen and (max-width: 1279px) {
    margin-left: 0px;
  }
`;
const ProductAddButton = styled.button`
  font-size: 16px;
  line-height: 32px;
  width: 9px;
  margin-right: 15px;

  @media screen and (max-width: 1279px) {
    margin-left: 0px;
  }
`;
const AvaliableQuantity = styled.div`
  margin-left: 8px;
  color: #c40a0a;
  @media screen and (max-width: 1279px) {
    margin-left: 0px;
  }
`;

const AddtoCart = styled.button`
  border: 1px solid #979797;
  background-color: #000000;
  color: #ffffff;
  width: 360px;
  height: 64px;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 26px;
  cursor: pointer;
  @media screen and (max-width: 1279px) {
    width: auto;
    height: 44px;
    margin: 10px 24px 0px;
    font-size: 16px;
    line-height: 30px;
    letter-spacing: 3.2px;
  }
`;

const ProductContent = styled.div`
  margin-top: 40px;
  @media screen and (max-width: 1279px) {
    margin: 28px 0px 0px 24px;
  }
`;
const ProductText = styled.p`
  font-size: 20px;
  line-height: 30px;
  height: 30px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 24px;
    height: 24px;
  }
`;
const ProductDetailContainer = styled.div`
  display: flex;
  margin-top: 50.33px;
  align-items: center;
  @media screen and (max-width: 1279px) {
    margin: 28px 0px 0px 24px;
  }
`;

const ProductMoreDetail = styled.p`
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 3px;
  color: #8b572a;
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    line-height: 30px;
    letter-spacing: 3.2px;
    white-space: nowrap;
  }
`;

const ProductDetailSpilt = styled.div`
  border-bottom: 1px solid #3f3a3a;
  width: 761px;
  margin-left: 61px; //加上 letter-space 3px
  @media screen and (max-width: 1279px) {
    width: 100%;
    margin: 0px 24px 0px 35px;
  }
`;
const ProductEnContent = styled.p`
  margin-top: 28px;
  font-size: 20px;
  line-height: 30px;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    line-height: 25px;
    margin: 12px 24px 0px;
  }
`;
const ProductDetailImg = styled.img`
  width: 960px;
  height: 540px;
  margin-top: 30px;
  @media screen and (max-width: 1279px) {
    display: block;
    width: calc(100% - 48px);
    height: auto;
    margin: 20px 24px 0px 24px;
  }
`;

export default Homepage;
