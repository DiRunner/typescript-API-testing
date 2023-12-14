import * as supertest from "supertest";
const request = supertest("https://jsonplaceholder.typicode.com");

describe("POC Test", () => {
  describe("GET request", () => {
    it("GET /posts", async () => {
      const res = await request.get("/posts");
      expect(res.statusCode).toBe(200);
      expect(res.body[0].id).toBe(1);
    });

    it("GET /comments with query params", async () => {
      //const res = await request.get('/comments?postId=1')
      const res = await request
        .get("/comments")
        .query({ postId: 1, limit: 10 });

      expect(res.body[0].postId).toBe(1);
    });
  });

  describe("POST /posts", () => {
    it("POST /posts", async () => {
      const data = {
        title: "My fav animes",
        body: "Naruto, One Piece, Hunter X Hunter",
        userId: 1,
      };

      const res = await request.post("/posts").send(data);

      expect(res.body.title).toBe(data.title);
    });
  });

  describe("PUT /post", () => {
    it("PUT /posts", async () => {
      const data = {
        title: "Updated title",
        body: "Updated boty...",
        userId: 5,
      };

      const getRes = await request.get("/posts/1");
      const beforeTitle = getRes.body.title;

      const res = await request.put("/posts/1").send(data);

      expect(res.body.title).toBe(data.title);
      expect(res.body.title).not.toBe(beforeTitle);

      // We could implement another GET here to veify the title is expected
      // we don't do that with this sample API because it doesn't actually save the changes
    });
  });

  describe("PATCH /post", () => {
    it("PATCH /post", async () => {
      const data = {
        title: "Updated title",
      };

      const getRes = await request.get("/posts/1");
      const beforeTitle = getRes.body.title;

      const res = await request.patch("/posts/1").send(data);

      expect(res.body.title).toBe(data.title);
      expect(res.body.title).not.toBe(beforeTitle);

      // We could implement another GET here to veify the title is expected
      // we don't do that with this sample API because it doesn't actually save the changes
    });
  });

  describe("DELETE /post", () => {
    it("DELETE /post", async () => {
      const res = await request.delete("/posts/1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({});
    });
  });
});
