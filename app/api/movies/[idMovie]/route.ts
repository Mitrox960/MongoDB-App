import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Operations related to movies
 */

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     tags: [Movies]
 *     description: Get a movie by ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the movie
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 */
export async function GET(request: Request, { params }: any): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     tags: [Movies]
 *     description: Delete a movie by ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 */
export async function DELETE(request: Request, { params }: any): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Movie deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   put:
 *     tags: [Movies]
 *     description: Update a movie by ID
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
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid movie ID or no data provided
 *       404:
 *         description: Movie not found
 */
export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ status: 400, message: 'No data provided', error: 'You must provide at least one field to update' });
    }

    const updateResult = await db.collection('movies').updateOne(
      { _id: new ObjectId(idMovie) },
      { $set: body }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Movie updated successfully', modifiedCount: updateResult.modifiedCount });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
