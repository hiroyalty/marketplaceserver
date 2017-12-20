/*'use strict';

module.exports = function CustomError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};

require('util').inherits(module.exports, Error);
*/

require('extend-error');
module.exports = function AppError(){
  AppError = Error.extend('AppError', 500);
  return AppError;
};

module.exports = function ClientError() {
  ClientError = Error.extend('ClientError', 400);
  return ClientError;
};

module.exports = function HttpNotFound() {
  HttpNotFound = ClientError.extend('HttpNotFound', 404);
  return HttpNotFound;
};

module.exports = function HttpUnauthorized() {
  HttpUnauthorized = ClientError.extend('HttpUnauthorized', 401);
  return HttpUnauthorized;
};

module.exports = function myHttpNotFound() {
  HttpNotFound = ClientError.extend('HttpNotFound', 404);
  myHttpNotFound = new HttpNotFound('End point do not exist, check and correct');
  return myHttpNotFound;
};

exports.myLoginError = function() {
  this.message = 'Invalid Username and/or Password';
  ClientError = Error.extend('ClientError', 400);
  myLoginError = new ClientError('Invalid Username and/or Password');
  //return myLoginError;
};

/*
  const AppError = Error.extend('ClientError', 400);
  const ClientError = Error.extend('ClientError', 400);

  const HttpNotFound = ClientError.extend('HttpNotFound', 404);
  const HttpUnauthorized = ClientError.extend('HttpUnauthorized', 401);

  const myHttpNotFound = new HttpNotFound('End point do not exist, check and correct');
  const myLoginError = new ClientError('Invalid Username and/or Password');


  // Output: true
  console.log(myHttpNotFound instanceof HttpNotFound);

  // Output: true
  console.log(myHttpNotFound instanceof ClientError);

  // Output:
  // { [HttpNotFound: my error message]
  //   name: 'HttpNotFound',
  //   code: 404,
  //   message: 'my error message' }
  console.log(myHttpNotFound); */
