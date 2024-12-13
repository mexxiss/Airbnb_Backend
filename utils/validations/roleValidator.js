export const Role = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req?.role)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
    };
};