import { Request } from "express";
import type { Client, ApiKey, AdminUser } from "@veridi/database";

export interface AuthenticatedRequest extends Request {
  client: Client;
  apiKey: ApiKey;
}

export interface AdminRequest extends Request {
  admin: AdminUser;
}
