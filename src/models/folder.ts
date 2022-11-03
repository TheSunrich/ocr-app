import Branch from "@/models/branch";

export interface IFolder {
    name: string
    status: number
    idBranch?: number
    branch?: Branch
}

export class FolderDTO implements IFolder {
    name: string = '';
    status: number = 1;
    idBranch?: number;
    branch?: Branch;
}

export default class Folder extends FolderDTO {
    constructor(dto: FolderDTO){
        super();
        Object.assign(this, dto);
    }
}