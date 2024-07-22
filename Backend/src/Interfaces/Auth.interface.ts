import { Request as ExpressRequest } from "express";
import { User } from "./User.interface";

export interface Request<P = {}, ResBody = any, ReqBody = any, ReqQuery = {}>
  extends ExpressRequest<P, ResBody, ReqBody, ReqQuery> {
  user?: User;
}
