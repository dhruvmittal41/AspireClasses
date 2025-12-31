export const validateProfile = (data) => {
    const errors = {};

    if (!data.full_name) errors.full_name = "Full Name is required.";
    if (!data.dob) errors.dob = "Date of Birth is required.";
    if (!data.gender) errors.gender = "Gender is required.";
    if (!data.mobile_number || !/^\d{10,15}$/.test(data.mobile_number)) {
        errors.mobile_number = "A valid mobile number is required.";
    }
    if (!data.city) errors.city = "City is required.";
    if (!data.state) errors.state = "State is required.";
    if (!data.country) errors.country = "Country is required.";

    return errors;
};
