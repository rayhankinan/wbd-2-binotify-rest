import { soapConfig } from "../config/soap-config";
import fetch from "node-fetch";
import xml2js from 'xml2js';

export class SOAPService {
    async validate(creatorID: number, subscriberID: number) {
        // TO DO: @Aira
        // Tambahkan logika validasi ke service SOAP di sini
        var url = "http://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
        return fetch(url, {
            method: 'POST',
            body: `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <checkStatus xmlns="http://service.binotify/">
                    <arg0 xmlns="">${creatorID}</arg0>
                    <arg1 xmlns="">${subscriberID}</arg1>
                </checkStatus>
            </Body>
            </Envelope>`,
            headers: {
                'Content-type': 'text/xml',
            }
        })
        .then(res => res.text())
        .then(body => {
        xml2js.parseString(body, {mergeAttrs : true}, async (err, result) => {
            var response = result['S:Envelope']['S:Body'][0]['ns2:checkStatusResponse'][0]['return'][0];
            if (response == "ACCEPTED") {
                return true;
            }
            else {
                return false;
            }
        });
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    }
}
