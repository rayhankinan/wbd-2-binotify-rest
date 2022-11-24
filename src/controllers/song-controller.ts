import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { 
    AuthToken,
    AuthRequest 
} from "../middlewares/authentication-middleware";

import { Song } from "../models/song-model";

interface UpdateRequest {
    judul: string;
    audioPath?: string;
}

interface StoreRequest {
    judul: string;
    penyanyiID: number;
    audioPath: string;
}

export class SongController {
    store() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) {
                // Endpoint hanya bisa diakses oleh penyanyi
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request body
            const { judul, penyanyiID, audioPath }: StoreRequest = req.body;

            // Buat song baru
            const song = new Song();
            song.judul = judul;
            song.penyanyiID = penyanyiID;
            song.audioPath = audioPath;

            // Buat lagu
            const newSong = await song.save();
            if (!newSong) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.CREATED).json({
                message: ReasonPhrases.CREATED,
            })
        };
    }

    index() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) {
                // Endpoint hanya bisa diakses oleh penyanyi
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Fetch semua lagu milik requester
            const songs = await Song.findBy({
                penyanyiID: token.userID
            });

            res.status(StatusCodes.OK).json({
                messeage: ReasonPhrases.OK,
                data: songs
            });
        };
    }

    show() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) {
                // Endpoint hanya bisa diakses oleh penyanyi
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            const songID = parseInt(req.params.id);

            // Fetch semua lagu milik requester
            const song = await Song.findOneBy({
                songID
            });

            // Apabila tidak ditemukan ...
            if (!song) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: ReasonPhrases.NOT_FOUND,
                });
                return;
            }

            // Bukan lagu requester ...
            if (song.penyanyiID != token.userID) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                messeage: ReasonPhrases.OK,
                data: song
            });
        };
    }

    update() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) {
                // Endpoint hanya bisa diakses oleh penyanyi
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request body
            const { judul, audioPath } : UpdateRequest = req.body;

            // Parse request param
            const songID = parseInt(req.params.id);

            const song = await Song.findOneBy({
                songID
            });

            // Apabila tidak ditemukan ...
            if (!song) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: ReasonPhrases.NOT_FOUND,
                });
                return;
            }

            // Bukan lagu requester ...
            if (song.penyanyiID != token.userID) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            
            // Update model
            song.judul = judul;
            if (audioPath) {
                song.audioPath = audioPath;
            }

            // Save!
            const newSong = await song.save();
            if (!newSong) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK
            });
        };
    }

    delete() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) {
                // Endpoint hanya bisa diakses oleh penyanyi
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request param
            const songID = parseInt(req.params.id);

            const song = await Song.findOneBy({
                songID
            });

            // Apabila tidak ditemukan ...
            if (!song) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: ReasonPhrases.NOT_FOUND,
                });
                return;
            }
            if (song.penyanyiID != token.userID) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            
            // Delete!
            const newSong = await song.remove();
            if (!newSong) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK
            });
        };
    }
}
