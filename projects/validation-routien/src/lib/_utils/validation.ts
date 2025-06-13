import { Injectable } from '@angular/core';
import { ValidationTypes } from '../_models/page-type';
import { ErrorObj } from '../_models/_error';
import { Page } from '../_models/_page';
const findAnd = require('find-and');

@Injectable({
    providedIn: 'root'
})
export class Validation {

    constructor() { }

    validate(page: any, onLoad = false) {
        const errors: any = [];
        if (onLoad) {
            this.loadValidation(page, errors);
        } else {
            this.validateSave(page, errors);
        }
        return this.processError(page, errors, onLoad);
    }
    processError(page: any, errors: any, onLoad = false) {
        const error = new ErrorObj();
        if (errors.length > 0) {
            error.message = errors.join(',');
            error.cause = !onLoad ? 'Invalid data' : 'Onload errors';
            error.type = page.pageValidator;
            error.errors = errors;
        }
        return error;
    }

    validateSave(page: any, errors: any) {
        switch (page.pageValidator) {
            case ValidationTypes.MTEADD_DEFAULT:
                this.validateMte(page, errors);
                break;
            case ValidationTypes.MTEADD:
                this.validateMte(page, errors);
                break;
            case ValidationTypes.TIMESHEETADD:
                this.validateTimeSheet(page, errors);
                break;
            case ValidationTypes.NOTIFICATIONADD:
            	this.validateNotification(page, errors);
            break;
            case ValidationTypes.RELEVANCYREVIEWPROCEDURE:
            	this.validateRelevancyReviewProcedure(page, errors);
            break;
            case ValidationTypes.RELEVANCYREVIEWOPTION:
            	this.validateRelevancyReviewOption(page, errors);
            break;
            case ValidationTypes.DGTASKSTATUSUPDATEVALIDATE:
            	this.validateDGTaskStatusUpdateValidate(page, errors);
            break;
            case ValidationTypes.DGDOCUMENTUPLOADVALIDATION:
            	this.validateDGDocumentUploadValidation(page, errors);
            break;
            case ValidationTypes.DGMEDIAREVISIONVALIDATION:
            	this.validateDGMediaRevisionValidation(page, errors);
            break;
            default:
                break;
        }
    }
    validateDGMediaRevisionValidation(page: Page, errors: any): any{
        const dgc_valid_start_date_attr = findAnd.returnFound(page, {
            "name": "DGC_VALID_START_DATE"
        });
        const dgc_valid_end_date_attr = findAnd.returnFound(page, {
            "name": "DGC_VALID_END_DATE"
        });
        let mediaFiles: number = 0 ;
        if(page.media){
            mediaFiles = page.media.length;
        }else if(page.pages){
            for(let i=0; i< page.pages.length; i++){
                if(page.pages[i].media){
                    mediaFiles = page.pages[i].media.length;
                }
            }
        }
        const currentDate = new Date();
        if (dgc_valid_start_date_attr.value) {
            const validStartDate = new Date(dgc_valid_start_date_attr.value);
            validStartDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            if (validStartDate.getTime() < currentDate.getTime()) {
                errors.push({
                    name: dgc_valid_start_date_attr.packageAttrDisplay,
                    type: 'INVALID',
                    message: "Valid Start Date should be greater than or equal to today's date."
                });
            } else {}
        }if(dgc_valid_end_date_attr.value){
            const validEndDate = new Date(dgc_valid_end_date_attr.value);
            validEndDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            if (validEndDate.getTime() < currentDate.getTime()) {
                errors.push({ name: dgc_valid_end_date_attr.packageAttrDisplay, 
                    type: 'INVALID', 
                    message: "Valid End Date should be greater than today's date." });
            } else{}
        }if(dgc_valid_start_date_attr.value && dgc_valid_end_date_attr.value) {
            const validStartDate = new Date(dgc_valid_start_date_attr.value);
            validStartDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            const validEndDate = new Date(dgc_valid_end_date_attr.value);
            validEndDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            if (validEndDate.getTime() < validStartDate.getTime()) {
                errors.push({ name: dgc_valid_end_date_attr.packageAttrDisplay, 
                    type: 'INVALID', 
                    message: "Valid End Date should be greater or equal to Valid Start Date." });
            }else{}
        } if(mediaFiles == 0 ){
            errors.push({ name: "Media", 
                type: 'INVALID', 
                message: "Media should be entered." });
        }if(mediaFiles > 1 ){
            errors.push({ name: "Media", 
                type: 'INVALID', 
                message: "Only one Media is allowed." });
        }
    }

