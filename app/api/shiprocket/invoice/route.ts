import { NextRequest, NextResponse } from "next/server";
import { getShiprocketToken } from "@/lib/shiprocket";

export async function GET(req: NextRequest) {
  const shipmentId = req.nextUrl.searchParams.get("shipment_id");

  if (!shipmentId) {
    return NextResponse.json(
      { error: "shipment_id required" },
      { status: 400 }
    );
  }

  const token = await getShiprocketToken();

  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/orders/print/invoice?ids=${shipmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}
