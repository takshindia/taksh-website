import { NextRequest, NextResponse } from "next/server";
import { trackShipment } from "@/lib/shiprocket";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const shipmentId = req.nextUrl.searchParams.get("shipment_id");

    if (!shipmentId) {
      return NextResponse.json(
        { error: "shipment_id is required" },
        { status: 400 }
      );
    }

    const result = await trackShipment(Number(shipmentId));

    const shipment =
      result?.tracking_data?.shipment_track?.[0] ?? null;

    const trackingUrl =
      result?.tracking_data?.track_url || "";

    if (shipment) {
      await supabase
        .from("orders")
        .update({
          tracking_status: shipment.current_status,
          tracking_url: trackingUrl,
          courier_name: shipment.courier_name,
          awb_code: shipment.awb_code,
        })
        .eq("shipment_id", Number(shipmentId));
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
