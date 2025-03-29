/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     description: Log in an existing user and return authentication tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully authenticated and returned JWT tokens
 *       400:
 *         description: Missing email or password in the request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Auth
 */

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, Db } from "mongodb";
import clientPromise from "@/lib/mongodb"; // Assurez-vous d'avoir configuré la connexion MongoDB

// Configuration des clés secrètes
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); // Utiliser email et password dans la requête

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Connexion à la base de données MongoDB
    const client = await clientPromise;
    const db: Db = client.db("sample_mflix");  // Remplacez "sample_mflix" par le nom de votre base de données
    const usersCollection = db.collection("users");  // Remplacez "users" par le nom de votre collection d'utilisateurs

    // Trouver l'utilisateur par email dans la base de données
    const user = await usersCollection.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Générer les tokens
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ email: user.email }, REFRESH_SECRET, { expiresIn: "7d" });

    // Stocker les tokens en cookies
    const response = NextResponse.json({ message: "Authenticated", jwt: token });
    response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
