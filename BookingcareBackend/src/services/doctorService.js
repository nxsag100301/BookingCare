import { raw } from 'body-parser';
import db from '../models/index';
require('dotenv').config();
import _, { includes } from 'lodash';
import { where } from 'sequelize';
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEN', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEN', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                message: "Get doctor success",
                data: doctors
            })
            // console.log('sang check doctors:', doctors)
        }
        catch (e) {
            reject(e)
        }
    })
}

let getAllDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ['password', 'image']
                },
                include: [
                    { model: db.Schedule, attributes: ['timeType', 'date'] }
                ],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'get all doctor success',
                data: doctor
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown',
        'action', 'selectedPrice', 'selectedPayment',
        'selectedProvince', 'specialtyId', 'clinicId'
    ]
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[[i]]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let postDetailDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('input data:', inputData)
            let checkObj = checkRequiredFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    message: `Missing input params: ${checkObj.element}`
                })
            }
            else {
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }
                else if (inputData.action === "EDIT") {
                    await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                    },
                        { where: { doctorId: inputData.doctorId } }
                    )
                }

                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId }
                })
                if (doctorInfor) {
                    await db.Doctor_Infor.update({
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    },
                        { where: { doctorId: inputData.doctorId } }
                    )
                }
                else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }
                resolve({
                    errCode: 0,
                    message: 'Post detail doctor success'
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}


let getDetailDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Mising input params id'
                })
            }
            else {
                let detail = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                        // { model: db.Markdown }
                        {
                            model: db.Doctor_Infor,
                            attributes: [
                                'priceId', 'provinceId', 'paymentId',
                                'addressClinic', 'nameClinic', 'note', 'specialtyId', 'clinicId'
                            ],
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (detail && detail.image) {
                    detail.image = Buffer.from(detail.image, 'base64').toString('binary');
                }
                if (detail === null) { detail = {} }
                resolve({
                    errCode: 0,
                    message: 'get doctor details success',
                    data: detail
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule) {
                resolve({
                    errCode: 1,
                    message: 'missing params input arrSchedule'
                })
            }
            else {
                let schedule = data.arrSchedule;
                // console.log('sang check schedule:', schedule)
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        // console.log('sang check item:', item)
                        return item;
                    })
                }
                await db.Schedule.bulkCreate(schedule);
                resolve({
                    errCode: 0,
                    message: 'create schedule success'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errcode: 1,
                    message: 'Missing input params'
                })
            }
            else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    message: 'Get schedule success',
                    data: data
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

let getExtraInforDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Mising input params id'
                })
            }
            else {
                let infor = await db.Doctor_Infor.findOne({
                    where: { doctorId: id },
                    attributes: [
                        'priceId', 'provinceId', 'paymentId',
                        'addressClinic', 'nameClinic', 'note'
                    ],
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Clinic, attributes: ['name', 'address'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!infor) infor = {}
                resolve({
                    errCode: 0,
                    message: 'get extra infor success',
                    data: infor
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getProfileDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Mising input params id'
                })
            }
            else {
                let profile = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdown, attributes: ['description'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: [
                                'priceId', 'provinceId', 'paymentId',
                                'addressClinic', 'nameClinic', 'clinicId'
                            ],
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Clinic, attributes: ['name', 'address'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (profile && profile.image) {
                    profile.image = Buffer.from(profile.image, 'base64').toString('binary');
                }
                if (profile === null) { profile = {} }
                resolve({
                    errCode: 0,
                    message: 'get doctor details success',
                    data: profile
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getListPatientByDoctorService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            let data = await db.Booking.findAll({
                where: {
                    doctorId: doctorId,
                    date: date,
                    statusId: "S2"
                },
                include: [
                    {
                        model: db.User, as: 'patientData', attributes: ['email', 'firstName', 'phonenumber', 'address', 'gender'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                        ]
                    },
                    { model: db.Allcode, attributes: ['valueVi', 'valueEn'] }
                ],
                raw: false,
                nest: true
            })
            resolve({
                errCode: 0,
                message: 'get list patient by doctor success',
                data
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let postSendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.date) {
                return resolve({
                    errCode: 1,
                    message: 'Mising input params id'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        statusId: "S2",
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        date: data.date
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = "S3"
                    await appointment.save()
                    emailService.sendAttachment({
                        receivers: data.email,
                        patientName: data.patientName,
                        timeVi: data.timeVi,
                        timeEn: data.timeEn,
                        date: data.date,
                        doctorNameVi: data.doctorNameVi,
                        doctorNameEn: data.doctorNameEn,
                        language: data.language,
                        image: data.image
                    })
                    return resolve({
                        errCode: 0,
                        message: 'Remedy sent'
                    })
                }
                else {
                    return resolve({
                        errCode: 1,
                        message: 'Something wrong'
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorService: getAllDoctorService,
    postDetailDoctorService: postDetailDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraInforDoctorByIdService: getExtraInforDoctorByIdService,
    getProfileDoctorByIdService: getProfileDoctorByIdService,
    getListPatientByDoctorService: getListPatientByDoctorService,
    postSendRemedyService: postSendRemedyService

}