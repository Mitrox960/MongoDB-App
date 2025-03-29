import { NextResponse } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     tags:
 *       - theaters
 *     description: Returns theaters
 *     responses:
 *       200:
 *         description: List of theaters
 */
export async function GET(): Promise<NextResponse> {
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const theaters = await db.collection('theaters').find({}).limit(10).toArray();

        return NextResponse.json(
            { status: 200, data: theaters }
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
 * /api/theaters:
 *   post:
 *     tags:
 *       - theaters
 *     description: Adds a new theater
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theaterId:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Theater added successfully
 *       400:
 *         description: Missing required fields (theaterId, location)
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');

        const body = await request.json();
        const { theaterId, location } = body;

        if (!theaterId || !location) {
            return NextResponse.json({ status: 400, message: 'Missing required fields (theaterId, location)' });
        }

        const newTheater = {
            theaterId,
            location,
        };

        const result = await db.collection('theaters').insertOne(newTheater);

        return NextResponse.json({ status: 201, message: 'Theater added successfully', data: newTheater });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
}
