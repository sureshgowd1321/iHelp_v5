import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

//Constants
import { constants } from '../../constants/constants';

/*
  Generated class for the PhpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PhpServiceProvider {

  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  headers: Headers;
  options: RequestOptions;

  constructor(public http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json', 
                                       'Accept': 'q=0.8;application/json;q=0.9' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  // Adding New Post
  addPost(postDesc)
  {
      let body     : string   = "key=create&post=" + postDesc,
          type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
          headers  : any      = new Headers({ 'Content-Type': type}),
          options  : any      = new RequestOptions({ headers: headers }),
          url      : any      = this.baseURI + "manage-data.php";

      this.http.post(url, body, options)
      .subscribe((data) =>
      {
         // If the request was successful notify the user
         if(data.status === 200)
         {
           console.log('Successfully new post submitted');
         }
         // Otherwise let 'em know anyway
         else
         {
            console.log('Something went wrong!');
         }
      });
  }

  // Updating existing post
  updatePost(postDesc, recordID)
  {
     let body       : string = "key=update&post=" + postDesc + "&recordID=" + recordID,
         type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
         headers    : any     = new Headers({ 'Content-Type': type}),
         options    : any     = new RequestOptions({ headers: headers }),
         url        : any     = this.baseURI + "manage-data.php";

     this.http.post(url, body, options)
     .subscribe(data =>
     {
        // If the request was successful notify the user
        if(data.status === 200)
        {
          console.log('Successfully post updated');
        }
        // Otherwise let 'em know anyway
        else
        {
           console.log('Something went wrong!');
        }
     });
  }
  
  // Deleting post
  deletePost(recordID)
  {
     let body       : string = "key=delete&recordID=" + recordID,
         type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
         headers    : any    = new Headers({ 'Content-Type': type}),
         options    : any    = new RequestOptions({ headers: headers }),
         url        : any    = this.baseURI + "manage-data.php";

     this.http.post(url, body, options)
     .subscribe(data =>
     {
        // If the request was successful notify the user
        if(data.status === 200)
        {
          console.log('Successfully post deleted');
        }
        // Otherwise let 'em know anyway
        else
        {
           console.log('Something went wrong!');
        }
     });
  }

  // Adding New comments
  addComments(postId, comment){
    console.log('Asyn Starts: ');
    let body     : string   = "key=addComment&postId=" + postId + "&comment=" + comment,
        type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        headers  : any      = new Headers({ 'Content-Type': type}),
        options  : any      = new RequestOptions({ headers: headers }),
        url      : any      = this.baseURI + "manage-data.php";

    return this.http.post(url, body, options)
                .map(response => response.json());
  }

  // Updating comments
  updateComment(commentId, comment)
  {
    let body     : string   = "key=updateComment&commentId=" + commentId + "&comment=" + comment,
        type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        headers  : any      = new Headers({ 'Content-Type': type}),
        options  : any      = new RequestOptions({ headers: headers }),
        url      : any      = this.baseURI + "manage-data.php";

        return this.http.post(url, body, options)
                    .map(response => response.json());
  }

  // Deleting comments
  deleteComment(commentId)
  {
    let body     : string   = "key=deleteComment&commentId=" + commentId,
        type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        headers  : any      = new Headers({ 'Content-Type': type}),
        options  : any      = new RequestOptions({ headers: headers }),
        url      : any      = this.baseURI + "manage-data.php";

    return this.http.post(url, body, options)
                .map(response => response.json());
  }

  // Add New User service
  addNewOnlineUser(userId, name, email, photoURL)
  {
    let body     : string   = "key=addUser" + 
                              "&userId=" + userId + 
                              "&name=" + name +
                              "&email=" + email +
                              "&photoURL=" + photoURL +
                              "&totalStars=" + 0 +
                              "&isDummyImage=" + 1 ,
        type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        headers  : any      = new Headers({ 'Content-Type': type}),
        options  : any      = new RequestOptions({ headers: headers }),
        url      : any      = this.baseURI + "manage-data.php";

    this.http.post(url, body, options)
    .subscribe((data) =>
    {
      //If the request was successful notify the user
      if(data.status === 200)
      {
          console.log('***Add User Success:'+ data.text);
      }
      // Otherwise let 'em know anyway
      else
      {   
          console.log('***Add User Error');
      }
    });
  }

}
