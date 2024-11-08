'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('schedules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            currentNumber: {
                type: Sequelize.INTEGER
            },
            maxNumber: {
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.STRING
            },
            timeType: {
                type: Sequelize.STRING
            },
            doctorId: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Thêm ràng buộc UNIQUE cho doctorId, date và timeType
        await queryInterface.addConstraint('schedules', {
            fields: ['doctorId', 'date', 'timeType'],
            type: 'unique',
            name: 'unique_schedule_constraint' // Tên của constraint
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Xóa ràng buộc UNIQUE trước khi xóa bảng (nếu cần)
        await queryInterface.removeConstraint('schedules', 'unique_schedule_constraint');
        await queryInterface.dropTable('schedules');
    }
};
