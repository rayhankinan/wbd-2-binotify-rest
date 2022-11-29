import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authentication-middleware";
import { soapConfig } from "../config/soap-config";
import { paginationConfig } from "../config/pagination-config";
import fetch from "node-fetch";
import xml2js from 'xml2js';

interface UpdateSubscription {
    creatorID: number;
    subscriberID: number;
}

export class SoapController {
    accept() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) {
                // Endpoint hanya bisa diakses oleh admin
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request body
            const { creatorID, subscriberID }: UpdateSubscription = req.body;

            var url = "http://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
            fetch(url, {
                method: 'POST',
                body: `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                <Body>
                    <approveSubscribe xmlns="http://service.binotify/">
                        <arg0 xmlns="">${creatorID}</arg0>
                        <arg1 xmlns="">${subscriberID}</arg1>
                    </approveSubscribe>
                </Body>
                </Envelope>`,
                headers: {
                    'Content-type': 'text/xml',
                }
            })
            .then(res => res.text())
            .then(body => {
            xml2js.parseString(body, {mergeAttrs : true}, async (err, result) => {
                var response = result['S:Envelope']['S:Body'][0]['ns2:approveSubscribeResponse'][0]['return'][0];
                if (response == "Subscription not found") {
                    res.status(StatusCodes.NOT_FOUND).json({
                        message: response,
                    });
                }
                else if (response == "Subscription accepted") {
                    res.status(StatusCodes.OK).json({
                        message: response,
                    });
                }
                else {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: response,
                    });
                }
            });
            })
            .catch(err => {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
            });
        };
    }

    reject() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) {
                // Endpoint hanya bisa diakses oleh admin
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request body
            const { creatorID, subscriberID }: UpdateSubscription = req.body;

            var url = "http://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
            fetch(url, {
                method: 'POST',
                body: `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                <Body>
                    <rejectSubscribe xmlns="http://service.binotify/">
                        <arg0 xmlns="">${creatorID}</arg0>
                        <arg1 xmlns="">${subscriberID}</arg1>
                    </rejectSubscribe>
                </Body>
                </Envelope>`,
                headers: {
                    'Content-type': 'text/xml',
                }
            })
            .then(res => res.text())
            .then(body => {
            xml2js.parseString(body, {mergeAttrs : true}, async (err, result) => {
                var response = result['S:Envelope']['S:Body'][0]['ns2:rejectSubscribeResponse'][0]['return'][0];
                if (response == "Subscription not found") {
                    res.status(StatusCodes.NOT_FOUND).json({
                        message: response,
                    });
                }
                else if (response == "Subscription rejectedd") {
                    res.status(StatusCodes.OK).json({
                        message: response,
                    });
                }
                else {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: response,
                    });
                }
            });
            })
            .catch(err => {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
            });
        };
    }

    index() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) {
                // Endpoint hanya bisa diakses oleh admin
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            
            const page = parseInt(req.params.page);

            var url = "http://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
            fetch(url, {
                method: 'POST',
                body: `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                    <Body>
                        <getAllReqSubscribe xmlns="http://service.binotify/">
                            <arg0 xmlns="">${page}</arg0>
                            <arg1 xmlns="">${paginationConfig.size}</arg1>
                        </getAllReqSubscribe>
                    </Body>
                </Envelope>`,
                headers: {
                    'Content-type': 'text/xml',
                }
            })
            .then(res => res.text())
            .then(body => {
            xml2js.parseString(body, {mergeAttrs : true}, async (err, result) => {
                var response = result['S:Envelope']['S:Body'][0]['ns2:rejectSubscribeResponse'][0]['return'][0];
                if (response == "Subscription not found") {
                    res.status(StatusCodes.NOT_FOUND).json({
                        message: response,
                    });
                }
                else if (response == "Subscription rejectedd") {
                    res.status(StatusCodes.OK).json({
                        message: response,
                    });
                }
                else {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: response,
                    });
                }
            });
            })
            .catch(err => {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
            });
        };
    }
}
