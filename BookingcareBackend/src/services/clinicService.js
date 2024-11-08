import db from '../models/index';


let postCreateNewClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.address
                || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            else {
                let res = await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        message: 'clinic created'
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        message: 'create clinic fail'
                    })
                }

            }

        }
        catch (e) {
            reject(e)
        }
    })
}

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Clinic.findAll({})
            if (res && res.length > 0) {
                res = res.map(item => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                });
            }
            if (!res) { res = {} }
            resolve({
                errCode: 0,
                message: 'get all clinic successs',
                data: res
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let getDetailClinicByIdService = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctors = [];
                    if (location === "ALL") {
                        doctors = await db.Doctor_Infor.findAll({
                            where: { clinicId: id },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    else {
                        doctors = await db.Doctor_Infor.findAll({
                            where: {
                                clinicId: id,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctors = doctors
                    resolve({
                        errCode: 0,
                        message: 'get detail clinic success',
                        data
                    })
                }
                else {
                    data = {}
                }
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let postEditClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.clinicId || !data.name
                || !data.address || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            else {
                await db.Clinic.update({
                    name: data.name,
                    image: data.image,
                    address: data.address,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                },
                    { where: { id: data.clinicId } }
                )
                resolve({
                    errCode: 0,
                    message: 'Clinic edited'
                })
            }

        }
        catch (e) {

        }
    })
}

let postDeleteClinicService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            else {
                await db.Clinic.destroy({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    message: 'Clinic deleted'
                })
            }

        }
        catch (e) {

        }
    })
}

module.exports = {
    postCreateNewClinicService, getAllClinicService,
    getDetailClinicByIdService, postEditClinicService,
    postDeleteClinicService
}