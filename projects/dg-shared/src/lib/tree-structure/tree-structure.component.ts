import { ChangeDetectorRef, Component, EventEmitter, Input, KeyValueDiffer, KeyValueDiffers, OnInit, Output, SimpleChanges } from '@angular/core';
declare var $:any;

@Component({
  selector: 'lib-tree-structure',
  template: `<div id="tree-container{{dynamicId}}" class="padding"></div>`,
  styleUrls: ['./tree-structure.component.css']
})
export class TreeStructureComponent implements OnInit {

  @Input() headerItem: any;
  @Input() previousHeaderItem: any;
  @Input() createNode: any;
  @Input() deleteNode: any;
  @Input() isbuild = false;
  @Input() renameNode: any;
  @Input() updatedNode: any;
  @Input() refreshTreeNav = false;
  @Input() selectedUniqueId!:any;
  @Input() selectedSectionShow!:any;
  @Input() parent = 'builder';
  @Input() cbpJson!:any;
  @Output() selectedNode: EventEmitter<any> = new EventEmitter();
  @Output() openCloseNode: EventEmitter<any> = new EventEmitter();
  @Output() createdNode: EventEmitter<any> = new EventEmitter();
  @Input() documentSelected: any;
  @Input() windowWidthChanged :any ;
  @Output() nodeTreeClicked:EventEmitter<any> = new EventEmitter();
  @Output() documentSelectedChange: EventEmitter<any> = new EventEmitter();
  @Output() isFromUpdateNode: EventEmitter<any> = new EventEmitter();
  nodeType = 'section';
  isSelectActionFromParent = false;
  @Input() isExecution = false;
  @Input() orderExecution = false;
  @Input() hideNumbers = false;
  @Input() headerFooterSelected = false;
  differ: KeyValueDiffer<string, any>;
  isTreeEvent = true;
  selectedTreeJsId = '';
  isSelectUpdateNode = true;
  dynamicId = new Date().getTime();
  headerItemChanged: boolean = false;
  updateNodeElement :any;
  updateNodeNumber : any ;
  nodeSelected :any ;
  @Output() loadedTree: EventEmitter<any> = new EventEmitter();
  constructor(private differs: KeyValueDiffers,private cd:ChangeDetectorRef) {
    this.differ = this.differs.find({}).create();
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  initJsTree(id:any) {
    this.selectedTreeJsId = id;
    const cbpJson = this.cbpJson;
    // console.log(cbpJson);
    const self = this;
    $(id).jstree({
      'core': {
        'check_callback': true,
        'data': !this.orderExecution ? JSON.parse(JSON.stringify(cbpJson.section)) : self.selectedSectionShow,
        'themes': {
          'theme': 'defualt',
          'dots': false,
          'icons': false
        }
      },
      'checkbox': {
        'keep_selected_style': false
      },
      'plugins': this.isExecution ? ['changed', 'themes', 'html_data', 'wholerow', 'types'] :
       (this.isbuild ? ['changed', 'contextmenu', 'html_data', 'ccrm', 'ui', 'themes',
        'wholerow'] : ['changed', 'themes', 'html_data', 'wholerow', 'types']),
      'contextmenu': {
        'items': this.customMenu.bind(this),
        'select_node': true
      }
    });
    $(id).on('changed.jstree', function (e:any, data:any) {
      if (self.isTreeEvent) {
        let selection = data.instance.get_selected(true)[0];
        if (selection) {
          if(data?.event?.type == "click"){
            self.nodeTreeClicked.emit(true)
          }
          self.documentSelected = false;
          selection['headerChanged'] = self.headerItemChanged;
          self.selectedNode.emit(selection);
          self.selectDocument();
        }
      }
    });
    $(id).bind('create_node.jstree', function (event:any, data:any) {
      const selectedNode = data.instance.get_selected(true)[0];
      const selectedNodeText = data.instance.get_selected(true)[0].text.trim().split(' ')[0];
      const step = (selectedNodeText.indexOf('.0') > 0 ? selectedNodeText.slice(0, selectedNodeText.length - 2) :
        selectedNodeText) + '.' + (selectedNode.children.length);
      self.documentSelected = false;
      self.createdNode.emit({ stepNo: data.node.id, parentStep: data.node.original.parent, dgType: data.node.original.dgType });
      self.selectDocument();
    });
    $(id).bind("open_node.jstree close_node.jstree", function (e:any, data:any) {
      const openCloseData= {'type':e.type, 'id': data.node.id,'children': data.node.children}
      self.openCloseNode.emit(openCloseData);
    });
  }

  customMenu(node:any) {
    const self = this;
    const id = this.selectedTreeJsId;
    if (!node.original.isEmbededObject) {
      if (node.original.dgType == 'Section') {
        return {
          'create': {
            'label': 'Section',
            'action': function () {
              const stepNo = node.text.trim().split(' ')[0].indexOf('.0') > 0 ? node.text.trim().split(' ')[0].slice(0, node.text.trim().split(' ')[0].length - 2) : node.text.trim().split(' ')[0];
              $(id).jstree().create_node(node, {
                text: stepNo + '.' + (node.children.length + 1),
                id: stepNo + '.' + (node.children.length + 1),
                dgType: 'Section',
                parent: node.text.trim().split(' ')[0]
              }
              ,'last', () => { $(id).jstree().open_node(node); });
            }
          },
          'Create': {
            'label': 'Step',
            'action': function () {
              const stepNo = node.text.trim().split(' ')[0].indexOf('.0') > 0 ? node.text.trim().split(' ')[0].slice(0, node.text.trim().split(' ')[0].length - 2) : node.text.trim().split(' ')[0];
              $(id).jstree().create_node(node, {
                text: stepNo + '.' + (node.children.length + 1),
                id: stepNo + '.' + (node.children.length + 1),
                dgType: 'StepAction',
                parent: node.text.trim().split(' ')[0]
              }, 'last', () => { $(id).jstree().open_node(node); });
            }
          },
        };
      }
      if (node.original.dgType == 'StepAction') {
        return {
          'Create': {
            'label': 'Step',
            'action': function () {
              const stepNo = node.text.trim().split(' ')[0].indexOf('.0') > 0 ? node.text.trim().split(' ')[0].slice(0, node.text.trim().split(' ')[0].length - 2) : node.text.trim().split(' ')[0];
              $(id).jstree().create_node(node, {
                text: stepNo + '.' + (node.children.length + 1),
                id: stepNo + '.' + (node.children.length + 1),
                dgType: 'StepAction',
                parent: node.text.trim().split(' ')[0]
              }
              , 'last', () => { $(id).jstree().open_node(node); });
            }
          },

        };
      }
    }
  }

  ngAfterViewInit(): void {
    if(this.cbpJson){
      this.initJsTree('#tree-container' +this.dynamicId);
      this.reuseInit('#tree-container' +this.dynamicId);
    }
  }
  reuseInit(id:any){
    $(id).on('ready.jstree', function () {
      $(id).jstree('open_all');
    });
    let self = this;
    $(id).on('loaded.jstree', function () {
      $(id).jstree('select_node', self.updatedNode);
      self.loadedTree.emit();
    });
    $(id).bind("refresh.jstree", function (e:any, data:any) {  $(self.selectedTreeJsId).jstree("open_all"); })
  }
  openNodes() {
    const self = this;
    $(this.selectedTreeJsId).on('ready.jstree', function () {
      $(self.selectedTreeJsId).jstree('open_all');
    });
    $(this.selectedTreeJsId).jstree(true).open_all();
  }
  openChildNodes(id:any) {
    $('#' + id).on('ready.jstree', function () {
      $('#' + id).jstree('open_all');
    });
    $('#' + id).jstree(true).open_all();
  }

  closeNodes() {
    const self = this;
    $(this.selectedTreeJsId).on('loaded.jstree', function () {
      $(self.selectedTreeJsId).jstree('close_all', -1);
    });
    $(this.selectedTreeJsId).jstree('close_all', -1);
    $(this.selectedTreeJsId).jstree(true).close_all();
  }
  deselectNodes() {
    $(this.selectedTreeJsId).jstree().deselect_all(true);
  }

  documentShow() {
    this.documentSelected = true;
    this.deselectNodes();
    this.documentSelected.emit(this.documentSelected);
    this.selectDocument();
  }
  selectDocument() {
    this.documentSelectedChange.emit(this.documentSelected);
  }
  refreshTree() {
    if($(this.selectedTreeJsId).jstree(true)?.settings?.core !== undefined){
     $(this.selectedTreeJsId).jstree(true).settings.core.data = JSON.parse(JSON.stringify(this.cbpJson.section));
     $(this.selectedTreeJsId).jstree(true).refresh(true);
     setTimeout(() => {
      this.updateNode();
     }, 100);
    }
  }

  updateNode() {
    if (!this.isbuild) {
       if (this.parent === 'read' || this.parent === 'execution') {
        $(this.selectedTreeJsId).jstree().deselect_all(true);
        $(this.selectedTreeJsId).jstree('select_node', this.updatedNode);
      }
    } else {
      if (this.updatedNode) {
        try {

            const deselect = this.cbpJson.section.length > 1 ||  
            this.cbpJson.section[0].children !== undefined;
            if (deselect) { $(this.selectedTreeJsId).jstree().deselect_all(true); }
            // const nodeSelected = this.updatedNode.dgUniqueID ? this.updatedNode.dgUniqueID : this.updatedNode;
            if(this.isExecution){
              this.nodeSelected = this.updatedNode
            }else{
              this.nodeSelected = this.updatedNode.dgUniqueID 
            }
         
            $(this.selectedTreeJsId).jstree('select_node', this.nodeSelected);
          
        } catch (er) { }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: forin
    for (const propName in changes) {
      if (propName === 'refreshTreeNav' && !changes.refreshTreeNav.firstChange) {
        if(this.selectedTreeJsId !==''){
          this.refreshTree();
        }
      }
      if (propName === 'updatedNode') {
        if(changes.updatedNode.previousValue !== changes.updatedNode.currentValue) {
          this.updatedNode = changes.updatedNode.currentValue;
          this.isSelectUpdateNode = true;
          this.isTreeEvent = false;


          this.updateNode();
          this.isTreeEvent = true;
          this.headerItemChanged = false;
          try {
            if(!this.isExecution){
              this.updateNodeNumber = this.updatedNode.dgUniqueID
            }else{
              this.updateNodeNumber = this.updatedNode
            }
            this.updateNodeElement = document.getElementById(this.updateNodeNumber);
            if(Number(this.updateNodeNumber) && this.updateNodeElement ){
              setTimeout(()=>{
                //  console.log("node element ",this.updateNodeElement)
                this.updateNodeElement?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                this.cd.detectChanges();
              },1000);

            }
          } catch (error) {
            console.log(error)
          }

        }
      }
      if (propName === 'headerItem') {
        if(changes.headerItem.previousValue !== changes.headerItem.currentValue) {
          if(this.updatedNode?.dgUniqueID === changes.headerItem.currentValue?.dgUniqueId){
            this.headerItem = changes.headerItem.currentValue;
            $(this.selectedTreeJsId).jstree('rename_node', this.headerItem.dgUniqueId, this.headerItem.text);
            if(this.selectedTreeJsId !==''){  this.headerItemChanged = true; }
            $(this.selectedTreeJsId).jstree('select_node',  this.headerItem.dgUniqueId);
          }
        }
      }
      if (propName === 'previousHeaderItem') {
        if(changes.previousHeaderItem.previousValue !== changes.previousHeaderItem.currentValue) {
          this.previousHeaderItem = changes.previousHeaderItem.currentValue;
          if(this.previousHeaderItem !== undefined && this.previousHeaderItem !== null){
            $(this.selectedTreeJsId).jstree('rename_node', this.previousHeaderItem.dgUniqueId, this.previousHeaderItem.text);
            if(this.selectedTreeJsId !==''){  this.headerItemChanged = true; }
          }
        }
      }
      if (propName === 'renameNode' && !changes.renameNode.firstChange) {
        if(changes.renameNode.previousValue !== changes.renameNode.currentValue) {
          this.renameNode = changes.renameNode.currentValue;
          $(this.selectedTreeJsId).jstree('rename_node', this.renameNode.dgUniqueID, this.renameNode.text);
          if(this.headerItem?.dgUniqueId)
          $(this.selectedTreeJsId).jstree('select_node',  this.headerItem.dgUniqueId);
        }
      }
      if(propName === 'documentSelected' && !changes.documentSelected.firstChange){
        if(changes.documentSelected.previousValue !== changes.documentSelected.currentValue) {
          if(changes.documentSelected.currentValue)  { this.deselectNodes(); }
        }
      }
      if(propName === 'headerFooterSelected' && !changes.headerFooterSelected.firstChange){
        if(changes.headerFooterSelected.previousValue !== changes.headerFooterSelected.currentValue) {
          if(changes.headerFooterSelected.currentValue)  { this.deselectNodes(); }
        }
      }

    }
  }

}
