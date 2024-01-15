export interface CDNClient {
    create(fileInfo: FileInfo, folder: String, privacy: string): Promise<any>;
    delete(fileInfo: any): Promise<any>;
    getOne(fileInfo: any): Promise<any>;
}

export interface FileInfo {
    fileName: string;
    fileSize: number;
    mimetype: string;
    encoding: string;
    fileData: Buffer;
}