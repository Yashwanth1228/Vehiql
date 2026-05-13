"use server";

import aj from "@/lib/arcjet";
import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import axios from "axios";

export async function getFeaturedCars(limit = 3) {
  try {
    const cars = await db.car.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return cars.map(serializeCarData);
  } catch (error) {
    throw new Error("Error fetching featured cars:" + error.message);
  }
}

// Function to convert File to base64
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processImageSearch(file) {
  try {
    //Rate limiting with Arcjet
    const req = await request();

    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit) {
        const { remaining, reset } = decision.reason;

        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSecond: reset,
          },
        });
        throw new Error("Too many requests.Please try again later");
      }
      throw new Error("Request blocked");
    }

    //Check if API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("Open Router Api key is not configured");
    }

    const base64Image = await fileToBase64(file);

    const mimeType = file.type || "image/jpeg";

    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    console.log("FILE TYPE:", file.type);
    console.log("IMAGE URL START:", imageUrl.substring(0, 50));

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4.1-mini",
        max_tokens: 200,

        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
Analyze this car image and return ONLY valid JSON.

{
  "make": "",
  "bodyType": "",
  "color": "",
  "confidence": 0.0
}
            `,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Vehiql AI Search",
        },
      },
    );
    console.log("AI RESULT:", response.data);

    const aiText = response.data?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error("AI returned empty response");
    }

    console.log("AI TEXT:", aiText);

    function cleanJSON(text) {
      return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    try {
      const cleanedText = cleanJSON(aiText);

      const parsedData = JSON.parse(cleanedText);

      return {
        success: true,
        data: parsedData,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);

      console.log("Raw response:", aiText);

      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error("FULL AI ERROR:", error.response?.data || error.message);

    throw new Error(
      "AI Search error: " +
        (error.response?.data?.error?.message || error.message),
    );
  }
}
