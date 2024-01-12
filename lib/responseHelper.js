function somethingWentWrong(err) {
    return {
        isSuccess: false,
        message: "Something Went Wrong!!",
        data: err
    }
}


function sendErrorResponse(err, res) {
    return res.status(500).json(somethingWentWrong(err));
}

function sendResult(result) {
    return {
        isSuccess: result.isSuccess,
        message: result.message,
        data: result.data
    }
}


function sendResponse(res, result ) {
    if (result.isSuccess) {
        return res.status(200).json(sendResult(result));
    } else {
        return res.status(400).json(sendResult(result));
    }
}

module.exports = {
    SendResponse: sendResponse,
    SendErrorResponse: sendErrorResponse
}