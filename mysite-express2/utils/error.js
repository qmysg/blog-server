class ServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }

  toResponseJSON() {}
}

//文件上传错误

exports.UploadError = class extends ServiceError {
  constructor(message) {
    super(message, 413);
  }
};

//禁止访问错误

exports.ForbiddenError = class extends ServiceError {
  constructor(message) {
    super(message, 401);
  }
};

//验证错误

exports.ValidationError = class extends ServiceError {
  constructor(message) {
    super(message, 406);
  }
};

//无资源错误

exports.NotFoundError = class extends ServiceError {
  constructor() {
    super("not found", 406);
  }
};

//其它错误

exports.UnknownError = class extends ServiceError {
  constructor() {
    super("server internal error", 500);
  }
};

exports.ServiceError = ServiceError;
