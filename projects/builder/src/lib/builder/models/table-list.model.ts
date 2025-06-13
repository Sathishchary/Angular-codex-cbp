import { DgTypes } from "cbp-shared";
export class TableList {
  dgUniqueID: any;
  prompt = '';
  dataType = 'table';
  tableName = 'Table';
  tableNameUpdated = false;
  captionText = '';
  captionPosition: 'top' | 'bottom' = 'top';
  colorhead = '#ccc';
  tableNo = 0;
  withoutHeaders = false;
  withoutLines = false;
  referenceOnly = false;
  selectTable = false;
  tableDataEntry = false;
  dgType: DgTypes = DgTypes.Table;
  // isFirstRow = false;
  rowsCount = 0;
  calstable = [{
    table: {
      tgroup: {
        colspec: [],
        thead: [],
        tfoot: [],
        tbody: [
          {
            row: [
              {
                entry: [

                ],
              },

            ]
          }
        ],
      }
    },
    dgType: 'CALSTable'
  }];
  isDataEntry = true;
}
