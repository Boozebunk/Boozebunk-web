import { join } from "path";

import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import Handlebars from "handlebars";

import { env } from "@boozebunk-trpc/env";

const sesClient = new SESClient({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

const getEmailTemplate = async (
  templateName: string,
  data: Record<string, string>,
): Promise<string> => {
  const templatePath = join(process.cwd(), "src", "templates", `${templateName}.hbs`);

  const templateContent = await Bun.file(templatePath).text();
  const template = Handlebars.compile(templateContent);

  return template(data);
};

export const sendEmail = async (
  recipientEmail: string,
  subject: string,
  templateName: string,
  templateData: Record<string, string>,
) => {
  const htmlContent = await getEmailTemplate(templateName, templateData);

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlContent,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: env.AWS_SES_FROM_EMAIL!,
  });

  try {
    await sesClient.send(command);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
