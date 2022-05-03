import { ErrorRequestHandler } from "express";
import { logger } from "../../utils";
import { isCreateApiError } from "../_utils";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next // next is required to detect "ErrorRequestHandler"
): void => {
  const { body, query, params, headers, path } = req;

  logger.error("Error Handler", req.originalUrl, {
    body,
    query,
    params,
    headers,
    path,
  });

  logger.error(err);

  if (isCreateApiError(err)) {
    res.status(412).send(err.apiError).end();
  } else {
    res.status(500).end();
  }
};