    loadValidation(page: any, errors: any) {
        //this.loadMte(page, errors);
        switch (page.pageValidator) {
            case ValidationTypes.MTEADD_DEFAULT:
                this.loadMte(page, errors);
                break;
            case ValidationTypes.MTEADD:
                this.loadMte(page, errors);
                break;
            case ValidationTypes.TIMESHEETADD:
                this.loadTimeSheet(page, errors);
                break;
            case ValidationTypes.NOTIFICATIONEDIT:
                this.loadNotificationEdit(page, errors);
                break;
            default:
                break;
        }
    }

    validateMte(page: any, errors: any): any {
        try {
            // commented on PRODFIX-1149 fix
            /* const userdDateValue = findAnd.returnFound(page, {
                "name": "DGC_USED_DATE"
            }).value;
            const returnDateValue = findAnd.returnFound(page, {
                "name": "DGC_RETURN_DATE"
            }).value; */

            /* if (!userdDateValue) {
                errors.push({ name: 'DGC_USED_DATE', type: 'INVALID', message: 'used date required' })
            }
            if (!userdDateValue) {
                errors.push({ name: 'DGC_RETURN_DATE', type: 'INVALID', message: 'return date required' })
            } */

            const currentDate = new Date();
            const usedDate = new Date(findAnd.returnFound(page, {
                "name": "DGC_USED_DATE"
            }).value);
            const returnDate = new Date(findAnd.returnFound(page, {
                "name": "DGC_RETURN_DATE"
            }).value);
            const calibrationDate = new Date(findAnd.returnFound(page, {
                "name": "DGC_CALIBRATION_DATE"
            }).value);
            const calibrationDueDate = new Date(findAnd.returnFound(page, {
                "name": "DGC_CALIBRATION_DUE_DATE"
            }).value);

            if (!usedDate || (usedDate && (usedDate > currentDate))) {
                errors.push({ name: 'DGC_USED_DATE', type: 'INVALID', message: 'Used date must be before the current date or equal to the current date.' })
            }
            if (!usedDate && (returnDate && (returnDate > currentDate))) {
                errors.push({ name: 'DGC_USED_DATE', type: 'INVALID', message: 'Return date must be before the current date or equal to the current date.' })
            }
            if (!returnDate || (returnDate && (returnDate > currentDate))) {
                errors.push({ name: 'DGC_RETURN_DATE', type: 'INVALID', message: 'Return date must be before the current date or equal to the current date.' })
            }

            /* if (usedDate && (returnDate <= usedDate)) {
                errors.push({ name: 'DGC_USED_DATE', type: 'INVALID', message: 'used date must before return date' })
            } */
             if (returnDate && (returnDate < usedDate)) {
                errors.push({ name: 'DGC_RETURN_DATE', type: 'INVALID', message: 'Return date must be after the used date or equal to the current date.' })
            }
            if (!calibrationDate || (calibrationDate && (calibrationDate > currentDate))) {
                errors.push({ name: 'DGC_CALIBRATION_DATE', type: 'INVALID', message: 'Calibration date must be before current date or equal to the current date.' })
            }
            if (!calibrationDueDate || (calibrationDueDate && (calibrationDate < currentDate))) {
                errors.push({ name: 'DGC_CALIBRATION_DUE_DATE', type: 'INVALID', message: 'Calibration Due Date date must be before current date or equal to the current date.' })
            }
        } catch (error) {
            return errors;
        }
        return errors;
    }

    validateTimeSheet(page: any, errors: any): any{
        try {
            const regularHours = findAnd.returnFound(page, {
                "name": "DGC_REGULAR_HOURS"
            }).value;

            if (regularHours && (regularHours > 24)) {
                errors.push({ name: 'DGC_REGULAR_HOURS', type: 'INVALID', cause: 'Work Hours should be less than 24 hours' })
            }

        } catch (error) {
            return errors;
        }

        return errors;
    }

    validateNotification(page: Page, errors: any): any{
		try{
			let organization = page.attributes.find(i => i.name == 'DGC_ORGANIZATION_ID')?.value;
			let userId = page.attributes.find(i => i.name == 'DGC_USER_ID')?.value;
            if(!organization && !userId){
	                errors.push({ name: '', type: 'INVALID', cause: 'Either Organization or User should be set' })}
		}catch(error){
			return errors
		}
	return errors;
	}

	validateRelevancyReviewProcedure(page: Page, errors: any): any {
		if (page['selectedListDataLength'].length == 0) {
			errors.push({ name: '', type: 'LISTINGPAGEVALIDATIONS', cause: 'At least one procedure should be selected From ' + page.display });
		}
		return errors;
	}

