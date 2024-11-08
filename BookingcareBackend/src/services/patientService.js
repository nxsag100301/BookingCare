import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let patientBookAppointmentService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email || !inputData.doctorId
                || !inputData.timeType || !inputData.date
                || !inputData.fullName || !inputData.gender
                || !inputData.address || !inputData.phoneNumber
            ) {
                resolve({
                    errCode: 1,
                    message: "Missing input params",
                })
            }
            else {
                let token = uuidv4();
                emailService.sendSimpleEmail({
                    receivers: inputData.email,
                    patientName: inputData.fullName,
                    time: inputData.time,
                    date: inputData.date,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    redirectLink: buildUrlEmail(inputData.doctorId, token)
                })
                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        roleId: "R3",
                        firstName: inputData.fullName,
                        gender: inputData.gender,
                        address: inputData.address,
                        phonenumber: inputData.phoneNumber
                    }
                })
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults:
                        {
                            statusId: "S1",
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    message: "booking appointment success",
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let patientVerifyBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    message: "Missing input params",
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1',
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        message: "Patient confirmed appointment"
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        message: `Appointment already confirmed or doesn't exist`
                    })
                }
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    patientBookAppointmentService,
    patientVerifyBookAppointmentService
}