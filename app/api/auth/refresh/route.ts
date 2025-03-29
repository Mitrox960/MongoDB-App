/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     description: Refresh the authentication token using a valid refresh token
 *     responses:
 *       200:
 *         description: Successfully refreshed the authentication token
 *       401:
 *         description: No refresh token provided
 *       403:
 *         description: Invalid refresh token
 *     tags:
 *       - Auth
 */

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

export async function GET(req: Request) {
    const refreshToken = req.headers.get("cookie")?.split("refreshToken=")[1];

    if (!refreshToken) {
        return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);
        const newToken = jwt.sign({ username: decoded.username }, SECRET_KEY, { expiresIn: "15m" });

        const response = NextResponse.json({ token: newToken });
        response.cookies.set("token", newToken, { httpOnly: true, secure: true, path: "/" });

        return response;
    } catch {
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
    }
}