	validateRelevancyReviewOption(page: Page, errors: any): any {
		try {
            let count: number = 0;
            let checkListValue: any[] = [];
            page.tableData.qsResponseData.qsRow.forEach((row:any) => {
              row.qsColVal.forEach((col:any) => {
                if (col.name == "DGC_RELEVANCY_CHECKLIST_VALUE") {
                  checkListValue.push(col.value);
                  count = count + col.value;
                }
              });
            });
            console.log(checkListValue);
            if (count > 1) {
              errors.push(
                { name: '', type: 'LISTINGPAGEVALIDATIONS', cause: 'Only one option should be selected From ' + page.display }
                );
            }
            if (count < 1) {
                errors.push(
                    { name: '', type: 'LISTINGPAGEVALIDATIONS', cause: 'At least one option should be selected From ' + page.display }

                    );
            }
		} catch (error) {
			return errors
		}

    }
    validateDGTaskStatusUpdateValidate(page: Page, errors: any): any {
		try {

            const status = findAnd.returnFound(page, {
                "name": "DGC_PACKAGE_STATUS"
            }).value;

            if (status === '103000') {
                const dgc_actual_start_date = findAnd.returnFound(page, {
                    "name": "DGC_ACTUAL_START_DATE"
                }).value;

                const dgc_estimated_end_date = findAnd.returnFound(page, {
                    "name": "DGC_ESTIMATED_END_DATE"
                }).value;

                if (!dgc_actual_start_date) {
                    errors.push({ name: 'DGC_ACTUAL_START_DATE', type: 'INVALID', message: "Actual Start Date is required" });
                }

                if (!dgc_estimated_end_date) {
                    errors.push({ name: 'DGC_ESTIMATED_END_DATE', type: 'INVALID', message: "Estimated End Date is required" });
                }

                if (dgc_actual_start_date && dgc_estimated_end_date) {
                    const currentDate = new Date().getTime();

                    const actualStartDateTimestamp = new Date(dgc_actual_start_date).getTime();
                    const estimatedEndDateTimestamp = new Date(dgc_estimated_end_date).getTime();

                    if (actualStartDateTimestamp > currentDate) {
                        errors.push({ name: 'DGC_ACTUAL_START_DATE', type: 'INVALID', message: "Actual Start Date should be less than or equal to current date." });
                    }

                    if (estimatedEndDateTimestamp <= actualStartDateTimestamp) {
                        errors.push({ name: 'DGC_ESTIMATED_END_DATE', type: 'INVALID', message: "Estimated End Date should be greater than Actual Start Date." });
                    }
                }
            }
            else if (status === '103100') {
                const dgc_actual_start_date = findAnd.returnFound(page, {
                    "name": "DGC_ACTUAL_START_DATE"
                }).value;

                const dgc_estimated_end_date = findAnd.returnFound(page, {
                    "name": "DGC_ESTIMATED_END_DATE"
                }).value;

                const dgc_actual_end_date = findAnd.returnFound(page, {
                    "name": "DGC_ACTUAL_END_DATE"
                }).value;

                if (!dgc_actual_start_date) {
                    errors.push({ name: 'DGC_ACTUAL_START_DATE', type: 'INVALID', message: "Actual Start Date is required." });
                }

                if (!dgc_estimated_end_date) {
                    errors.push({ name: 'DGC_ESTIMATED_END_DATE', type: 'INVALID', message: "Estimated End Date is required." });
                }

                if (!dgc_actual_end_date) {
                    errors.push({ name: 'DGC_ACTUAL_END_DATE', type: 'INVALID', message: "Actual End Date is required." });
                }

                if (dgc_actual_start_date && dgc_estimated_end_date && dgc_actual_end_date) {
                    const currentDate = new Date().getTime(); // Get current timestamp

                    const actualStartDateTimestamp = new Date(dgc_actual_start_date).getTime();
                    const actualEndDateTimestamp = new Date(dgc_actual_end_date).getTime();
                    const estimatedEndDateTimestamp = new Date(dgc_estimated_end_date).getTime();

                    if (actualStartDateTimestamp > currentDate) {
                        errors.push({ name: 'DGC_ACTUAL_START_DATE', type: 'INVALID', message: "Actual Start Date should be less than or equal to current date." });
                    }

                    if (estimatedEndDateTimestamp <= actualStartDateTimestamp) {
                        errors.push({ name: 'DGC_ESTIMATED_END_DATE', type: 'INVALID', message: "Estimated End Date should be greater than Actual Start Date." });
                    }

                    if (actualEndDateTimestamp <= actualStartDateTimestamp) {
                        errors.push({ name: 'DGC_ACTUAL_END_DATE', type: 'INVALID', message: "Actual End Date should be greater than Actual Start Date." });
                    }
                }
            }
            else if(status == '107000'){
                const dgc_cause_code = findAnd.returnFound(page, {
                    "name": "DGC_CAUSE_CODE"
                }).value;

                if (!dgc_cause_code) {
                    errors.push({ name: '', type: 'INVALID', message: "Cause Code is required for Cancel" })
                }
            }
            else if(status == '107500'){
                const dgc_cause_code = findAnd.returnFound(page, {
                    "name": "DGC_CAUSE_CODE"
                }).value;

                if (!dgc_cause_code) {
                    errors.push({ name: '', type: 'INVALID', message: "Cause Code is required for Interrupt" })
                }
            }

		} catch (error) {
			return errors
		}
		return errors;
	}

