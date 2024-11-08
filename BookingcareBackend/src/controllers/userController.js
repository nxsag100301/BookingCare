import db from '../models/index'
import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input params'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id; // all, id
    let data = await userService.getAllUser(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'get success',
        data: data
    })
}

let handleCreateNewUser = async (req, res) => {
    let data = req.body.data;
    let dataUser = await userService.createNewUser(data);
    // console.log('check req.body from nodejs createuser:', data)
    return res.status(200).json({ dataUser })

}

let handleEditUser = async (req, res) => {
    let databody = req.body;
    // console.log('check req.body from nodejs edituser:', data)
    if (!databody.id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing input params id"
        })
    }
    let data = await userService.editUser(databody);
    return res.status(200).json({ data })
}

let handleDeleteUser = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing input params id"
        })
    }
    let data = await userService.deleteUser(id);
    return res.status(200).json({ data })
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);

    }
    catch (e) {
        console.log('Err code from nodejs:', e)
        return res.status(200).json({
            errCode: -1,
            message: 'Err form server'
        })
    }
}


module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode

}