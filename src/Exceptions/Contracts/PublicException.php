<?php

namespace AwemaPL\BaseJS\Exceptions\Contracts;
interface PublicException
{
    /**
     * Get error message
     *
     * @return string
     */
    public function getErrorMessage();

    /**
     * Get error code
     *
     * @return string
     */
    public function getErrorCode();

    /**
     * Get error http status
     * @return mixed
     */
    public function getErrorHttpStatus();

    /**
     * Get error user message
     *
     * @return mixed
     */
    public function getErrorUserMessage();

    /**
     * Get error details
     * 
     * @return mixed
     */
    public function getErrorDetails();

    /**
     * Is error report
     *
     * @return bool
     */
    public function isErrorReport();

}
