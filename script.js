document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // ตัวแปร
    // ==============================

    let selectedFile = null;
    let totalPages = 0;


    // ==============================
    // เชื่อมกับ HTML
    // ==============================

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

    const printButton =
        document.getElementById("printButton");

    const status =
        document.getElementById("status");


    // ==============================
    // ตั้งค่า PDF.js
    // ==============================

    if (typeof pdfjsLib === "undefined") {

        pageCount.textContent =
            "❌ ระบบอ่าน PDF ไม่พร้อมใช้งาน";

        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


    // ==============================
    // เลือกไฟล์ PDF
    // ==============================

    fileInput.addEventListener("change", async function () {

        const file = fileInput.files[0];

        if (!file) {
            return;
        }


        // ตรวจสอบ PDF

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


        // กำลังนับหน้า

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


            totalPages = pdf.numPages;


            // แสดงจำนวนหน้า

            pageCount.textContent =
                "📑 จำนวน " +
                totalPages +
                " หน้า";


            // แสดงตั้งค่าปริ้น

            printSetting.style.display =
                "block";


            // คำนวณราคา

            calculatePrice();


        } catch (error) {

            console.error(error);

            pageCount.textContent =
                "❌ อ่านไฟล์ PDF ไม่สำเร็จ";

        }

    });


    // ==============================
    // เปลี่ยนขนาดกระดาษ
    // ==============================

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


    // ==============================
    // คำนวณราคา
    // ==============================

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


        // ==================================
        // A4
        // ==================================

        if (paperSize.value === "A4") {

            // A4 ขาวดำ = 1 บาท
            // A4 สี = 4 บาท

            if (color.value === "black") {

                pricePerPage = 1;

            } else {

                pricePerPage = 4;

            }
        }


        // ==================================
        // A5
        // ==================================

        else if (paperSize.value === "A5") {


            // ------------------------------
            // A5 เอกสาร
            // ------------------------------

            if (a5Type.value === "document") {

                // ขาวดำ = 1
                // สี = 2

                if (color.value === "black") {

                    pricePerPage = 1;

                } else {

                    pricePerPage = 2;

                }

            }


            // ------------------------------
            // A5 การ์ด
            // ------------------------------

            else if (a5Type.value === "card") {

                // ขาวดำ = 8
                // สี = 10

                if (color.value === "black") {

                    pricePerPage = 8;

                } else {

                    pricePerPage = 10;

                }

            }


            // ------------------------------
            // A5 สติกเกอร์
            // ------------------------------

            else if (a5Type.value === "sticker") {

                // ขาวดำ = 8
                // สี = 15

                if (color.value === "black") {

                    pricePerPage = 8;

                } else {

                    pricePerPage = 15;

                }

            }

        }


        // ==================================
        // คำนวณราคารวม
        // ==================================

        const totalPrice =
            totalPages *
            pricePerPage *
            numberOfCopies;


        // แสดงราคา

        price.textContent =
            totalPrice.toLocaleString("th-TH") +
            " บาท";

    }


    // ==============================
    // เปลี่ยนสี
    // ==============================

    color.addEventListener(
        "change",
        calculatePrice
    );


    // ==============================
    // เปลี่ยนจำนวนชุด
    // ==============================

    copies.addEventListener(
        "input",
        calculatePrice
    );


    // ==============================
    // เปลี่ยนประเภท A5
    // ==============================

    a5Type.addEventListener(
        "change",
        calculatePrice
    );


    // ==============================
    // ปุ่มยืนยันปริ้น
    // ==============================

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

                copies.value = 1;
            }


            let pricePerPage = 0;


            // ==================================
            // A4
            // ==================================

            if (paperSize.value === "A4") {

                if (color.value === "black") {

                    pricePerPage = 1;

                } else {

                    pricePerPage = 4;

                }

            }


            // ==================================
            // A5
            // ==================================

            else if (paperSize.value === "A5") {


                if (a5Type.value === "document") {

                    if (color.value === "black") {

                        pricePerPage = 1;

                    } else {

                        pricePerPage = 2;

                    }

                }


                else if (a5Type.value === "card") {

                    if (color.value === "black") {

                        pricePerPage = 8;

                    } else {

                        pricePerPage = 10;

                    }

                }


                else if (a5Type.value === "sticker") {

                    if (color.value === "black") {

                        pricePerPage = 8;

                    } else {

                        pricePerPage = 15;

                    }

                }

            }


            // ==================================
            // ราคารวม
            // ==================================

            const totalPrice =
                totalPages *
                pricePerPage *
                numberOfCopies;


            // ==================================
            // ชื่อสี
            // ==================================

            const colorText =
                color.value === "black"
                    ? "ขาวดำ"
                    : "สี";


            // ==================================
            // ชื่อประเภท A5
            // ==================================

            let typeText = "-";


            if (paperSize.value === "A5") {

                typeText =
                    a5Type.options[
                        a5Type.selectedIndex
                    ].text;

            }


            // ==================================
            // แสดงสถานะ
            // ==================================

            status.innerHTML = `

                <strong>
                    🖨️ สรุปคำสั่งปริ้น
                </strong>

                <br><br>

                📄 ไฟล์:
                ${selectedFile.name}

                <br>

                📑 จำนวน:
                ${totalPages} หน้า

                <br>

                📄 กระดาษ:
                ${paperSize.value}

                <br>

                📦 ประเภท:
                ${typeText}

                <br>

                🎨 สี:
                ${colorText}

                <br>

                🔢 จำนวนชุด:
                ${numberOfCopies} ชุด

                <br><br>

                💰
                <strong>
                    รวม ${totalPrice} บาท
                </strong>

            `;

        }
    );

});
