import { ServerClient } from "postmark";
import { NextRequest, NextResponse } from "next/server";

// Initialize Postmark client with error handling
const getPostmarkClient = () => {
  const apiKey = process.env.POSTMARK_SERVER_WELCOME_KEY;
  if (!apiKey) {
    throw new Error("POSTMARK_SERVER_WELCOME_KEY is not configured");
  }
  return new ServerClient(apiKey);
};

// Type definitions
interface EmailRequest {
  to: string;
  userName: string;
  emailName: string;
  email?: string;
  industry?: string;
  contactNumber?: string;
}

interface EmailTemplate {
  name: string;
  templateId: number;
  subject: string;
  customFields?: Record<string, string>;
}

// Email template configurations as array
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    name: "RSVP Successful",
    templateId: 43444769,
    subject: "NASTY ENRG Launch",
  },
];

// API route handler
export async function POST(request: NextRequest) {
  try {
    // Initialize client
    const client = getPostmarkClient();

    // Parse request body
    const body = await request.json();
    const {
      to,
      userName,
      emailName,
      email,
      contactNumber,
      industry,
    }: EmailRequest = body;

    // Validate required fields
    if (!to || !userName || !emailName) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            to: !to ? "Missing recipient email" : undefined,
            userName: !userName ? "Missing user name" : undefined,
            emailName: !emailName ? "Missing email template name" : undefined,
          },
        },
        { status: 400 },
      );
    }

    // Find email template in array
    const template = EMAIL_TEMPLATES.find((t) => t.name === emailName);
    if (!template) {
      return NextResponse.json(
        {
          error: "Invalid email template",
          availableTemplates: EMAIL_TEMPLATES.map((t) => t.name),
        },
        { status: 400 },
      );
    }

    // Send email
    const response = await client.sendEmailWithTemplate({
      From: "rsvp@nastyenrglaunch.co.za",
      To: to,
      TemplateId: template.templateId,
      TemplateModel: {
        company_name: userName,
        name: userName,
        email: email || "",
        contactNumber: contactNumber || "",
        industry: industry || "",
      },
    });

    return NextResponse.json(
      {
        message: `${emailName} email sent successfully`,
        messageId: response.MessageID,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // Provide more detailed error response
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
