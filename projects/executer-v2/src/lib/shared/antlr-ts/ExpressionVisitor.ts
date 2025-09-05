// TypeScript wrapper for ExpressionVisitor
// Import the existing JavaScript ExpressionVisitor
const ExpressionVisitorJS = require('../../../../../../src/assets/cbp/parser/Antlr/ExpressionVisitor').ExpressionVisitor;

export class ExpressionVisitor {
  private jsVisitor: any;
  private callBackObject: any;

  constructor(callBackObject: any) {
    this.callBackObject = callBackObject;
    this.jsVisitor = new (ExpressionVisitorJS as any)(callBackObject);
  }

  // Delegate visit method to the JavaScript implementation
  public visit(node: any) {
    return this.jsVisitor.visit(node);
  }

  // Delegate createExpression method
  public createExpression(input: string): string {
    return this.jsVisitor.createExpression(input);
  }
}