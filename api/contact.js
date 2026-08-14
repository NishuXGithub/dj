// Vercel Serverless Function — POST /api/contact
// Receives a validated enquiry from the website and emails it to the
// Fine Arts DJ Amplifier business inbox using Resend. No database is used.
//
// Required environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  – your Resend API key (secret, server-only)
//   TO_EMAIL        – the Fine Arts business email that should receive enquiries
//   FROM_EMAIL      – (optional) a verified Resend sender, e.g.
//                     "Fine Arts DJ Amplifier <enquiry@yourdomain.com>".
//                     Defaults to Resend's shared onboarding sender for quick testing.

import { Resend } from "resend";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// Indian mobile: optional +91/91, then 10 digits starting 6-9
const isIndianPhone = (v) => /^(?:\+?91)?[6-9]\d{9}$/.test(String(v).replace(/[\s-]/g, ""));

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Parse body (Vercel auto-parses JSON, but guard for string bodies too)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const service = String(body.service || body.event || "").trim();
  const message = String(body.message || "").trim();
  const honeypot = String(body.company || "").trim(); // hidden anti-spam field

  // Anti-spam: bots fill the hidden "company" field. Silently accept & drop.
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  // Server-side validation (never trust the client)
  const fields = [];
  if (name.length < 2 || name.length > 100) fields.push("name");
  if (!isEmail(email) || email.length > 150) fields.push("email");
  if (!isIndianPhone(phone)) fields.push("phone");
  if (message.length < 5 || message.length > 2000) fields.push("message");
  if (service.length > 100) fields.push("service");
  if (fields.length) {
    return res.status(400).json({ ok: false, error: "Invalid input", fields });
  }

  // Configuration check
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TO_EMAIL;
  const from = process.env.FROM_EMAIL || "Fine Arts DJ Amplifier <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("Email not configured: missing RESEND_API_KEY or TO_EMAIL");
    return res.status(500).json({ ok: false, error: "Email service is not configured." });
  }

  const submittedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const text =
`New customer enquiry received.

Name: ${name}
Phone: ${phone}
Email: ${email}
Service/Product: ${service || "Not specified"}

Message:
${message}

Submitted At:
${submittedAt}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#1a1826;">
    <h2 style="color:#8b2fff;margin:0 0 4px;">New Enquiry – Fine Arts DJ Amplifier</h2>
    <p style="color:#555;margin:0 0 16px;">New customer enquiry received.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;width:150px;color:#888;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(phone)}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Service/Product</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(service || "Not specified")}</td></tr>
    </table>
    <p style="margin:16px 0 4px;color:#888;font-size:14px;">Message</p>
    <div style="background:#f4f2ff;border-radius:8px;padding:14px;font-size:14px;white-space:pre-wrap;">${escapeHtml(message)}</div>
    <p style="margin:16px 0 0;color:#888;font-size:12px;">Submitted At: ${submittedAt}</p>
  </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email, // replying goes straight to the customer
      subject: "New Enquiry – Fine Arts DJ Amplifier",
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ ok: false, error: "Email service error" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Send failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to send enquiry" });
  }
}
