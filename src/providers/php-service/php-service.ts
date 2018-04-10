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

  // Get User Info
  getUserInfo(id: string){
    return this.http.get(this.baseURI + 'getUserInfoFromId.php?userId='+id)
    .map(response => response.json());
  }

  // Get User Profile Picture
  getUserProfilePic(id: string) {
    return this.http.get(this.baseURI + 'getUserProfilePic.php?userId='+id)
    .map(response => response.json());
  }
  
  // Get All Posts
  getAllPosts(minCount: string, loadType: string, postalCode: string, postFilter: string, postCity: string, postState: string, postCountry: string) {
    return this.http.get(this.baseURI + 'retrieve-data.php?minCount=' + minCount 
                                      + '&loadType=' + loadType 
                                      + '&userPostalCode=' + postalCode
                                      + '&userPostFilter=' + postFilter
                                      + '&postedCity=' + postCity
                                      + '&postedState=' + postState
                                      + '&postedCountry=' + postCountry )
    .map(response => response.json());
  } 

  // Get Post Information
  getPostInfo(postId: string) {
    return this.http.get(this.baseURI + 'getDataFromId.php?postId='+postId)
    .map(response => response.json());
  }

  // Get All Posts from User Id
  getPostsFromUserId(userUid: string, minCount: string, loadType: string) {
    return this.http.get(this.baseURI + 'getPostsFromUserId.php?userUid='+userUid
                                      + '&loadType=' + loadType
                                      + '&minCount=' + minCount)
    .map(response => response.json());
  }

  // Get All Comments
  getAllComments(postId: string) {
    return this.http.get(this.baseURI + 'get-all-comments.php?postId='+postId)
    .map(response => response.json());
  }

  // Get Location from Location Id
  getLocationInfo(locationId: string) {
    return this.http.get(this.baseURI + 'getLocationsFromId.php?locationId='+locationId)
    .map(response => response.json());
  }

  // Get Location Id from Locations
  getLocationId(city: string, state: string, country: string) {
    return this.http.get(this.baseURI + 'getLocationIdFromLocations.php?city=' + city + '&state=' + state + '&country=' + country )
    .map(response => response.json());
  }

  // Get All Countries
  getAllCountries() {
  //  let body     : string   = "key=countries",
        // type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        // headers  : any      = new Headers({ 'Content-Type': type}),
        // options  : any      = new RequestOptions({ headers: headers }),
       // url      : any      = this.baseURI + "get-all-locations.php?key=countries";

    return this.http.get(this.baseURI + 'get-all-locations.php?key=countries')
    .map(response => response.json());
  }

  // Adding New Post
  addPost(postDesc, userId, postedLocation, PostalCode, postedCity, postedState, postedCountry)
  {
      let body     : string   = "key=create&post=" + postDesc + '&userId=' + userId + '&postedLocation=' + postedLocation + '&postalCode=' + PostalCode + 
                                '&postedCity='+ postedCity + '&postedState=' + postedState + '&postedCountry=' + postedCountry,
          type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
          headers  : any      = new Headers({ 'Content-Type': type}),
          options  : any      = new RequestOptions({ headers: headers }),
          url      : any      = this.baseURI + "manage-data.php";

      return this.http.post(url, body, options)
                  .map(response => response.json());
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
  addComments(postId, comment, commentedBy){
    console.log('Asyn Starts: ');
    let body     : string   = "key=addComment&postId=" + postId + "&comment=" + comment + "&commentedBy=" + commentedBy,
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
  addNewOnlineUser(userId, name, email, nickName, locationId)
  {
    let body     : string   = "key=addUser" + 
                              "&userId=" + userId + 
                              "&name=" + name +
                              "&nickName=" + nickName +
                              "&email=" + email +
                              "&locationId=" + locationId +
                              "&totalStars=" + 0 ,

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
          console.log('***Add User Success:');
      }
      // Otherwise let 'em know anyway
      else
      {   
          console.log('***Add User Error');
      }
    });
  }

  // Add New User service
  updateUserFilter(userId, postFilter)
  {
    let body     : string   = "key=updateUserPostFilter" + 
                              "&userId=" + userId + 
                              "&postFilter=" + postFilter ,

        type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        headers  : any      = new Headers({ 'Content-Type': type}),
        options  : any      = new RequestOptions({ headers: headers }),
        url      : any      = this.baseURI + "manage-data.php";

    return this.http.post(url, body, options)
                  .map(response => response.json());
  }

  // Update User Data
  updateUserData(userId, updatedName, locId)
  {
    let body     : string   = "key=updateUserData" + 
                              "&userId=" + userId + 
                              "&userName=" + updatedName + 
                              "&locationId=" + locId ,

        type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
        headers  : any      = new Headers({ 'Content-Type': type}),
        options  : any      = new RequestOptions({ headers: headers }),
        url      : any      = this.baseURI + "manage-data.php";

    return this.http.post(url, body, options)
                  .map(response => response.json());
  }

}
