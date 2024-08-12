import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Noto Sans TC'; /* 確保字體已引入 */
    /* outline: 1px solid black; */
  }
  body{
    margin: 0px;
  }

  /* 鏈接和輸入框樣式 */
  a,
  input {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    box-shadow: none;
    font: inherit;
    color: inherit;
    text-align: inherit;
    cursor: pointer;
    text-decoration: none;
  }
  p{
    margin: 0px;
  }

  /* 按鈕樣式 */
  button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    cursor: pointer;
    outline: none; /* 可選，移除按鈕的輪廓 */
  }

  /* 無序列表樣式 */
  ul {
    list-style-type: none; 
    padding: 0;
    margin: 0;
    display: flex;
  }

  /* 圖片樣式 */
  img {
    display: block; 
    max-width: 100%;
    height: auto;
  }
`;

export default GlobalStyle;
