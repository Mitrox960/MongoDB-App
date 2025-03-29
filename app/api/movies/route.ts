import { NextResponse } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Operations related to movies
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     description: Returns a list of movies
 *     responses:
 *       200:
 *         description: List of movies
 */
export async function GET(): Promise<NextResponse> {
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const movies = await db.collection('movies').find({}).limit(10).toArray();

        return NextResponse.json(
            { status: 200, data: movies }
        );
    }
    catch (error: any) {
        return NextResponse.json(
            { status: 500, message: 'Internal Server Error', error: error.message }
        );
    }
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     description: Adds a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - year
 *               - genres
 *               - directors
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               year:
 *                 type: integer
 *                 example: 2010
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi"]
 *               directors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Christopher Nolan"]
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const body = await request.json();

        if (!body.title || !body.year || !body.genres || !body.directors) {
            return NextResponse.json({ status: 400, message: 'Missing required fields', error: 'Title, year, genres, and directors are required' });
        }

        const newMovie = {
            title: body.title,
            plot: body.plot || '',
            genres: body.genres || [],
            runtime: body.runtime || null,
            cast: body.cast || [],
            num_mflix_comments: body.num_mflix_comments || 0,
            fullplot: body.fullplot || '',
            languages: body.languages || [],
            released: body.released ? new Date(body.released) : null,
            directors: body.directors || [],
            rated: body.rated || '',
            awards: body.awards || { wins: 0, nominations: 0, text: '' },
            lastupdated: body.lastupdated || new Date().toISOString(),
            year: body.year,
            imdb: body.imdb || { rating: null, votes: null, id: null },
            countries: body.countries || [],
            type: body.type || 'movie',
            tomatoes: body.tomatoes || { viewer: { rating: null, numReviews: null, meter: null }, lastUpdated: new Date().toISOString() }
        };

        const result = await db.collection('movies').insertOne(newMovie);

        return NextResponse.json({ status: 201, message: 'Movie added successfully', data: { _id: result.insertedId } });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
}
