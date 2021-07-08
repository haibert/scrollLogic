export class Gallery {
    constructor(galleryID, galleryName, thumbnail, eventDate) {
        this.galleryID = galleryID
        this.galleryName = galleryName
        this.thumbnail = thumbnail
        this.eventDate = eventDate
        // this.privateOrPublic = privateOrPublic
        // this.creationDate = creationDate
    }
}

export class Pic {
    constructor(galleryID, fullPath, id, thumbPath) {
        this.galleryID = galleryID
        this.fullPath = fullPath
        this.id = id
        this.thumbPath = thumbPath
    }
}

export class Search {
    constructor(uniqueID, userName, firstName, lastName, avatar) {
        this.uniqueID = uniqueID
        this.userName = userName
        this.firstName = firstName
        this.lastName = lastName
        this.avatar = avatar
    }
}
