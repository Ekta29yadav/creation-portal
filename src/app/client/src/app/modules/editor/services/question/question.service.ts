import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { PublicDataService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private configService: ConfigService, public publicDataService: PublicDataService) { }

  readQuestion(questionId) {
    const filters = '?fields=body,answer,templateId,responseDeclaration,interactionTypes,interactions,name,solutions,editorState,media';
    const option = {
      url: `${this.configService.urlConFig.URLS.QUESTION.READ}/${questionId}`,
      // tslint:disable-next-line:max-line-length
      param: { 'fields': 'code,body,answer,templateId,responseDeclaration,interactionTypes,interactions,name,solutions,editorState,media,code,primaryCategory,qType,identifier,languageCode' }
    };
    return this.publicDataService.get(option);
  }

  updateHierarchyQuestionCreate(questionSetId, metadata, questionSetHierarchy): Observable<ServerResponse> {
    let hierarchyChildren: Array<string>;
    if (questionSetHierarchy.childNodes) {
      hierarchyChildren = questionSetHierarchy.childNodes;
    } else {
      hierarchyChildren = [];
    }
    hierarchyChildren.push('questionId');
    const requestObj = {
      'data': {
        'nodesModified': {
          'questionId': {
            'metadata': metadata,
            'objectType': 'Question',
            'root': false,
            'isNew': true
          }
        },
        'hierarchy': {
        }
      }
    };
    requestObj.data.hierarchy[questionSetId] = {
      'children': hierarchyChildren,
      'root': true
    };
    const req = {
      url: this.configService.urlConFig.URLS.QUESTION_SET.UPDATE_HIERARCHY,
      data: {
        request: requestObj
      }
    };
    return this.publicDataService.patch(req);
  }

  updateHierarchyQuestionUpdate(questionSetId, questionId, metadata, questionSetHierarchy): Observable<ServerResponse> {
    const requestObj = {
      'data': {
        'nodesModified': {},
        'hierarchy': {}
      }
    };
    requestObj.data.hierarchy[questionSetId] = {
      'children': questionSetHierarchy.childNodes,
      'root': true
    };
    requestObj.data.nodesModified[questionId] = {
      'metadata': metadata,
      'objectType': 'Question',
      'root': false,
      'isNew': false
    };
    const req = {
      url: this.configService.urlConFig.URLS.QUESTION_SET.UPDATE_HIERARCHY,
      data: {
        request: requestObj
      }
    };
    return this.publicDataService.patch(req);
  }
}
