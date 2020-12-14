<?php

namespace AwemaPL\BaseJS\Exceptions;
use AwemaPL\BaseJS\Exceptions\Contracts\PublicException as PublicExceptionContract;
use Exception;

class PublicException extends Exception implements PublicExceptionContract
{
    protected $errorMessage;

    protected $errorCode;

    protected $errorHttpStatus;

    protected $errorUserMessage;

    protected $errorDetails;

    protected $errorReport = true;

    public function __construct($errorMessage, $errorCode, $errorHttpStatus, $previous = null, $errorUserMessage = null, $errorDetails = null, bool $errorReport = true)
    {
        parent::__construct(json_encode([
            'code' =>$errorCode,
            'message' =>$errorMessage,
            'status' =>$errorHttpStatus,
            'userMessage' =>$errorUserMessage,
            'details' =>$errorDetails,
        ]), 0, $previous);
        $this->errorMessage = $errorMessage;
        $this->errorCode = $errorCode;
        $this->errorHttpStatus = $errorHttpStatus;
        $this->errorUserMessage = $errorUserMessage;
        $this->errorDetails = $errorDetails;
        $this->errorReport = $errorReport;
    }

    /**
     * Get error message
     *
     * @return string
     */
    public function getErrorMessage(){
        return $this->errorMessage;
    }

    /**
     * Get error code
     *
     * @return string
     */
    public function getErrorCode(){
       return $this->errorCode;
    }

    /**
     * Get error http status
     * @return mixed
     */
    public function getErrorHttpStatus(){
        return $this->errorHttpStatus;
    }

    /**
     * Get error user message
     *
     * @return mixed
     */
    public function getErrorUserMessage(){
        return $this->errorUserMessage;
    }

    /**
     * Get error details
     *
     * @return mixed
     */
    public function getErrorDetails(){
        return $this->errorDetails;
    }


    /**
     * Is error report
     *
     * @return bool
     */
    public function isErrorReport(){
        return $this->errorReport;
    }
}