    validateDGDocumentUploadValidation(page: Page, errors: any): any {
        // Count the number of attributes with non-empty values
        const nonEmptyValuesCount = page.attributes.filter(attr => attr.value !== undefined && attr.value.trim() !== '').length;
    
        if (nonEmptyValuesCount === 0) {
            // If no attribute with a non-empty value is found, add an error message to the errors array
            errors.push({ name: '', type: 'INVALID', message: "One option in the Physical File section should be set." });
        } else if (nonEmptyValuesCount > 1) {
            // If more than one attribute with a non-empty value is found, add an error message to the errors array
            errors.push({ name: '', type: 'INVALID', message: "A single file option should be set in the Upload File section." });
        }
    }
    


    loadMte(page: Page, messages: any): any {
        try {
            //commented for PRODFIX-1149 fix
            /*
            const currentDate = new Date();
            let usedDateVal = page.attributes.find(i => i.name == 'DGC_USED_DATE')?.value;
            let returnDateVal = page.attributes.find(i => i.name == 'DGC_RETURN_DATE')?.value;
            const usedDate = usedDateVal ? new Date(usedDateVal.replace(" ", "T")) : null;
            const returnDate = returnDateVal ? new Date(returnDateVal.replace(" ", "T")) : null;
             if (usedDate && (usedDate <= currentDate)) {
                messages.push({ name: 'DGC_USED_DATE', type: 'PROTECT', value: true, message: 'used date must be protected' });
                messages.push({ name: 'DGC_MTE_ID', type: 'PROTECT', value: true, message: 'mte id must be protected' })
                messages.push({ name: 'DGC_MTE_NAME', type: 'PROTECT', value: true, message: 'mte name must be protected' })

            }
            if (returnDate && (returnDate <= currentDate)) {
                messages.push({ name: 'DGC_RETURN_DATE', type: 'PROTECT', value: true, message: 'return date must be protected' })
            } */

            //const currentDate = new Date();
            const usedDateAttr = findAnd.returnFound(page, {
                "name": "DGC_USED_DATE"
            });
            //const usedDate = usedDateAttr ? new Date(usedDateAttr.value) : null;
             usedDateAttr.isRequired = 0;
             usedDateAttr.isEditable = 1;

            const returnDateAttr = findAnd.returnFound(page, {
                "name": "DGC_RETURN_DATE"
            });
            //const returnDate = returnDateAttr ? new Date(returnDateAttr.value) : null;
             returnDateAttr.isRequired = 0;
             returnDateAttr.isEditable = 1;

            console.log(page);
        } catch (error) {
            return messages;
        }
        return messages;
    }

    loadTimeSheet(page: Page, messages: any): any{
        try {
            const currentDate = new Date();
            let workDate = page.attributes.find(i => i.name == 'DGC_WORK_DATE')?.value;
            if (workDate && (workDate <= currentDate)) {
                messages.push({ name: 'DGC_WORK_DATE', type: 'PROTECT', value: true, message: 'Work Date must be protected' });
                messages.push({ name: 'DGC_REGULAR_HOURS', type: 'PROTECT', value: true, message: 'Regular Hours must be protected' })
                messages.push({ name: 'DGC_COMMENTS', type: 'PROTECT', value: true, message: 'Comments must be protected' })

            }
            console.log(page);
        } catch (error) {
            return messages;
        }
        return messages;
    }

    loadNotificationEdit(page: Page, messages: any): any{
        try {
            let workDate = page.attributes.find(i => i.name == 'DGC_NOTIFICATION_DATE')?.value;
            if (workDate) {
                page.attributes.forEach(attr =>{
                    if(attr.isEditable == 1){
                        messages.push({name: attr.name, type: 'PROTECT'});
                    }
                });
            messages.push({name:'SAVE',type: 'PROTECT', action: true});
            }
            console.log(page);
        } catch (error) {
            return messages;
        }
        return messages;
    }

    dgpsrcvalidation(page: any){
      try{
        if(page.documentOrderStatus == 5200 && (page.qual == 12000 || page.role == 'PSRCCHAIR')){
          for(let i=0; i < page.attributes.length; i++){
            page.attributes[i].isEditable = 1;
          }
        }else{
        for(let i=0; i < page.attributes.length; i++){
            page.attributes[i].isEditable = 0;
            }
        }
      }catch(error){
         return error
      }
        return page;
    }

}
