/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHandler/AppError"
import { IAuthProvider, IUser, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from 'http-status'
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env"
import { setTokens } from "../../utils/setTokens"
import { userSearchableFields } from "./user.constents"
import { QueryBuilder } from "../../utils/queryBuilder"
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config"

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


const createHost = async (payload: Partial<IUser>): Promise<IUser> => {
    const { email, password, ...rest } = payload;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email is required!");
    }

    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required!");
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
    }

    const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

    // provider must be literal type "credentials"
    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email,
    };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        role: Role.HOST,
        ...rest, // rest should only include IUser fields
    });

    return user;
};




const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find().select('-password'), query)
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




const getAllHosts = async (query: Record<string, any>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm || "";

    // 🔍 search condition (name OR email)
    const searchCondition = searchTerm
        ? {
              $or: [
                  { name: { $regex: searchTerm, $options: "i" } },
                  { email: { $regex: searchTerm, $options: "i" } },
              ],
          }
        : {};

    const filterCondition = {
        role: Role.HOST,
        ...searchCondition,
    };

    const data = await User.find(filterCondition)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(filterCondition);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
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



const updateMyProfile = async (userId: string, payload: Partial<IUser>): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found"); 
  const allowedFields: (keyof IUser)[] = ["name", "phone", "address", "picture", "bio"]; 
  // যদি নতুন ছবি আসে এবং আগের picture থাকে
  if (payload.picture && user.picture) {
    // আগের ছবি delete
    await deleteImageFromCLoudinary(user.picture);
  } 
  // update allowed fields
  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      user.set(field, payload[field]);
    }
  } 
  await user.save();
  return user;
};




const updateUserByAdmin = async (userId: string, payload: Partial<IUser>) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    const allowedFields: (keyof IUser)[] = ["isDeleted", "isActive", "isVerified"];
    allowedFields.forEach((field) => {
        if (payload[field] !== undefined) {
            user.set(field, payload[field]);
        }
    });
    await user.save();
    return user;
};



export const UserServices = {
    createUser,
    createHost,
    getAllUsers,
    getAllHosts,
    getSingleUser,
    getMe,
    updateMyProfile,
    updateUserByAdmin
}
