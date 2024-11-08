import db from '../models/index'
import doctorService from "../services/doctorService"

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10;
    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(doctors);

    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: 1,
            message: 'Err from server'
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let doctor = await doctorService.getAllDoctorService(doctor);
        return res.status(200).json(doctor);

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        });
    }
}

let postDetailDoctor = async (req, res) => {
    try {
        let response = await doctorService.postDetailDoctorService(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let id = req.query.id;
        let detail = await doctorService.getDetailDoctorByIdService(id)
        return res.status(200).json(detail)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let data = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(data)

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }

}

let getScheduleByDate = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;
        let data = await doctorService.getScheduleByDateService(doctorId, date);
        return res.status(200).json(data)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let id = req.query.id;
        let infor = await doctorService.getExtraInforDoctorByIdService(id)
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let id = req.query.doctorId;
        let profile = await doctorService.getProfileDoctorByIdService(id)
        return res.status(200).json(profile)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let getListPatientByDoctor = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;
        // console.log('check id:', doctorId, 'date:', date)
        let data = await doctorService.getListPatientByDoctorService(doctorId, date)
        return res.status(200).json(data)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let postSendRemedy = async (req, res) => {
    try {
        let data = await doctorService.postSendRemedyService(req.body)
        return res.status(200).json(data)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    postDetailDoctor: postDetailDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientByDoctor: getListPatientByDoctor,
    postSendRemedy: postSendRemedy

}