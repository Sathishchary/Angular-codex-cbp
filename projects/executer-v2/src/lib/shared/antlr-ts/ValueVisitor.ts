// TypeScript wrapper for ValueVisitor
// Import the existing JavaScript ValueVisitor
const ValueVisitorJS = require('../../../../../../src/assets/cbp/parser/Antlr/ValueVisitor').ValueVisitor;

export class ValueVisitor {
  private jsVisitor: any;
  private callBackObject: any;

  constructor(callBackObject: any) {
    this.callBackObject = callBackObject;
    this.jsVisitor = new (ValueVisitorJS as any)(callBackObject);
  }

  // Delegate visit method to the JavaScript implementation
  public visit(node: any) {
    return this.jsVisitor.visit(node);
  }

  // Delegate getResponse method
  public getResponse(): any {
    return this.jsVisitor.getResponse();
  }
}