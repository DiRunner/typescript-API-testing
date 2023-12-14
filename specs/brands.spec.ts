import controller from "../controller/brand.controller";

describe("BRANDS Test", () => {
  describe("Fetch brands", () => {
    it("GET /brands", async () => {
      const res = await controller.getBrands();
      // My way
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
        })
      );

      //The tutor way
      expect(Object.keys(res.body[0])).toEqual(["_id", "name"]);
    });
  });

  describe("Create brands", () => {
    let postBrand;
    const data = {
      name: "Test Brand " + Math.floor(Math.random() * 100000),
      description: "Test Brand Description",
    };
    beforeAll(async () => {
      postBrand = await controller.postBrands(data);
    });

    afterAll(async () => {
      await controller.deleteBrand(postBrand.body._id);
    });

    it("POST /brands", async () => {
      expect(postBrand.statusCode).toBe(200);
      expect(postBrand.body.name).toEqual(data.name);
      expect(Object.keys(postBrand.body)).toContain("createdAt");
      // Another way
      expect(postBrand.body).toHaveProperty("createdAt");
    });

    it("Schema Verification - Name is a mandatory field", async () => {
      const data = {
        name: "",
        description: "Test Brand Description",
      };
      const res = await controller.postBrands(data);

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toEqual("Name is required");
    });

    it("Schema Verification - Min char length for name > 1", async () => {
      const data = {
        name: "a",
        description: "Test Brand Description",
      };
      const res = await controller.postBrands(data);

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toEqual("Brand name is too short");
    });

    it("Business Logic - Duplicated brand entries not allowed", async () => {
      // Second request
      const res2 = await controller.postBrands(data);
      expect(res2.statusCode).toBe(422);
      expect(res2.body.error).toContain(" already exists");
    });
  });

  describe("Fetch Individual Brand", () => {
    describe("GET /brand/:id", () => {
      let postBrand;
      beforeAll(async () => {
        const data = {
          name: "Test Brand " + Math.floor(Math.random() * 100000),
          description: "Test Brand Description",
        };
        postBrand = await controller.postBrands(data);
      });

      afterAll(async () => {
        await controller.deleteBrand(postBrand.body._id);
      });

      it("Business Logic - GET /brands/invalid_id should throw 404", async () => {
        const res = await controller.getBrandById("123af0632517bebb4b5cb587");
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toEqual("Brand not found.");
      });

      it("GET /brands:id", async () => {
        const res = await controller.getBrandById(postBrand.body._id);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toEqual(postBrand.body._id);
        expect(res.body.name).toEqual(postBrand.body.name);
      });
    });
  });

  describe("Update Brands", () => {
    let postBrand;
    const data = {
      name: "Test Brand " + Math.floor(Math.random() * 100000),
      description: "Test Brand Description",
    };

    beforeAll(async () => {
      postBrand = await controller.postBrands(data);
    });

    afterAll(async () => {
      await controller.deleteBrand(postBrand.body._id);
    });

    it("PUT /brands:id", async () => {
      const res = await controller.putBrand(postBrand.body._id, data);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
      expect(res.body).toHaveProperty("updatedAt");
    });

    it("Schema Verification - Brand name > 30 chars is not accepted", async () => {
      const Data = {
        name: "Very long brand name 1234567890",
      };

      const res = await controller.putBrand(postBrand.body._id, Data);
      expect(res.statusCode).toBe(422);
      expect(res.body.error).toEqual("Brand name is too long");
    });

    it("Schema Verification - Brand description must be a string", async () => {
      const Data = {
        name: "Test Brand " + Math.floor(Math.random() * 100000),
        description: 123,
      };

      const res = await controller.putBrand(postBrand.body._id, Data);

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toEqual("Brand description must be a string");
    });

    it("Schema Verification - Throw error when update invalid brand", async () => {
      const Data = {
        name: "Test Brand",
      };

      const res = await controller.putBrand("656123c00c8c9043918eb5c9", Data);
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toEqual("Brand not found.");
    });
  });

  describe("DELETE Brands", () => {
    let postBrand;
    const data = {
      name: "Test Brand " + Math.floor(Math.random() * 100000),
      description: "Test Brand Description",
    };

    beforeAll(async () => {
      postBrand = await controller.postBrands(data);
    });

    it("DELETE /brands:id", async () => {
      let res = await controller.deleteBrand(postBrand.body._id);

      expect(res.statusCode).toBe(200);
    });

    it("Schema Verification - Throw error when delete invalid brand", async () => {
      const res = await controller.deleteBrand(postBrand.body._id);
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toEqual("Brand not found.");
    });
  });
});
