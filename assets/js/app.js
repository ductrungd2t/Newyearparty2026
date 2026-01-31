(function(){
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();

// --- RSVP FORM ---
(function(){
  const FORM = document.getElementById('rsvpForm');
  if (!FORM) return;

  const MSG = document.getElementById('formMsg');
  const BTN_DOWNLOAD = document.getElementById('btnDownload');

  // 1) Nếu bạn dùng Google Sheets (Apps Script), dán link Web App kết thúc bằng /exec vào đây.
  // Ví dụ: https://script.google.com/macros/s/XXX/exec
  const SCRIPT_URL = '';

  function setMsg(text, type){
    if (!MSG) return;
    MSG.textContent = text || '';
    MSG.classList.remove('ok','err');
    if (type) MSG.classList.add(type);
  }

  function getData(){
    const data = {
      fullName: (FORM.fullName.value || '').trim(),
      team: (FORM.team.value || '').trim(),
      phone: (FORM.phone.value || '').trim(),
      email: (FORM.email.value || '').trim(),
      attend: (FORM.attend.value || '').trim(),
      guests: (FORM.guests.value || '0').trim(),
      diet: (FORM.diet.value || 'Normal').trim(),
      allergy: (FORM.allergy.value || '').trim(),
      note: (FORM.note.value || '').trim(),
      submittedAt: new Date().toISOString(),
    };
    return data;
  }

  function validate(d){
    if (!d.fullName || !d.team || !d.phone || !d.attend) return 'Vui lòng điền đủ các mục bắt buộc.';
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Email không đúng định dạng.';
    return '';
  }

  function toCSVRow(d){
    const cols = [
      d.submittedAt,
      d.fullName,
      d.team,
      d.phone,
      d.email,
      d.attend,
      d.guests,
      d.diet,
      d.allergy,
      d.note,
    ];
    return cols.map(v => {
      const s = String(v ?? '');
      const safe = s.replace(/"/g, '""');
      return /[",\n]/.test(safe) ? `"${safe}"` : safe;
    }).join(',');
  }

  function downloadCSV(d){
    const header = [
      'submittedAt','fullName','team','phone','email','attend','guests','diet','allergy','note'
    ].join(',');
    const csv = header + '\n' + toCSVRow(d) + '\n';

    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newyearparty_rsvp_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  BTN_DOWNLOAD?.addEventListener('click', () => {
    const d = getData();
    const err = validate(d);
    if (err){ setMsg(err, 'err'); return; }
    downloadCSV(d);
    setMsg('Đã tải CSV về máy (bản sao của form).', 'ok');
  });

  FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    const d = getData();
    const err = validate(d);
    if (err){ setMsg(err, 'err'); return; }

    const btn = FORM.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    // Lưu tạm trong localStorage (phòng khi chưa cấu hình Google Sheets)
    try{
      const key = 'newyearparty_rsvp_latest';
      localStorage.setItem(key, JSON.stringify(d));
    }catch(_){ /* ignore */ }

    if (!SCRIPT_URL){
      setMsg('Đã ghi nhận! (Chưa cấu hình Google Sheets nên dữ liệu đang lưu tạm trên trình duyệt của bạn.)', 'ok');
      FORM.reset();
      if (btn) btn.disabled = false;
      return;
    }

    setMsg('Đang gửi...', '');

    try {
      // POST + no-cors để tránh CORS block của Apps Script
      const body = new URLSearchParams(d).toString();
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      });

      setMsg('Cảm ơn bạn! Ban tổ chức đã nhận được đăng ký.', 'ok');
      FORM.reset();
    } catch (e2) {
      console.error(e2);
      setMsg('Không gửi được (lỗi mạng). Bạn thử lại hoặc bấm “Tải bản sao (CSV)”.', 'err');
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();
