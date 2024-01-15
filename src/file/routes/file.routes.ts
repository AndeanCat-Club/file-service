import { Router } from 'express';
import fileController from '../controllers/file.controller';

class FileRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes(): void {
        this.router.post('/createFile', fileController.create);
        this.router.post('/getFile', fileController.getOne);
        this.router.put('/updateFile', fileController.create);
        this.router.delete('/deleteFile', fileController.delete);
    }
}

const fileRoutes = new FileRoutes();
export default fileRoutes.router;