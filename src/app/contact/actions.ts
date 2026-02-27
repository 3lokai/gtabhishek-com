"use server";

import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "../../../env";

const resend = new Resend(env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
  honeypot: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().max(0, "Spam detected")
  ),
});

async function sendSlackWebhook(name: string, email: string, message: string) {
  if (!env.SLACK_WEBHOOK_URL) {
    return;
  }

  try {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `New contact form submission from ${name}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "New Contact Form Submission",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${name}`,
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n<mailto:${email}|${email}>`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message:*\n${message}`,
            },
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Error sending Slack webhook:", error);
  }
}

export async function submitContactForm(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    honeypot: formData.get("website"), // Honeypot field named "website"
  };

  const result = contactFormSchema.safeParse(rawData);

  if (!result.success) {
    const firstError =
      Array.isArray(result.error.issues) && result.error.issues.length > 0
        ? result.error.issues[0].message
        : undefined;

    if (!firstError) {
      return {
        success: false,
        error: "Validation failed",
      };
    }

    return {
      success: false,
      error: firstError,
    };
  }

  const { name, email, message } = result.data;

  try {
    // Save to database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Send email to you (the site owner)
    const { error: ownerEmailError } = await resend.emails.send({
      from: "GT Abhishek <hello@gtabhishek.com>",
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #EBEBF0; border-bottom: 2px solid #5B8FD9; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 600;">
            New Contact Form Submission
          </h2>
          <div style="background: #464850; padding: 20px; border-radius: 20px; margin: 20px 0; border: 1px solid #4D4F5C;">
            <p style="margin: 10px 0; color: #B8B9C0; font-size: 14px;"><strong style="color: #EBEBF0;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0; color: #B8B9C0; font-size: 14px;"><strong style="color: #EBEBF0;">Email:</strong> <a href="mailto:${email}" style="color: #5B8FD9; text-decoration: none;">${email}</a></p>
            <p style="margin: 10px 0; color: #B8B9C0; font-size: 14px;"><strong style="color: #EBEBF0;">Message:</strong></p>
            <p style="background: #383A4A; padding: 15px; border-radius: 12px; white-space: pre-wrap; color: #EBEBF0; font-size: 14px; line-height: 1.6; margin-top: 10px; border: 1px solid #4D4F5C;">${message}</p>
          </div>
          <p style="color: #B8B9C0; font-size: 12px; margin-top: 20px; line-height: 1.5;">
            You can reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    if (ownerEmailError) {
      console.error("Resend (owner):", ownerEmailError);
      return {
        success: false,
        error: "Email service error. Please try again or email us directly.",
      };
    }

    // Send confirmation email to the user
    const { error: confirmationEmailError } = await resend.emails.send({
      from: "GT Abhishek <hello@gtabhishek.com>",
      to: email,
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #EBEBF0; border-bottom: 2px solid #5B8FD9; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 600;">
            Thank You, ${name}!
          </h2>
          <p style="color: #B8B9C0; line-height: 1.6; font-size: 14px; margin-bottom: 20px;">
            I've received your message and will get back to you as soon as possible.
          </p>
          <div style="background: #464850; padding: 20px; border-radius: 20px; margin: 20px 0; border: 1px solid #4D4F5C;">
            <p style="margin: 0; color: #EBEBF0; font-size: 14px; font-weight: 600;"><strong>Your Message:</strong></p>
            <p style="background: #383A4A; padding: 15px; border-radius: 12px; white-space: pre-wrap; margin-top: 10px; color: #EBEBF0; font-size: 14px; line-height: 1.6; border: 1px solid #4D4F5C;">${message}</p>
          </div>
          <p style="color: #B8B9C0; line-height: 1.6; margin-top: 20px; font-size: 14px;">
            Best regards,<br>
            <strong style="color: #EBEBF0;">GT Abhishek</strong>
          </p>
        </div>
      `,
    });

    if (confirmationEmailError) {
      console.error("Resend (confirmation):", confirmationEmailError);
      return {
        success: false,
        error:
          "We couldn't send your message. Please try again or email us directly.",
      };
    }

    // Send Slack webhook
    await sendSlackWebhook(name, email, message);

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error processing contact form:", error);

    const isPrismaError =
      error instanceof Error &&
      "code" in error &&
      typeof (error as { code?: string }).code === "string" &&
      (error as { code: string }).code.startsWith("P");

    if (isPrismaError) {
      return {
        success: false,
        error: "Could not save your message. Please try again.",
      };
    }

    const genericMessage =
      "Something went wrong. Please try again or email us directly.";
    const devMessage =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? `${genericMessage} (${error.message})`
        : genericMessage;

    return {
      success: false,
      error: devMessage,
    };
  }
}
