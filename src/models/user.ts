import Branch from "@/models/branch";

export interface IUser {
    id: number
    username: string
    pwd: string
    role: number
    name: string
    status: number
    idBranch?: number
    branch?: Branch
}

export class UserDTO implements IUser {
    id: number = 0
    username: string = ''
    pwd: string = ''
    role: number = 0
    name: string = '';
    status: number = 1;
    idBranch?: number;
    branch?: Branch;
}

export default class User extends UserDTO {
    constructor(dto: UserDTO){
        super();
        Object.assign(this, dto);
    }
}