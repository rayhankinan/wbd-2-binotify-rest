import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import multer from "multer";

export class UploadMiddleware {
    upload(filename: string) {
        const storage = multer.diskStorage({
            destination: function (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void
            ) {
                callback(null, path.join(__dirname, "..", "..", "uploads"));
            },
            filename: function (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void
            ) {
                const uniqueSuffix = uuidv4();
                callback(
                    null,
                    `${path.parse(file.originalname).name}-${uniqueSuffix}.mp3`
                );
            },
        });
        const upload = multer({ storage: storage });

        return upload.single(filename);
    }
}
