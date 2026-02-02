// assets/js/app.js
(() => {
  const form = document.getElementById("rsvpForm");
  const msg = document.getElementById("formMsg");
  const yearEl = document.getElementById("y");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!form) return;

  // Nếu bạn có Apps Script (Google Sheets) thì dán link /exec vào đây:
  // Ví dụ: const SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
  const SCRIPT_URL = ""; // để trống nếu chưa dùng

  const setMsg = (text, ok = true) => {
    if (!msg) return;
    msg.textContent = text;
    msg.classList.remove("ok", "err");
    msg.classList.add(ok ? "ok" : "err");
  };

  const disableButton = (disabled) => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = disabled;
    btn.textContent = disabled ? "Đang gửi..." : "Gửi đăng ký";
  };

  const validate = () => {
    // required fields
    const requiredNames = ["fullName", "team", "phone", "nickname", "attend"];
    for (const name of requiredNames) {
      const el = form.elements[name];
      if (!el) continue;
      const value = (el.value || "").trim();
      if (!value) return `Vui lòng điền đầy đủ: ${name}`;
    }

    // check phone basic (không quá gắt)
    const phone = (form.elements["phone"].value || "").trim();
    const phoneOk = /^[0-9+()\s.-]{8,}$/.test(phone);
    if (!phoneOk) return "Số điện thoại có vẻ chưa đúng định dạng.";

    return "";
  };

  const toObject = () => {
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => (data[k] = String(v).trim()));
    data.timestamp = new Date().toISOString();
    return data;
  };

  async function sendToGoogleSheet(data) {
    // Apps Script Web App thường nhận POST form-data hoặc JSON.
    // Dùng JSON cho gọn:
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    // Apps Script có thể trả text/json
    const text = await res.text();
    return text;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(""); // clear

    const err = validate();
    if (err) {
      setMsg("❌ " + err, false);
      return;
    }

    const data = toObject();

    disableButton(true);

    try {
      if (SCRIPT_URL) {
        await sendToGoogleSheet(data);
        setMsg("✅ Đăng ký thành công! Hẹn gặp bạn ở bữa tiệc 🎉", true);
      } else {
        // Chưa nối Sheets: vẫn cho “thành công” để test, đồng thời lưu local
        localStorage.setItem("newyearparty_rsvp_latest", JSON.stringify(data));
        setMsg("✅ Đã ghi nhận đăng ký (demo). BTC sẽ tổng hợp danh sách 🎉", true);
      }

      form.reset();
    } catch (ex) {
      console.error(ex);
      setMsg("❌ Gửi đăng ký thất bại. Vui lòng thử lại hoặc liên hệ BTC.", false);
    } finally {
      disableButton(false);
    }
  });
})();
