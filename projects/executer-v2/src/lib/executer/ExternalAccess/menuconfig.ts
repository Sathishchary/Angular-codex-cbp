export class MenuConfig {
    isSwitchUser?: boolean = false;
    isEmail?: boolean = false;
    isCREnabled?: boolean = false;
    isMedia?: boolean = false;
    isComents?: boolean = false;
    isEditableCbp?: boolean = false;
    isUndoStep?: boolean = false;
    isReload?: boolean = false;
    isSave?: boolean = false;
    isMobile: boolean = false;
    isAutoSave?: boolean = true;
    autoSaveTimeInterval?: number = 1000 * 60 * 2// 5 minutes

    // menu bar options
    isNavigation = true;
    isPageHeader = true;
    isPageFooter = true;
    isDisableCircle = true;
    isShowSectionStepIcon = true;
    isUpdateViewText = true;
    isColorEnabled = true;
    //executer types
    isEwpExecuter?: boolean = false;
    isReadExecutor?: boolean = false;
    isExecuter?: boolean = false;
    isPreview?: boolean = false;
    showRowTable?: boolean = false;
    isPreProcessorEnabled: boolean = false;
    isLocationEnabled: boolean = false;
    isAllowAccessEnabled: boolean = false;
    play?: boolean = true;
    isDeleteEnabled?: boolean = true;
    isCollapsibleViewEnabled?: boolean = false;
    enableReferenceObj?: boolean = false;
    stickyNoteEnable?: boolean = true;
    isIndendationEnabled?: boolean = false;
    isDataProtected?: boolean = true;
    isAutoScrollEnabled?: boolean = false;
    marginTop?: number = 50// 5 minutes
    marginBottom?: number = 50// 5 minutes
    showUpdates?: boolean = false;
    disableAutoStepNavigation?: boolean = true;
}
