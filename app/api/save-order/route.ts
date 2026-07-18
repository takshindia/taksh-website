import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createShipment, generateAWB } from "@/lib/shiprocket";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      email,
      mobile,
      address,
      city,
      pincode,
      product_name,
      quantity,
      amount,
      payment_status,
      status,
      razorpay_order_id,
      razorpay_payment_id,
    } = body;

    const { data: orderData, error } = await supabase
  .from("orders")
  .insert([
    {
      customer_name,
      email,
      mobile,
      address,
      city,
      pincode,
      product_name,
      quantity,
      amount,
      payment_status,
      status,
      razorpay_order_id,
      razorpay_payment_id,
    },
  ])
  .select()
  .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

try {
  const shipment = await createShipment({
    orderId: razorpay_order_id || `TAKSH-${Date.now()}`,
    customer_name,
    email,
    mobile,
    address,
    city,
    pincode,
    product_name,
    quantity,
    amount,
  });

  const shipmentId = shipment.shipment_id;

console.log("Shiprocket:", shipment);

const awb = await generateAWB(shipmentId);

console.log("AWB:", awb);

const updateResult = await supabase
  .from("orders")
  .update({
    shipment_id: shipmentId,
    awb_code: awb?.awb_code || null,
    courier_name: awb?.courier_name || null,
    tracking_url: awb?.tracking_data?.track_url || null,
    tracking_status: shipment.status,
  })
  .eq("id", orderData.id);

console.log("Update Result:", updateResult);

} catch (err) {
  console.error("Shiprocket Error:", err);
}

    // Customer Confirmation Email
const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "✅ Your तक्ष Order is Confirmed",

      html: `
));

<div style="max-width:650px;margin:auto;background:#0f0f0f;color:#ffffff;padding:40px;border-radius:12px;font-family:Arial,sans-serif">

<h1 style="text-align:center;color:#D4AF37;font-size:42px;margin:0;">
तक्ष
</h1>

<p style="text-align:center;color:#cccccc;">
Premium Laser Engraving & Personalized Gifts
</p>

<hr style="border:1px solid #333;margin:30px 0;">

<h2 style="color:#D4AF37;">
✅ Order Confirmed
</h2>

<p>Hello <b>${customer_name}</b>,</p>

<p>
Thank you for shopping with <b>तक्ष</b>.
Your order has been successfully placed.
</p>

<table width="100%" cellpadding="10" style="background:#1b1b1b;border-radius:8px;margin-top:20px;">
<tr>
<td><b>Product</b></td>
<td>${product_name}</td>
</tr>

<tr>
<td><b>Quantity</b></td>
<td>${quantity}</td>
</tr>

<tr>
<td><b>Total</b></td>
<td>₹${amount}</td>
</tr>

<tr>
<td><b>Payment</b></td>
<td>${payment_status}</td>
</tr>
</table>

<hr style="border:1px solid #333;margin:30px 0;">

<p>📦 We will notify you when your order is shipped.</p>

<p>Thank you for choosing <b>तक्ष</b>. ❤️</p>

</div>
`,
    });
    // Admin Email
    const adminEmail = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "taksh.support03@gmail.com",
      subject: "🛒 New Order Received - तक्ष",

      html: `
    ));

    console.log("Admin Email Sent");

<div style="font-family:Arial,sans-serif;padding:20px;">

<h2>🛒 New Order Received</h2>

<p><b>Customer:</b> ${customer_name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Mobile:</b> ${mobile}</p>

<p><b>Address:</b> ${address}</p>
<p><b>City:</b> ${city}</p>
<p><b>Pincode:</b> ${pincode}</p>

<hr>

<p><b>Product:</b> ${product_name}</p>

<p><b>Quantity:</b> ${quantity}</p>

<p><b>Total:</b> ₹${amount}</p>

<p><b>Payment:</b> ${payment_status}</p>

<p><b>Status:</b> ${status}</p>

<p><b>Razorpay Order ID:</b> ${razorpay_order_id}</p>

<p><b>Razorpay Payment ID:</b> ${razorpay_payment_id}</p>

</div>
`,
    });

    return NextResponse.json({
      success: true,
      message: "Order saved successfully",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save order",
      },
      {
        status: 500,
      }
    );
  }
}