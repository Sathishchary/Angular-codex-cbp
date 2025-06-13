import { DOCUMENT } from '@angular/common';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectOption } from './ae-select/ae-select.component';
import { AngularEditorService, UploadResponse } from './angular-editor.service';
import { CustomClass } from './config';

@Component({
  selector: 'angular-editor-toolbar',
  templateUrl: './angular-editor-toolbar.component.html',
  styleUrls: ['./angular-editor-toolbar.component.scss'],
})

export class AngularEditorToolbarComponent implements OnDestroy {
  // implements OnInit
  htmlMode = false;
  linkSelected = false;
  block = 'default';
  fontName = 'Times New Roman';
  fontSize = '3';
  foreColour!: any;
  backColor!: any;
  @Input() config: any;
  @Input() stepObject: any;
  @ViewChild('fgInput', { read: ElementRef }) forColorr!: ElementRef;
  headings: SelectOption[] = [
    {
      label: 'Heading 1',
      value: 'h1',
    },
    {
      label: 'Heading 2',
      value: 'h2',
    },
    {
      label: 'Heading 3',
      value: 'h3',
    },
    {
      label: 'Heading 4',
      value: 'h4',
    },
    {
      label: 'Heading 5',
      value: 'h5',
    },
    {
      label: 'Heading 6',
      value: 'h6',
    },
    {
      label: 'Heading 7',
      value: 'h7',
    },
    {
      label: 'Paragraph',
      value: 'p',
    },
    {
      label: 'Predefined',
      value: 'pre'
    },
    {
      label: 'Standard',
      value: 'div'
    },
    {
      label: 'default',
      value: 'default'
    }
  ];

