
export interface ICompany {
    id?: number
    name: string
    companyName: string
    businessLine: string
    phone: string
    email: string
    rfc: string
}

export class CompanyDTO implements ICompany {
    id?: number;
    name: string= ''
    companyName: string= '';
    businessLine: string= '';
    phone: string= '';
    email: string = '';
    rfc: string = '';
}

export default class Company extends CompanyDTO {
    constructor(dto: CompanyDTO){
        super();
        Object.assign(this, dto);
    }
}