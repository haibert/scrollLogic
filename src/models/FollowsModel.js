export class Follows {
    constructor(
        // avatarFullPath,
        avatarThumbPath,
        firstName,
        lastName,
        userID,
        userName,
        accountPrivacy,
        follows
    ) {
        // this.avatarFullPath = avatarFullPath
        this.follows = follows
        this.avatarThumbPath = avatarThumbPath
        this.firstName = firstName
        this.lastName = lastName
        this.userID = userID
        this.userName = userName
        this.accountPrivacy = accountPrivacy
    }
}
