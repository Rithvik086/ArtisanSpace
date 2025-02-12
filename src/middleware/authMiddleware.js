import jwt from 'jsonwebtoken';

const verifytoken = (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization; // Express stores headers in lowercase

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Auth denied, no token provided." });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach user info to request
            next(); // Move to next middleware
        } catch (err) {
            return res.status(400).json({ message: "Invalid token" }); // Add return to stop execution
        }
    } else {
        return res.status(401).json({ message: "No token provided." }); // Ensure response if no auth header
    }
};

export default verifytoken;
 