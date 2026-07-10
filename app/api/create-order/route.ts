import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
    console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_KEY_SECRET);
  try {
    const order = await razorpay.orders.create({
      amount: 10000,
      currency: "INR",
      receipt: "taksh_order_1",
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}