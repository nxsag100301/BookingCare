require('dotenv').config();
const nodemailer = require("nodemailer");
import moment from "moment";

let sendSimpleEmail = async (dataSend) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let info = await transporter.sendMail({
            from: '"Nguyễn Xuân Sáng SERN" <nxsag100301@gmail.com>', // sender address
            to: dataSend.receivers, // list of receivers
            subject: "Thông tin đặt lịch khám bệnh", // Subject line
            html: getBodyHTMLEmail(dataSend), // HTML body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName}</h3>
            <p>Bạn đã đặt lịch khám bệnh từ nxsag SERN</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div>
                Thời gian: <b>${dataSend.time} Ngày: ${moment(Number(dataSend.date)).format('DD/MM/YYYY')}</b>
            </div>
            <div>
                Bác sĩ khám: <b>${dataSend.doctorName}</b>
            </div>
            <p>Click vào link này để xác nhận đặt lịch khám</p>
            <p>
                <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
            </p>
            <div>Thank you for using nxsag SERN</div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
            <h3>Hello ${dataSend.patientName}</h3>
            <p>You have booked a medical appointment from nxsag SERN</p>
            <p>Appointment details:</p>
            <div>
                Time: <b>${dataSend.time} Date: ${moment(Number(dataSend.date)).format('DD/MM/YYYY')}</b>
            </div>
            <div>
                Doctor: <b>${dataSend.doctorName}</b>
            </div>
            <p>Click on this link to confirm your appointment</p>
            <p>
                <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
            </p>
            <div>Thank you for using nxsag SERN</div>
        `;
    }
    return result;
};

let sendAttachment = async (dataSend) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        // Tách phần định dạng và dữ liệu từ chuỗi base64
        const base64Data = dataSend.image.split(",")[1]; // Lấy phần dữ liệu
        const mimeType = dataSend.image.split(";")[0].split(":")[1]; // Lấy định dạng (MIME type)

        // Tạo tên tệp dựa trên định dạng
        const extension = mimeType.split("/")[1]; // Lấy phần định dạng, ví dụ: "jpeg", "png"
        const filename = `${dataSend.patientName}'s Remedy.${extension}`; // Tạo tên tệp như remedy.jpeg hoặc remedy.png

        let info = await transporter.sendMail({
            from: '"Nguyễn Xuân Sáng SERN" <nxsag100301@gmail.com>',
            to: dataSend.receivers,
            subject: "Kết quả khám bệnh",
            html: getBodyHTMLEmailRemedy(dataSend),
            attachments: [
                {
                    filename: filename,
                    content: base64Data,
                    encoding: 'base64' // Định dạng là base64
                }
            ]
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName}</h3>
            <p>Bạn đã khám bệnh xong từ nxsag SERN</p>
            <p>Thông tin lịch khám bệnh:</p>
            <div>
                Thời gian: <b>${dataSend.timeVi} Ngày: ${moment(Number(dataSend.date)).format('DD/MM/YYYY')}</b>
            </div>
            <div>
                Bác sĩ khám: <b>${dataSend.doctorNameVi}</b>
            </div>
            <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
            <p>

            </p>
            <div>Cảm ơn vì đã sử dụng nxsag SERN</div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
            <h3>Hello ${dataSend.patientName}</h3>
            <p>You have completed your medical examination at nxsag SERN</p>
            <p>Appointment details:</p>
            <div>
                 Time: <b>${dataSend.timeEn} Date: ${moment(Number(dataSend.date)).format('DD/MM/YYYY')}</b>
            </div>
            <div>
                 Doctor: <b>${dataSend.doctorNameEn}</b>
            </div>
            <p>The prescription/invoice is attached in the file</p>
            <p>
        
            </p>
            <div>Thank you for using nxsag SERN</div>        
        `;
    }
    return result;
}

module.exports = {
    sendSimpleEmail, sendAttachment
};
