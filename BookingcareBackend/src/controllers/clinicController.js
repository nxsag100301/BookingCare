import clinicService from "../services/clinicService";


let postCreateNewClinic = async (req, res) => {
    try {
        let data = req.body
        // console.log('sang check req.body:', data)
        let infor = await clinicService.postCreateNewClinicService(data)
        res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinicService()
        res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let id = req.query.id
        let location = req.query.location
        let infor = await clinicService.getDetailClinicByIdService(id, location)
        res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let postEditClinic = async (req, res) => {
    try {
        let data = await clinicService.postEditClinicService(req.body)
        res.status(200).json(data)
    }
    catch (e) {
        console.log(e)
        res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

let postDeleteClinic = async (req, res) => {
    try {
        let id = req.body.id
        let data = await clinicService.postDeleteClinicService(id)
        res.status(200).json(data)
    }
    catch (e) {
        console.log(e)
        res.status(200).json({
            errCode: 1,
            message: 'err from server'
        })
    }
}

module.exports = {
    postCreateNewClinic, getAllClinic,
    getDetailClinicById, postEditClinic,
    postDeleteClinic
}