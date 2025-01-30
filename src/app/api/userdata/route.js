// pages/api/users.js
import connectDb from "@/lib/dbConect";
import Data from "@/lib/models/data";
import { NextResponse } from "next/server";

// Connect to the database
connectDb();

// GET request handler
export const GET = async () => {
  try {
    // Fetch all users (dummy data for now)
    const users = await Data.find();
    if (users.length === 0) {
      // Dummy data if the DB is empty
      const dummyData = [
        { name: 'John Doe', dob: '1990-01-01', age: 30 },
        { name: 'Jane Smith', dob: '1985-02-02', age: 35 },
        { name: 'Michael Johnson', dob: '2000-03-03', age: 20 },
      ];
      await Data.insertMany(dummyData); // Add dummy data to MongoDB if it's empty
      return new NextResponse(JSON.stringify(dummyData), { status: 200 });
    }
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
};

// POST request handler
export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, dob, age } = body;
    const newUser = new Data({ name, dob, age });
    await newUser.save();
    return new NextResponse(
      JSON.stringify(newUser),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
};

// PUT request handler
export const PUT = async (req) => {
  try {
    const body = await req.json();
    const { id, name, dob, age } = body;
    const updatedUser = await Data.findByIdAndUpdate(id, { name, dob, age }, { new: true });
    return new NextResponse(
      JSON.stringify(updatedUser),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
};

// DELETE request handler
export const DELETE = async (req) => {
  try {
    const { id } = req.query;
    await Data.findByIdAndDelete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
};
