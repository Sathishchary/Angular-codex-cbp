import { DgTypes } from "cbp-shared";

export class acknowledge{
    dgUniqueID = '';
    type = 'data element';
    dataType = 'ack';
    name = 'button';
    label = 'button' ;
    acknowledgementReqd = false;
    dgType: DgTypes = DgTypes.ButtonIconDataEntry;
}
