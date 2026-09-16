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


/* =====================================
   PROMPTPAY
   ===================================== */

const PROMPTPAY_ID = "0999066313";


/* =====================================
   PDF.JS
   ===================================== */

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


/* =====================================
   เลือกไฟล์
   ===================================== */

fileInput.addEventListener("change", async function () {

    selectedFile = fileInput.files[0];

    if (!selectedFile) return;

    fileName.textContent =
        "📄 " + selectedFile.name;

    pageCount.textContent =
        "⏳ กำลังนับจำนวนหน้า...";

    try {

        const data =
            await selectedFile.arrayBuffer();

        const pdf =
            await pdfjsLib
                .getDocument({ data })
                .promise;

        totalPages = pdf.numPages;

        pageCount.textContent =
            "📑 จำนวน " + totalPages + " หน้า";

        printSetting.style.display =
            "block";

        calculatePrice();

    } catch (error) {

        console.error(error);

        pageCount.textContent =
            "❌ ไม่สามารถอ่านไฟล์ PDF ได้";

    }

});


/* =====================================
   เลือก A4 / A5
   ===================================== */

paperSize.addEventListener("change", function () {

    if (paperSize.value === "A5") {

        a5TypeBox.style.display =
            "block";

    } else {

        a5TypeBox.style.display =
            "none";

    }

    calculatePrice();

});


/* =====================================
   คำนวณราคา
   ===================================== */

function calculatePrice() {

    if (totalPages === 0) return;

    const numberOfCopies =
        Math.max(1, Number(copies.value));

    let pricePerPage;


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
        total.toLocaleString() +
        " บาท";

}


/* =====================================
   เปลี่ยนสี
   ===================================== */

color.addEventListener(
    "change",
    calculatePrice
);


/* =====================================
   เปลี่ยนจำนวนชุด
   ===================================== */

copies.addEventListener(
    "input",
    calculatePrice
);


/* =====================================
   เปลี่ยนประเภท A5
   ===================================== */

a5Type.addEventListener(
    "change",
    calculatePrice
);


/* =====================================
   กดปุ่มปริ้น
   ===================================== */

printButton.addEventListener(
    "click",
    function () {

        if (!selectedFile) {

            alert(
                "กรุณาเลือกไฟล์ PDF ก่อน"
            );

            return;

        }


        const numberOfCopies =
            Math.max(1, Number(copies.value));


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


        /* =============================
           แสดงสรุป
           ============================= */

        document.getElementById(
            "paymentBox"
        ).style.display = "block";


        printSetting.style.display =
            "none";


        const summary =
            document.getElementById(
                "summary"
            );


        let a5Text = "";


        if (paperSize.value === "A5") {

            a5Text = `
                <div class="summary-item">
                    📦 ประเภท A5:
                    ${a5Type.options[
                        a5Type.selectedIndex
                    ].text}
                </div>
            `;

        }


        summary.innerHTML = `

            <div class="summary-item">
                📄 ไฟล์:
                ${selectedFile.name}
            </div>

            <div class="summary-item">
                📑 จำนวน:
                ${totalPages} หน้า
            </div>

            <div class="summary-item">
                📄 กระดาษ:
                ${paperSize.value}
            </div>

            ${a5Text}

            <div class="summary-item">
                🎨 สี:
                ${
                    color.value === "black"
                    ? "ขาวดำ"
                    : "สี"
                }
            </div>

            <div class="summary-item">
                🔢 จำนวนชุด:
                ${numberOfCopies}
            </div>

            <div class="summary-total">
                💰 ${total.toLocaleString()} บาท
            </div>

        `;


        /* =============================
           สร้าง QR
           ============================= */

        const qrBox =
            document.getElementById(
                "qrcode"
            );


        qrBox.innerHTML = "";


        /*
         * หมายเหตุ:
         * ส่วนนี้สร้าง QR จากข้อมูล
         * PromptPay ที่กำหนด
         */

        const payload =
            createPromptPayPayload(
                PROMPTPAY_ID,
                total
            );


        new QRCode(qrBox, {

            text: payload,

            width: 230,

            height: 230,

            correctLevel:
                QRCode.CorrectLevel.M

        });

    }
);


/* =====================================
   สร้าง PromptPay Payload
   ===================================== */

function createPromptPayPayload(
    mobile,
    amount
) {

    let phone =
        mobile.replace(/\D/g, "");


    if (phone.startsWith("0")) {

        phone =
            "0066" +
            phone.substring(1);

    }


    const merchantInfo =
        "0016A000000677" +
        "010111" +
        "0113" +
        phone;


    const merchantInfoField =
        "29" +
        merchantInfo.length
            .toString()
            .padStart(2, "0") +
        merchantInfo;


    const amountText =
        Number(amount)
            .toFixed(2);


    let payload =
        "000201" +
        "010212" +
        merchantInfoField +
        "5303764" +
        "54" +
        amountText.length
            .toString()
            .padStart(2, "0") +
        amountText +
        "5802TH" +
        "6304";


    const crc =
        calculateCRC16(payload);


    return payload + crc;

}


/* =====================================
   CRC16
   ===================================== */

function calculateCRC16(
    data
) {

    let crc = 0xFFFF;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        crc ^=
            data.charCodeAt(i) << 8;


        for (
            let j = 0;
            j < 8;
            j++
        ) {

            if (crc & 0x8000) {

                crc =
                    (crc << 1) ^
                    0x1021;

            } else {

                crc =
                    crc << 1;

            }

            crc &=
                0xFFFF;

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4, "0");

}


/* =====================================
   ชำระเงินแล้ว
   ===================================== */

const paidButton =
    document.getElementById(
        "paidButton"
    );


if (paidButton) {

    paidButton.addEventListener(
        "click",
        function () {

            document.getElementById(
                "paymentBox"
            ).style.display = "none";


            document.getElementById(
                "successBox"
            ).style.display = "block";


            status.textContent =
                "✅ รับคำสั่งปริ้นแล้ว";

        }
    );

}
