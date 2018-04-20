export interface IPosts {
    id           : number;
    post         : string;
    createdDate  : string;
    createdById  : string;
    name         : string;
    email        : string;
    nickname     : string;
    city         : string;
    state        : string;
    country      : string;
    profilePic   : string;  
    wishId       : number;
    addedToWishlist : boolean;
    likesCount   : number;
    isPostLiked  : boolean;
    commentsCount: number;
}

export interface IUser {
    uid               : string;
    email?            : string;
    photoURL?         : string;
    displayName?      : string;
    //nickName?         : string;
    favoriteColor?    : string;
    totalStars?       : number;
    createdDate?      : string;
    displayPostsFrom? : string;
    city?             : string;
    state?            : string;
    country?          : string;
    birthDate?        : Date;
}

export interface IComment {
    id            : number;
    postId        : number;
    comment       : string;
    commentedBy   : string;
    commentedDate : string;
    name          : string;
    nickname      : string;
    profilePic    : string;
}

export interface ICountries {
    country   : string;
    state     : string;
    city      : string;
}