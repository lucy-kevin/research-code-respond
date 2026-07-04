import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Admin portal is disabled until Supabase is configured.
  if (!url || !key) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const res = NextResponse.next();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) =>
        cookies.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        ),
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = req.nextUrl.pathname.startsWith("/admin/login");
  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
