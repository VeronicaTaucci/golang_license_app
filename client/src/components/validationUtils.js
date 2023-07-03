export const checkErrors = (formData, setError) => {
  const validateEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  const validEmail = validateEmail(formData.account.email);
  if (!validEmail) {
    setError(["Please enter a valid email"]);
    return false;
  }
  if (formData.account.maxUsers > 32767) {
    setError(["The maximum number of users can't exceed 32767"]);
    return false;
  }
  if (formData.account.maxUsers > 32767) {
    setError(["The maximum number of cores can't exceed 32767"]);
    return false;
  }
  setError([]);
  return true;
};
