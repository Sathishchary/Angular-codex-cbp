/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { QsResponseData } from "./_qsResponseData";
import { QsResponseHeader } from "./_qsResponseHeader";

export class QsResponse{
  qsResponseHeader?: QsResponseHeader;
  qsResponseData?: QsResponseData;
}
