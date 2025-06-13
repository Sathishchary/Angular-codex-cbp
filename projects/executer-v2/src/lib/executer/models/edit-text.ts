export class EditText {
  status!: string;
  oldText!: string;
  newText!: string;
  number!: string;
  createdDate: any;
  createdBy!: string;
  reason!: string;
  dgType!: string;
  dgUniqueId!: string;
  comment!: string;
  discipline!: string;
  selectedStepDgUniqueId!: string;
  reviewerName!: string;
  reviewerId!: string;
  userId!: string;
  constructor(status: string, oldText: string, newText: string, number: string, createdDate: any, createdBy: string, reason: string, dgType: string, dgUniqueId: string,
    comment: string, discipline: string, reviewerName: string, reviewerId: string, userId: string) {
    this.status = status;
    this.oldText = oldText
    this.newText = newText
    this.number = number;
    this.createdDate = createdDate
    this.createdBy = createdBy;
    this.reason = reason;
    this.dgType = dgType;
    this.dgUniqueId = dgUniqueId
    this.selectedStepDgUniqueId = dgUniqueId;
    this.comment = comment;
    this.discipline = discipline;
    this.reviewerName = reviewerName;
    this.reviewerId = reviewerId;
    this.userId = userId;
  }
}
