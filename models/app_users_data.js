module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("users", {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: "email"
        },
        salt: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        countryCode: {
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        yob: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        weightUnit: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        heightFeet: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        heightInch: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        otp: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        deviceToken: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        jsonWebToken: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        refreshToken: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        profileImage: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        imageLink: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        isLoggedIn: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            default: false
        },
    })

    return Users
}