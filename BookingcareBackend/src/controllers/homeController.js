import db from '../models/index'
import CRUDService from '../services/CRUDService'



let getHomepage = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render("homepage.ejs", { data: JSON.stringify(data) });
};

let getCRUD = async (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    res.redirect('/');
};

let getDisplayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render("displaycrud.ejs", { data: data });
};

let getEditCRUD = async (req, res) => {
    let userId = req.params.id;
    if (userId) {
        let userData = await CRUDService.getUserById(userId);
        return res.render('editcrud.ejs', { data: userData })
    }
    else {
        return res.redirect('/');
    }
};

let postupdateCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.redirect('/get-display-crud');
}

let postDeleteCRUD = async (req, res) => {
    let userId = req.params.id;
    await CRUDService.deleteUser(userId);
    return res.redirect('/get-display-crud');

}

module.exports = {
    getHomepage: getHomepage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    getDisplayCRUD: getDisplayCRUD,
    getEditCRUD: getEditCRUD,
    postupdateCRUD: postupdateCRUD,
    postDeleteCRUD: postDeleteCRUD
}