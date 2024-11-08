import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController"


let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomepage);

    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);

    router.get("/get-display-crud", homeController.getDisplayCRUD);

    router.get("/edit-crud/:id", homeController.getEditCRUD);

    router.post("/post-update-crud", homeController.postupdateCRUD);

    router.post("/delete-crud/:id", homeController.postDeleteCRUD);

    router.post("/api/login", userController.handleLogin);

    router.get('/api/get-all-user', userController.handleGetAllUser);

    router.post('/api/create-new-user', userController.handleCreateNewUser)

    router.put('/api/edit-user', userController.handleEditUser)

    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)

    router.get('/api/get-all-doctor', doctorController.getAllDoctor)

    router.post('/api/post-detail-doctor', doctorController.postDetailDoctor)

    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)

    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)

    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.post('/api/patient-book-appointment', patientController.patientBookAppointment)

    router.post('/api/verify-book-appointment', patientController.postverifyBookAppointment)

    router.post('/api/create-new-specialty', specialtyController.postCreateNewSpecialty)

    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)

    router.post('/api/create-new-clinic', clinicController.postCreateNewClinic)

    router.get('/api/get-all-clinic', clinicController.getAllClinic)

    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)

    router.post('/api/post-edit-clinic', clinicController.postEditClinic)

    router.delete('/api/post-delete-clinic', clinicController.postDeleteClinic)

    router.get('/api/get-list-patient-by-doctor', doctorController.getListPatientByDoctor)

    router.post('/api/send-remedy', doctorController.postSendRemedy)

    return app.use("/", router);
}

module.exports = initWebRoutes;