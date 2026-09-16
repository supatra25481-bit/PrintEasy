const fileInput =
    document.getElementById("fileInput");

const fileName =
    document.getElementById("fileName");

const pageCount =
    document.getElementById("pageCount");

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


let totalPages = 0;

let selectedFile = null;


// PDF.js

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// เลือก PDF

fileInput.addEventListener(
    "change",
    async function () {

        selectedFile =
            fileInput.files[0];

        if (!selectedFile) {
            return;
        }


        fileName.textContent =
            "📄 " + selectedFile.name;


        pageCount.textContent =
            "⏳ กำลังนับจำนวนหน้า...";


        try {

            const data =
                await selectedFile.arrayBuffer();


            const pdf =
                await pdfjsLib
                    .getDocument(data)
                    .promise;


            totalPages =
                pdf.numPages;


            pageCount.textContent =
                "📑 จำนวน " +
                totalPages +
                " หน้า";


            printSetting.style.display =
                "block";


            calculatePrice();

        }

        catch (error) {

            console.error(error);

            pageCount.textContent =
                "❌ อ่านไฟล์ไม่ได้";

        }

    }
);


// เลือก A4 / A5

paperSize.addEventListener(
    "change",
    function () {

        if (paperSize.value === "A5") {

            a5TypeBox.style.display =
                "block";

        }

        else {

            a5TypeBox.style.display =
                "none";

        }


        calculatePrice();

    }
);


// คำนวณราคา

function calculatePrice() {

    if (totalPages === 0) {
        return;
    }


    const numberOfCopies =
        Number(copies.value);


    let pricePerPage;


    // A4

    if (paperSize.value === "A4") {

        if (color.value === "black") {

            pricePerPage = 1;

        }

        else {

            pricePerPage = 5;

        }

    }


    // A5

    else {

        if (color.value === "black") {

            pricePerPage = 1;

        }

        else {

            pricePerPage = 4;

        }

    }


    const total =
        totalPages *
        numberOfCopies *
        pricePerPage;


    price.textContent =
        total + " บาท";

}


// เปลี่ยนสี

color.addEventListener(
    "change",
    calculatePrice
);


// เปลี่ยนจำนวนชุด

copies.addEventListener(
    "input",
    calculatePrice
);


// เปลี่ยนประเภท A5

a5Type.addEventListener(
    "change",
    calculatePrice
);


// ปุ่มสั่งปริ้น

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
            Number(copies.value);


        let pricePerPage;


        if (paperSize.value === "A4") {

            pricePerPage =
                color.value === "black"
                ? 1
                : 5;

        }

        else {

            pricePerPage =
                color.value === "black"
                ? 1
                : 4;

        }


        const total =
            totalPages *
            numberOfCopies *
            pricePerPage;


        status.textContent =
            "✅ เตรียมคำสั่งปริ้นเรียบร้อย";


        alert(

            "สรุปคำสั่งปริ้น\n\n" +

            "ไฟล์: " +
            selectedFile.name +

            "\nจำนวนหน้า: " +
            totalPages +

            " หน้า" +

            "\nกระดาษ: " +
            paperSize.value +

            "\nสี: " +
            (
                color.value === "black"
                ? "ขาวดำ"
                : "สี"
            ) +

            "\nจำนวนชุด: " +
            numberOfCopies +

            "\nรวม: " +
            total +
            " บาท"

        );

    }
);