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
    constructor(galleryID, fullPath, id) {
        this.galleryID = galleryID
        this.fullPath = fullPath
        this.id = id
    }
}
