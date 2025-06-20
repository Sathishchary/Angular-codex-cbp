export enum ActionId {
  DataEntry = 6000,
  Verification = 6100,
  SkipVerification = 3000,
  UndoVerification = 4000,
  Signature = 6200,
  Initial = 6300,
  Update = 7000,
  Delete = 7100,
  AddComment = 8000,
  AddMedia = 8100,
  AddCR = 8200,
  Open = 9000,
  NA = 9999,
  Email = 20000,
  NewUser = 30000,
  SwitchUser = 31000,
  Alert = 2000,
  ExecutionStart = 100,
  ExecutionPause = 200,
  ExecutionEnd = 100,
  ExecutionTerminate = 300,
  ExecutionComplete = 400,
  Acknowledged = 10000,
  DynamicSection = 9200,
  RowUpdate = 9300
}
