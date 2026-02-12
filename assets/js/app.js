// ---------- FORM SUBMIT TO GOOGLE SHEETS ----------
(function () {
  const FORM = document.getElementById('rsvpForm');
  if (!FORM) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywy9GukWGl4pWBtLp3tnXHutsMhecftbW9RJBMQMHbbFdeelG-AUK-7etVGddvI7aW/exec';

  const MSG = document.getElementById('formMsg');
  const setMsg = (text, ok = true) => {
    if (!MSG) return;
    MSG.textContent = text;
    MSG.className = 'lead-msg ' + (ok ? 'ok' : 'err');
  };

  FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nickname = (FORM.nickname?.value || '').trim();
    const studentId = (FORM.studentId?.value || '').trim();

    if (!nickname || !studentId) {
      setMsg('❌ Vui lòng điền đủ thông tin bắt buộc (*)', false);
      return;
    }

    setMsg('Đang gửi...');
    const btn = FORM.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    const body = new URLSearchParams({
      timestamp: new Date().toISOString(),
      nickname,
      studentId
    }).toString();

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body
      });

      setMsg('✅ Đăng ký thành công!');
      FORM.reset();
    } catch (err) {
      console.error(err);
      setMsg('❌ Lỗi kết nối. Vui lòng thử lại.', false);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();
