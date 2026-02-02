// ---------- FORM SUBMIT TO GOOGLE SHEETS (RSVP) ----------
(function () {
  const FORM = document.getElementById('rsvpForm');
  if (!FORM) return;

  // Dán URL Web App (kết thúc bằng /exec)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdgaSVq8X9PGH-GPMNcLNteZnj-5ZJHX0_s4r4hIOvTsqCxb8NK8_Ysf2FRVAAus1n/exec';

  const MSG = document.getElementById('formMsg');
  const setMsg = (text) => { if (MSG) MSG.textContent = text; };

  FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Lấy dữ liệu & trim
    const fullName  = (FORM.fullName?.value || '').trim();
    const team      = (FORM.team?.value || '').trim();
    const phone     = (FORM.phone?.value || '').trim();
    const nickname  = (FORM.nickname?.value || '').trim();
    const attend    = (FORM.attend?.value || '').trim();
    const diet      = (FORM.diet?.value || '').trim();
    const allergy   = (FORM.allergy?.value || '').trim();

    // Ràng buộc gọn (giống mẫu)
    if (!fullName || !team || !phone || !nickname || !attend) {
      setMsg('Vui lòng điền đủ thông tin bắt buộc (*)');
      return;
    }

    setMsg('Đang gửi...');
    const btn = FORM.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    // Gửi dạng x-www-form-urlencoded (ổn định no-cors)
    const body = new URLSearchParams({
      timestamp: new Date().toISOString(),
      fullName,
      team,
      phone,
      nickname,
      attend,
      diet,
      allergy
    }).toString();

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      });

      // Tới đây coi như đã gửi request đi
      setMsg('✅ Cảm ơn bạn! Thông tin đã được ghi nhận.');
      FORM.reset();
    } catch (err) {
      console.error('Submit error:', err);
      setMsg('❌ Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();
