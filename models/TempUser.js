export default class TempUser {
    constructor(id, name, interests) {
        this._id = id;
        this.name = name;
        this.interests = interests;
    }

    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            interests: this.interests,
        }
    }

    static fromJSON(json) {
        return new TempUser(json._id, json.name, json.interests); 
    }

    // addInterest(interest) {
    //     if (!this.interests.includes(interest)) {
    //         this.interests.push(interest);
    //     }
    // }

    // removeInterest(interest) {
    //     this.interests = this.interests.filter((item) => item !== interest);
    // }


}