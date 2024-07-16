
class User {
    constructor(id, email, password, firstName, lastName, questionCredits = 0, questionSkipCredits = 0, interests = []) {
        this._id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.questionCredits = questionCredits;
        this.questionSkipCredits = questionSkipCredits;
        this.interests = interests;
    }

    toJSON() {
        return {
            _id: this._id,
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            questionCredits: this.questionCredits,
            questionSkipCredits: this.questionSkipCredits,
            interests: this.interests,
        };
    }

    static fromJSON(json) {
        return new User(
            json._id,
            json.email,
            json.password,
            json.firstName,
            json.lastName,
            json.questionCredits,
            json.questionSkipCredits,
            json.interests,
        );
    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    updatePassword(newPassword) {
        this.password = newPassword;
    }

    updateName(newFirstName, newLastName) {
        this.firstName = newFirstName;
        this.lastName = newLastName;
    }

    updateQuestionCredits(amount) {
        this.questionCredits += amount;
    }

    updateQuestionSkipCredits(amount) {
        this.questionSkipCredits += amount;
    }

    addInterest(interest) {
        if (!this.interests.includes(interest)) {
            this.interests.push(interest);
        }
    }

    removeInterest(interest) {
        this.interests = this.interests.filter((item) => item !== interest);
    }
}

export default User;