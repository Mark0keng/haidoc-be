const _ = require("lodash");
const request = require("supertest");

const db = require("../../models");
const productApi = require("../../api/product");
const generalHelper = require("../../helpers/generalHelper");
// const productListData = require("./fixtures/database/productListData.json");
const productDetailData = require("./fixtures/product/productDetail.json");

let apiUrl;

let mockAllProduct;
let mockProductDetail;

let getAllProduct;
let getProductDetail;

describe("Product", () => {
  beforeAll(() => {
    apiUrl = "/product";

    server = generalHelper.createTestServer("/product", productApi);
  });

  afterAll(async () => {
    await server.close();
  });

  // describe("GET Product List", () => {
  //   beforeEach(() => {
  //     mockAllProduct = _.cloneDeep(productListData);
  //     getAllProduct = jest.spyOn(db.Product, "findAll");
  //   });

  //   test("Should Return 200: GET All Product Success", async () => {
  //     getAllProduct.mockResolvedValue(mockAllProduct);

  //     await request(server)
  //       .get(apiUrl)
  //       .expect(200)
  //       .then((res) => expect(res.body.data.length).toBe(3));
  //   });

  //   test("Should Return 404: GET All Product Success But Empty", async () => {
  //     getAllProduct.mockResolvedValue([]);

  //     await request(server)
  //       .get(apiUrl)
  //       .expect(404)
  //       .then((res) => expect(res.body.message).toBe("Product Not Found"));
  //   });
  // });

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
        .then((res) => console.log(res.body, "<<<"));
    });

    test("Should Return 404: GET Product Detail Not Found", async () => {
      getProductDetail.mockResolvedValue(null);

      await request(server)
        .get(`${apiUrl}/1234567890`)
        .expect(404)
        .then((res) => expect(res.body.error).toBe("Not Found"));
    });
  });
});
