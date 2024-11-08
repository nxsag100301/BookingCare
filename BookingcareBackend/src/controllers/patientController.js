import db from '../models/index';
import patientService from "../services/patientService";

let patientBookAppointment = async (req, res) => {
    try {
        let inputData = req.body
        // console.log('check inputdata:', inputData)
        let booking = await patientService.patientBookAppointmentService(inputData)
        return res.status(200).json(booking)

    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: 1,
            message: 'Err from server'
        })
    }
}

let postverifyBookAppointment = async (req, res) => {
    try {
        let inputData = req.body
        // console.log('check inputdata:', inputData)
        let verify = await patientService.patientVerifyBookAppointmentService(inputData)
        return res.status(200).json(verify)

    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: 1,
            message: 'Err from server'
        })
    }
}

module.exports = {
    patientBookAppointment,
    postverifyBookAppointment
}