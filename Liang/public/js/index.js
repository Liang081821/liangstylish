// 額外功能:計時器
let isTimedOut = false;
const timeout = setTimeout(() => {
  isTimedOut = true;
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  const errorMessage = document.getElementById("error-message");
  console.log("時間到，你還沒 fetch 到東西！");
  errorMessage.style.display = "block";
  container.style.display = "none";
}, 3000);

// 額外功能:斷網路
function showError() {
  console.log("抱歉，您斷網路了");
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "block";
  const homepage = document.getElementById("products-container");
  homepage.style.display = "none";
}
window.addEventListener("offline", showError);

document.addEventListener("DOMContentLoaded", () => {
  // 第 0 層（資料來源）：手機輸入框樣式設定
  const searchIcon = document.querySelector(".mobile-search-icon");
  searchIcon.addEventListener("click", () => {
    const parent = searchIcon.parentElement; //獲取 img 的父層元素
    const logo = document.querySelector(".logo");
    const category = document.querySelector(".category");
    const mobilesearchlogo = document.querySelector(".mobile-search-icon");

    logo.classList.add("adjusted-logo-display"); //使用者點擊時，將手機版的元素新增額外樣式變化
    mobilesearchlogo.classList.add("adjusted-display");
    category.classList.add("adjusted-margin");

    parent.insertAdjacentHTML(
      //插入 HTML 字符串到父層的末尾
      "beforeend",
      `
      <div class="search-box">
        <input type="text" placeholder="西裝" class="search-input searchInput">
        <button class="close-btn">X</button>
      </div>
    `
    );
    //關閉按鈕
    const closeButton = document.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
      const searchBox = document.querySelector(".search-box");
      if (searchBox) {
        searchBox.remove(); //移除 search-box
      }
      //把原本加上去的額外樣式移除，確保回去不會跑版，且這些樣式寫在 media query中，如果沒有按 close button 直接拉回去也會消失
      logo.classList.remove("adjusted-logo-display");
      mobilesearchlogo.classList.remove("adjusted-display");
      category.classList.remove("adjusted-margin");
    });
  });
  //第 0 層（資料來源）：偵測使用者輸入內容
  document.addEventListener("keydown", (event) => {
    if (event.target.matches(".searchInput") && event.keyCode === 13) {
      // 检查 Enter 键
      const keyword = event.target.value;
      const url = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(
        keyword
      )}`;
      updateURL(null, keyword);
      container.innerHTML = "";
      console.log(`使用者輸入 ${keyword}`);
      fetchProductsByCategory(url);
    }
  });

  const categoryLinks = document.querySelectorAll(".category a");
  const container = document.getElementById("products-container");
  const logo = document.querySelector(".logo");

  //合併兩個 addeventlistener
  function navagation(event) {
    event.preventDefault();
    const target = event.target; //觸發事件的 dom 元素
    let category;
    let url;
    if (target === logo) {
      category = "https://api.appworks-school.tw/api/1.0/products/all";
      url = "";
    } else {
      url = new URL(target.href).searchParams.get("tag");
      category = `https://api.appworks-school.tw/api/1.0/products/${url}`;
    }
    container.innerHTML = "";
    console.log(`我點擊了${url || "logo"}`);
    updateURL(url);
    fetchProductsByCategory(category);
  }

  logo.addEventListener("click", navagation); // 自動將事件對象傳給指定的事件函數
  categoryLinks.forEach((link) => {
    link.addEventListener("click", navagation);
  });

  // 第 1 層：更新網址
  function updateURL(category, keyword) {
    let newURL;
    if (keyword) {
      newURL = `${window.location.origin}${window.location.pathname}?keyword=${keyword}`;
    } else if (category) {
      newURL = `${window.location.origin}${window.location.pathname}?tag=${category}`;
    } else {
      newURL = `${window.location.origin}${window.location.pathname}`;
    }
    console.log(`正在更新網址中: ${newURL}`);
    window.history.pushState({ path: newURL }, "", newURL);
  }

  // 第 2 層：根據不同 URL 請求 API
  let isLoading = false; // 防止重複加載，也可以省略
  let nextPaging = null; // 保存下一頁的 URL
  function fetchProductsByCategory(url) {
    if (isLoading) return; // 如果正在加載，則返回
    isLoading = true;

    console.log(`Fetching data from: ${url}`);
    const container = document.getElementById("products-container");

    const loadingGif = document.createElement("img");
    loadingGif.id = "loading-gif";
    loadingGif.src = "../images/loading.gif";
    container.appendChild(loadingGif);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (isTimedOut) return;
        clearTimeout(timeout);

        const isNextPagingRequest = nextPaging && url === nextPaging;
        if (!isNextPagingRequest) {
          console.log("頁面滾動回上");
          window.scrollTo(0, 0);
        }

        nextPaging = data.next_paging
          ? `${url.split("?")[0]}?paging=${data.next_paging}`
          : null;

        if (data.data && Array.isArray(data.data) && data.data.length === 0) {
          container.innerHTML =
            "<h1>Can't find your product, please use another keyword.</h1>";
          isLoading = false;
          return;
        }

        const products = data.data;
        if (products && Array.isArray(products)) {
          const imageLoadPromises = products.map((product) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = product.main_image;
              img.onload = resolve;
              img.onerror = resolve;
            });
          });

          const productElements = products.map((product) => {
            return createProductElement(product);
          });

          Promise.all(imageLoadPromises)
            .then(() => {
              productElements.forEach((elem) => {
                container.appendChild(elem);
              });

              const loadingGifElement = document.getElementById("loading-gif");
              if (loadingGifElement) {
                loadingGifElement.parentElement.removeChild(loadingGifElement);
              }
            })
            .catch(() => {
              console.error("Some images failed to load.");
            })
            .finally(() => {
              if (nextPaging) {
                window.addEventListener("scroll", handleScroll);
              } else {
                window.removeEventListener("scroll", handleScroll);
              }
              isLoading = false;
            });
        } else {
          console.error("No products found");
        }
      });
  }

  function createProductElement(product) {
    const productDiv = document.createElement("div");
    productDiv.className = "product";

    const link = document.createElement("a");
    link.href = `/product?id=${product.id}`;

    const img = document.createElement("img");
    img.src = product.main_image;
    img.alt = product.title;
    img.className = "product-img";

    link.appendChild(img);
    productDiv.appendChild(link);

    const colorDiv = document.createElement("div");
    colorDiv.className = "product-color";
    if (product.colors && Array.isArray(product.colors)) {
      product.colors.forEach((color) => {
        const colorBlock = document.createElement("div");
        colorBlock.className = "color";
        colorBlock.style.backgroundColor = `#${color.code}`;
        colorDiv.appendChild(colorBlock);
      });
    }
    productDiv.appendChild(colorDiv);

    const textDiv = document.createElement("div");
    textDiv.className = "product-text";
    textDiv.textContent = product.title;
    productDiv.appendChild(textDiv);

    const priceDiv = document.createElement("div");
    priceDiv.className = "product-price";
    priceDiv.textContent = `TWD.${product.price}`;
    productDiv.appendChild(priceDiv);

    return productDiv;
  }

  // 第 3 層（功能處理）：infinite scrolling
  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      window.removeEventListener("scroll", handleScroll); // 移除滾動事件以防重複加載
      if (nextPaging) {
        console.log("加載下一頁中");
        fetchProductsByCategory(nextPaging);
      }
    }
  }

  // 第 3 層（功能處理）：刷新頁面
  function loadInitialData() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("keyword");
    const category = urlParams.get("tag");
    let url;
    if (keyword) {
      url = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${keyword}`;
    } else if (category) {
      const baseUrl = "https://api.appworks-school.tw/api/1.0/products/";
      url = `${baseUrl}${category || "all"}`;
    } else {
      url = "https://api.appworks-school.tw/api/1.0/products/all";
    }
    console.log("功能處理：頁面重新加載");
    fetchProductsByCategory(url);
  }
  loadInitialData(); //每次刷新頁面會自動跑來這

  //  第 3 層（功能處理）：瀏覽器倒退
  window.addEventListener("popstate", (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("keyword");
    const category = urlParams.get("tag");
    let url;
    if (keyword) {
      url = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${keyword}`;
    } else if (category) {
      const baseUrl = "https://api.appworks-school.tw/api/1.0/products/";
      url = `${baseUrl}${category || "all"}`;
    } else {
      url = "https://api.appworks-school.tw/api/1.0/products/all";
    }
    console.log("State:", event.state);
    console.log("Current URL:", window.location.href);
    console.log("處理倒退按鈕");
    container.innerHTML = "";
    fetchProductsByCategory(url);
  });

  //carousel
  function fetchCarousel() {
    fetch("https://api.appworks-school.tw/api/1.0/marketing/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          console.log(data);
        }

        const browserhomepage = document.getElementById("browser-homepage");
        const bannerDiv = document.createElement("div");
        bannerDiv.className = "banner-container";

        const bannerimg = document.createElement("img");
        bannerimg.className = "banner-photo";
        bannerimg.id = "Bannerimg";

        const bannerContainer = document.createElement("div");
        bannerContainer.className = "banner-wrapper";

        const bannerText = document.createElement("div");
        bannerText.className = "banner-text";

        const textabove = document.createElement("div");
        textabove.className = "text-above";
        textabove.id = "Textabove";

        const textbelow = document.createElement("div");
        textbelow.className = "text-below";
        textbelow.id = "Textbelow";

        const bannerDotContainer = document.createElement("div");
        bannerDotContainer.className = "banner-dot-container";

        const dots = [];
        for (let i = 0; i < data.data.length; i++) {
          const bannerDot = document.createElement("div");
          bannerDot.className = "banner-dot-white";
          bannerDot.addEventListener("click", () => {
            currentIndex = i;
            updateImage();
            startTiming();
          });

          bannerDotContainer.appendChild(bannerDot);
          dots.push(bannerDot);
        }

        bannerText.appendChild(textabove);
        bannerText.appendChild(textbelow);
        bannerContainer.appendChild(bannerText);
        bannerDiv.appendChild(bannerDotContainer);

        const link = document.createElement("a");
        link.id = "BannerLink"; // 添加一個ID以便後續更新鏈接
        bannerDiv.appendChild(link);

        link.appendChild(bannerimg);
        link.appendChild(bannerContainer);

        browserhomepage.appendChild(bannerDiv);

        let currentIndex = 0;

        function updateImage() {
          const imageUrl = data.data[currentIndex].picture;
          const productId = data.data[currentIndex].product_id; // 獲取當前產品ID
          let story = data.data[currentIndex].story;

          const parts = story.split(/\r\n/);
          const textAbove = parts.slice(0, 3).join("<br>");
          const textBelow = parts.slice(3).join("<br>"); // 確保下面的文本正確顯示

          bannerDiv.style.opacity = "0";
          bannerDiv.style.transition = "opacity 1s ease-in-out";

          bannerimg.src = imageUrl;
          link.href = `/product?id=${productId}`; // 更新鏈接的href

          bannerimg.onload = () => {
            textabove.innerHTML = `<div>${textAbove}</div>`;
            textbelow.innerHTML = `<div>${textBelow}</div>`;

            setTimeout(() => {
              bannerDiv.style.opacity = "1";
            }, 100);

            dots.forEach((dot, index) => {
              if (index === currentIndex) {
                dot.className = "banner-dot-red";
                console.log(`Dot ${index} turned red`);
              } else {
                dot.className = "banner-dot-white";
              }
            });
          };
        }

        updateImage();
        let timing;
        startTiming();

        function startTiming() {
          if (timing) {
            clearInterval(timing);
          }
          console.log("啟動我了嗎");
          // 設置新的定時器
          timing = setInterval(() => {
            currentIndex = (currentIndex + 1) % data.data.length;
            updateImage();
          }, 5000);
        }
      });
  }
  fetchCarousel();

  const getTotalQuantity = () => {
    const storedData = JSON.parse(localStorage.getItem(`CartItem`));
    let totalQuantity = storedData.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);

    console.log(`總數量: ${totalQuantity}`);
    const browserQuantity = document.getElementById("browser-quantity");
    browserQuantity.innerHTML = totalQuantity;
    const mobileQuantity = document.getElementById("mobile-quantity");
    mobileQuantity.innerHTML = totalQuantity;
    return totalStroageQuantity;
  };
  getTotalQuantity();
});
