import { Request, Response, NextFunction } from 'express';

/*
    Write an Express middleware function that checks for the presence of an `X-User-Id` HTTP header.
       - If the header is missing or not a valid number, return `401 Unauthorized`.
       - If present, attach the user ID to `res.locals` (e.g., `res.locals.userId`) so downstream routes can access it.
       - Apply this middleware only to routes that create or modify data (`POST` and `PATCH`).
  */

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const rawUserId = req.header('X-User-Id');
  if (!rawUserId || !/^\d+$/.test(rawUserId)) {
    res
      .status(401)
      .json({ error: 'Unauthorized: missing or invalid X-User-Id header' });
    return;
  }

  // Store the authenticated userId on res.locals.userId
  res.locals.userId = Number(rawUserId);
  next();
}

export default authMiddleware;
