// TypeScript wrapper for CBPLexer
import { Lexer, CharStream } from 'antlr4ts';

// Import the existing JavaScript CBPLexer
const CBPLexerJS = require('../../../../../../src/assets/cbp/parser/Antlr/CBPLexer').CBPLexer;

export class CBPLexer extends Lexer {
  private jsLexer: any;

  constructor(input: CharStream) {
    super(input);
    this.jsLexer = new CBPLexerJS(input);
  }

  // Delegate methods to the JavaScript implementation
  public nextToken() {
    return this.jsLexer.nextToken();
  }

  public get grammarFileName(): string {
    return this.jsLexer.grammarFileName;
  }

  public get ruleNames(): string[] {
    return this.jsLexer.ruleNames;
  }

  public get channelNames(): string[] {
    return this.jsLexer.channelNames;
  }

  public get modeNames(): string[] {
    return this.jsLexer.modeNames;
  }

  public get tokenNames(): string[] {
    return this.jsLexer.tokenNames;
  }

  public get vocabulary() {
    return this.jsLexer.vocabulary;
  }

  // Token constants from the original lexer
  static readonly UNKNOWN = 0;
  static readonly IF_FUNCTION = 1;
  static readonly AND = 2;
  static readonly OR = 3;
  static readonly NOT = 4;
  static readonly EQ = 5;
  static readonly NEQ = 6;
  static readonly GT = 7;
  static readonly LT = 8;
  static readonly GTEQ = 9;
  static readonly LTEQ = 10;
  static readonly PLUS = 11;
  static readonly MINUS = 12;
  static readonly MUL = 13;
  static readonly DIV = 14;
  static readonly ASSIGN = 15;
  static readonly SCOL = 16;
  static readonly DOT = 17;
  static readonly AMP = 18;
  static readonly OPAR = 19;
  static readonly CPAR = 20;
  static readonly OBRACE = 21;
  static readonly CBRACE = 22;
  static readonly TRUE = 23;
  static readonly FALSE = 24;
  static readonly NIL = 25;
  static readonly IF = 26;
  static readonly ELSE = 27;
  static readonly WHILE = 28;
  static readonly LOG = 29;
  static readonly GOTO = 30;
  static readonly KEY_CONTINUE = 31;
  static readonly KEY_SKIP = 32;
  static readonly KEY_CONFIRMCONTINUE = 33;
  static readonly ID = 34;
  static readonly INT = 35;
  static readonly FLOAT = 36;
  static readonly STRING = 37;
  static readonly VALUE_STRING = 38;
  static readonly COMMENT = 39;
  static readonly SPACE = 40;
  static readonly OTHER = 41;
}