declare namespace Express {
  interface Request {
    user: {
      id: string;
      email: string;
      password: string;
      sessionKey: string | null;
      sessionID: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
