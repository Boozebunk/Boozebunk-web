import { join } from "path";

import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { env } from "@boozebunk-trpc/env";
import Handlebars from "handlebars";

// AWS SDK client setup
const sesClient = new SESClient({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

// A reusable function to read and compile email templates
const getEmailTemplate = async (
  templateName: string,
  data: Record<string, string>,
): Promise<string> => {
  const templatePath = join(process.cwd(), "src", "templates", `${templateName}.hbs`);

  // Use Bun's native file reading
  const templateContent = await Bun.file(templatePath).text();
  const template = Handlebars.compile(templateContent);

  return template(data);
};

// Main function to send emails
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
    Source: env.AWS_SES_FROM_EMAIL!, // Sender Email Address
  });

  try {
    const result = await sesClient.send(command);
    console.log("Email sent successfully. MessageId:", result.MessageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
