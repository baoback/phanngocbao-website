// Nhận mã từ GitHub, đổi lấy token, rồi gửi về cho Decap CMS qua postMessage
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return new Response('Thiếu mã hoặc cấu hình OAuth.', { status: 400 });
  }

  let body;
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    if (data.access_token) {
      body = {
        status: 'success',
        payload: { token: data.access_token, provider: 'github' },
      };
    } else {
      body = { status: 'error', payload: data };
    }
  } catch (err) {
    body = { status: 'error', payload: { message: String(err) } };
  }

  const content =
    body.status === 'success'
      ? `authorization:github:success:${JSON.stringify(body.payload)}`
      : `authorization:github:error:${JSON.stringify(body.payload)}`;

  const html = `<!doctype html><html><body><script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(content)}, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
  </script><p>Đang đăng nhập...</p></body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
