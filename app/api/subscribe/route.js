export async function POST(req) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return Response.json(
      { error: "Please enter a valid email" },
      { status: 400 },
    );
  }

  // Step 1: create (or get existing) subscriber
  const subRes = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": process.env.KIT_API_KEY,
    },
    body: JSON.stringify({ email_address: email, state: "active" }),
  });

  const subData = await subRes.json();

  if (!subRes.ok) {
    return Response.json(
      { error: subData.errors?.[0] || "Something went wrong" },
      { status: subRes.status },
    );
  }

  const subscriberId = subData.subscriber.id;

  // Step 2: add subscriber to the form
  const formRes = await fetch(
    `https://api.kit.com/v4/forms/${process.env.KIT_FORM_ID}/subscribers/${subscriberId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": process.env.KIT_API_KEY,
      },
    },
  );

  const formData = await formRes.json();

  if (!formRes.ok) {
    return Response.json(
      { error: formData.errors?.[0] || "Something went wrong" },
      { status: formRes.status },
    );
  }

  return Response.json({ success: true, subscriber: formData.subscriber });
}
