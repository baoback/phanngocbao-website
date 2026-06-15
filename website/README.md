# Website phanngocbao.vn (Next.js)

Blog Marketing + Hồ sơ cá nhân, phong cách tối giản kiểu Unsplash, kèm trang quản trị **/admin** để tự viết bài (không cần code). Dùng **Next.js** để dễ mở rộng về sau (livestream, đăng nhập, tài khoản người dùng...).

- **Công nghệ:** Next.js 15 (App Router) + React 19
- **Nội dung:** file Markdown trong thư mục `content/` (đọc bằng `gray-matter` + `marked`)
- **Quản trị (CMS):** Decap CMS — đăng nhập bằng GitHub
- **Hosting đề xuất:** Vercel (miễn phí, hợp Next.js nhất, gắn tên miền miễn phí)

---

## 1. Có sẵn gì trong này

| Trang | Đường dẫn | Mô tả |
|-------|-----------|-------|
| Trang chủ | `/` | Lưới masonry + tìm kiếm trực tiếp + lọc theo thẻ |
| Bài viết | `/blog/...` | Trang đọc bài đầy đủ |
| Hồ sơ | `/about` | Profile cá nhân (sửa qua admin) |
| Theo chủ đề | `/tags/...` | Lọc bài theo thẻ |
| **Quản trị** | `/admin` | Viết/sửa/xóa bài, đổi hồ sơ, tải ảnh |

Cấu trúc thư mục chính:
```
app/            # giao diện & các trang (Next.js App Router)
app/api/        # route xác thực đăng nhập GitHub cho /admin
content/blog/   # các bài viết (.md) — admin sẽ ghi vào đây
content/about.md# nội dung trang hồ sơ
lib/posts.js    # đọc & xử lý markdown
public/admin/   # trang quản trị Decap CMS
public/uploads/ # ảnh
```

---

## 2. Triển khai lên mạng — làm đúng thứ tự

> Cần 2 tài khoản miễn phí: **GitHub** và **Vercel**. Tất cả các bước đều miễn phí.

