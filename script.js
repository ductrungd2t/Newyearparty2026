document.addEventListener("DOMContentLoaded", () => {

    const WEDDING_DATE = new Date("2026-11-29T09:00:00+07:00");

    const cover = document.getElementById("cover");
    const music = document.getElementById("music");
    const musicBtn = document.getElementById("musicBtn");

    const openInvitationBtn = document.getElementById("openInvitation");
    const openText = document.getElementById("openText");


    /* =========================
       MỞ THIỆP
    ========================== */

    function openInvitation() {

        console.log("Đã bấm mở thiệp");

        if (cover) {
            cover.classList.add("hidden");
        }

        document.body.classList.remove("locked");

        // Phát nhạc nếu có
        if (music) {

            music.play()
                .then(() => {
                    if (musicBtn) {
                        musicBtn.classList.add("playing");
                    }
                })
                .catch(err => {
                    console.log("Trình duyệt chưa cho phép phát nhạc:", err);
                });

        }

        // Xóa cover sau animation
        if (cover) {
            setTimeout(() => {
                cover.remove();
            }, 1000);
        }
    }


    // Nút mở thiệp
    if (openInvitationBtn) {
        openInvitationBtn.addEventListener("click", openInvitation);
    }

    // Chữ mở thiệp
    if (openText) {
        openText.addEventListener("click", openInvitation);
    }


    /* =========================
       NÚT NHẠC
    ========================== */

    if (musicBtn && music) {

        musicBtn.addEventListener("click", () => {

            if (music.paused) {

                music.play()
                    .then(() => {
                        musicBtn.classList.add("playing");
                    })
                    .catch(() => {});

            } else {

                music.pause();
                musicBtn.classList.remove("playing");

            }

        });

    }


    /* =========================
       COUNTDOWN
    ========================== */

    function tick() {

        let distance = WEDDING_DATE - new Date();

        if (distance < 0) {
            distance = 0;
        }

        const days = Math.floor(distance / 86400000);

        const hours = Math.floor(
            (distance % 86400000) / 3600000
        );

        const minutes = Math.floor(
            (distance % 3600000) / 60000
        );

        const seconds = Math.floor(
            (distance % 60000) / 1000
        );


        const values = {
            days,
            hours,
            minutes,
            seconds
        };


        Object.entries(values).forEach(([id, value]) => {

            const element = document.getElementById(id);

            if (element) {
                element.textContent =
                    String(value).padStart(2, "0");
            }

        });

    }

    tick();

    setInterval(tick, 1000);


    /* =========================
       LỊCH THÁNG 11/2026
    ========================== */

    const calendar = document.getElementById("calendarDays");

    if (calendar) {

        const firstDay =
            (new Date(2026, 10, 1).getDay() + 6) % 7;


        // Ô trống đầu tháng
        for (let i = 0; i < firstDay; i++) {

            const empty = document.createElement("span");

            empty.className = "empty";

            calendar.appendChild(empty);

        }


        // Ngày
        for (let day = 1; day <= 30; day++) {

            const element = document.createElement("span");

            element.textContent = day;

            if (day === 29) {
                element.className = "wedding-day";
            }

            calendar.appendChild(element);

        }

    }


    /* =========================
       HIỆU ỨNG KHI CUỘN
    ========================== */

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }

                });

            },

            {
                threshold: 0.12
            }

        );


        document
            .querySelectorAll(".reveal")
            .forEach(element => {
                observer.observe(element);
            });

    } else {

        // Browser cũ
        document
            .querySelectorAll(".reveal")
            .forEach(element => {
                element.classList.add("active");
            });

    }


    /* =========================
       RSVP
    ========================== */

    const rsvpForm =
        document.getElementById("rsvpForm");

    const rsvpResult =
        document.getElementById("rsvpResult");


    if (rsvpForm) {

        rsvpForm.addEventListener("submit", event => {

            event.preventDefault();

            const formData =
                new FormData(event.currentTarget);

            const name =
                formData.get("name") || "bạn";


            if (rsvpResult) {

                rsvpResult.textContent =
                    `Cảm ơn ${name}! Xác nhận của bạn đã được ghi nhận ❤️`;

            }

            event.currentTarget.reset();

        });

    }


    console.log(
        "Wedding Invitation JS loaded successfully ❤️"
    );

});
