/* =================================================================
   MỤC "BÀI FANPAGE" TRONG /admin
   - Widget "fbpublish": khung Đăng ngay / Hẹn giờ / Huỷ hẹn giờ + trạng thái.
   - Xem trước giống bài Facebook ở khung bên phải.
   - Tạo nhanh từ bài blog: chọn bài blog, để trống Nội dung, bấm Lưu → tự điền.
   Gọi API /api/fanpage (máy chủ kiểm tra quyền GitHub rồi mới gọi Facebook).
   ================================================================= */
(function () {
  if (!window.CMS || !window.createClass || !window.h) return;
  var CMS = window.CMS;
  var h = window.h;
  var API = '/api/fanpage';

  function ghToken() {
    try {
      var raw = localStorage.getItem('decap-cms-user') || localStorage.getItem('netlify-cms-user');
      var u = raw ? JSON.parse(raw) : null;
      return (u && u.token) || '';
    } catch (e) {
      return '';
    }
  }

  function toJS(v) {
    if (v && typeof v.toJS === 'function') return v.toJS();
    return v || {};
  }

  function call(body) {
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ghToken() },
      body: JSON.stringify(body),
    })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false, error: 'Máy chủ không phản hồi đúng (HTTP ' + r.status + '). Thử lại sau ít phút.' };
        });
      })
      .catch(function () {
        return { ok: false, error: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.' };
      });
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }
  function toLocalInput(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function fmt(iso) {
    var d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d)) return '';
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ' ngày ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  function defaultWhen() {
    var d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    return toLocalInput(d);
  }

  var S = {
    box: 'border:1px solid #dfe3e8;border-radius:10px;padding:16px;background:#fafbfc;font-size:14px;line-height:1.5;color:#1f2933',
    row: 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px',
    btn: 'border:0;border-radius:6px;padding:9px 14px;font-weight:600;cursor:pointer;font-size:14px',
    primary: 'background:#1877f2;color:#fff',
    ghost: 'background:#fff;color:#1f2933;border:1px solid #c5ccd3',
    danger: 'background:#fff;color:#b42318;border:1px solid #f0b4ae',
    input: 'border:1px solid #c5ccd3;border-radius:6px;padding:8px 10px;font-size:14px',
    badge: 'display:inline-block;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;margin-left:6px',
    note: 'color:#5f6b7a;font-size:12.5px;margin-top:10px',
    err: 'margin-top:12px;padding:10px 12px;border-radius:6px;background:#fdecea;color:#8a1c12',
    ok: 'margin-top:12px;padding:10px 12px;border-radius:6px;background:#e7f6ec;color:#14532d',
  };
  var BADGE = {
    draft: 'background:#eef0f3;color:#3e4c59',
    scheduled: 'background:#fff4d6;color:#7a5200',
    published: 'background:#e7f6ec;color:#14532d',
  };
  var LABEL = { draft: 'Nháp', scheduled: 'Đã hẹn giờ', published: 'Đã đăng' };

  function css(str) {
    var o = {};
    str.split(';').forEach(function (p) {
      var i = p.indexOf(':');
      if (i < 0) return;
      var k = p.slice(0, i).trim().replace(/-([a-z])/g, function (_, c) {
        return c.toUpperCase();
      });
      o[k] = p.slice(i + 1).trim();
    });
    return o;
  }

  var Control = window.createClass({
    getInitialState: function () {
      return { page: null, busy: false, msg: '', err: '', when: defaultWhen() };
    },
    componentDidMount: function () {
      var self = this;
      call({ action: 'status' }).then(function (j) {
        self.setState({ page: j });
      });
      var v = this.val();
      if (v.status === 'scheduled' && v.scheduledAt && new Date(v.scheduledAt).getTime() < Date.now()) {
        this.run('refresh', {}, true);
      }
    },
    val: function () {
      var v = toJS(this.props.value);
      if (!v.status) v.status = 'draft';
      return v;
    },
    entry: function () {
      return this.props.getEntry ? this.props.getEntry() : this.props.entry;
    },
    editorData: function (e) {
      var d = e.get('data');
      var imgs = d.get('images');
      return {
        message: d.get('message') || '',
        link: d.get('link') || '',
        images: imgs && imgs.toJS ? imgs.toJS() : imgs || [],
      };
    },
    run: function (action, extra, silent) {
      var self = this;
      var e = this.entry();
      if (!e || e.get('newRecord') || !e.get('path')) {
        this.setState({ err: 'Hãy bấm Lưu (Publish) bài trước, rồi mới đăng lên fanpage.', msg: '' });
        return;
      }
      var pageName = this.state.page && this.state.page.pageName ? this.state.page.pageName : 'fanpage';
      var ask = {
        publish: 'Đăng bài này lên ' + pageName + ' ngay bây giờ?',
        schedule: 'Hẹn giờ đăng bài này lên ' + pageName + ' lúc ' + fmt(new Date(this.state.when)) + '?',
        cancel: 'Huỷ hẹn giờ? Bài hẹn trên Facebook sẽ bị xoá, bài ở đây trở về Nháp.',
        reset: 'Xoá trạng thái "Đã đăng" để có thể đăng bài này thành một bài MỚI? (Bài cũ trên Facebook vẫn giữ nguyên.)',
      };
      if (!silent && ask[action] && !window.confirm(ask[action])) return;

      var body = { action: action, path: e.get('path') };
      if (action === 'publish' || action === 'schedule') body.editor = this.editorData(e);
      if (action === 'schedule') {
        var d = new Date(this.state.when);
        if (isNaN(d)) {
          this.setState({ err: 'Chọn ngày và giờ hẹn trước đã.' });
          return;
        }
        body.scheduledAt = d.toISOString();
      }
      for (var k in extra || {}) body[k] = extra[k];

      this.setState({ busy: true, err: '', msg: silent ? '' : 'Đang xử lý, đợi vài giây...' });
      call(body).then(function (j) {
        if (!j.ok) {
          self.setState({ busy: false, msg: '', err: silent ? '' : j.error || 'Có lỗi xảy ra.' });
          return;
        }
        if (!j.changed) {
          self.setState({ busy: false, msg: silent ? '' : 'Chưa có thay đổi.' });
          return;
        }
        var done = {
          publish: 'Đã đăng lên fanpage.',
          schedule: 'Đã hẹn giờ trên Facebook.',
          cancel: 'Đã huỷ hẹn giờ.',
          reset: 'Đã xoá trạng thái.',
          refresh: 'Bài hẹn giờ đã lên fanpage.',
        }[action];
        if (j.saved) {
          self.setState({ busy: true, msg: done + ' Trạng thái đã được lưu, đang tải lại trang...' });
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        } else {
          self.props.onChange(j.facebook);
          self.setState({
            busy: false,
            msg: done + ' Lưu ý: chưa ghi được trạng thái tự động, hãy bấm Lưu (Publish) ngay để tránh đăng trùng.',
          });
        }
      });
    },
    render: function () {
      var self = this;
      var v = this.val();
      var st = this.state;
      var p = st.page;
      var conn;
      if (!p) conn = h('span', { style: css('color:#5f6b7a') }, 'Đang kiểm tra kết nối Facebook...');
      else if (!p.ok) conn = h('span', { style: css('color:#b42318') }, p.error);
      else if (!p.configured)
        conn = h('span', { style: css('color:#b42318') }, 'Chưa kết nối Facebook (thiếu biến FB_PAGE_TOKEN trên Vercel).');
      else conn = h('span', null, 'Sẽ đăng lên: ', h('b', null, p.pageName));

      var canPost = p && p.ok && p.configured && !st.busy;
      var parts = [];

      parts.push(
        h(
          'div',
          { key: 'head' },
          h('b', null, 'Trạng thái:'),
          h('span', { style: css(S.badge + ';' + (BADGE[v.status] || BADGE.draft)) }, LABEL[v.status] || v.status),
          h('div', { style: css('margin-top:6px') }, conn)
        )
      );

      if (v.status === 'published') {
        parts.push(
          h(
            'div',
            { key: 'pub', style: css('margin-top:10px') },
            v.publishedAt ? 'Đăng lúc ' + fmt(v.publishedAt) + '. ' : '',
            v.url ? h('a', { href: v.url, target: '_blank', rel: 'noopener' }, 'Xem bài trên Facebook') : null
          )
        );
        parts.push(
          h(
            'div',
            { key: 'reset', style: css(S.row) },
            h(
              'button',
              { type: 'button', style: css(S.btn + ';' + S.ghost), disabled: st.busy, onClick: function () { self.run('reset'); } },
              'Xoá trạng thái để đăng lại'
            )
          )
        );
      } else if (v.status === 'scheduled') {
        parts.push(h('div', { key: 'sch', style: css('margin-top:10px') }, 'Facebook sẽ tự đăng lúc ', h('b', null, fmt(v.scheduledAt)), '.'));
        parts.push(
          h(
            'div',
            { key: 'schbtn', style: css(S.row) },
            h(
              'button',
              { type: 'button', style: css(S.btn + ';' + S.ghost), disabled: st.busy, onClick: function () { self.run('refresh'); } },
              'Kiểm tra đã lên chưa'
            ),
            h(
              'button',
              { type: 'button', style: css(S.btn + ';' + S.danger), disabled: !canPost, onClick: function () { self.run('cancel'); } },
              'Huỷ hẹn giờ'
            )
          )
        );
      } else {
        parts.push(
          h(
            'div',
            { key: 'now', style: css(S.row) },
            h(
              'button',
              { type: 'button', style: css(S.btn + ';' + S.primary), disabled: !canPost, onClick: function () { self.run('publish'); } },
              'Đăng ngay'
            )
          )
        );
        parts.push(
          h(
            'div',
            { key: 'later', style: css(S.row) },
            h('input', {
              type: 'datetime-local',
              style: css(S.input),
              value: st.when,
              min: toLocalInput(new Date(Date.now() + 11 * 60 * 1000)),
              onChange: function (ev) { self.setState({ when: ev.target.value }); },
            }),
            h(
              'button',
              { type: 'button', style: css(S.btn + ';' + S.ghost), disabled: !canPost, onClick: function () { self.run('schedule'); } },
              'Hẹn giờ đăng'
            )
          )
        );
        parts.push(
          h(
            'div',
            { key: 'note', style: css(S.note) },
            'Hệ thống đăng bản ĐÃ LƯU của bài, nên hãy bấm Lưu (Publish) trước. Ảnh vừa tải lên cần 1–2 phút để website cập nhật. Hẹn giờ: từ 11 phút đến 30 ngày tới.'
          )
        );
      }

      if (st.err) parts.push(h('div', { key: 'err', style: css(S.err) }, st.err));
      if (st.msg) parts.push(h('div', { key: 'msg', style: css(S.ok) }, st.msg));

      return h(
        'div',
        { className: this.props.classNameWrapper, style: css(S.box) },
        h('style', null, '.fbp-box button:disabled{opacity:.45;cursor:not-allowed}'),
        h('div', { className: 'fbp-box' }, parts)
      );
    },
  });

  var ControlPreview = window.createClass({
    render: function () {
      return null;
    },
  });

  CMS.registerWidget('fbpublish', Control, ControlPreview);

  // ---------- Xem trước giống bài Facebook ----------
  var Preview = window.createClass({
    render: function () {
      var e = this.props.entry;
      var getAsset = this.props.getAsset;
      var data = e.get('data');
      var message = data.get('message') || '';
      var link = (data.get('link') || '').trim();
      var imgs = data.get('images');
      imgs = imgs && imgs.toJS ? imgs.toJS() : imgs || [];
      imgs = imgs.filter(Boolean).map(function (src) {
        try {
          var a = getAsset(src);
          return a && a.toString ? a.toString() : src;
        } catch (err) {
          return src;
        }
      });
      if (imgs.length && link && message.indexOf(link) < 0) message = message ? message + '\n\n' + link : link;

      var grid = null;
      if (imgs.length) {
        var shown = imgs.slice(0, 4);
        var cols = shown.length === 1 ? '1fr' : '1fr 1fr';
        grid = h(
          'div',
          { style: css('display:grid;gap:2px;grid-template-columns:' + cols) },
          shown.map(function (src, i) {
            var more = i === 3 && imgs.length > 4;
            return h(
              'div',
              { key: i, style: css('position:relative;aspect-ratio:' + (shown.length === 1 ? 'auto' : '1/1') + ';overflow:hidden;background:#e4e6eb') },
              h('img', { src: src, style: css('width:100%;height:100%;object-fit:cover;display:block') }),
              more
                ? h(
                    'div',
                    { style: css('position:absolute;inset:0;background:rgba(0,0,0,.45);color:#fff;font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center') },
                    '+' + (imgs.length - 4)
                  )
                : null
            );
          })
        );
      } else if (link) {
        grid = h(
          'div',
          { style: css('border-top:1px solid #e4e6eb;background:#f0f2f5;padding:12px 16px;color:#65676b;font-size:13px') },
          'Thẻ xem trước link (Facebook tự lấy ảnh và tiêu đề từ trang):',
          h('div', { style: css('color:#050505;font-weight:600;margin-top:4px;word-break:break-all') }, link)
        );
      }

      return h(
        'div',
        { style: css('background:#f0f2f5;min-height:100%;padding:24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif') },
        h(
          'div',
          { style: css('max-width:500px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 2px rgba(0,0,0,.2);overflow:hidden') },
          h(
            'div',
            { style: css('display:flex;gap:8px;align-items:center;padding:12px 16px') },
            h('div', { style: css('width:40px;height:40px;border-radius:50%;background:#1877f2') }),
            h('div', null, h('div', { style: css('font-weight:600;font-size:15px') }, 'Fanpage của bạn'), h('div', { style: css('color:#65676b;font-size:13px') }, 'Xem trước'))
          ),
          message
            ? h('div', { style: css('padding:0 16px 12px;font-size:15px;white-space:pre-wrap;word-break:break-word;color:#050505') }, message)
            : h('div', { style: css('padding:0 16px 12px;color:#8a8d91;font-size:14px') }, 'Chưa có nội dung.'),
          grid
        )
      );
    },
  });
  CMS.registerPreviewTemplate('fanpage', Preview);

  // ---------- Tạo nhanh từ bài blog ----------
  var reloadAfterSave = false;
  CMS.registerEventListener({
    name: 'preSave',
    handler: function (arg) {
      var entry = arg && arg.entry;
      if (!entry || entry.get('collection') !== 'fanpage') return undefined;
      var data = entry.get('data');
      var slug = data.get('fromBlog');
      if (!slug) return undefined;
      var msg = String(data.get('message') || '').trim();
      var link = String(data.get('link') || '').trim();
      if (msg && link) return undefined;
      return call({ action: 'blog', slug: slug }).then(function (j) {
        if (!j || !j.ok) return undefined;
        if (!msg) data = data.set('message', [j.title, j.description].filter(Boolean).join('\n\n'));
        if (!link) data = data.set('link', j.url);
        if (!entry.get('newRecord')) reloadAfterSave = true;
        return data;
      });
    },
  });
  CMS.registerEventListener({
    name: 'postSave',
    handler: function () {
      if (!reloadAfterSave) return;
      reloadAfterSave = false;
      setTimeout(function () {
        window.location.reload();
      }, 1500);
    },
  });
})();
