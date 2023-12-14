import controller from "../controller/upload.controller";

describe("Upload File", () => {
  it("POST /upload/single", async () => {
    const res = await controller.postUploadSingle("data/milei.jpg");
    expect(res.body.filename).toEqual("milei.jpg");
  });

  it("POST /upload/multiple", async () => {
    const files = [
      "data/milei.jpg",
      "data/spider.jpeg",
      "data/lambo.jpeg",
      "data/cerati.jpeg",
    ];
    const res = await controller.postUploadMultiple(files);
    console.log(res.body);
    expect(res.body.length).toBe(4);
    expect(res.body[0].filename).toEqual("milei.jpg");
    expect(res.body[1].filename).toEqual("spider.jpeg");
    expect(res.body[2].filename).toEqual("lambo.jpeg");
    expect(res.body[3].filename).toEqual("cerati.jpeg");
  });
});
