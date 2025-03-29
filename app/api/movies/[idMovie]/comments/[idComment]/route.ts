// page/api/movies/[idMovie]/comments/[idComment]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   get:
 *     description: Get a specific comment for a movie by Movie ID and Comment ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: idComment
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the comment for the movie
 *       400:
 *         description: Invalid Movie ID or Comment ID format
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Comments
 */
export async function GET(request: Request, { params }: { params: { idMovie: string, idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie, idComment } = params;

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID format', error: 'Movie ID or Comment ID is incorrect' });
    }

    const comment = await db.collection('comments').findOne({
      _id: new ObjectId(idComment),
      movie_id: new ObjectId(idMovie),
    });

    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID for this movie' });
    }

    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   delete:
 *     description: Delete a specific comment for a movie by Movie ID and Comment ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: idComment
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid Movie ID or Comment ID format
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Comments
 */
export async function DELETE(request: Request, { params }: { params: { idMovie: string, idComment: string } }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idMovie, idComment } = params;

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID format', error: 'Movie ID or Comment ID is incorrect' });
    }

    const result = await db.collection('comments').deleteOne({
      _id: new ObjectId(idComment),
      movie_id: new ObjectId(idMovie),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID for this movie' });
    }

    return NextResponse.json({ status: 200, message: 'Comment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   put:
 *     description: Update a specific comment for a movie by Movie ID and Comment ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: idComment
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
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Missing required fields or invalid ID format
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 *     tags:
 *       - Comments
 */
export async function PUT(request: Request, { params }: { params: { idMovie: string, idComment: string } }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie, idComment } = params;

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid Movie ID or Comment ID format' });
    }

    const body = await request.json();
    const { name, email, text } = body;

    if (!name || !email || !text) {
      return NextResponse.json({ status: 400, message: 'Missing required fields (name, email, text)' });
    }

    const updatedComment = {
      name,
      email,
      text,
      date: new Date(),
    };

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) },
      { $set: updatedComment }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found' });
    }

    return NextResponse.json({ status: 200, message: 'Comment updated successfully', data: updatedComment });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
