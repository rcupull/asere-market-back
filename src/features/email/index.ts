import nodemailer from "nodemailer";

const user = "aseremarket@gmail.com";
const pass = "apxb pupn lhex catp";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

const getValidationCodeRoute = (code: string): string => {
  return `http://local.community.com:5173/validate/${code}`;
};

export const sendValidationCodeToEmail = ({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: user,
        to: email,
        subject: "Verificación de la cuenta",
        text: `No debe responde a este correo. De click al siguiente link para validar su cuenta en Asere Market ${getValidationCodeRoute(
          code
        )}`,
      },
      (error: any, info: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      }
    );
  });
};
