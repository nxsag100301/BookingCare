import specialtyService from "../services/specialtyService";

let postCreateNewSpecialty = async (req, res) => {
    try {
        let data = req.body
        // console.log('sang check req.body:', data)
        let infor = await specialtyService.postCreateNewSpecialtyService(data)
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

let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.getAllSpecialtyService()
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

let getDetailSpecialtyById = async (req, res) => {
    try {
        let id = req.query.id
        let location = req.query.location
        let infor = await specialtyService.getDetailSpecialtyByIdService(id, location)
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

module.exports = {
    postCreateNewSpecialty, getAllSpecialty,
    getDetailSpecialtyById
}