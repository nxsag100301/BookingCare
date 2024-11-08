import { where } from 'sequelize';
import db from '../models/index';


let postCreateNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            else {
                let res = await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        message: 'specialty created'
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        message: 'create specialty fail'
                    })
                }

            }

        }
        catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Specialty.findAll({
                attributes: {
                    exclude: ['descriptionHTML', 'descriptionMarkdown']
                }
            })
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
                message: 'get all specialty successs',
                data: res
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialtyByIdService = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    message: 'missing input params'
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                    nest: true,
                })
                if (data) {
                    let doctors = []
                    if (location === "ALL") {
                        doctors = await db.Doctor_Infor.findAll({
                            where: { specialtyId: id },
                            nest: true,
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    else {
                        //find by location
                        doctors = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location
                            },
                            nest: true,
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctors = doctors;
                    resolve({
                        errCode: 0,
                        message: 'get specialty success',
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



module.exports = {
    postCreateNewSpecialtyService, getAllSpecialtyService,
    getDetailSpecialtyByIdService
}