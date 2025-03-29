/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     description: Log out the current user and clear session cookies
 *     responses:
 *       200:
 *         description: Successfully logged out and cleared cookies
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Auth
 */

import { NextResponse } from "next/server";

export async function POST() {
  // access bdd --> delete session
  const response = NextResponse.json({ message: "Logged out" });

  // Supprimer les cookies
  response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

  return response;
}
