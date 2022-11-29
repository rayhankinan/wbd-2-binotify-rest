import { soapConfig } from "../config/soap-config";
import $ from "jquery";
import {parseString} from 'xml2js';

export class SOAPService {
    async validate(creatorID: number, subscriberID: number) {
        // TO DO: @Aira
        // Tambahkan logika validasi ke service SOAP di sini
        var result = $.Deferred();
        var url = "https://"+soapConfig.host+":"+soapConfig.port+"/api/subscribe";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var response = xhr.responseText;
                parseString(response, (err: any, result: any) => {
                    const json = JSON.stringify(result, null, 4)
                    console.log(json);
                    result = true;
                })
            }
        };
        var data = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <checkStatus xmlns="http://service.binotify/">
                    <arg0 xmlns="">${creatorID}</arg0>
                    <arg1 xmlns="">${subscriberID}</arg1>
                </checkStatus>
            </Body>
        </Envelope>`;
        xhr.send(data);

        return result;
    }
}
