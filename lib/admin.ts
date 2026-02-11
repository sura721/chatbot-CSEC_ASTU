export const ADMIN_EMAILS = ["your-email@gmail.com"]; // Replace with your Clerk email

export function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}