import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authentication-middleware";

import { Song } from "../models/song-model";

import * as fs from "fs";
import * as path from "path";
import { getMP3Duration } from "../utils/get-mp3-duration";

interface UpdateRequest {
    title: string;
}

interface ISongData {
    id: number;
    title: string;
    duration: Number;
}

interface IPageData {
    page: number;
    totalPage: number;
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
            const { title } = req.body;

            // Buat song baru
            const song = new Song();
            song.title = title;
            song.penyanyiID = token.userID;
            song.audioPath = req.file!.filename;
            song.duration = Math.ceil(getMP3Duration(req.file!.buffer) / 1000);

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
            });
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

            // Get page query
            const page = parseInt((req.query?.page || "1") as string);
            const pageSize = parseInt((req.query?.pageSize || "5") as string);

            const [songs, length] = await Promise.all([
                Song.createQueryBuilder("song")
                    .select(["song.songID", "song.title", "song.duration"])
                    .where("song.penyanyiID = :userID", {
                        userID: token.userID,
                    })
                    .skip((page - 1) * pageSize)
                    .take(pageSize)
                    .getMany(),
                Song.createQueryBuilder("song")
                    .select(["song.songID"])
                    .where("song.penyanyiID = :userID", {
                        userID: token.userID,
                    })
                    .getCount(),
            ]);

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: songs,
                totalPage: Math.ceil(length / pageSize),
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
                songID,
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

            res.sendFile(
                path.join(__dirname, "..", "..", "uploads", song.audioPath)
            );
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
            const { title }: UpdateRequest = req.body;

            // Parse request param
            const songID = parseInt(req.params.id);

            const song = await Song.findOneBy({
                songID,
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

            // Get old filename
            const oldFilename = song.audioPath;

            // Update model
            song.title = title;
            song.audioPath = req.file!.filename;

            // Save!
            const newSong = await song.save();
            if (!newSong) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            // Delete old file from storage
            fs.unlinkSync(
                path.join(__dirname, "..", "..", "uploads", oldFilename)
            );

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
            });
        };
    }

    updateTitle() {
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
            const { title }: UpdateRequest = req.body;

            // Parse request param
            const songID = parseInt(req.params.id);

            const song = await Song.findOneBy({
                songID,
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
            song.title = title;

            // Save!
            const newSong = await song.save();
            if (!newSong) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
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
                songID,
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
            const deletedSong = await song.remove();
            if (!deletedSong) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            // Delete from storage
            fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "uploads",
                    deletedSong.audioPath
                )
            );

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
            });
        };
    }

    indexArtist() {
        return async (req: Request, res: Response) => {
            // TODO: Authenticate subscription

            // Get page query
            const { artistID } = req.params;

            // Fetch semua lagu milik requester
            const songs = await Song.findBy({
                penyanyiID: parseInt(artistID),
            });

            // Construct expected data
            const songsData: ISongData[] = [];

            songs.forEach((song) => {
                songsData.push({
                    id: song.songID,
                    title: song.title,
                    duration: song.duration,
                });
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: songsData,
            });
        };
    }

    fetchSong() {
        return async (req: Request, res: Response) => {
            // TODO: Authenticate subscription

            const songID = parseInt(req.params.songID);

            // Fetch semua lagu milik requester
            const song = await Song.findOneBy({
                songID,
            });

            // Apabila tidak ditemukan ...
            if (!song) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: ReasonPhrases.NOT_FOUND,
                });
                return;
            }

            res.sendFile(
                path.join(__dirname, "..", "..", "uploads", song.audioPath)
            );
        };
    }
}
