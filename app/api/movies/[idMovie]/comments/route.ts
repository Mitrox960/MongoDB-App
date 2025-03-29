// page/api/movies/[idMovie]/comments/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   get:
 *     description: Get all comments for a movie by ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns all comments for the movie
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Comments
 */
export async function GET(request: Request, { params }: { params: any }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    const comments = await db.collection('comments')
      .find({ movie_id: new ObjectId(idMovie) })
      .toArray();

    return NextResponse.json({ status: 200, data: comments });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   post:
 *     description: Add a new comment for a movie by ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Missing required fields or invalid movie ID
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Comments
 */
export async function POST(request: Request, { params }: { params: any }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid Movie ID format' });
    }

    const body = await request.json();
    const { name, email, text } = body;

    if (!name || !email || !text) {
      return NextResponse.json({ status: 400, message: 'Missing required fields (name, email, text)' });
    }

    const newComment = {
      name,
      email,
      movie_id: new ObjectId(idMovie),
      text,
      date: new Date(),
    };

    const result = await db.collection('comments').insertOne(newComment);

    return NextResponse.json({ status: 201, message: 'Comment added successfully', data: { _id: result.insertedId, ...newComment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
