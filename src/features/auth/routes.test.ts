import supertest from "supertest";
import { app } from "../../server";
import { setAnyString } from "../../utils/test-utils";
import { UserModel } from "../../schemas/user";
import { User } from "../../types/user";

describe("/auth/sign-in", () => {
  it("POST", async () => {
    const user = new UserModel({
      name: "user1",
      email: "user1@gmail.com",
      password: "password_123",
      passwordVerbose: "password_123",
    });

    await user.save();

    await supertest(app)
      .post(`/auth/sign-in`)
      .send({
        username: "user1@gmail.com",
        password: "password_123",
      })
      .expect(200)
      .then((response) => {
        const { user, token } = response.body;
        expect(token).toBeTruthy();

        expect(user).toMatchInlineSnapshot(
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
});