### Bước 1 — Đưa code lên GitHub
1. Tạo tài khoản https://github.com (nếu chưa có) và tạo repo mới, ví dụ `phanngocbao-website`.
2. Đẩy thư mục `website` này lên repo đó. Dễ nhất: dùng **GitHub Desktop** (https://desktop.github.com) → Add local repository → Publish.
   (Hoặc dùng terminal:)
   ```bash
   git init
   git add .
   git commit -m "Khởi tạo website phanngocbao.vn"
   git branch -M main
   git remote add origin https://github.com/TEN-GITHUB/phanngocbao-website.git
   git push -u origin main
   ```

### Bước 2 — Deploy lên Vercel
1. Vào https://vercel.com → đăng nhập bằng GitHub.
2. **Add New → Project → Import** repo `phanngocbao-website`.
3. Vercel tự nhận diện Next.js. Bấm **Deploy**, chờ ~1–2 phút.
4. Bạn nhận được địa chỉ tạm dạng `phanngocbao-website.vercel.app`. Mở thử là thấy web chạy.

### Bước 3 — Tạo "GitHub OAuth App" (để đăng nhập trang /admin)
1. GitHub → ảnh đại diện → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Điền:
   - **Application name:** phanngocbao admin
   - **Homepage URL:** `https://phanngocbao.vn` (tạm thời có thể dùng địa chỉ `...vercel.app`)
   - **Authorization callback URL:** `https://phanngocbao.vn/api/callback`
     (nếu chưa gắn tên miền thì dùng `https://TEN.vercel.app/api/callback`)
3. Bấm **Register** → lưu lại **Client ID** và bấm **Generate a new client secret** để lấy **Client Secret**.

### Bước 4 — Khai báo khóa bí mật trên Vercel
1. Vercel → project → **Settings → Environment Variables**, thêm 2 biến:
   - `OAUTH_GITHUB_CLIENT_ID` = Client ID ở bước 3
   - `OAUTH_GITHUB_CLIENT_SECRET` = Client Secret ở bước 3
2. Vào tab **Deployments → Redeploy** để áp dụng biến mới.

### Bước 5 — ⚠️ Sửa file cấu hình admin
Mở `public/admin/config.yml`, sửa 2 dòng rồi push lại lên GitHub:
```yaml
  repo: TEN-GITHUB/phanngocbao-website   # tên GitHub/tên repo của bạn
  base_url: https://phanngocbao.vn      # đúng URL site (tạm thời: https://TEN.vercel.app)
```

### Bước 6 — Gắn tên miền phanngocbao.vn
1. Vercel → project → **Settings → Domains → Add** → nhập `phanngocbao.vn`.
2. Vercel hiển thị bản ghi DNS cần thêm (thường là một `A record` và/hoặc `CNAME`).
3. Đăng nhập nơi **mua tên miền** → quản lý DNS → thêm đúng bản ghi Vercel yêu cầu.
4. Chờ DNS cập nhật (vài phút–vài giờ). Vercel tự cấp **HTTPS** miễn phí.
5. Sau khi domain chạy: nhớ cập nhật lại **callback URL** trong GitHub OAuth App (bước 3) và **base_url** trong config.yml thành `https://phanngocbao.vn`.

Xong! Mỗi lần bạn đăng bài trong `/admin`, code được commit lên GitHub → Vercel tự build lại → web cập nhật sau ~1 phút.

---

## 3. Viết bài hàng ngày

1. Vào `https://phanngocbao.vn/admin` → **Login with GitHub**.
2. **Bài viết → New Bài viết** → điền Tiêu đề, Mô tả, Ngày, tải **Ảnh bìa**, thêm **Thẻ**, viết Nội dung.
3. **Publish**. Khoảng 1 phút sau bài lên web.

Sửa hồ sơ cá nhân: **Trang cố định → Trang Hồ sơ**.

---

## 4. Chạy thử trên máy (tùy chọn)

```bash
npm install
npm run dev
```
Mở http://localhost:3000 (cần Node.js 18.18+ — tải ở https://nodejs.org).

> Lưu ý: trang `/admin` cần đăng nhập GitHub nên chỉ hoạt động đầy đủ sau khi đã deploy và cấu hình OAuth (bước 3–5). Phần hiển thị web thì chạy được ngay trên máy.

---

## 5. Tùy chỉnh nhanh

| Muốn đổi | Sửa ở đâu |
|----------|-----------|
| Tên thương hiệu trên header | `app/components/Header.jsx` |
| Câu tiêu đề lớn trang chủ | `app/page.jsx` |
| Màu sắc, font, bo góc | `app/globals.css` (phần `:root`) |
| Nội dung hồ sơ | `/admin` hoặc `content/about.md` |

---

## 6. Hướng mở rộng giai đoạn sau (vì sao chọn Next.js)

Next.js cho phép thêm dần các tính năng động mà không cần làm lại từ đầu:

- **Đăng nhập / tài khoản người dùng:** thêm NextAuth.js (Auth.js).
- **Livestream:** nhúng player (Mux, YouTube Live, Cloudflare Stream) trong một route mới `app/live/page.jsx`.
- **Bình luận, lượt thích, newsletter:** thêm API routes + một database (ví dụ Vercel Postgres, Supabase).
- **Trang dịch vụ / bán khóa học:** thêm trang và tích hợp thanh toán.

Mỗi tính năng là một thư mục/route mới trong `app/`, không ảnh hưởng phần blog hiện có.

---

## 7. Lưu ý

- Ảnh bìa/đại diện hiện là ảnh mẫu (`.svg`). Khi đăng bài thật, tải ảnh của bạn qua `/admin`.
- Thiết kế mô phỏng trải nghiệm Unsplash (lưới ảnh, khoảng trắng, tìm kiếm) — **không** dùng logo hay kho ảnh của Unsplash.
- Mọi thay đổi đi qua GitHub nên luôn có lịch sử và khôi phục được.
