import { NextFunction, Request, Response } from 'express'
import { ErrorHelper } from '@helpers/ErrorHelper'

export const errorMiddleware = (
	error: Error & Partial<ErrorHelper>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = error.statusCode ?? 500;
	const message = error.message ?? 'Internal Server Error';
	console.log(statusCode, " - ", message);
	return res.status(statusCode).json({ message });
}
