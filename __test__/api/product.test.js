const _ = require("lodash");
const path = require("path");
const request = require("supertest");

const db = require("../../models");
const cloudinary = require("../../utils/cloudinary");
const productApi = require("../../api/product");
const generalHelper = require("../../helpers/generalHelper");
const productListData = require("./fixtures/product/productList.json");
const productDetailData = require("./fixtures/product/productDetail.json");

let apiUrl;

let mockAllProduct;
let mockProductDetail;

let getAllProduct;
let getProductDetail;
let createProduct;
let updateProduct;
let deleteProduct;

let bearerTokenAdmin =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6MywiaWF0IjoxNzA5MjgwODY2LCJleHAiOjE3MTAxNDQ4NjZ9.Do2ggD3ZasJCvPgi7Iq6_81-07VW441FfwdyS6OMvKk";
let bearerTokenUser =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJmYXJyYXMiLCJlbWFpbCI6ImZhcnJhc0BnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE3MDkyODEwMjQsImV4cCI6MTcxMDE0NTAyNH0.hMrqkFlwmLrFzerC70X4pKNVRS-OYtyxyBtlOqicICM";
let bearerTokenDoctor =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJidWRpeWFudG8iLCJlbWFpbCI6ImJ1ZGl5YW50b0BnbWFpbC5jb20iLCJyb2xlIjoyLCJpYXQiOjE3MDkyODEwMDAsImV4cCI6MTcxMDE0NTAwMH0.pH1XrR0cnSoXe2CcOwPXI5He998Q5D-CSXxM906F_NY";

