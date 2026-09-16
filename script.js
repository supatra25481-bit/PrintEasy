// ========================================
// PRINT EASY
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------
    // ดึง element จากหน้าเว็บ
    // -------------------------------

    const fileInput = document.getElementById("fileInput");
    const fileName = document.getElementById("fileName");
    const pageCount = document.getElementById("pageCount");

    const printSetting =
        document.getElementById("printSetting");

    const paperSize =
        document.getElementById("paperSize");

    const a5TypeBox =
        document.getElementById("a5TypeBox");

    const a5Type =
        document.getElementById("a5Type");

    const color =
        document.getElementById("color");

    const copies =
        document.getElementById("copies");

    const price =
        document.getElementById("price");

    const printButton =
        document.getElementById("printButton");

    const paymentBox =
        document.getElementById("paymentBox");

    const summary =
        document.getElementById("summary");

    const qrcode =
        document.getElementById("qrcode");

    const paidButton =
        document.getElementById("paidButton");

    const successBox =
        document.getElementById("successBox");


    // -------------------------------
    // ตรวจว่า PDF.js โหลดแล้วหรือยัง
    // -------------------------------

    if (typeof pdfjsLib === "undefined") {

        pageCount.textContent =
            "❌ ระบบอ่าน PDF ยังโหลดไม่สำเร็จ";

        return;

    }


    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


    // ========================================
    // เลือกไฟล์
    // ========================================

    fileInput.addEventListener(
        "change",
        async function () {

            const file =
                fileInput.files[0];


            if (!file) {

                return;

            }


            // ตรวจสอบ PDF

            if (
                file.type !== "application/pdf" &&
                !file.name.toLowerCase().endsWith(".pdf")
            ) {

                alert(
                    "กรุณาเลือกไฟล์ PDF เท่านั้น"
                );

                fileInput.value = "";

                return;

            }


            // เก็บไฟล์

            selectedFile = file;


            // แสดงชื่อไฟล์

            fileName.textContent =
                "📄 " + file.name;


            // กำลังอ่าน

            pageCount.textContent =
                "⏳ กำลังนับจำนวนหน้า...";


            try {

                const buffer =
                    await file.arrayBuffer();


                const loadingTask =
                    pdfjsLib.getDocument({
                        data: buffer
                    });


                const pdf =
                    await loadingTask.promise;


                totalPages =
                    pdf.numPages;


                pageCount.textContent =
                    "📑 จำนวน " +
                    totalPages +
                    " หน้า";


                // เปิดการตั้งค่า

                printSetting.style.display =
                    "block";


                calculatePrice();


            } catch (error) {

                console.error(error);

                pageCount.textContent =
                    "❌ ไม่สามารถอ่านไฟล์ PDF ได้";

            }

        }
    );


    // ========================================
    // เปลี่ยน A4 / A5
    // ========================================

    paperSize.addEventListener(
        "change",
        function () {

            if (
                paperSize.value === "A5"
            ) {

                a5TypeBox.style.display =
                    "block";

            } else {

                a5TypeBox.style.display =
                    "none";

            }


            calculatePrice();

        }
    );


    // ========================================
    // คำนวณราคา
    // ========================================

    function calculatePrice() {

        if (
            totalPages <= 0
        ) {

            price.textContent =
                "0 บาท";

            return;

        }


        let numberOfCopies =
            parseInt(copies.value);


        if (
            isNaN(numberOfCopies) ||
            numberOfCopies < 1
        ) {

            numberOfCopies = 1;

            copies.value = 1;

        }


        let pricePerPage;


        // A4

        if (
            paperSize.value === "A4"
        ) {

            if (
                color.value === "black"
            ) {

                pricePerPage = 1;

            } else {

                pricePerPage = 5;

            }

        }


        // A5

        else {

            if (
                color.value === "black"
            ) {

                pricePerPage = 1;

            } else {

                pricePerPage = 4;

            }

        }


        const total =
            totalPages *
            numberOfCopies *
            pricePerPage;


        price.textContent =
            total.toLocaleString("th-TH") +
            " บาท";

    }


    // ========================================
    // เปลี่ยนสี
    // ========================================

    color.addEventListener(
        "change",
        calculatePrice
    );


    // ========================================
    // เปลี่ยนจำนวนชุด
    // ========================================

    copies.addEventListener(
        "input",
        calculatePrice
    );


    // ========================================
    // เปลี่ยนประเภท A5
    // ========================================

    a5Type.addEventListener(
        "change",
        calculatePrice
    );


    // ========================================
    // กดปริ้น
    // ========================================

    printButton.addEventListener(
        "click",
        function () {

            if (!selectedFile) {

                alert(
                    "กรุณาเลือกไฟล์ PDF ก่อน"
                );

                return;

            }


            let numberOfCopies =
                parseInt(copies.value);


            if (
                isNaN(numberOfCopies) ||
                numberOfCopies < 1
            ) {

                numberOfCopies = 1;

            }


            let pricePerPage;


            if (
                paperSize.value === "A4"
            ) {

                pricePerPage =
                    color.value === "black"
                        ? 1
                        : 5;

            } else {

                pricePerPage =
                    color.value === "black"
                        ? 1
                        : 4;

            }


            const total =
                totalPages *
                numberOfCopies *
                pricePerPage;


            let a5Name = "";


            if (
                paperSize.value === "A5"
            ) {

                a5Name =
                    a5Type.options[
                        a5Type.selectedIndex
                    ].text;

            }


            const colorName =
                color.value === "black"
                    ? "ขาวดำ"
                    : "สี";


            // สรุปงาน

            summary.innerHTML = `

                <div class="summary-item">
                    📄 ไฟล์:
                    ${fileName.textContent}
                </div>

                <div class="summary-item">
                    📑 จำนวน:
                    ${totalPages} หน้า
                </div>

                <div class="summary-item">
                    📄 กระดาษ:
                    ${paperSize.value}
                </div>

                ${
                    paperSize.value === "A5"
                    ?
                    `
                    <div class="summary-item">
                        📦 ประเภท:
                        ${a5Name}
                    </div>
                    `
                    :
                    ""
                }

                <div class="summary-item">
                    🎨 สี:
                    ${colorName}
                </div>

                <div class="summary-item">
                    🔢 จำนวนชุด:
                    ${numberOfCopies}
                </div>

                <div class="summary-total">
                    💰 ${total} บาท
                </div>

            `;


            // ซ่อนหน้าตั้งค่า

            printSetting.style.display =
                "none";


            // เปิดหน้าชำระเงิน

            paymentBox.style.display =
                "block";


            // สร้าง QR ตัวอย่าง

            qrcode.innerHTML = "";


            if (
                typeof QRCode !== "undefined"
            ) {

                new QRCode(
                    qrcode,
                    {
                        text:
                            "PRINT EASY " +
                            total +
                            " บาท",

                        width: 230,

                        height: 230
                    }
                );

            }


            paymentBox.scrollIntoView({
                behavior: "smooth"
            });

        }
    );


    // ========================================
    // ชำระเงินแล้ว
    // ========================================

    paidButton.addEventListener(
        "click",
        function () {

            paymentBox.style.display =
                "none";


            successBox.style.display =
                "block";


            successBox.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

});


// ========================================
// ตัวแปรที่ใช้เก็บไฟล์
// ========================================

let selectedFile = null;
let totalPages = 0;
