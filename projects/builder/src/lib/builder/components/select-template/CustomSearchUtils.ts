import { PropertyData } from './propertyData';

export class CustomSearchUtills {
    //Functionality for Edocument Listing
    static prepareCategorySearchObjForEdocumentListing(catname: string, typename: string, subName: string) {
        const array = [
            {
                'searchFieldName': 'DGC_CATEGORY', 'searchFieldNameI': 'DGC_CATEGORY',
                'searchFieldValue': catname === undefined ? '' : catname
            },
            {
                'searchFieldName': 'DGC_TYPE', 'searchFieldNameI': 'DGC_TYPE',
                'searchFieldValue': typename === undefined ? '' : typename
            },
            {
                'searchFieldName': 'DGC_SUB_TYPE', 'searchFieldNameI': 'DGC_SUB_TYPE',
                'searchFieldValue': subName === undefined ? '' : subName
            }
        ];
        return array;
    }
    static preparePropertyObjForEdocumentListing(propertyModal: PropertyData, loggedInUserId: any, typeOfSearch: string): any {
        // console.log(propertyModal);
        let propertyModalObj = [];
        switch (typeOfSearch) {
            case 'My Favorites':
                propertyModalObj.push({
                    'searchFieldName': 'DGC_FK_USER_ID', 'searchFieldNameI': 'DGC_FK_USER_ID',
                    'searchFieldValue': loggedInUserId
                });
                break;
            case 'My Documents':
                propertyModalObj.push({
                    'searchFieldName': 'DGC_ADDED_FK_USER_ID', 'searchFieldNameI': 'DGC_ADDED_FK_USER_ID',
                    'searchFieldValue': loggedInUserId
                });
                break;
            default:
                propertyModalObj.push({
                    'searchFieldName': 'DGC_DOCUMENT_NBR', 'searchFieldNameI': 'DGC_DOCUMENT_NBR',
                    'searchFieldValue': propertyModal.documentName ? propertyModal.documentName : ''
                },
                    {
                        'searchFieldName': 'DGC_DOCUMENT_TITLE', 'searchFieldNameI': 'DGC_DOCUMENT_TITLE',
                        'searchFieldValue': propertyModal.title
                    },
                    {
                        'searchFieldName': 'DGC_DOCUMENT_STATUS', 'searchFieldNameI': 'DGC_DOCUMENT_STATUS',
                        'searchFieldValue': propertyModal.status ? propertyModal.status : ''
                    },
                    {
                        'searchFieldName': 'DGC_DOCUMENT_CONTROL_CODE', 'searchFieldNameI': 'DGC_DOCUMENT_CONTROL_CODE',
                        'searchFieldValue': propertyModal.controlType ? propertyModal.controlType : ''
                    },
                    {
                        'searchFieldName': 'DGC_IS_VERSION_VALIDATION_REQ', 'searchFieldNameI': 'DGC_IS_VERSION_VALIDATION_REQ',
                        'searchFieldValue': propertyModal.validation === false ? null : 1
                    },
                    {
                        'searchFieldName': 'DGC_APPROVAL_REQD', 'searchFieldNameI': 'DGC_APPROVAL_REQD',
                        'searchFieldValue': propertyModal.approval === false ? null : 1
                    },
                    {
                        'searchFieldName': 'DGC_IS_PRINTABLE', 'searchFieldNameI': 'DGC_IS_PRINTABLE',
                        'searchFieldValue': propertyModal.validation === false ? null : 1
                    },
                    {
                        'searchFieldName': 'DGC_IS_DOWNLOADABLE', 'searchFieldNameI': 'DGC_IS_DOWNLOADABLE',
                        'searchFieldValue': propertyModal.downloadable === false ? null : 1
                    },
                    {
                        'searchFieldName': 'DGC_CONTENT_TYPE', 'searchFieldNameI': 'DGC_CONTENT_TYPE',
                        'searchFieldValue': propertyModal.typeDoc === true ? 1000 : ''
                    },
                    {
                        'searchFieldName': 'DGC_CONTENT_SUB_TYPE', 'searchFieldNameI': 'DGC_CONTENT_SUB_TYPE',
                        'searchFieldValue': this.getSubTypeValues(propertyModal)
                    },
                    {
                        'searchFieldName': 'DGC_CONTENT_SIZE', 'searchFieldNameI': 'DGC_CONTENT_SIZE',
                        'searchFieldValue': (propertyModal.lessThanMb === undefined ? null : propertyModal.lessThanMb * 1000 * 1000)
                            + '-' + (propertyModal.greaterThanMb === undefined ? null : propertyModal.greaterThanMb * 1000 * 1000)
                    },

                    {
                        'searchFieldName': 'DGC_CREATED_DATE', 'searchFieldNameI': 'DGC_CREATED_DATE',
                        'searchFieldValue': this.checkDateAndTime(propertyModal, 'created')
                    },
                    {
                        'searchFieldName': 'DGC_VALID_DATE', 'searchFieldNameI': 'DGC_VALID_DATE',
                        'searchFieldValue': this.checkDateAndTime(propertyModal, 'valid')
                    },
                    {
                        'searchFieldName': 'DGC_STATUS_DATE', 'searchFieldNameI': 'DGC_STATUS_DATE',
                        'searchFieldValue': this.checkDateAndTime(propertyModal, 'status')
                    },
                    // {
                    //     'searchFieldName': 'DGC_CREATED_USER_ID', 'searchFieldNameI': 'DGC_CREATED_USER_ID',
                    //     'searchFieldValue': loggedInUserId
                    // },
                )
                break;
        }

        return propertyModalObj;
    }
    static getSubTypeValues(propertyModal: PropertyData) {
        let subtype = '';
        if (propertyModal.subTypedoc)
            subtype = subtype + "4000;";
        if (propertyModal.subTypePDF)
            subtype = subtype + "1000;";
        if (propertyModal.subTypeCBP)
            subtype = subtype + "2000;";
        if (propertyModal.subTypeXML)  ///////
            subtype = subtype + "5000;";
        const editedText = subtype.slice(0, -1) //'remove last semicoloun'
        return editedText;
    }
    static checkDateAndTime(propertyModal: PropertyData, type: string) {
        let res;
        if (type == 'created') {
            res = (propertyModal.addedMinDate ? propertyModal.addedMinDate : '')
                + '-' + (propertyModal.addedMaxDate !== undefined ? propertyModal.addedMaxDate : '');
        }
        else if (type == 'valid') {
            res = (propertyModal.validMinDate ? propertyModal.validMinDate : '')
                + '-' + (propertyModal.validMaxDate !== undefined ? propertyModal.validMaxDate : '');
        }
        else if (type == 'status') {
            res = (propertyModal.ststausMinDate ? propertyModal.ststausMinDate : '')
                + '-' + (propertyModal.ststausMaxDate !== undefined ? propertyModal.ststausMaxDate : '');
        }
        if (res == '-') {
            res = '';
        }
        return res;
    }
    static getTagSeatchValuesForEdocumentlisting(tags: any) {
        let tagvaluestring = '';
        for (let i = 0; i < tags.length; i++) {
            tagvaluestring += tags[i].display + ';';
        }
        // console.log(tagvaluestring);
        return [{ 'searchFieldName': 'DGC_DOCUMENT_TAG', 'searchFieldNameI': 'DGC_DOCUMENT_TAG', 'searchFieldValue': tagvaluestring }];
    }
    //Functionality for Monitor Listing
    static prepareCategorySearchObjForMonitorListing(catname: string, typename: string, subName: string) {
        const array = [
            {
                'searchFieldName': 'DGC_CATEGORY', 'searchFieldNameI': 'DGC_CATEGORY',
                'searchFieldValue': catname === undefined ? '' : catname
            },
            {
                'searchFieldName': 'DGC_TYPE', 'searchFieldNameI': 'DGC_TYPE',
                'searchFieldValue': typename === undefined ? '' : typename
            },
            {
                'searchFieldName': 'DGC_SUB_TYPE', 'searchFieldNameI': 'DGC_SUB_TYPE',
                'searchFieldValue': subName === undefined ? '' : subName
            }
        ];
        return array;
    }
    static preparePropertyObjForMonitorListing(propertyModal: PropertyData, loggedInUserId: any): any {
        // console.log(propertyModal);
        const propertyModalObj = [
            {
                'searchFieldName': 'DGC_DOCUMENT_NBR', 'searchFieldNameI': 'DGC_DOCUMENT_NBR',
                'searchFieldValue': propertyModal.documentName ? propertyModal.documentName : ''
            },
            {
                'searchFieldName': 'DGC_DOCUMENT_TITLE', 'searchFieldNameI': 'DGC_DOCUMENT_TITLE',
                'searchFieldValue': propertyModal.title
            },
            {
                'searchFieldName': 'DGC_DOCUMENT_STATUS', 'searchFieldNameI': 'DGC_DOCUMENT_STATUS',
                'searchFieldValue': propertyModal.status ? propertyModal.status : ''
            },
            {
                'searchFieldName': 'DGC_IS_VERSION_VALIDATION_REQ', 'searchFieldNameI': 'DGC_IS_VERSION_VALIDATION_REQ',
                'searchFieldValue': propertyModal.validation === false ? 0 : 1
            },
            {
                'searchFieldName': 'DGC_IS_DOWNLOADABLE', 'searchFieldNameI': 'DGC_IS_DOWNLOADABLE',
                'searchFieldValue': propertyModal.downloadable === false ? 0 : 1
            },
            // {
            //     'searchFieldName': 'DGC_IS_DOWNLOADABLE', 'searchFieldNameI': 'DGC_IS_DOWNLOADABLE',
            //     'searchFieldValue': propertyModal.downloadable === false ? 0 : 1
            // }, 
            // {
            //     'searchFieldName': 'DGC_IS_DOWNLOADABLE', 'searchFieldNameI': 'DGC_IS_DOWNLOADABLE',
            //     'searchFieldValue': propertyModal.downloadable === false ? 0 : 1
            // },
            {
                'searchFieldName': 'DGC_CONTENT_TYPE', 'searchFieldNameI': 'DGC_CONTENT_TYPE',
                'searchFieldValue': propertyModal.typeDoc === true ? 1000 : ''
            },
            {
                'searchFieldName': 'DGC_CONTENT_SUB_TYPE', 'searchFieldNameI': 'DGC_CONTENT_SUB_TYPE',
                'searchFieldValue': this.getSubTypeValues(propertyModal)
            },
            {
                'searchFieldName': 'DGC_CONTENT_SIZE', 'searchFieldNameI': 'DGC_CONTENT_SIZE',
                'searchFieldValue': (propertyModal.lessThanMb === undefined ? null : propertyModal.lessThanMb * 1000 * 1000)
                    + '-' + (propertyModal.greaterThanMb === undefined ? null : propertyModal.greaterThanMb * 1000 * 1000)
            },

            {
                'searchFieldName': 'DGC_CREATED_DATE', 'searchFieldNameI': 'DGC_CREATED_DATE',
                'searchFieldValue': this.checkDateAndTime(propertyModal, 'created')
            },
            {
                'searchFieldName': 'DGC_VALID_DATE', 'searchFieldNameI': 'DGC_VALID_DATE',
                'searchFieldValue': this.checkDateAndTime(propertyModal, 'valid')
            },
            // {
            //     'searchFieldName': 'DGC_CREATED_USER_ID', 'searchFieldNameI': 'DGC_CREATED_USER_ID',
            //     'searchFieldValue': loggedInUserId
            // },
        ];
        return propertyModalObj;
    }
    static getTagSeatchValuesForMonitorlisting(tags: any) {
        let tagvaluestring = '';
        for (let i = 0; i < tags.length; i++) {
            tagvaluestring += tags[i].display + ';';
        }
        // console.log(tagvaluestring);
        return [{ 'searchFieldName': 'DGC_DOCUMENT_TAG', 'searchFieldNameI': 'DGC_DOCUMENT_TAG', 'searchFieldValue': tagvaluestring }];
    }
    //set Filter Values
    static setFilterValuesForEdocListing(status:string,reasoncode:string,type:string,document:any) {
        const array = [
            {
                'searchFieldName': 'DGC_DOCUMENT_CR_STATUS_DISPLAY', 'searchFieldNameI': 'DGC_DOCUMENT_CR_STATUS_DISPLAY',
                'searchFieldValue': status === undefined ? '' : status
            },
            {
                'searchFieldName': 'DGC_DOCUMENT_NBR', 'searchFieldNameI': 'DGC_DOCUMENT_NBR',
                'searchFieldValue': document === undefined ? '' : document
            },
            {
                'searchFieldName': 'DGC_CHANGE_TYPE_DISPLAY', 'searchFieldNameI': 'DGC_CHANGE_TYPE_DISPLAY"',
                'searchFieldValue': type === undefined ? '' : type
            },
            {
                'searchFieldName': 'DGC_REASON_CODE_DISPLAY', 'searchFieldNameI': 'DGC_REASON_CODE_DISPLAY',
                'searchFieldValue': reasoncode === undefined ? '' : reasoncode
            }

        ];
        return array;
    }
    // Custom Search Dailog 
    static prepareCustomSearchForSelectTemplateDailog(catname: string, typename: string, subName: string,documentnumber:string,facility:string,docId:string) {
        const array = [
            {
                'searchFieldName': 'DGC_CATEGORY', 'searchFieldNameI': 'DGC_CATEGORY',
                'searchFieldValue': catname === undefined ? '' : catname
            },
            {
                'searchFieldName': 'DGC_TYPE', 'searchFieldNameI': 'DGC_TYPE',
                'searchFieldValue': typename === undefined ? '' : typename
            },
            {
                'searchFieldName': 'DGC_SUB_TYPE', 'searchFieldNameI': 'DGC_SUB_TYPE',
                'searchFieldValue': subName === undefined ? '' : subName
            },
            {
                'searchFieldName': 'DGC_DOCUMENT_NBR', 'searchFieldNameI': 'DGC_DOCUMENT_NBR',
                'searchFieldValue': documentnumber ? documentnumber : ''
            },
            {
                'searchFieldName': 'DGC_FACILITY', 'searchFieldNameI': 'DGC_FACILITY',
                'searchFieldValue': facility  ? facility : ''
            }, 
            {
                'searchFieldName': 'DGC_DOCUMENT_STATUS', 'searchFieldNameI': 'DGC_DOCUMENT_STATUS',
                'searchFieldValue': 10000
            },
            {
                'searchFieldName': 'DGC_ID', 'searchFieldNameI': 'DGC_ID',
                'searchFieldValue': docId ? docId : ''
            }
        ];
        return array;
    }

     //Functionality for DCR Listing
     static prepareSearchObjForDCRListing(status: string, reason: string, type: string,document: string) {
        const array = [
            {
                'searchFieldName': 'DGC_DOCUMENT_CR_STATUS_DISPLAY', 'searchFieldNameI': 'DGC_DOCUMENT_CR_STATUS_DISPLAY',
                'searchFieldValue': status === undefined ? '' : status
            },
            {
                'searchFieldName': 'DGC_REASON_CODE_DISPLAY', 'searchFieldNameI': 'DGC_REASON_CODE_DISPLAY',
                'searchFieldValue': reason === undefined ? '' : reason
            },
            {
                'searchFieldName': 'DGC_CHANGE_TYPE_DISPLAY', 'searchFieldNameI': 'DGC_CHANGE_TYPE_DISPLAY',
                'searchFieldValue': type === undefined ? '' : type
            },
            {
                'searchFieldName': 'DGC_DOCUMENT_NBR', 'searchFieldNameI': 'DGC_DOCUMENT_NBR',
                'searchFieldValue': document === undefined ? '' : document
            }
        ];
        return array;
    }
}