## **쇼핑몰 사이트 만들기**

---

### 상품 업로드 페이지 만들기

1. 비어있는 업로드 페이지를 생성한다.

   ```javascript
   import React from "react";

   function UploadProductPage() {
       return (
           <div>
               UploadProductPage
           </div>;
       )
   }

   export default UploadProductPage;
   ```

2. 업로드 페이지 Route를 만든다.
   ```javascript
   // client/App.js
   ...
   import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
   ...
   <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
   ...
   ```
3. 업로드 페이지 탭을 만든다.
   ```javascript
   // client/src/components/views/NavBar/Sections/RightMenu.js
   ...
   if (user.userData && !user.userData.isAuth) {
     return (
       <Menu mode={props.mode}>
         <Menu.Item key="mail">
           <a href="/login">Signin</a>
         </Menu.Item>
         <Menu.Item key="app">
           <a href="/register">Signup</a>
         </Menu.Item>
       </Menu>
     );
   } else {
     return (
       <Menu mode={props.mode}>
         <Menu.Item key="upload">
           <a href="/product/upload">Upload</a>
         </Menu.Item>
         <Menu.Item key="logout">
           <a onClick={logoutHandler}>Logout</a>
         </Menu.Item>
       </Menu>
     );
   }
   ```
4. Drop Zone을 제외한 From을 만든다.

   ```javascript
   // client/src/components/views/UploadProductPage/UploadProductPage.js
   import React from "react";
   import { Typography, Button, Form, Input } from "antd";

   const { Title } = Typography;
   const { TextArea } = Input;

   function UploadProductPage() {
     return (
       <div
         style={{
           maxWidth: "700px",
           margin: "2rem auth",
         }}
       >
         <div style={{ textAlign: "center", marginBottom: "2rem" }}>
           <Title level={2}>여행 상품 업로드</Title>
         </div>

         <Form>
           {/* DropZone */}
           <br />
           <br />
           <label>이름</label>
           <Input />
           <br />
           <br />
           <label>설명</label>
           <TextArea />
           <br />
           <br />
           <label>가격($)</label>
           <Input />
           <br />
           <br />
           <select>
             <option></option>
           </select>
           <br />
           <br />
           <Button>확인</Button>
         </Form>
       </div>
     );
   }

   export default UploadProductPage;
   ```

   - 파일 업로드만을 위한 컴포넌트를 만든다.

5. 모든 INPUT을 위한 onChange Function을 만든다.

- onChange 이벤트가 일어날 때 마다 value값을 바꾸려면 state를 사용한다.

  ```javascript
  // client/src/components/views/UploadProductPage/UploadProductPage.js
  import React, { useState } from "react";
  import { Typography, Button, Form, Input } from "antd";

  const { TextArea } = Input;

  const Continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" },
  ];

  function UploadProductPage() {
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState(0);
    const [Continent, setContinent] = useState(1);
    const [Images, setImages] = useState([]);

    const titleChangeHandler = (event) => {
      setTitle(event.currentTarget.value);
    };

    const descriptionChangeHandler = (event) => {
      setDescription(event.currentTarget.value);
    };

    const priceChangeHandler = (event) => {
      setPrice(event.currentTarget.value);
    };

    const continentChangeHandler = (event) => {
      setContinent(event.currentTarget.value);
    };

    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "2rem auth",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2>여행 상품 업로드</h2>
        </div>

        <Form>
          {/* DropZone */}
          <br />
          <br />
          <label>이름</label>
          <Input onChange={titleChangeHandler} value={Title} />
          <br />
          <br />
          <label>설명</label>
          <TextArea onChange={descriptionChangeHandler} value={Description} />
          <br />
          <br />
          <label>가격($)</label>
          <Input type="number" onChange={priceChangeHandler} value={Price} />
          <br />
          <br />
          <select onChange={continentChangeHandler} value={Continent}>
            {Continents.map((item) => (
              <option key={item.key} value={Continent}>
                {item.value}
              </option>
            ))}
          </select>
          <br />
          <br />
          <Button>확인</Button>
        </Form>
      </div>
    );
  }

  export default UploadProductPage;
  ```

---

### 파일 업로드 컴포넌트 만들기

1. Utils 폴더 안에 파일 업로드 파일을 만든다.

```javascript
// client/src/components/utils/FileUpload.js
import React from "react";
import Dropzone from "react-dropzone";
import { Icon } from "antd";

function FileUpload() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>
    </div>
  );
}

export default FileUpload;
```

2. Drop-Zone 라이브러리를 다운 받는다.
   - npm i react-dropzone
3. File 업로드 컴포넌트를 위한 UI를 만든다.

```javascript
// client/components/views/UploadProductPage/UploadProductPage.js
...
import FileUpload from "../../utils/FileUpload.js";
...
<FileUpload />
...
```

4. onDrop Function을 만든다.
   - npm i multer

```javascript
// client/components/views/UploadProductPage/UploadProductPage.js
import React, { useState } from "react";
import { Typography, Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload.js";

const { TextArea } = Input;

const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadProductPage() {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);
  const [Images, setImages] = useState([]);

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value);
  };

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value);
  };

  const continentChangeHandler = (event) => {
    setContinent(event.currentTarget.value);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auth",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>여행 상품 업로드</h2>
      </div>

      <Form>
        {/* DropZone */}
        <FileUpload />
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description} />
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" onChange={priceChangeHandler} value={Price} />
        <br />
        <br />
        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map((item) => (
            <option key={item.key} value={Continent}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button>확인</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
```

5. onDelete Function을 만든다.
   - 이미지를 지우려면 state에 담긴 인덱스 0,1,2... 중 삭제하면 된다.

```javascript
// FileUpload.js
...
  const deleteHandler = (image) => {
    const currentIndex = Images.indexOf(image);

    let newImages = [...Images];
    newImages.splice(currentIndex, 1);
    setImages(newImages);
  };
...
```

- 확인 버튼을 누를때 모든 정보를 UploadProductPage에서 백엔드로 보내줘야되는데 FileUpload.js에 이미지 정보가 있다.
  - 부모 컴포넌트인 UploadProductPage에 이미지 정보를 올려줘야 한다.

---

### 상품 업로드 페이지 마무리

1. Product Model을 만든다.

```javascript
// server/models/Product.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.objectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
```

2. Upload File Component를 가져온다.
3. 파일 데이터를 uploadFile 컴포넌트에서 부모 컴포넌트로 업데이트한다.
4. onSubmit Function을 만든다.
5. 모든 정보를 서버로 보낸다.
6. 보내진 정보를 몽고DB에 저장한다.
