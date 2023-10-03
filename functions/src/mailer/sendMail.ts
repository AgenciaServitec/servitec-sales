import mustache from "mustache";
import nodemailer from "nodemailer";
import { environmentConfig } from "../config";
import Mail from "nodemailer/lib/mailer";

const { host, from, pass, user, port } = environmentConfig["node-mailer"];

export const sendMail = async (mailOptions: Mail.Options): Promise<void> => {
  const transporter = nodemailer.createTransport({
    port,
    host,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({ ...mailOptions, from });
};

export const html = (template: string, view: unknown): string =>
  mustache.render(template, view);
