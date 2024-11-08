import db from '../models/index'
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
                attributes: ['id', 'email', 'roleid', 'firstname', 'lastname']
            })
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let checkpassword = await compareUserPassword(email, password)
                if (checkpassword === true) {
                    userData.errCode = 0;
                    userData.errMessage = 'Ok';
                    userData.user = user;
                }
                else {
                    userData.errCode = 1;
                    userData.errMessage = `Your password incorrect`
                }
                resolve(userData)
            }
            else {
                userData.errCode = 2;
                userData.errMessage = `Your email isn't exist`
                resolve(userData)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        }
        catch (e) {
            reject(e);
        }
    })
}



let compareUserPassword = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            })
            if (user) {
                let check = bcrypt.compareSync(password, user.password);
                if (check) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isEmailExist = await checkUserEmail(data.email);
            if (isEmailExist) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email already exists! Try another email'
                });
            } else {
                let hashPasswordfromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordfromBcrypt,
                    firstName: data.firstname,
                    lastName: data.lastname,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar
                });
                resolve({
                    errCode: 0,
                    errMessage: 'User created successfully'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userId,
                },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    message: `User isn't exists`
                });
            }
            else {
                await user.destroy();
                resolve({
                    errCode: 0,
                    message: `Deleted`
                });
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: data.id,
                },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    message: `User not found`
                });
            }
            else {
                await db.User.update({
                    firstName: data.firstname,
                    lastName: data.lastname,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar
                },
                    {
                        where: {
                            id: data.id
                        }
                    });

                resolve({
                    errCode: 0,
                    message: `Edited`
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: "Missing params input"
                })
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser,
    getAllCodeService: getAllCodeService

}