import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {API_BASE_URL} from "../../../../constants/api-url";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private addQuestionUrl:string = `${API_BASE_URL}/addQuestion`;
  private getAllQuestionsUrl:string = `${API_BASE_URL}/getAllQuestions`;
  private getSingleQuestionsUrl:string = `${API_BASE_URL}/getSingleQuestion/`;
  private getSingleImageUrl:string = `${API_BASE_URL}/showImage/`;
  private addAnswerUrl:string = `${API_BASE_URL}/addAnswer`;
  private getAllAnswersUrl:string = `${API_BASE_URL}/getAllAnswers/`;
  private checkAnswerSelectedUrl:string = `${API_BASE_URL}/checkAnswerSelected/`;
  private updateSingleQuestionUrl:string = `${API_BASE_URL}/updateSingleQuestion/`;
  private deleteSingleQuestionUrl:string = `${API_BASE_URL}/deleteSingleQuestion/`;
  private updateSingleAnswerUrl:string = `${API_BASE_URL}/updateSingleAnswer/`;
  private deleteSingleAnswerUrl:string = `${API_BASE_URL}/deleteSingleAnswer/`;



  constructor(private http:HttpClient) { }

  addQuestion(questionProps){
    return this.http.post(this.addQuestionUrl, questionProps).pipe(catchError(this.handlerError));
  }

  getAllQuestions(){
    return this.http.get(this.getAllQuestionsUrl).pipe(catchError(this.handlerError));
  }

  getSingleQuestion(id){
    return this.http.get(this.getSingleQuestionsUrl+id).pipe(catchError(this.handlerError));
  }

  getSingleImage(fileName){
    return this.http.get(this.getSingleImageUrl+fileName).pipe(catchError(this.handlerError));
  }

  addAnswer(answerProps){
    return this.http.post(this.addAnswerUrl, answerProps).pipe(catchError(this.handlerError));
  }

  getAllAnswers(questionId){
    return this.http.get(this.getAllAnswersUrl+questionId).pipe(catchError(this.handlerError));
  }

  checkAnswerSelected(answerId){
    return this.http.get(this.checkAnswerSelectedUrl + answerId).pipe(catchError(this.handlerError));
  }

  updateSingleQuestion(questionProps, questionId){
    return this.http.put(this.updateSingleQuestionUrl + questionId, questionProps).pipe(catchError(this.handlerError));
  }

  deleteSingleQuestion(questionId){
    return this.http.delete(this.deleteSingleQuestionUrl + questionId).pipe(catchError(this.handlerError));
  }

  updateSingleAnswer(answerProps, answerId){
    return this.http.put(this.updateSingleAnswerUrl + answerId, answerProps).pipe(catchError(this.handlerError));
  }

  deleteSingleAnswer(answerId){
    return this.http.delete(this.deleteSingleAnswerUrl + answerId).pipe(catchError(this.handlerError));
  }


  private handlerError(error: HttpErrorResponse){
    let message = '';
    if (error.error instanceof ErrorEvent){
      console.error(`Client-side error: ${error.error.message}`);
      message = error.error.message;
    } else{
      console.error(`Server-side error: ${error.status}`);
      message = error.message;
    }
  return throwError({
    title: 'Something wrong! please try again later.',
    message
  });
  }


}
