const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export async function getShiprocketToken() {
  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error("Shiprocket login failed");
  }

  const data = await response.json();

  return data.token;
}

export async function createShipment(order: {
  orderId: string;
  customer_name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  product_name: string;
  quantity: number;
  amount: number;
}) {
  const token = await getShiprocketToken();

  const response = await fetch(
    `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order.orderId,
        order_date: new Date().toISOString().slice(0, 10),

        pickup_location: "warehouse",

        billing_customer_name: order.customer_name,
        billing_last_name: "",
        billing_address: order.address,
        billing_city: order.city,
        billing_pincode: order.pincode,
        billing_state: "Gujarat",
        billing_country: "India",
        billing_email: order.email,
        billing_phone: order.mobile,

        shipping_is_billing: true,

        order_items: [
          {
            name: order.product_name,
            sku: "TAKSH-001",
            units: order.quantity,
            selling_price: order.amount,
          },
        ],

        payment_method: "Prepaid",
        sub_total: order.amount,

        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5,
      }),
    }
  );

  return await response.json();
}

export async function generateAWB(shipment_id: number) {
  const token = await getShiprocketToken();

  const response = await fetch(
    `${SHIPROCKET_BASE_URL}/courier/assign/awb`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipment_id,
      }),
    }
  );

  return await response.json();
}
export async function trackShipment(shipment_id: number) {
  const token = await getShiprocketToken();

  const response = await fetch(
    `${SHIPROCKET_BASE_URL}/courier/track/shipment/${shipment_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return await response.json();
}