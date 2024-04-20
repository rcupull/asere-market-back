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

export const sendEmail = ({
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
        text: `No debe responde a este correo. Ingrese el siguiente código de verificación ${code} en la aplicación.`,
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
