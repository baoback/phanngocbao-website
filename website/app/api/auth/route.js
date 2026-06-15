// Bắt đầu quy trình đăng nhập GitHub cho trang quản trị /admin (Decap CMS)
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse('Thiếu biến môi trường OAUTH_GITHUB_CLIENT_ID', { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/callback`;
  const state = Math.random().toString(36).slice(2);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
    state,
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
