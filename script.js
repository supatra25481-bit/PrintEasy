// ============================================
// PRINT EASY - ระบบสั่งปริ้น
// ============================================

// ------------------------------
// ตัวแปรหลัก
// ------------------------------

let selectedFile = null;
let totalPages = 0;


// ------------------------------
// หา Element จาก HTML
// ------------------------------

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

const status =
    document.getElementById("status");

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


// ============================================
// PDF.js
// ============================================

if (typeof pdfjsLib !== "undefined") {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}


// ============================================
// เมื่อเลือกไฟล์ PDF
// ============================================

fileInput.addEventListener(
    "change",
    async function () {

        const file = fileInput.files[0];

        if (!file) {
            return;
        }


        // ตรวจสอบว่าเป็น PDF

        if (
            file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {

            alert("กรุณาเลือกไฟล์ PDF เท่านั้น");

            fileInput.value = "";

            return;
        }


        selectedFile = file;


        // แสดงชื่อไฟล์

        fileName.textContent =
            "📄 " + file.name;


        // แสดงสถานะกำลังอ่านไฟล์

        pageCount.textContent =
            "⏳ กำลังนับจำนวนหน้า...";


        try {

            const arrayBuffer =
                await file.arrayBuffer();


            const pdf =
                await pdfjsLib
                    .getDocument({
                        data: arrayBuffer
                    })
                    .promise;


            totalPages =
                pdf.numPages;


            // แสดงจำนวนหน้า

            pageCount.textContent =
                "📑 จำนวน " +
                totalPages +
                " หน้า";


            // แสดงเมนูตั้งค่าปริ้น

            printSetting.style.display =
                "block";


            // คำนวณราคา

            calculatePrice();


        } catch (error) {

            console.error(error);

            pageCount.textContent =
                "❌ อ่านไฟล์ PDF ไม่สำเร็จ";

            printSetting.style.display =
                "none";

        }

    }
);


// ============================================
// เปลี่ยนขนาดกระดาษ
// ============================================

paperSize.addEventListener(
    "change",
    function () {

        if (paperSize.value === "A5") {

            a5TypeBox.style.display =
                "block";

        } else {

            a5TypeBox.style.display =
                "none";

        }


        calculatePrice();

    }
);


// ============================================
// คำนวณราคา
// ============================================

function calculatePrice() {

    if (totalPages <= 0) {

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


    let pricePerPage = 0;


    // ------------------------------
    // A4
    // ------------------------------

    if (paperSize.value === "A4") {

        if (color.value === "black") {

            // A4 ขาวดำ = 1 บาท

            pricePerPage = 1;

        } else {

            // A4 สี = 5 บาท

            pricePerPage = 5;

        }

    }


    // ------------------------------
    // A5
    // ------------------------------

    else {

        if (color.value === "black") {

            // A5 ขาวดำ = 1 บาท

            pricePerPage = 1;

        } else {

            // A5 สี = 4 บาท

            pricePerPage = 4;

        }

    }


    // ------------------------------
    // รวมราคา
    // ------------------------------

    const totalPrice =
        totalPages *
        pricePerPage *
        numberOfCopies;


    price.textContent =
        totalPrice.toLocaleString("th-TH") +
        " บาท";

}


// ============================================
// เปลี่ยนสี
// ============================================

color.addEventListener(
    "change",
    calculatePrice
);


// ============================================
// เปลี่ยนจำนวนชุด
// ============================================

copies.addEventListener(
    "input",
    calculatePrice
);


// ============================================
// เปลี่ยนประเภท A5
// ============================================

a5Type.addEventListener(
    "change",
    calculatePrice
);


// ============================================
// กดปุ่ม "ยืนยันคำสั่งปริ้น"
// ============================================

printButton.addEventListener(
    "click",
    function () {

        // ต้องมีไฟล์ก่อน

        if (!selectedFile) {

            alert(
                "กรุณาเลือกไฟล์ PDF ก่อน"
            );

            return;

        }


        // จำนวนชุด

        let numberOfCopies =
            parseInt(copies.value);


        if (
            isNaN(numberOfCopies) ||
            numberOfCopies < 1
        ) {

            numberOfCopies = 1;

        }


        // ------------------------------
        // หาราคาต่อหน้า
        // ------------------------------

        let pricePerPage;


        if (paperSize.value === "A4") {

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


        // ------------------------------
        // ราคาทั้งหมด
        // ------------------------------

        const totalPrice =
            totalPages *
            pricePerPage *
            numberOfCopies;


        // ------------------------------
        // ชื่อสี
        // ------------------------------

        const colorName =
            color.value === "black"
                ? "ขาวดำ"
                : "สี";


        // ------------------------------
        // ประเภท A5
        // ------------------------------

        let a5Name = "";


        if (paperSize.value === "A5") {

            a5Name =
                a5Type.options[
                    a5Type.selectedIndex
                ].text;

        }


        // ------------------------------
        // แสดงสรุป
        // ------------------------------

        summary.innerHTML = `

            <div class="summary-item">
                📄 ไฟล์:
                ${escapeHTML(selectedFile.name)}
            </div>

            <div class="summary-item">
                📑 จำนวน:
                ${totalPages} หน้า
            </div>

            <div class="summary-item">
                📄 ขนาดกระดาษ:
                ${paperSize.value}
            </div>

            ${
                paperSize.value === "A5"
                ?
                `
                <div class="summary-item">
                    📦 ประเภท A5:
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
                💰 ${totalPrice.toLocaleString("th-TH")}
                บาท
            </div>

        `;


        // ------------------------------
        // เปิดหน้าชำระเงิน
        // ------------------------------

        paymentBox.style.display =
            "block";


        // ซ่อนหน้าตั้งค่า

        printSetting.style.display =
            "none";


        // ล้าง QR เก่า

        qrcode.innerHTML = "";


        // ------------------------------
        // สร้าง QR
        // ------------------------------

        createPaymentQR(
            totalPrice
        );


        // เลื่อนไปหน้าชำระเงิน

        paymentBox.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ============================================
// สร้าง QR สำหรับชำระเงิน
// ============================================

function createPaymentQR(amount) {

    // ตรวจว่ามี QRCode library

    if (
        typeof QRCode === "undefined"
    ) {

        qrcode.innerHTML = `

            <p>
                ❌ ไม่พบระบบ QR Code
            </p>

        `;

        return;

    }


    /*
     * ตอนนี้ใช้ QR สำหรับต้นแบบระบบ
     *
     * หากต้องการรับเงินจริง
     * ต้องใช้ PromptPay payload
     * ที่สร้างอย่างถูกต้อง
     */

    const paymentText =
        "PRINT EASY " +
        amount +
        " บาท";


    new QRCode(
        qrcode,
        {

            text: paymentText,

            width: 230,

            height: 230,

            correctLevel:
                QRCode.CorrectLevel.M

        }
    );

}


// ============================================
// ปุ่ม "ชำระเงินแล้ว"
// ============================================

paidButton.addEventListener(
    "click",
    function () {

        paymentBox.style.display =
            "none";


        successBox.style.display =
            "block";


        status.textContent =
            "✅ รับคำสั่งปริ้นแล้ว";


        successBox.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ============================================
// ป้องกัน HTML จากชื่อไฟล์
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
