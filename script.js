const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const pageCount = document.getElementById("pageCount");
const printSetting = document.getElementById("printSetting");

const paperSize = document.getElementById("paperSize");
const a5TypeBox = document.getElementById("a5TypeBox");
const a5Type = document.getElementById("a5Type");
const color = document.getElementById("color");
const copies = document.getElementById("copies");
const price = document.getElementById("price");
const printButton = document.getElementById("printButton");
const status = document.getElementById("status");

let totalPages = 0;
let selectedFile = null;

// ======================================
// ใส่เบอร์ PromptPay ของคุณตรงนี้
// ======================================

const PROMPTPAY_ID = "0999066313";


// ======================================
// ตั้งค่า PDF.js
// ======================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// ======================================
// เลือกไฟล์ PDF
// ======================================

fileInput.addEventListener("change", async function () {

    selectedFile = fileInput.files[0];

    if (!selectedFile) return;

    fileName.textContent = "📄 " + selectedFile.name;

    pageCount.textContent = "⏳ กำลังนับจำนวนหน้า...";

    try {

        const data = await selectedFile.arrayBuffer();

        const pdf = await pdfjsLib
            .getDocument({ data: data })
            .promise;

        totalPages = pdf.numPages;

        pageCount.textContent =
            "📑 จำนวน " + totalPages + " หน้า";

        printSetting.style.display = "block";

        calculatePrice();

    } catch (error) {

        console.error(error);

        pageCount.textContent =
            "❌ ไม่สามารถอ่านไฟล์ PDF ได้";

    }

});


// ======================================
// เลือก A4 / A5
// ======================================

paperSize.addEventListener("change", function () {

    if (paperSize.value === "A5") {

        a5TypeBox.style.display = "block";

    } else {

        a5TypeBox.style.display = "none";

    }

    calculatePrice();

});


// ======================================
// คำนวณราคา
// ======================================

function calculatePrice() {

    if (totalPages === 0) return;

    let pricePerPage = 0;

    const numberOfCopies = Number(copies.value);


    // A4
    if (paperSize.value === "A4") {

        if (color.value === "black") {
            pricePerPage = 1;
        } else {
            pricePerPage = 5;
        }

    }


    // A5
    else {

        if (color.value === "black") {
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
        total.toLocaleString() + " บาท";

}


// ======================================
// เปลี่ยนสี
// ======================================

color.addEventListener(
    "change",
    calculatePrice
);


// ======================================
// เปลี่ยนจำนวนชุด
// ======================================

copies.addEventListener(
    "input",
    calculatePrice
);


// ======================================
// เปลี่ยนประเภท A5
// ======================================

a5Type.addEventListener(
    "change",
    calculatePrice
);


// ======================================
// กดปริ้น
// ======================================

printButton.addEventListener("click", function () {

    if (!selectedFile) {

        alert("กรุณาเลือกไฟล์ PDF ก่อน");

        return;

    }


    const numberOfCopies =
        Number(copies.value);


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


    const total =
        totalPages *
        numberOfCopies *
        pricePerPage;


    // ==================================
    // ซ่อนหน้าตั้งค่า
    // ==================================

    printSetting.style.display = "none";


    // ==================================
    // แสดงหน้าชำระเงิน
    // ==================================

    document.getElementById("paymentBox").style.display =
        "block";


    // ข้อมูลสรุป
    document.getElementById("summary").innerHTML = `

        <div class="summary-item">
            📄 ไฟล์: ${selectedFile.name}
        </div>

        <div class="summary-item">
            📑 จำนวน: ${totalPages} หน้า
        </div>

        <div class="summary-item">
            📄 กระดาษ: ${paperSize.value}
        </div>

        ${
            paperSize.value === "A5"
            ? `<div class="summary-item">
                📦 ประเภท A5: ${a5Type.options[a5Type.selectedIndex].text}
               </div>`
            : ""
        }

        <div class="summary-item">
            🎨 สี:
            ${
                color.value === "black"
                ? "ขาวดำ"
                : "สี"
            }
        </div>

        <div class="summary-item">
            🔢 จำนวนชุด: ${numberOfCopies}
        </div>

        <div class="summary-total">
            💰 ${total.toLocaleString()} บาท
        </div>

    `;


    // ==================================
    // สร้าง QR PromptPay
    // ==================================

    const qrBox =
        document.getElementById("qrcode");

    qrBox.innerHTML = "";


    if (
        PROMPTPAY_ID !==
        "ใส่เบอร์พร้อมเพย์ของคุณตรงนี้"
    ) {

        new QRCode(qrBox, {

            text:
                "https://promptpay.io/" +
                PROMPTPAY_ID +
                "/" +
                total,

            width: 220,

            height: 220

        });

    } else {

        qrBox.innerHTML = `
            <p>
                ⚠️ ยังไม่ได้ใส่เบอร์ PromptPay
            </p>

            <p>
                กรุณาใส่เบอร์ในตัวแปร
                PROMPTPAY_ID
            </p>
        `;

    }

});


// ======================================
// ปุ่มแจ้งว่าจ่ายแล้ว
// ======================================

document.getElementById("paidButton")
    .addEventListener("click", function () {

        document.getElementById("paymentBox")
            .style.display = "none";

        document.getElementById("successBox")
            .style.display = "block";

    });
