import { DgTypes } from "./dg-types";

export class CoverPageFrom {
  prompt = '';
  dataType = 'table';
  tableName = 'Table';
  tableNameUpdated = false;
  captionText = '';
  captionPosition: 'top'| 'bottom' = 'top';
  colorhead = '#ccc';
  tableNo = 0;
  withoutHeaders = true;
  withoutLines =  true;
  referenceOnly = false;
  selectTable = false;
  tableDataEntry = false;
  coverPageTable = true;
  dgType: DgTypes = DgTypes.Table;
  calstable= [
        {
            table: {
              tgroup: {
                colspec: [],
                thead: [
                  {
                    title : "Column1",
                    columnSize: 100,
                    fieldName: "Column1",
                    align: "left",
                    position: 1
                  }
                ],
                tfoot: [],
                tbody: [
                  {
                    row: [
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      },
                      {
                        entry: [
                          {
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            },
            dgUniqueID: "0",
            dgType: "CALSTable"
          }
  ];
  dgUniqueID = "0" ;
  parentID = "0" ;
  isDataEntry = true;
  maxTableColumn = 1;
  columnSize =  1;
  rowSize = 15;
  level = null;


}