  fontSizes: SelectOption[] = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
    {
      label: '6',
      value: '6',
    },
    {
      label: '7',
      value: '7',
    }
  ];

  customClassId = '-1';
  // tslint:disable-next-line:variable-name
  _customClasses!: CustomClass[];
  customClassList: SelectOption[] = [{ label: '', value: '' }];
  // uploadUrl: string;

  tagMap = {
    BLOCKQUOTE: 'indent',
    A: 'link'
  };

  select = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'PRE', 'DIV'];

  buttons = ['undo', 'redo', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter',
    'justifyRight', 'justifyFull', 'indent', 'outdent', 'insertUnorderedList', 'insertOrderedList', 'link'];

  @Input()
  id!: any;
  @Input()
  uploadUrl!: any;
  @Input()
  upload!: (file: File) => Observable<HttpEvent<UploadResponse>>;
  @Input()
  showToolbar!: boolean;
  @Input() fonts: SelectOption[] = [{ label: '', value: '' }];

  @Input() defaultTextEditor = false;
  colorPalet: boolean = false;
  colorPalet2: boolean = false;
  isStrikeThroughApplied: any = false;

  @Input()
  set customClasses(classes: CustomClass[]) {
    if (classes) {
      this._customClasses = classes;
      this.customClassList = this._customClasses.map((x, i) => ({ label: x.name, value: i.toString() }));
      this.customClassList.unshift({ label: 'Clear Class', value: '-1' });
    }
  }

  @Input()
  set defaultFontName(value: any) {
    if (value) {
      this.fontName = value;
    }
  }

  @Input()
  set defaultFontSize(value: any) {
    if (value) {
      this.fontSize = value?.toString();
    }
  }

  @Input()
  hiddenButtons!: string[][];

  @Output() execute: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('fileInput', { static: true })
  myInputFile!: ElementRef;
  subScriptOption = false;
  superScriptOption = false;

  @Output() setCharPos: EventEmitter<string> = new EventEmitter<string>();

  public get isLinkButtonDisabled(): boolean {
    return this.htmlMode || !Boolean(this.editorService.selectedText);
  }

  constructor(
    private r: Renderer2,
    public editorService: AngularEditorService,
    private er: ElementRef,
    @Inject(DOCUMENT) private doc: any
  ) {
  }

  ngAfterViewInit(): void {
    this.foreColour = this.config.foreColor;
  }

  /**
   * Trigger command from editor header buttons
   * @param command string from toolbar buttons
   */
  triggerCommand(command: string) {
    this.clearColor();
    if (command === 'subscript' || this.editorService.subScriptOption) { this.editorService.subScriptOption = !this.editorService.subScriptOption; }
    if (command === 'superscript' || this.editorService.superScriptOption) { this.editorService.superScriptOption = !this.editorService.superScriptOption; }
    if ((command === 'subscript' || command === 'superscript') && !this.editorService.subScriptOption && !this.editorService.superScriptOption) {
      this.doc.execCommand(command, false, false);
    }
    this.execute.emit(command);
    if (command === 'strikeThrough') {
      if (!this.isStrikeThroughApplied) {
        this.isStrikeThroughApplied = true;
      } else {
        this.isStrikeThroughApplied = false;
        const elementById = this.doc.getElementById('strikeThrough' + '-' + this.id);
        if (elementById)
          this.r?.removeClass(elementById, 'active');
      }
    }
  }
  /**
   * highlight editor buttons when cursor moved or positioning
   */
  triggerButtons() {
    this.clearColor();
    if (!this.showToolbar) {
      return;
    }
    const editor: any = document.getElementById('cbp-editor');
    editor.focus();
    this.buttons?.forEach(e => {
      let result = this.doc.queryCommandState(e);
      const elementById = this.doc.getElementById(e + '-' + this.id);
      if (result) {
        this.r?.addClass(elementById, 'active');
      } else {
        if (elementById)
          this.r?.removeClass(elementById, 'active');
      }
    });
  }
  isSubOrSuperScriptActive() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    const parentElement = selection.getRangeAt(0).commonAncestorContainer.parentElement;
    if (!parentElement) return false;
    const tagName = parentElement.tagName.toLowerCase();
    this.editorService.subScriptOption = (tagName === 'sub');
    this.editorService.superScriptOption = (tagName === 'sup');
}

  /**
   * trigger highlight editor buttons when cursor moved or positioning in block
   */
  triggerBlocks(nodes: Node[]) {
    if (!this.showToolbar) {
      return;
    }
    this.linkSelected = nodes.findIndex(x => x.nodeName === 'A') > -1;
    let found = false;
    this.select.forEach(y => {
      const node = nodes.find(x => x.nodeName === y);
      if (node !== undefined && y === node.nodeName) {
        if (found === false) {
          this.block = node.nodeName.toLowerCase();
          found = true;
        }
      } else if (found === false) {
        this.block = 'default';
      }
    });

    found = false;
    if (this._customClasses) {
      this._customClasses.forEach((y, index) => {
        const node = nodes.find(x => {
          if (x instanceof Element) {
            return x.className === y.class;
          }
        });
        if (node !== undefined) {
          if (found === false) {
            this.customClassId = index.toString();
            found = true;
          }
        } else if (found === false) {
          this.customClassId = '-1';
        }
      });
    }

    Object.keys(this.tagMap).map(e => {
      const elementById = this.doc.getElementById((this.tagMap as any)[e] + '-' + this.id);
      const node = nodes.find(x => x.nodeName === e);
      if (node !== undefined && e === node.nodeName) {
        this.r.addClass(elementById, 'active');
      } else {
        this.r.removeClass(elementById, 'active');
      }
    });

    this.foreColour = this.doc.queryCommandValue('ForeColor');
    this.fontSize = this.doc.queryCommandValue('FontSize');
    this.fontName = this.doc.queryCommandValue('FontName').replace(/"/g, '');
    this.backColor = this.doc.queryCommandValue('backColor');
  }

  /**
   * insert URL link
   */
  insertUrl() {
    let url: any = 'https:\/\/';
    const selection: any = this.editorService.savedSelection;
    if (selection && selection.commonAncestorContainer.parentElement.nodeName === 'A') {
      const parent = selection.commonAncestorContainer.parentElement as HTMLAnchorElement;
      if (parent.href !== '') {
        url = parent.href;
      }
    }
    url = prompt('Insert URL link', url);
    if (url && url !== '' && url !== 'https://') {
      this.editorService.createLink(url);
    }
  }

  /**
   * insert Video link
   */
  insertVideo() {
    this.execute.emit('');
    const url = prompt('Insert Video link', `https://`);
    if (url && url !== '' && url !== `https://`) {
      this.editorService.insertVideo(url);
    }
  }

  /** insert color */
  insertColor(color: string, where: string, isUpdate: string) {
    if (!this.defaultTextEditor) { this.clearColor(); }
    if (where === 'textColor') { this.foreColour = color; }
    else { this.backColor = color; }
    this.editorService.insertColor(color, where, isUpdate);
    this.execute.emit('');
  }


  /**
   * set font Name/family
   * @param foreColor string
   */
  setFontName(foreColor: string): void {
    this.editorService.setFontName(foreColor);
    this.execute.emit('');
  }

  /**
   * set font Size
   * @param fontSize string
   */
  setFontSize(fontSize: string): void {
    this.editorService.setFontSize(fontSize);
    this.execute.emit('');
  }

  /**
   * toggle editor mode (WYSIWYG or SOURCE)
   * @param m boolean
   */
  setEditorMode(m: boolean) {
    const toggleEditorModeButton = this.doc.getElementById('toggleEditorMode' + '-' + this.id);
    if (m) {
      this.r.addClass(toggleEditorModeButton, 'active');
    } else {
      this.r.removeClass(toggleEditorModeButton, 'active');
    }
    this.htmlMode = m;
  }

  /**
   * Upload image when file is selected.
   */
  onFileChanged(event: { target: { files: any[]; }; }) {
    const file = event.target.files[0];
    if (file.type.includes('image/')) {
      if (this.upload) {
        this.upload(file).subscribe(() => this.watchUploadImage);
      } else if (this.uploadUrl) {
        this.editorService.uploadImage(file).subscribe(() => this.watchUploadImage);
      } else {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          const fr: any = e.currentTarget as FileReader;
          this.editorService.insertImage(fr.result.toString());
        };
        reader.readAsDataURL(file);
      }
    }
  }

  watchUploadImage(response: HttpResponse<{ imageUrl: string }>, event: any) {
    const { imageUrl }: any = response.body;
    this.editorService.insertImage(imageUrl);
    event.srcElement.value = null;
  }

  /**
   * Set custom class
   */
  setCustomClass(classId: string) {
    if (classId === '-1') {
      this.execute.emit('clear');
    } else {
      this.editorService.createCustomClass(this._customClasses[+classId]);
    }
  }

  isButtonHidden(name: string): boolean {
    if (!name) {
      return false;
    }
    if (!(this.hiddenButtons instanceof Array)) {
      return false;
    }
    let result: any;
    for (const arr of this.hiddenButtons) {
      if (arr instanceof Array) {
        result = arr.find(item => item === name);
      }
      if (result) {
        break;
      }
    }
    return result !== undefined;
  }

  focus() {
    this.clearColor();
    this.execute.emit('focus');
    // console.log('focused');
  }

  clearColor() {
    this.colorPalet = false; this.colorPalet2 = false;
  }

  changecolor() {
    this.colorPalet = !this.colorPalet;
    this.colorPalet2 = false;
  }

  changecolor2() {
    this.colorPalet = false;
    this.colorPalet2 = !this.colorPalet2;
  }

  setItem(item: string) {
    this.setCharPos.emit(item);
  }
  ngOnDestroy(): void {
    this.editorService.superScriptOption = false;
    this.editorService.subScriptOption = false;
  }
  setSubOrSupScriptBtnsState(command: any) {
    const elementById = this.doc.getElementById(`${command}-${this.id}`);
    if (elementById)
      this.r?.removeClass(elementById, 'active');
  }
}
