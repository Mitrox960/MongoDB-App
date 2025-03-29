import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     tags:
 *       - theaters
 *     description: Returns a theater by its ID
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         description: ID of the theater to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theater details
 *       400:
 *         description: Invalid Theater ID format
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request: Request, { params }: { params: any }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, data: theater });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   put:
 *     tags:
 *       - theaters
 *     description: Updates a theater by its ID
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         description: ID of the theater to update
 *         schema:
 *           type: string
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
 *       200:
 *         description: Theater updated successfully
 *       400:
 *         description: Invalid Theater ID format or Missing required fields (theaterId, location)
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid Theater ID format' });
    }

    const body = await request.json();
    const { theaterId, location } = body;

    if (!theaterId || !location) {
      return NextResponse.json({ status: 400, message: 'Missing required fields (theaterId, location)' });
    }

    const updatedTheater = {
      theaterId,
      location,
    };

    const result = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: updatedTheater }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found' });
    }

    return NextResponse.json({ status: 200, message: 'Theater updated successfully', data: updatedTheater });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   delete:
 *     tags:
 *       - theaters
 *     description: Deletes a theater by its ID
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         description: ID of the theater to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 *       400:
 *         description: Invalid Theater ID format
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid Theater ID format' });
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found' });
    }

    return NextResponse.json({ status: 200, message: 'Theater deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
