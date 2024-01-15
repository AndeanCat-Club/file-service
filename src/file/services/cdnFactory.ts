import { CDNClient, FileInfo } from "../../shared/types";
import { DigitalOceanClient } from "./digitalOceanClient/digitalOceanClient";

export class CDNFactory{
    client: CDNClient;

    constructor(type: string){
        this.client = this.startClient(type);
    }

    startClient(type: string){
        switch(type){
            case 'digitalOcean':
                return new DigitalOceanClient();     
            default:
                throw new Error(`Not valid client type: ${type}`);
        }
    }

    async create(fileInfo: FileInfo, folder: String, privacy: string){
        return await this.client.create(fileInfo, folder, privacy);
    }

    async delete(storageData: any){
        await this.client.delete(storageData);       
    }

    async getOne(storageData: any){
        return await this.client.getOne(storageData);
    }
}