import AppError from "../../errorHandler/AppError"
import { IAuthProvider, IUser, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from 'http-status'
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env"
import { setTokens } from "../../utils/setTokens"
import { userSearchableFields } from "./user.constents"
import { QueryBuilder } from "../../utils/queryBuilder"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist !")
    }
    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
    )
    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    }
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    const tokens = setTokens({
        id: user._id.toString(),
        role: user.role
    })
    return { user, tokens }
}


const createHost = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist !")
    }
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const authProvider: IAuthProvider = { provider: 'credentials', providerId: email as string }
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        role: Role.HOST,
        ...rest
    })
    return user
}



const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .pagination();

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]);

    return { data, meta };
};


const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select('-password')
    return {
        user
    }
}


const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
}

export const UserServices = {
    createUser,
    createHost,
    getAllUsers,
    getSingleUser,
    getMe,
}
