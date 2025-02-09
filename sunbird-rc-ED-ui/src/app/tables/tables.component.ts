import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../services/data/schema.service';
import { GeneralService } from '../services/general/general.service';


import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Location } from '@angular/common';
import { ToastMessageService } from '../services/toast-message/toast-message.service';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  table: any;
  entity: any;
  tab: string = 'attestation'
  tableSchema: any;
  apiUrl: any;
  model: any;
  Data: string[] = [];
  property: any[] = [];
  field;

  page: number = 1;
  limit: number = 10;
  identifier: any;
  layout: string;
  isPreview: boolean = false;
  isLoading = false;

  form = new FormGroup({});
  modelInterview: any;
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [];
  isEdit: boolean = false;
  responseData: any;

  constructor(
    public location: Location,
    public router: Router,
    public toastMsg: ToastMessageService, private route: ActivatedRoute, public generalService: GeneralService, public schemaService: SchemaService) { }

  ngOnInit(): void {
    this.location.replaceState("admin/attestation/admin-attestation/Prerak");

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let tabUrl = this.router.url;
    this.route.params.subscribe(async params => {
      this.table = params['table'].toLowerCase();
      this.entity = params['entity'].toLowerCase();
      this.tab = tabUrl.replace(this.table, "").replace(this.entity, "").split("/").join("");
      this.schemaService.getTableJSON().subscribe(async (TableSchemas) => {
        let filtered = TableSchemas.tables.filter(obj => {
          return Object.keys(obj)[0] === this.table
        })
        this.tableSchema = filtered[0][this.table]
        this.apiUrl = this.tableSchema.api;
        this.limit = filtered[0].hasOwnProperty(this.limit) ? filtered[0].limit : this.limit;
        await this.getData();
      })

    });

    this.schemaService.getJSONData('/assets/config/ui-config/interview.json').subscribe((res) => {
      this.responseData = res.definitions.Interview.properties;
      let _self = this;
      Object.keys(this.responseData).forEach(function (key) {
        let fieldVal = _self.responseData[key];
        let option = [];



     
        if (fieldVal.hasOwnProperty('enum')) {
          for (let i = 0; i < fieldVal.enum.length; i++) {
            option.push({ value: fieldVal.enum[i], label: fieldVal.enum[i] })
          }
          console.log({ option });
          _self.fields.push({
            key: key,
            type: 'select',
            templateOptions: {
              label: fieldVal.title,
              // placeholder: fieldVal.placeholder,
              // description: fieldVal.description,
             // required: true,
              options: option,
            },
          });
        } else {
          _self.fields.push({
            key: key,
            type: 'input',
            templateOptions: {
             // placeholder: fieldVal.placeholder,
              // description: fieldVal.description,
             // required: true,
              label: fieldVal.title
            }

          })
        }
        console.log({ key });
      })
    });
  }

  submitInterviewData(modelInterview)
  {
    let data = {
      'vfsTeamName' : modelInterview['vfsTeamName'],
      'mcqWhyDoYouWantPragatiPrerak' : modelInterview['mcqWhyDoYouWantPragatiPrerak'],
      'freeTextWhyDoYouWantPragatiPrerak' : modelInterview['freeTextWhyDoYouWantPragatiPrerak'],
      'mcqPastExperience' : modelInterview['mcqPastExperience'],
      'freeTextPastExperience' : modelInterview['freeTextPastExperience'],
      'mcqNgoExperience' : modelInterview['mcqNgoExperience'],
      'freeTextNgoExperience' : modelInterview['freeTextNgoExperience'],
      'mcqYearOfNgoExperience' : modelInterview['mcqYearOfNgoExperience'],
      'mcqSectorOfNgoExperience' : modelInterview['mcqSectorOfNgoExperience'],
      'mcqPrimaryStakeholder' : modelInterview['mcqPrimaryStakeholder'],
      'mcqEngagementType' : modelInterview['mcqEngagementType'],
      'mcqTeachingExpierience' : modelInterview['mcqTeachingExpierience'],
      'freeTextTeachingExpierience' : modelInterview['freeTextTeachingExpierience'],
      'mcqYearOfTeachingExpierience' : modelInterview['mcqYearOfTeachingExpierience'],
      'mcqTeachingEngagementType' : modelInterview['mcqTeachingEngagementType'],
      'mcqPrimaryStakeholderType' : modelInterview['mcqPrimaryStakeholderType'],
      'mcqTrainingExpierience' : modelInterview['mcqTrainingExpierience'],
      'freeTextTrainingExpierience' : modelInterview['freeTextTrainingExpierience'],
      'mcqTrainingProvider' : modelInterview['mcqTrainingProvider'],
      'mcqTrainingDuration' : modelInterview['mcqTrainingDuration'],
      'mcqTrainingContent' : modelInterview['mcqTrainingContent'],
      'mcqPastExperienceWillHelp' : modelInterview['mcqPastExperienceWillHelp'],
      'mcqPocPastExperience' : modelInterview['mcqPocPastExperience'],
      'freeTextNameOfPoc' : modelInterview['freeTextNameOfPoc'],
      'digitMobNoOfPoc' : modelInterview['digitMobNoOfPoc'],
      'mcqRelationshipWithThePOC' : modelInterview['mcqRelationshipWithThePOC'],
    }
   // this.model['sorder']  = this.exLength;
     this.generalService.postData('/Prerak/'+ this.identifier, data).subscribe((res) => {
       console.log({res});
      if (res.params.status == 'SUCCESSFUL' && !this.model['attest']) {
      // this.router.navigate([this.redirectTo])
      }
      else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
        this.toastMsg.error('error', res.params.errmsg);

      }
    }, (err) => {
      this.toastMsg.error('error', err.error.params.errmsg);
      
    });
  }
  openPreview(item, row) {
    this.isEdit = false;
    this.isPreview = true;

    this.identifier = item.id;
    this.layout = 'Prerak';
  }

  openEdit(item, row) {
    this.identifier = '';
    this.isEdit = true;
    this.isPreview = false;


    this.identifier = item.id;
    this.layout = 'Prerak';

  }

 getPrerakData(item, data)
  {
    this.identifier = item.id;
  }

  getData(request = { filters: {} }) {
    this.isLoading = true;
    let url;
    if (this.entity) {
      url = this.apiUrl
    } else {
      console.log("Something went wrong");
      return;
    }

    if (url.toLowerCase().includes('search')) {
      this.generalService.postData(url, request).subscribe((res) => {
        this.model = res;
        this.addData()
      });
    } else {
      this.generalService.getData(url).subscribe((res) => {
        this.model = res;
        this.addData()
      });
    }
  }

  addData() {
    let tempArray;
    let tempObject;
    this.property = []; 
    this.model.forEach(element => {
      tempArray = [];
      this.tableSchema.fields.forEach((field) => {
        tempObject = field;

        if (tempObject.name) {
          tempObject['value'] = element[field.name]
          tempObject['status'] = element['status']
        }

        if (tempObject.formate) {
          tempObject['formate'] = field.formate
        }

        if (tempObject.custom) {
          if (tempObject.type === "button") {
            if (tempObject.redirectTo && tempObject.redirectTo.includes(":")) {
              let urlParam = tempObject.redirectTo.split(":")
              urlParam.forEach((paramVal, index) => {
                if (paramVal in element) {
                  urlParam[index] = element[paramVal]
                }
              });
              tempObject['redirectToUrl'] = urlParam.join("/").replace("//", "/");
              tempObject['id'] = element.osid;
            }
          }
          tempObject['type'] = field.type
        }
        tempArray.push(this.pushData(tempObject));
      });
      this.property.push(tempArray)
    });

    this.tableSchema.items = this.property;
    this.isLoading = false;
  }

  pushData(data) {
    let object = {};
    for (let key in data) {
      if (data.hasOwnProperty(key))
        object[key] = data[key];
    }
    return object;
  }

  onSubmit(event) {
    this.getData(event);
  }

}
