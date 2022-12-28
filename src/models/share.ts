/**
 "id": "3e2f885f-646d-43c2-a5de-7d3afc5bcb16",
 "pwd": null,
 "dateEnd": null,
 "dateInit": "2022-12-27",
 "status": 1,
 "folders": [
 {
            "name": "FG 132365",
            "status": 1,
            "idBranch": 1,
            "branch": null,
            "files": null
        }
 ],
 "idUser": 2410,
 "user": {
        "id": 2410,
        "username": "OG_CUESQUIVEL",
        "pwd": "pbkdf2:sha256:30$5m7FC6iikYjeWJaxJuJdkez6pLmOmX$6f68070a859870681e2e04b959d09dc117aa6128eb3b59653dd99e7940aee978",
        "status": 1,
        "role": 1,
        "idBranch": 1,
        "branch": null
    }
 * */
import Folder from "@/models/folder";
import User from "@/models/user";


export interface IShare {
    id?: string
    pwd?: string
    dateEnd?: string
    dateInit?: string
    status: number
    idUser: number
    folders: Folder[]
    user?: User
}

export class ShareDTO implements IShare {
    id?: string;
    pwd?: string;
    dateEnd?: string;
    dateInit?: string;
    status: number = 1;
    idUser: number = 0;
    folders: Folder[] = [];
    user?: User;
}

export default class Share extends ShareDTO {
    constructor(dto: ShareDTO){
        super();
        Object.assign(this, dto);
    }
}