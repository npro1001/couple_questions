
class User {
    constructor(id, email, password, firstName, lastName, questionCredits = 0, questionSkipCredits = 0, interests = [], currentGameSession = null) {
        this._id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.questionCredits = questionCredits;
        this.questionSkipCredits = questionSkipCredits;
        this.interests = interests;
        this.currentGameSession = currentGameSession;
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
            currentGameSession: this.currentGameSession

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
            json.currentGameSession,
        );
    }

    updateCurrentGameSession(gameSession) {  // TODO make this update DB AND state
        this.currentGameSession = gameSession;
    }

    removeCurrentGameSession() { // TODO make this update DB AND state
        this.currentGameSession = null;
    }


    updateEmail(newEmail) {  // TODO make this update DB AND state
        this.email = newEmail;
    }

    updatePassword(newPassword) {  // TODO make this update DB AND state
        this.password = newPassword;
    }

    updateName(newFirstName, newLastName) {  // TODO make this update DB AND state
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