import supertest from "supertest";
import { app } from "../../server";
import { generateToken, setAnyString } from "../../utils/test-utils";
import { UserModel } from "../../schemas/user";
import { Image } from "../../types/general";
import { User } from "../../types/user";

describe("/user/:userId", () => {
  it("GET", async () => {
    const dummy1 = new UserModel({
      name: "user1",
      email: "user1@gmail.com",
      password: "password_123",
      passwordVerbose: "password_123",
    });

    await dummy1.save();

    await supertest(app)
      .get(`/user/${dummy1._id}`)
      .auth(generateToken(dummy1._id), { type: "bearer" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchInlineSnapshot(
          setAnyString<User>(
            "_id",
            "createdAt",
            "payment.planHistory.0.dateOfPurchase"
          ),
          `
{
  "__v": 0,
  "_id": Anything,
  "createdAt": Anything,
  "email": "user1@gmail.com",
  "name": "user1",
  "payment": {
    "planHistory": [
      {
        "dateOfPurchase": Anything,
        "planType": "free",
        "status": "current",
        "trialMode": true,
      },
    ],
  },
  "profileImage": null,
  "role": "user",
  "validated": false,
}
`
        );
      });
  });

  it("PUT", async () => {
    const dummy1 = new UserModel({
      name: "user1",
      email: "user1@gmail.com",
      password: "password_123",
      passwordVerbose: "password_123",
    });

    await dummy1.save();

    const profileImage: Image = {
      height: 300,
      width: 300,
      src: "http://link-src.com/image.png",
    };

    await supertest(app)
      .put(`/user/${dummy1._id}`)
      .send({ profileImage })
      .auth(generateToken(dummy1._id), { type: "bearer" })
      .expect(200);

    await supertest(app)
      .get(`/user/${dummy1._id}`)
      .auth(generateToken(dummy1._id), { type: "bearer" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchInlineSnapshot(
          setAnyString<User>(
            "_id",
            "createdAt",
            "payment.planHistory.0.dateOfPurchase"
          ),
          `
{
  "__v": 0,
  "_id": Anything,
  "createdAt": Anything,
  "email": "user1@gmail.com",
  "name": "user1",
  "payment": {
    "planHistory": [
      {
        "dateOfPurchase": Anything,
        "planType": "free",
        "status": "current",
        "trialMode": true,
      },
    ],
  },
  "profileImage": {
    "height": 300,
    "src": "http://link-src.com/image.png",
    "width": 300,
  },
  "role": "user",
  "validated": false,
}
`
        );
      });
  });
});
