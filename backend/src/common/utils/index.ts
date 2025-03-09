import { ApiResponseOptions } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ClientInfo } from "src/logic/urls/urls.service";
import * as crypto from "crypto";

/**
 * Generates a description string for Swagger documentation containing
 * possible error codes for a specific endpoint.
 * @param errorCodeObject - An array of error code objects with code and message properties
 * @returns ApiResponseOptions - An object containing the generated description string
 *
 */

export const mapApiErrorCodes = (
  errorCodeObject: { code: string; message: string }[]
): ApiResponseOptions => {
  let descriptionString = "Possible error codes: ";
  errorCodeObject.map((item) => {
    descriptionString += `${item.code} ,`;
  });

  return { description: descriptionString.trim() };
};

/**
 * Extract client information from request
 */
export const getClientInfo = (req: Request): ClientInfo => {
  const userAgent = req.headers["user-agent"] || "";
  const referrer = req.headers["referer"] || "";
  const ipAddress =
    req.ip ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    "0.0.0.0";

  // Generate visitor ID using fingerprint
  const visitorId = generateVisitorId(req);

  return {
    ipAddress,
    userAgent,
    referrer,
    browser: parseBrowser(userAgent),
    deviceType: parseDevice(userAgent),
    visitorId,
  };
};

/**
 * Generate a visitor ID from request data
 */
export const generateVisitorId = (req: Request): string => {
  // Collect data points for fingerprinting
  const dataPoints = [
    req.ip || "0.0.0.0",
    req.headers["user-agent"] || "",
    req.headers["accept-language"] || "",
    req.headers["accept"] || "",
  ];

  // Add any visitor cookie if available
  if (req.cookies && req.cookies.visitor_id) {
    dataPoints.push(req.cookies.visitor_id);
  }

  // Create a hash from the data points
  const fingerprint = crypto
    .createHash("sha256")
    .update(dataPoints.join("|"))
    .digest("hex");

  return fingerprint;
};

export const parseBrowser = (userAgent: string): string => {
  if (!userAgent) return "Unknown";

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge") || userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident"))
    return "Internet Explorer";
  return "Other";
};

/**
 * Parse device type from user agent
 */
export const parseDevice = (userAgent: string): string => {
  if (!userAgent) return "Unknown";

  if (userAgent.includes("Mobile")) return "Mobile";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
};
