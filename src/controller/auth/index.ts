import { RequestHandler } from "express";

export const ViewLogin: RequestHandler = (req, res) => {
    
    res.render("auth/login")
    
}