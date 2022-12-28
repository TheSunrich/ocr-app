
export interface IBranch {

    id?: number
    serie: string
    name: string
    city: string
    state: string
    status: number
}

export class BranchDTO implements IBranch {
    id?: number;
    serie: string = ''
    name: string = '';
    city: string = '';
    state: string = '';
    status: number = 1;
}

export default class Branch extends BranchDTO {
    constructor(dto: BranchDTO){
        super();
        Object.assign(this, dto);
    }
}