import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private addQuestionUrl:string = 'http://localhost:5000/addQuestion';
  private getAllQuestionsUrl:string = 'http://localhost:5000/getAllQuestions';
  private getSingleQuestionsUrl:string = 'http://localhost:5000/getSingleQuestion/';
  private getSingleImageUrl:string = 'http://localhost:5000/showImage/';
  private addAnswerUrl:string = 'http://localhost:5000/addAnswer';
  private getAllAnswersUrl:string = 'http://localhost:5000/getAllAnswers/';
  private checkAnswerSelectedUrl:string = 'http://localhost:5000/checkAnswerSelected/';
  private updateSingleQuestionUrl:string = 'http://localhost:5000/updateSingleQuestion/';
  private deleteSingleQuestionUrl:string = 'http://localhost:5000/deleteSingleQuestion/';
  private updateSingleAnswerUrl:string = 'http://localhost:5000/updateSingleAnswer/';
  private deleteSingleAnswerUrl:string = 'http://localhost:5000/deleteSingleAnswer/';



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
