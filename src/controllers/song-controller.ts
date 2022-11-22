import { Request, Response } from "express";

export class SongController {
    store() {
        return async (req: Request, res: Response) => {
            // TO DO: @Marcho
            // Tambahkan create lagu penyanyi di sini
        };
    }

    index() {
        return async (req: Request, res: Response) => {
            // TO DO: @Marcho
            // Tambahkan read all lagu penyanyi di sini
        };
    }

    show() {
        return async (req: Request, res: Response) => {
            // TO DO: @Marcho
            // Tambahkan get one lagu penyanyi di sini
        };
    }

    update() {
        return async (req: Request, res: Response) => {
            // TO DO: @Marcho
            // Tambahkan update lagu penyanyi di sini
        };
    }

    delete() {
        return async (req: Request, res: Response) => {
            // TO DO: @Marcho
            // Tambahkan delete lagu penyanyi di sini
        };
    }
}
