import { createHmac } from "crypto";

/**
 * Shared helpers for the newsletter pipeline (notify route + unsubscribe
 * route). The unsubscribe link carries an HMAC of the email so nobody can
 * unsubscribe other people by guessing addresses.
 */

export function newsletterSecret(): string | null {
  return (
    process.env.NEWSLETTER_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? null
  );
}

export function unsubscribeToken(email: string, secret: string) {
  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

/** Simple branded HTML email for a new blog post. */
export function postEmailHtml(opts: {
  title: string;
  excerpt: string;
  postUrl: string;
  unsubscribeUrl: string;
}) {
  const { title, excerpt, postUrl, unsubscribeUrl } = opts;
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#FAF9F5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F5;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr><td style="padding-bottom:20px;">
            <span style="font-size:16px;font-weight:bold;color:#1A1A1A;">Research <span style="color:#6B21E8;">|</span> Code <span style="color:#6B21E8;">|</span> Respond</span>
          </td></tr>
          <tr><td style="background:#ffffff;border:1px solid #e5e0d8;border-radius:16px;padding:32px;">
            <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6B21E8;font-weight:bold;">New on the blog</p>
            <h1 style="margin:12px 0 0;font-size:24px;line-height:1.25;color:#1A1A1A;">${title}</h1>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#4B5563;">${excerpt}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr><td style="background:#6B21E8;border-radius:999px;">
                <a href="${postUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">Read the post</a>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding-top:20px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">
              You're receiving this because you subscribed to Research Code Respond updates.<br/>
              <a href="${unsubscribeUrl}" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
