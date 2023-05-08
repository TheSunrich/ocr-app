
export interface IClient {
    id?: number
    name: string
    phone: string
    email: string
    idCompany: number
    username: string
    status: number
    role: number
}


export class ClientDTO implements IClient {
    id?: number
    name: string = '';
    phone: string = '';
    email: string = '';
    idCompany: number = 0;
    username: string = '';
    status: number = 0;
    role: number = 0;
}

export default class Client extends ClientDTO {
    constructor(dto: ClientDTO){
        super();
        Object.assign(this, dto);
    }
}