function validatePassword(password) {
    const UpperCase = /[A-Z]/.test(password);
    const LowerCase = /[a-z]/.test(password);
    const Number = /\d/.test(password);
    const MinimumLength = password.length >= 6;

    return UpperCase && LowerCase && Number && MinimumLength;
}

export default validatePassword