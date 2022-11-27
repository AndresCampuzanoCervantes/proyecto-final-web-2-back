const {
    sequelize,
    Usuarios: userModel,
} = require("../models");
const bcrypt = require("bcrypt");

const getUser = async (id) => {
    const user = await userModel.findOne({
        where: {
            id,
            estado: 1,
        },
    });
    return user;
}

const getUsers = async (where) => {
    const users = await userModel.findAll({
        where: { estado: 1, ...where },
        order: [["id", "DESC"]]
    });
    return users;
}

const createUser = async (userData) => {
    const t = await sequelize.transaction();

    try {
        let userDocument = null;
        if (userData.documento !== "") {
            userDocument = await userModel.findOne({
                where: {
                    documento: userData.documento,
                    estado: 1,
                },
            });
        }

        const userEmail = await userModel.findOne({
            where: {
                email: userData.email,
                estado: 1,
            },
        });
        if (!userDocument) {
            if (!userEmail) {
                const passwordCrypt = await bcrypt.hash(userData.password, 10);
                const { id: newUser } = await userModel.create(
                    { ...userData, password: passwordCrypt },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return {
                    success: true,
                    newUser,
                };
            } else {
                await t.rollback();
                return {
                    success: false,
                    message: "Ya existe un usuario con ese correo electrónico.",
                };
            }
        } else {
            await t.rollback();
            return {
                success: false,
                message: "Ya existe un usuario con ese documento.",
            };
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const updateUser = async (userData, userId) => {
    const t = await sequelize.transaction();

    try {
        const user = await userModel.findOne({
            where: {
                id: userId,
                estado: 1,
            },
        });

        if (userData.email && user.email !== userData.email) {
            const userEmail = await userModel.findOne({
                where: {
                    email: userData.email,
                    estado: 1,
                },
            });
            if (userEmail) {
                await t.rollback();
                return {
                    success: false,
                    message: "Ya existe un usuario con ese correo electrónico.",
                };
            }
        }
        let passwordCrypt = "";

        if (userData.id_usuario_aprueba) {
            await userApproveModel.create({
                id_usuario_aprobado: userId,
                id_usuario_aprueba: userData.id_usuario_aprueba,
            });
        }

        if (userData.password) {
            passwordCrypt = await bcrypt.hash(userData.password, 10);
        } else {
            passwordCrypt = user.password;
        }

        await userModel.update(
            { ...userData, password: passwordCrypt },
            {
                where: {
                    id: userId,
                },
                transaction: t,
            }
        );

        await t.commit();
        const userUpdated = await userModel.findOne({
            where: { id: userId, estado: 1 },
            include: [
                {
                    model: userGroupModel,
                    as: "grupoUsuarios",
                    where: { estado: 1 },
                },
            ],
        });
        return {
            success: true,
            userUpdated,
        };
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const deleteUser = async (userId) => {
    const t = await sequelize.transaction();

    try {
        await userModel.update(
            {
                estado: -1,
            },
            {
                where: {
                    id: userId,
                },
                transaction: t,
            }
        );

        await t.commit();
        return { success: true, userId };
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const signin = async (data) => {
    const t = await sequelize.transaction();
    try {
        const user = await userModel.findOne({
            where: { email: data.email, estado: 1 },
            include: [
                {
                    model: userGroupModel,
                    as: "grupoUsuarios",
                    where: { estado: 1 },
                },
            ],
        });

        if (user) {
            if (!(await bcrypt.compare(data.password, user.password))) {
                await t.rollback();
                return { success: false, message: "Contraseña incorrecta" };
            }

            return { success: true, user};
        } else {
            return {
                sucess: false,
                message: "El usuario no ha sido creado o está inactivo",
            };
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const changePassword = async ({ currentPassword, password, userId }) => {
    const t = await sequelize.transaction();
    try {
        const user = await this.getUser(userId);

        if (currentPassword) {
            if (!(await bcrypt.compare(currentPassword, user.password))) {
                throw new Error("Contraseña invalida");
            }
        }

        const passwordCrypt = await bcrypt.hash(password, 10);
        await userModel.update(
            { password: passwordCrypt },
            {
                where: { id: userId },
                transaction: t,
            }
        );
        await t.commit();
        return {
            success: true,
            userId,
        };
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    signin
};