describe("Product", () => {
  beforeAll(() => {
    apiUrl = "/product";
    mockUploadToCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    server = generalHelper.createTestServer("/product", productApi);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("GET Product List", () => {
    beforeEach(() => {
      mockAllProduct = _.cloneDeep(productListData);
      getAllProduct = jest.spyOn(db.Product, "findAndCountAll");
    });

    test("Should Return 200: GET All Product Success", async () => {
      getAllProduct.mockResolvedValue(mockAllProduct);

      await request(server)
        .get(apiUrl)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.message).toBe("Successfully get data");
          expect(res.body.data.rows.length).toBe(9);
        });
    });
  });

  describe("GET Product Detail", () => {
    beforeEach(() => {
      mockProductDetail = _.cloneDeep(productDetailData);
      getProductDetail = jest.spyOn(db.Product, "findOne");
    });

    test("Should Return 200: GET Product Detail for Albusmin", async () => {
      getProductDetail.mockResolvedValue(mockProductDetail);

      await request(server)
        .get(`${apiUrl}/15`)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.message).toBe("Successfully get data");
          expect(res.body.data.id).toBe(15);
        });
    });

    test("Should Return 404: GET Product Detail Not Found", async () => {
      getProductDetail.mockResolvedValue(null);

      await request(server)
        .get(`${apiUrl}/1234567890`)
        .expect(404)
        .then((res) => expect(res.body.error).toBe("Not Found"));
    });
  });

  describe("POST Create Product", () => {
    beforeEach(() => {
      apiUrl = "/product/create";
      imageUrl = path.join(__dirname, "fixtures/product/tolakangin.jpg");
      payload = {
        name: "Tolak Angin",
        price: 4000,
        description: "obat masuk angin",
        concern: "jangan konsumsi jika alergi terhadap bahan baku produk",
        consumption: "Konsumsi secukupnya",
        packaging: "per Sachet",
        manufacture: "Sido Muncul",
        category: "Obat Masuk Angin",
        stock: 10,
      };
      createProduct = jest.spyOn(db.Product, "create");
    });

    test("Should Return 201: POST Create Product Success", async () => {
      createProduct.mockResolvedValue("Success");
      mockUploadToCloudinary.mockResolvedValue({
        url: "/example-url/image.jpg",
      });

      await request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenAdmin)
        .field("name", payload.name)
        .field("price", payload.price)
        .field("description", payload.description)
        .field("concern", payload.concern)
        .field("consumption", payload.consumption)
        .field("packaging", payload.packaging)
        .field("manufacture", payload.manufacture)
        .attach("imageUrl", imageUrl)
        .field("category", payload.category)
        .field("stock", payload.stock)
        .expect(201)
        .then((res) => {
          expect(res.body.data).toBeTruthy();
        });
    });

    test("Should Return 400: POST Create Product Failed Because of Empty Payload", async () => {
      createProduct.mockResolvedValue("Success");

      await request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenAdmin)
        .send({})
        .expect(400)
        .then((res) => expect(res.body.error).toBe("Bad Request"));
    });

    test("Should Return 401: Unauthorized", async () => {
      createProduct.mockResolvedValue("Success");

      await request(server)
        .post(`${apiUrl}`)
        .field("name", payload.name)
        .field("price", payload.price)
        .field("description", payload.description)
        .field("concern", payload.concern)
        .field("consumption", payload.consumption)
        .field("packaging", payload.packaging)
        .field("manufacture", payload.manufacture)
        .attach("imageUrl", imageUrl)
        .field("category", payload.category)
        .field("stock", payload.stock)
        .expect(401)
        .then((res) => {
          expect(res.body.error).toBe("Unauthorized");
        });
    });

    test("Should Return 403: Forbidden", async () => {
      createProduct.mockResolvedValue("Success");

      await request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenUser)
        .field("name", payload.name)
        .field("price", payload.price)
        .field("description", payload.description)
        .field("concern", payload.concern)
        .field("consumption", payload.consumption)
        .field("packaging", payload.packaging)
        .field("manufacture", payload.manufacture)
        .attach("imageUrl", imageUrl)
        .field("category", payload.category)
        .field("stock", payload.stock)
        .expect(403)
        .then((res) => {
          expect(res.body.error).toBe("Forbidden");
        });
    });
  });

  describe("PUT Update Product", () => {
    beforeEach(() => {
      apiUrl = "/product/update";
      imageUrl = path.join(__dirname, "fixtures/product/tolakangin.jpg");
      payload = {
        name: "Tolak Angin",
        price: 4000,
        description: "obat masuk angin",
        concern: "jangan konsumsi jika alergi terhadap bahan baku produk",
        consumption: "Konsumsi secukupnya",
        packaging: "per Sachet",
        manufacture: "Sido Muncul",
        category: "Obat Masuk Angin",
        stock: 10,
      };

      mockProductDetail = _.cloneDeep(productDetailData);
      updateProduct = jest.spyOn(db.Product, "update");
    });

    test("Should Return 201: PUT Update Product Success", async () => {
      updateProduct.mockResolvedValue("Success");
      mockUploadToCloudinary.mockResolvedValue({
        url: "/example-url/image.jpg",
      });

      await request(server)
        .put(`${apiUrl}/14`)
        .set("Authorization", bearerTokenAdmin)
        .field("name", payload.name)
        .field("price", payload.price)
        .field("description", payload.description)
        .field("concern", payload.concern)
        .field("consumption", payload.consumption)
        .field("packaging", payload.packaging)
        .field("manufacture", payload.manufacture)
        .attach("imageUrl", imageUrl)
        .field("category", payload.category)
        .field("stock", payload.stock)
        .expect(200)
        .then((res) => {
          expect(res.body.message).toBe("Product successfully updated");
          expect(res.body.data).toBeTruthy();
        });
    });
  });

  describe("DELETE Delete Product", () => {
    beforeEach(() => {
      apiUrl = "/product/delete";
      deleteProduct = jest.spyOn(db.Product, "destroy");
    });

    test("Should Return 200: DELETE Delete Product Success", async () => {
      deleteProduct.mockResolvedValue("Success");
      mockUploadToCloudinary.mockResolvedValue({
        url: "/example-url/image.jpg",
      });

      await request(server)
        .delete(`${apiUrl}/15`)
        .set("Authorization", bearerTokenAdmin)
        .expect(200)
        .then((res) => {
          console.log(res.body);
          expect(res.body.message).toBe("Product Successfully Deleted");
          expect(res.body.data).toBeTruthy();
        });
    });
  });
});
