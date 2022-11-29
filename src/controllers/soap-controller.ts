import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { 
    AuthToken,
    AuthRequest 
} from "../middlewares/authentication-middleware";
import { soapConfig } from "../config/soap-config";
import { parseString } from "xml2js";

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
            const { creatorID, subscriberID } : UpdateSubscription = req.body;

            var url = "https://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "text/xml");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var response = xhr.responseText;
                        parseString(response, (err: any, result: any) => {
                            const json = JSON.stringify(result, null, 4)
                            console.log(json);
                            res.status(StatusCodes.CREATED).json({
                                message: ReasonPhrases.CREATED,
                            })
                        })
                    }
                    else {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            message: ReasonPhrases.BAD_REQUEST,
                        })
                    }
                }
            };
            var data = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                <Body>
                    <approveSubscribe xmlns="http://service.binotify/">
                        <arg0 xmlns="">${creatorID}</arg0>
                        <arg1 xmlns="">${subscriberID}</arg1>
                    </approveSubscribe>
                </Body>
            </Envelope>`;
            xhr.send(data);
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
            const { creatorID, subscriberID } : UpdateSubscription = req.body;

            var url = "https://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "text/xml");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var response = xhr.responseText;
                        parseString(response, (err: any, result: any) => {
                            const json = JSON.stringify(result, null, 4)
                            console.log(json);
                            res.status(StatusCodes.CREATED).json({
                                message: ReasonPhrases.CREATED,
                            })
                        })
                    }
                    else {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            message: ReasonPhrases.BAD_REQUEST,
                        })
                    }
                }
            };
            var data = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                <Body>
                    <rejectSubscribe xmlns="http://service.binotify/">
                        <arg0 xmlns="">${creatorID}</arg0>
                        <arg1 xmlns="">${subscriberID}</arg1>
                    </rejectSubscribe>
                </Body>
            </Envelope>`;
            xhr.send(data);
        };
    }
}