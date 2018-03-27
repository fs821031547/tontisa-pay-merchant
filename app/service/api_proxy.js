module.exports = app => {
  class ApiProxy extends app.ApiService {}
  return ApiProxy;
};
