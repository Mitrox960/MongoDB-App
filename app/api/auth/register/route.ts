/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *       400:
 *         description: Missing required fields or user already exists
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Auth
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient, Db } from "mongodb";
import clientPromise from "@/lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

export async function POST(req: Request) {
  try {
    // Récupérer le corps de la requête avec les nouveaux champs (name, email, password)
    const { name, email, password } = await req.json();

    // Vérifier si le nom et l'email sont fournis
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connexion à la base de données
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    // Vérifier si l'utilisateur existe déjà avec cet email ou ce nom
    const existingUser = await db.collection("users").findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email or name already exists" }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec un nom, un email, et un mot de passe
    const newUser = {
      name,        // Nom de l'utilisateur
      email,       // Email de l'utilisateur
      password: hashedPassword, // Mot de passe haché
      createdAt: new Date(), // Date de création
    };

    // Insérer l'utilisateur dans la base de données
    const result = await db.collection("users").insertOne(newUser);

    // Générer les tokens
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ email }, REFRESH_SECRET, { expiresIn: "7d" });

    // Stocker les tokens en cookies
    const response = NextResponse.json({ message: "User registered successfully", data: { _id: result.insertedId } });
    response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/" });

    return response;
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
