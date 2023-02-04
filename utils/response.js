const response = (status, code, text, data) => {
  return {
    status: status,
    statusCode: code,
    text: text,
    data: data,
    responseDateTime: new Date(),
  };
};

module.exports = { response };
